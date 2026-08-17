import Cookies from 'js-cookie';

const ACCESS_COOKIE  = 'faucon_access_token';
const REFRESH_COOKIE = 'faucon_refresh_token';

// Le cookie du token d'accès ne doit pas survivre plus longtemps que le JWT
// lui-même (1h par défaut côté serveur, JWT_ACCESS_EXPIRES) — sinon il traîne
// dans le navigateur bien après son expiration réelle, source de confusion
// en debug. Le refresh token, lui, correspond à sa durée de vie serveur (7j).
const ACCESS_COOKIE_OPTIONS = {
  expires: 1 / 24, // js-cookie exprime `expires` en jours — ~1h
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};
const REFRESH_COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

export const setAuthCookies = (accessToken: string, refreshToken: string): void => {
  Cookies.set(ACCESS_COOKIE, accessToken, ACCESS_COOKIE_OPTIONS);
  Cookies.set(REFRESH_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);
};

export const setAccessCookie = (accessToken: string): void => {
  Cookies.set(ACCESS_COOKIE, accessToken, ACCESS_COOKIE_OPTIONS);
};

export const getAccessToken = (): string | undefined => Cookies.get(ACCESS_COOKIE);
export const getRefreshToken = (): string | undefined => Cookies.get(REFRESH_COOKIE);

export const clearAuthCookies = (): void => {
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
};
