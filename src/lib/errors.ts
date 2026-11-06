// Formate les erreurs en messages clairs pour l'utilisateur.
// Le serveur renvoie `{ success: false, message }` (voir utils/response.ts) ;
// on privilégie ce message métier (déjà en français), sinon on retombe sur un
// message générique selon le type d'erreur (réseau, HTTP, délai d'attente).

import { ApiResponse } from '@/types';

const en = () => typeof document !== 'undefined' && document.documentElement.lang === 'en';

interface ApiErrorShape {
  code?: string;
  response?: {
    status?: number;
    data?: { message?: string };
  };
}

/**
 * Extrait `data` d'une réponse API typée de manière sûre.
 * Lance une erreur explicite si le champ est absent (réponse serveur
 * inattendue) au lieu de crasher silencieusement sur un `null`.
 */
export function unwrap<T>(res: ApiResponse<T>): T {
  if (res.data == null) {
    throw new Error(en() ? 'Unexpected server response: missing “data” field.' : 'Réponse serveur inattendue : champ « data » manquant.');
  }
  return res.data;
}


// Messages métier connus renvoyés par l'API (rédigés en français côté serveur).
// On les traduit côté client pour que le passage en anglais reste cohérent.
const SERVER_MESSAGES_EN: Record<string, string> = {
  'Email ou mot de passe incorrect': 'Incorrect email or password',
  'Cet email est déjà utilisé': 'This email is already in use',
  "Ce nom d'utilisateur est déjà pris": 'This username is already taken',
  'Ce nom d’utilisateur est déjà pris': 'This username is already taken',
  'Utilisateur introuvable': 'User not found',
  'Véhicule introuvable': 'Vehicle not found',
  'Traceur introuvable': 'Tracker not found',
  'Alarme introuvable': 'Alert not found',
  'Ce traceur est déjà connecté à un autre compte.': 'This tracker is already linked to another account.',
  'Code d’activation invalide. Vérifiez le PIN imprimé sur le boîtier.': 'Invalid activation code. Check the PIN printed on the device.',
  'Numéro invalide (format attendu : +237XXXXXXXXX)': 'Invalid number (expected format: +237XXXXXXXXX)',
  'Tous les champs sont requis': 'All fields are required',
  'Email et mot de passe requis': 'Email and password required',
  'Le mot de passe doit contenir au moins 8 caractères': 'The password must be at least 8 characters long',
  'Token invalide ou expiré': 'Invalid or expired token',
  'Clé API invalide, révoquée ou expirée': 'Invalid, revoked or expired API key',
  'Clé de provisioning invalide': 'Invalid provisioning key',
  'Route introuvable': 'Route not found',
  'Identifiant du traceur requis': 'Tracker identifier required',
  'ID utilisateur requis': 'User ID required',
  'ID traceur requis': 'Tracker ID required',
  'ID alarme requis': 'Alert ID required',
  'ID de l\'alarme requis': 'Alert ID required',
  'ID du véhicule requis': 'Vehicle ID required',
  'ID de clé requis': 'Key ID required',
  'Nom de clé requis (2 à 60 caractères)': 'Key name required (2 to 60 characters)',
  'Rôle invalide (UTILISATEUR | ADMIN)': 'Invalid role (USER | ADMIN)',
  'Mode invalide (WORK | MOVE | STANDBY)': 'Invalid mode (WORK | MOVE | STANDBY)',
  'Coordonnées du centre invalides': 'Invalid centre coordinates',
  'Rayon de la zone invalide': 'Invalid zone radius',
  'Numéro de téléphone requis': 'Phone number required',
  'Seuil de vitesse invalide (entre 0 et 300 km/h)': 'Invalid speed limit (between 0 and 300 km/h)',
  'Dates invalides (format ISO 8601 attendu)': 'Invalid dates (ISO 8601 expected)',
  'Date invalide (format YYYY-MM-DD attendu)': 'Invalid date (YYYY-MM-DD expected)',
};

const translateServerMessage = (message: string): string =>
  en() ? (SERVER_MESSAGES_EN[message] ?? message) : message;

// Un message « technique » (Prisma, pile d'appel, code erreur brut…) n'a
// rien à faire à l'écran : on le remplace par un message générique.
const TECHNIQUE_PATTERN =
  /PrismaClient|TypeError|ReferenceError|RangeError|SyntaxError|ValidationError|\b at \b|at [A-Za-z]|Error:|ERR_|ECONN|ETIMEDOUT|QueryFailed|SQLSTATE/i;

const generiqueParStatut = (status: number | undefined): string | null => {
  switch (status) {
    case 403:
      return en() ? 'Access denied: you do not have permission to perform this action.' : 'Accès refusé : vous n’avez pas la permission d’effectuer cette action.';
    case 404:
      return en() ? 'Item not found or deleted. Refresh the page and try again.' : 'Élément introuvable ou supprimé. Actualisez la page et réessayez.';
    case 429:
      return en() ? 'Too many attempts. Wait a moment, then try again.' : 'Trop de tentatives. Patientez un moment, puis réessayez.';
    default:
      return status !== undefined && status >= 500
        ? (en() ? 'Internal server error. Try again in a moment.' : 'Erreur interne du serveur. Réessayez dans un instant.')
        : null;
  }
};

export function getErrorMessage(err: unknown, fallback: string): string {
  const e = (err ?? {}) as ApiErrorShape;

  // Serveur injoignable ou délai dépassé.
  if (e.code === 'ECONNABORTED' || e.code === 'ERR_CANCELED') {
    return en() ? 'The server is taking too long to respond. Try again in a moment.' : 'Le serveur met trop de temps à répondre. Réessayez dans un instant.';
  }
  if (e.code === 'ERR_NETWORK' || (!e.response && !e.code)) {
    return en() ? 'Unable to reach the server. Check your internet connection and try again.' : 'Impossible de joindre le serveur. Vérifiez votre connexion Internet, puis réessayez.';
  }

  // Message métier explicite renvoyé par le serveur (ex. « Numéro invalide… »).
  const server = e.response?.data?.message;
  if (typeof server === 'string' && server.trim() && !TECHNIQUE_PATTERN.test(server)) {
    return translateServerMessage(server);
  }

  // Message générique selon le statut HTTP, sinon le repli fourni par l'appelant.
  return generiqueParStatut(e.response?.status) ?? fallback;
}
