export interface User {
  id: string;
  userName: string;
  email: string;
  telephone?: string;
  dateCreation: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export type DeviceMode = 'WORK' | 'MOVE' | 'STANDBY';

export type AlarmType =
  | 'SORTIE_ZONE'
  | 'VITESSE_EXCESSIVE'
  | 'DECOLLEMENT_TRACEUR'
  | 'NON_MOUVEMENT'
  | 'BATTERIE_FAIBLE';

export interface Device {
  id: string;
  imei: string;
  nom: string;
  image?: string;
  modeActuel: DeviceMode;
  niveauBatterie: number;
  estActif: boolean;
  derniereCommunication?: string;
  limiteVitesse?: {
    seuilKmh: number;
    estActive: boolean;
  } | null;
  perimetreGeofence?: {
    nom: string;
    centreLat: number;
    centreLon: number;
    rayonMetres: number;
    estActif: boolean;
  } | null;
}

export interface LivePosition {
  vehiculeId: string;
  latitude: number;
  longitude: number;
  vitesse: number;
  cap: number;
  battery: number;
  horodatage: string;
}

export interface Position {
  id: number;
  vehiculeId: string;
  latitude: number;
  longitude: number;
  vitesse: number;
  cap: number;
  niveauBatterie: number;
  horodatage: string;
}

export interface Alarm {
  id: string;
  vehiculeId: string;
  typeAlarme: AlarmType;
  latitude: number;
  longitude: number;
  valeurMesuree?: number;
  seuilConfigure?: number;
  estAcquittee: boolean;
  horodatage: string;
}

export interface DailyReport {
  id: string;
  vehiculeId: string;
  date: string;
  distanceTotaleKm: number;
  vitesseMoyenne: number;
  vitesseMax: number;
  nbAlarmes: number;
  tempsArretMinutes: number;
}

export interface SessionTrajet {
  id: string;
  vehiculeId: string;
  dateDebut: string;
  dateFin?: string;
  distanceKm: number;
  dureeMinutes?: number;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}