// Contrats des événements temps réel poussés par le backend via Socket.IO.
// Doivent rester synchronisés avec tracker/websocket.service.ts et
// tracker/position.handler.ts (broadcastPosition).

export interface RealtimePosition {
  vehiculeId: string;
  latitude: number;
  longitude: number;
  vitesse: number;
  cap?: number;
  battery: number;
  satellites?: number;
  signal?: number;
  horodatage: string;
  source: 'http' | 'sms' | 'tcp' | 'mqtt';
  eventType?: string;
}

export type RealtimeEventName = 'position_update' | 'alarm' | 'commande_update' | 'vehicle_mode';

// Mode RÉELLEMENT appliqué par le traceur, confirmé par son ACK. Émis par
// le backend quand le traceur répond à une commande MODE (imposition) ou
// MODE? (lecture) — cf. tracker/websocket.service.ts (broadcastVehicleMode).
export interface RealtimeVehicleMode {
  vehiculeId: string;
  modeActuel: 'WORK' | 'MOVE' | 'STANDBY';
}
