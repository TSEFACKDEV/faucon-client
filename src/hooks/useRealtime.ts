'use client';
import { useEffect } from 'react';
import {
  connectRealtime,
  subscribeRealtime,
  onPositionUpdate,
  onAlarm,
  disconnectRealtime,
} from '@/lib/realtime';
import { useRealtimeStore } from '@/store/realtime.store';

// Branche les pages admin sur le flux temps réel du backend : se connecte en
// singleton, s'abonne aux traceurs passés, et alimente le store partagé.
export const useRealtime = (vehiculeIds: string[]): void => {
  const setPosition = useRealtimeStore((s) => s.setPosition);
  const setDerniereAlarme = useRealtimeStore((s) => s.setDerniereAlarme);

  useEffect(() => {
    connectRealtime();
    const unsubPosition = onPositionUpdate(setPosition);
    const unsubAlarm = onAlarm(setDerniereAlarme);
    return () => {
      unsubPosition();
      unsubAlarm();
    };
  }, [setPosition, setDerniereAlarme]);

  const ids = vehiculeIds.join(',');
  useEffect(() => {
    if (!ids) return;
    subscribeRealtime(ids.split(','));
  }, [ids]);
};

// À appeler lors de la déconnexion explicite (logout).
export const closeRealtime = (): void => {
  useRealtimeStore.getState().reset();
  disconnectRealtime();
};
