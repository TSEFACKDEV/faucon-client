import axios from 'axios';
import { toast } from 'react-toastify';
import {
  getAccessToken, setAccessCookie, setAuthCookies, getRefreshToken, clearAuthCookies,
} from './authCookies';

// baseURL relatif : les appels partent vers `/api/*` qui est proxifié par
// Next.js (voir next.config.ts) vers le backend FAUCON. Le navigateur reste
// sur la même origine, ce qui contourne le CORS du serveur distant.
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Verrou partagé : si plusieurs requêtes échouent en 401 au même instant
// (ex. plusieurs widgets du dashboard chargés en parallèle), une seule
// tentative de rafraîchissement part réellement — les autres attendent son
// résultat au lieu de déclencher chacune leur propre appel /auth/refresh.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  try {
    // Appel via `axios` brut (pas `api`) : évite de repasser par les
    // intercepteurs ci-dessous et de créer une boucle si le refresh
    // lui-même échoue en 401.
    const { data } = await axios.post('/api/auth/refresh', { refreshToken });
    const tokens = data?.data;
    if (!tokens?.accessToken) return null;
    if (tokens.refreshToken) setAuthCookies(tokens.accessToken, tokens.refreshToken);
    else setAccessCookie(tokens.accessToken);
    return tokens.accessToken as string;
  } catch {
    return null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? '';
    // /auth/login et /auth/register renvoient aussi 401/400 sur des
    // identifiants invalides — ce n'est PAS une session expirée, la
    // redirection dure casserait l'affichage du message d'erreur du
    // formulaire. /auth/refresh est de toute façon appelé hors de `api`
    // (voir refreshAccessToken) mais reste exclu ici par cohérence.
    const isAuthEndpoint = /\/auth\/(login|register|refresh)/.test(url);

    if (status === 401 && !isAuthEndpoint && !error.config?._retry) {
      error.config._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        error.config.headers = { ...error.config.headers, Authorization: `Bearer ${newToken}` };
        return api.request(error.config);
      }

      // Le rafraîchissement a échoué : la session est réellement terminée.
      clearAuthCookies();
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        // Ce 401 peut venir d'une requête de fond (widget périodique, autre
        // onglet) pendant qu'un formulaire est à moitié rempli ailleurs sur
        // la page — un redirect immédiat et silencieux l'efface sans
        // prévenir. On laisse le toast le temps de s'afficher avant de
        // couper la page.
        toast.error('Session expirée. Vous allez être redirigé vers la connexion.');
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
