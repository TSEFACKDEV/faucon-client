import { AlarmType, DeviceMode } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDate = (iso: string): string =>
  format(new Date(iso), 'dd/MM/yyyy', { locale: fr });

export const formatDateTime = (iso: string): string =>
  format(new Date(iso), 'dd MMM yyyy · HH:mm', { locale: fr });

export const formatTime = (iso: string): string =>
  format(new Date(iso), 'HH:mm', { locale: fr });

export const timeAgo = (iso: string): string =>
  formatDistanceToNow(new Date(iso), { locale: fr, addSuffix: true });

// Même seuil que le backend (EN_LIGNE_SEUIL_MS = 10 min) : strictement
// supérieur à la plus longue période d'émission du firmware (STANDBY à
// l'arrêt : 5 min), pour qu'un traceur allumé ne bascule pas « hors ligne »
// entre deux trames. Ne PAS descendre sous 5 min.
const EN_LIGNE_SEUIL_MS = 10 * 60 * 1000;

export const isOnline = (derniereCommunication?: string | null): boolean => {
  if (!derniereCommunication) return false;
  const delta = Date.now() - new Date(derniereCommunication).getTime();
  return delta >= 0 && delta < EN_LIGNE_SEUIL_MS;
};

export const formatCoords = (lat: number, lon: number): string =>
  `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

export const formatSpeed = (speed: number): string =>
  `${Math.round(speed)} km/h`;

export const getBatteryColor = (level: number): string => {
  if (level <= 20) return '#B23434';   // danger-strong
  if (level <= 50) return '#8A5E10';   // warning-strong
  return '#1F7A50';                    // success-strong
};

export const ALARM_LABELS: Record<AlarmType, string> = {
  SORTIE_ZONE:         'Sortie de zone',
  VITESSE_EXCESSIVE:   'Vitesse excessive',
  DECOLLEMENT_TRACEUR: 'Retrait dispositif',
  NON_MOUVEMENT:       'Immobilisation',
  BATTERIE_FAIBLE:     'Batterie faible',
};

export const ALARM_COLORS: Record<AlarmType, string> = {
  SORTIE_ZONE:         '#B23434',
  VITESSE_EXCESSIVE:   '#8A5E10',
  DECOLLEMENT_TRACEUR: '#B23434',
  NON_MOUVEMENT:       '#8A5E10',
  BATTERIE_FAIBLE:     '#8A5E10',
};

export const MODE_LABELS: Record<DeviceMode, string> = {
  WORK:    'Continu (WORK)',
  MOVE:    'Adaptatif (MOVE)',
  STANDBY: 'Veille (STANDBY)',
};