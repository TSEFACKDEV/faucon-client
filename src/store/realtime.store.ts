import { create } from 'zustand';
import type { RealtimePosition } from '@/types/realtime';
import type { Alarme } from '@/types';

export interface TracePoint {
  latitude: number;
  longitude: number;
  horodatage: string;
}

// État de la connexion temps réel : `inconnu` avant la première tentative
// (aucune bannière), `connecte` une fois le flux actif, `deconnecte` quand le
// flux est perdu (bannière visible).
export type ConnexionRealtime = 'inconnu' | 'connecte' | 'deconnecte';

// Nombre maximum de points conservés par trace temps réel (le tracé reste
// léger, la suite de l'historique vient de la base via le REST).
const MAX_TRACE_POINTS = 500;

interface RealtimeState {
  // Dernière position reçue en temps réel, indexée par véhicule.
  positions: Record<string, RealtimePosition>;
  // Trace temps réel par véhicule : les points s'accumulent au fil des
  // trames (dédupliqués par horodatage) pour dessiner le trajet en direct.
  traces: Record<string, TracePoint[]>;
  // Dernière alarme reçue en temps réel (pour badge/flash et liste live).
  derniereAlarme: Alarme | null;
  // État de la connexion WebSocket (bannière « hors ligne » côté UI).
  connexion: ConnexionRealtime;
  setPosition: (p: RealtimePosition) => void;
  setDerniereAlarme: (a: Alarme) => void;
  setConnexion: (c: ConnexionRealtime) => void;
  reset: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  positions: {},
  traces: {},
  derniereAlarme: null,
  connexion: 'inconnu',
  setPosition: (p) =>
    set((state) => {
      const trace = state.traces[p.vehiculeId] ?? [];
      const last = trace[trace.length - 1];
      const newTrace =
        last && last.horodatage === p.horodatage
          ? trace
          : [...trace, {
              latitude: p.latitude,
              longitude: p.longitude,
              horodatage: p.horodatage,
            }].slice(-MAX_TRACE_POINTS);
      return {
        positions: { ...state.positions, [p.vehiculeId]: p },
        traces: { ...state.traces, [p.vehiculeId]: newTrace },
      };
    }),
  setDerniereAlarme: (a) => set({ derniereAlarme: a }),
  setConnexion: (c) => set({ connexion: c }),
  reset: () => set({ positions: {}, traces: {}, derniereAlarme: null, connexion: 'inconnu' }),
}));
