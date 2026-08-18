// Formate les erreurs en messages clairs pour l'utilisateur.
// Le serveur renvoie `{ success: false, message }` (voir utils/response.ts) ;
// on privilégie ce message métier (déjà en français), sinon on retombe sur un
// message générique selon le type d'erreur (réseau, HTTP, délai d'attente).

import { ApiResponse } from '@/types';

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
    throw new Error('Réponse serveur inattendue : champ « data » manquant.');
  }
  return res.data;
}

// Un message « technique » (Prisma, pile d'appel, code erreur brut…) n'a
// rien à faire à l'écran : on le remplace par un message générique.
const TECHNIQUE_PATTERN =
  /PrismaClient|TypeError|ReferenceError|RangeError|SyntaxError|ValidationError|\b at \b|at [A-Za-z]|Error:|ERR_|ECONN|ETIMEDOUT|QueryFailed|SQLSTATE/i;

const generiqueParStatut = (status: number | undefined): string | null => {
  switch (status) {
    case 403:
      return 'Accès refusé : vous n’avez pas la permission d’effectuer cette action.';
    case 404:
      return 'Élément introuvable ou supprimé. Actualisez la page et réessayez.';
    case 429:
      return 'Trop de tentatives. Patientez un moment, puis réessayez.';
    default:
      return status !== undefined && status >= 500
        ? 'Erreur interne du serveur. Réessayez dans un instant.'
        : null;
  }
};

export function getErrorMessage(err: unknown, fallback: string): string {
  const e = (err ?? {}) as ApiErrorShape;

  // Serveur injoignable ou délai dépassé.
  if (e.code === 'ECONNABORTED' || e.code === 'ERR_CANCELED') {
    return 'Le serveur met trop de temps à répondre. Réessayez dans un instant.';
  }
  if (e.code === 'ERR_NETWORK' || (!e.response && !e.code)) {
    return 'Impossible de joindre le serveur. Vérifiez votre connexion Internet, puis réessayez.';
  }

  // Message métier explicite renvoyé par le serveur (ex. « Numéro invalide… »).
  const server = e.response?.data?.message;
  if (typeof server === 'string' && server.trim() && !TECHNIQUE_PATTERN.test(server)) {
    return server;
  }

  // Message générique selon le statut HTTP, sinon le repli fourni par l'appelant.
  return generiqueParStatut(e.response?.status) ?? fallback;
}
