import { AlarmType } from '@/types';
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

export const formatCoords = (lat: number, lon: number): string =>
  `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

export const formatSpeed = (speed: number): string =>
  `${Math.round(speed)} km/h`;

export const getBatteryColor = (level: number): string => {
  if (level <= 15) return '#EF4444';
  if (level <= 30) return '#F59E0B';
  return '#1B4332';
};

export const ALARM_LABELS: Record<AlarmType, string> = {
  SORTIE_ZONE:         'Sortie de zone',
  VITESSE_EXCESSIVE:   'Vitesse excessive',
  DECOLLEMENT_TRACEUR: 'Retrait dispositif',
  NON_MOUVEMENT:       'Immobilisation',
  BATTERIE_FAIBLE:     'Batterie faible',
};

export const ALARM_COLORS: Record<AlarmType, string> = {
  SORTIE_ZONE:         '#EF4444',
  VITESSE_EXCESSIVE:   '#F59E0B',
  DECOLLEMENT_TRACEUR: '#EF4444',
  NON_MOUVEMENT:       '#F59E0B',
  BATTERIE_FAIBLE:     '#F59E0B',
};