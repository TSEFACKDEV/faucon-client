'use client';
// Synchronisation entre onglets : les cookies d'auth sont partagés par le
// navigateur (pas par onglet), mais le store Zustand et la connexion
// Socket.IO sont en mémoire, donc propres à chaque onglet. Sans ce canal, se
// connecter avec un compte différent dans un onglet B laisse l'onglet A
// afficher l'identité de l'ancien utilisateur alors que ses prochaines
// requêtes API partent déjà avec le nouveau token (le cookie, lui, est
// global) — actions effectuées sous une identité différente de celle
// affichée, sans aucun avertissement.
const CHANNEL_NAME = 'faucon-auth';

let channel: BroadcastChannel | null = null;

const getChannel = (): BroadcastChannel | null => {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  if (!channel) channel = new BroadcastChannel(CHANNEL_NAME);
  return channel;
};

export type AuthChangeKind = 'login' | 'logout';

export const broadcastAuthChange = (kind: AuthChangeKind): void => {
  getChannel()?.postMessage(kind);
};

// Un BroadcastChannel ne délivre jamais ses propres messages à l'émetteur —
// pas besoin de filtrer l'onglet courant.
export const onAuthChangeFromOtherTab = (listener: (kind: AuthChangeKind) => void): (() => void) => {
  const c = getChannel();
  if (!c) return () => {};
  const handler = (e: MessageEvent<AuthChangeKind>) => listener(e.data);
  c.addEventListener('message', handler);
  return () => c.removeEventListener('message', handler);
};
