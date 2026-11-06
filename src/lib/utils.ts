import { AlarmType, DeviceMode } from '@/types';
import { format, formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

const currentLanguage = (): 'fr' | 'en' => {
  if (typeof document !== 'undefined' && document.documentElement.lang === 'en') return 'en';
  return 'fr';
};

const dateLocale = () => (currentLanguage() === 'en' ? enUS : fr);

export const formatDate = (iso: string): string =>
  format(new Date(iso), currentLanguage() === 'en' ? 'MM/dd/yyyy' : 'dd/MM/yyyy', { locale: dateLocale() });

export const formatDateTime = (iso: string): string =>
  format(new Date(iso), currentLanguage() === 'en' ? 'MMM d, yyyy · HH:mm' : 'dd MMM yyyy · HH:mm', { locale: dateLocale() });

export const timeAgo = (iso: string): string =>
  formatDistanceToNow(new Date(iso), { locale: dateLocale(), addSuffix: true });

// Même seuil que le backend (EN_LIGNE_SEUIL_MS = 10 min) : strictement
// supérieur à la plus longue période d'émission du firmware (STANDBY à
// l'arrêt : 5 min), pour qu'un traceur allumé ne bascule pas « hors ligne »
// entre deux trames. Ne PAS descendre sous 5 min.
const EN_LIGNE_SEUIL_MS = 10 * 60 * 1000;

// MÊME RÈGLE QUE : mobile/src/utils/formatters.ts isDeviceOffline. À tenir
// identique partout — sinon un traceur mourant (dernier sursaut
// batterie/signal) peut s'afficher "En ligne" ici alors que le mobile le
// signale déjà "Hors ligne", sur un produit dont c'est la fonction critique.
export const isOnline = (
  derniereCommunication?: string | null,
  niveauSignal?: number | null,
  niveauBatterie?: number | null
): boolean => {
  if (!derniereCommunication) return false;
  if (niveauSignal != null && niveauSignal < 12 && niveauBatterie === 0) return false;
  const delta = Date.now() - new Date(derniereCommunication).getTime();
  return delta >= 0 && delta < EN_LIGNE_SEUIL_MS;
};

export const formatCoords = (lat: number, lon: number): string =>
  `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

export const getBatteryColor = (level: number): string => {
  if (level <= 20) return '#B91C1C';   // danger-strong
  if (level <= 50) return '#B45309';   // warning-strong
  return '#15803D';                    // success-strong
};

const ALARM_LABELS_I18N: Record<AlarmType, { fr: string; en: string }> = {
  SORTIE_ZONE:         { fr: 'Sortie de zone', en: 'Geofence exit' },
  VITESSE_EXCESSIVE:   { fr: 'Vitesse excessive', en: 'Speeding' },
  DECOLLEMENT_TRACEUR: { fr: 'Retrait dispositif', en: 'Device removed' },
  NON_MOUVEMENT:       { fr: 'Immobilisation', en: 'Vehicle idle' },
  BATTERIE_FAIBLE:     { fr: 'Batterie faible', en: 'Low battery' },
};

const MODE_LABELS_I18N: Record<DeviceMode, { fr: string; en: string }> = {
  WORK:    { fr: 'Continu (WORK)', en: 'Continuous (WORK)' },
  MOVE:    { fr: 'Adaptatif (MOVE)', en: 'Adaptive (MOVE)' },
  STANDBY: { fr: 'Veille (STANDBY)', en: 'Standby (STANDBY)' },
};

export const ALARM_TYPES = Object.keys(ALARM_LABELS_I18N) as AlarmType[];

export const getAlarmLabel = (type: AlarmType): string =>
  ALARM_LABELS_I18N[type][currentLanguage()];

export const getModeLabel = (mode: DeviceMode): string =>
  MODE_LABELS_I18N[mode][currentLanguage()];