'use client';
// Connexion Socket.IO temps réel vers le backend Faucon. Instanciée en
// singleton : le dashboard, la page traceurs et le détail traceur partagent
// la même connexion, avec une liste d'écouteurs par événement. L'authentification
// passe par `auth.token` (même cookie que l'API REST) et chaque abonnement
// est vérifié côté serveur (un client ne reçoit que ses véhicules, sauf ADMIN).

import { io, Socket } from 'socket.io-client';
import type {
  RealtimePosition,
  RealtimeVehicleMode,
} from '@/types/realtime';
import type { Alarme, Commande } from '@/types';
import { useRealtimeStore } from '@/store/realtime.store';
import { getAccessToken } from './authCookies';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? '';

type PositionListener = (data: RealtimePosition) => void;
type AlarmListener = (data: Alarme) => void;
type CommandeListener = (data: Commande) => void;
type VehicleModeListener = (data: RealtimeVehicleMode) => void;

let socket: Socket | null = null;
const positionListeners = new Set<PositionListener>();
const alarmListeners = new Set<AlarmListener>();
const commandeListeners = new Set<CommandeListener>();
const vehicleModeListeners = new Set<VehicleModeListener>();
let subscribedIds: string[] = [];

const ensureConnected = (): Socket | null => {
  if (!getAccessToken()) return null;
  if (socket?.connected) return socket;

  socket?.disconnect();
  socket = io(SOCKET_URL, {
    // `auth` en fonction (pas un objet littéral figé) : socket.io-client la
    // rappelle à CHAQUE tentative de (re)connexion, donc une reconnexion
    // automatique après une coupure réseau relit le cookie à jour — y
    // compris si /auth/refresh a renouvelé le token entre-temps. Avec un
    // objet statique, la reconnexion auto retentait indéfiniment avec le
    // premier token capturé, périmé au bout d'1h, et le flux temps réel
    // restait mort jusqu'au rechargement complet de la page.
    auth: (cb) => cb({ token: getAccessToken() }),
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionAttempts: 10,
  });

  socket.on('connect', () => {
    useRealtimeStore.getState().setConnexion('connecte');
    if (subscribedIds.length > 0) socket!.emit('subscribe', subscribedIds);
  });

  socket.on('position_update', (data: RealtimePosition) => {
    positionListeners.forEach((l) => l(data));
  });
  socket.on('alarm', (data: Alarme) => {
    alarmListeners.forEach((l) => l(data));
  });
  socket.on('commande_update', (data: Commande) => {
    commandeListeners.forEach((l) => l(data));
  });
  socket.on('vehicle_mode', (data: RealtimeVehicleMode) => {
    vehicleModeListeners.forEach((l) => l(data));
  });

  socket.on('connect_error', (err) => {
    useRealtimeStore.getState().setConnexion('deconnecte');
    console.warn('[WS] Erreur de connexion :', err.message);
  });

  socket.on('disconnect', () => {
    useRealtimeStore.getState().setConnexion('deconnecte');
  });

  // Les tentatives de reconnexion auto sont épuisées (reconnectionAttempts) :
  // Socket.IO abandonne silencieusement. Sans ce listener, la bannière
  // "Reconnexion automatique en cours…" restait affichée indéfiniment sans
  // qu'aucune reconnexion ne soit réellement retentée.
  socket.io.on('reconnect_failed', () => {
    useRealtimeStore.getState().setConnexion('echec');
  });

  return socket;
};

export const connectRealtime = (): void => {
  if (getAccessToken()) ensureConnected();
};

// Relance manuellement une tentative de connexion après un échec définitif
// (bouton "Recharger" de la bannière) — recrée le socket depuis zéro plutôt
// que de compter sur l'auto-reconnexion déjà épuisée.
export const reconnectRealtime = (): void => {
  socket?.disconnect();
  socket = null;
  ensureConnected();
};

export const subscribeRealtime = (vehiculeIds: string[]): void => {
  const ids = vehiculeIds.filter((id, i, arr) => id && arr.indexOf(id) === i);
  const s = ensureConnected();

  const needsResubscribe =
    ids.length !== subscribedIds.length ||
    ids.some((id) => !subscribedIds.includes(id));

  subscribedIds = ids;
  if (s?.connected && needsResubscribe && ids.length > 0) {
    s.emit('subscribe', ids);
  }
};

export const onPositionUpdate = (listener: PositionListener): (() => void) => {
  positionListeners.add(listener);
  return () => positionListeners.delete(listener);
};

export const onAlarm = (listener: AlarmListener): (() => void) => {
  alarmListeners.add(listener);
  return () => alarmListeners.delete(listener);
};

export const onCommandeUpdate = (listener: CommandeListener): (() => void) => {
  commandeListeners.add(listener);
  return () => commandeListeners.delete(listener);
};

export const onVehicleMode = (listener: VehicleModeListener): (() => void) => {
  vehicleModeListeners.add(listener);
  return () => vehicleModeListeners.delete(listener);
};

export const disconnectRealtime = (): void => {
  socket?.disconnect();
  socket = null;
  subscribedIds = [];
  useRealtimeStore.getState().setConnexion('inconnu');
};
