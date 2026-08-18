export type Role = 'UTILISATEUR' | 'ADMIN';

export interface User {
  id: string;
  userName: string;
  email: string;
  telephone?: string | null;
  role: Role;
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

export type CodeCommande = 'LOCALISER' | 'MODE' | 'REDEMARRER' | 'RESET_USINE' | 'NUMERO_SMS';
export type StatutCommande = 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';

export interface Commande {
  id: string;
  vehiculeId: string;
  codeCommande: CodeCommande;
  parametres?: { valeur?: string; detail?: string } | null;
  statutExecution: StatutCommande;
  dateEnvoi: string;
  dateReponse?: string | null;
}

// ── Utilisateurs (vue admin) ──────────────────────────────────────
export interface UtilisateurResume {
  id: string;
  userName: string;
  email: string;
  telephone?: string | null;
  role: Role;
  dateCreation: string;
  derniereConnexion?: string | null;
  nbVehicules: number;
}

export interface UtilisateurDetail {
  id: string;
  userName: string;
  email: string;
  telephone?: string | null;
  role: Role;
  dateCreation: string;
  derniereConnexion?: string | null;
  vehicules: VehiculeResume[];
}

// ── Traceurs (vue admin, tous propriétaires confondus) ────────────
export interface VehiculeResume {
  id: string;
  imei?: string | null;
  trackerId?: string | null;
  nom: string;
  modeActuel: DeviceMode;
  niveauBatterie: number;
  niveauSignal?: number | null;
  estActif: boolean;
  dateAjout: string;
  joursActifs: number;
  derniereCommunication?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  enLigne: boolean;
  utilisateur: { id: string; userName: string; email: string } | null;
}

export interface VehiculeDetail {
  id: string;
  imei?: string | null;
  trackerId?: string | null;
  pinActivation?: string | null;
  nom: string;
  image?: string | null;
  telephoneAlerte?: string | null;
  modeActuel: DeviceMode;
  niveauBatterie: number;
  niveauSignal?: number | null;
  estActif: boolean;
  dateAjout: string;
  derniereCommunication?: string | null;
  utilisateur: { id: string; userName: string; email: string; telephone?: string | null } | null;
  limiteVitesse?: { seuilKmh: number; estActive: boolean } | null;
  perimetreGeofence?: {
    nom: string; centreLat: number; centreLon: number; rayonMetres: number; estActif: boolean;
  } | null;
  alarmes: Alarme[];
  commandes: Commande[];
  positions: Position[];
}

export interface Position {
  id: number;
  vehiculeId: string;
  latitude: number;
  longitude: number;
  vitesse: number;
  cap?: number | null;
  niveauBatterie: number;
  nbSatellites?: number | null;
  niveauSignal?: number | null;
  horodatage: string;
}

// ── Alarmes (vue admin, tous traceurs confondus) ──────────────────
export interface Alarme {
  id: string;
  vehiculeId: string;
  vehicule?: { id: string; nom: string; trackerId?: string | null; utilisateur?: { userName: string } | null };
  typeAlarme: AlarmType;
  latitude: number;
  longitude: number;
  valeurMesuree?: number | null;
  seuilConfigure?: number | null;
  estAcquittee: boolean;
  horodatage: string;
}

// ── Statistiques dashboard ─────────────────────────────────────────
export interface StatsOverview {
  totalUtilisateurs: number;
  totalVehicules: number;
  vehiculesEnLigne: number;
  vehiculesActifs: number;
  alarmesNonAcquittees: number;
  alarmesAujourdhui: number;
  croissanceUtilisateurs30j: { date: string; total: number }[];
  alarmesParJour7j: { date: string; total: number }[];
  alarmesParType: { type: AlarmType; total: number }[];
  repartitionModes: { mode: DeviceMode; total: number }[];
  repartitionBatterie: { tranche: string; total: number }[];
}

export interface VehiculeProvisionne {
  trackerId: string;
  pinActivation: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}
