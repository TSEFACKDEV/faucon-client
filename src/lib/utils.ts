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

// Cohérent avec isRecentlyConnected (mobile) : < 5 min depuis la dernière
// communication ⇒ le traceur est considéré « en ligne ».
export const isOnline = (derniereCommunication?: string | null): boolean => {
  if (!derniereCommunication) return false;
  const delta = Date.now() - new Date(derniereCommunication).getTime();
  return delta >= 0 && delta < 5 * 60 * 1000;
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