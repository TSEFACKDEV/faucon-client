import api from '@/lib/axios';
import { setAuthCookies, getAccessToken, getRefreshToken, clearAuthCookies } from '@/lib/authCookies';
import { broadcastAuthChange } from '@/lib/authBroadcast';
import { AuthResponse, User, ApiResponse } from '@/types';

export const authService = {
  login: async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    const result = data.data!;
    setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken);
    broadcastAuthChange('login');
    return result;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      clearAuthCookies();
      broadcastAuthChange('logout');
    }
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return data.data!;
  },

  updateProfile: async (payload: {
    userName: string;
    email: string;
    telephone?: string;
  }): Promise<User> => {
    const { data } = await api.patch<ApiResponse<User>>('/auth/me', payload);
    return data.data!;
  },

  isAuthenticated: (): boolean => {
    return !!getAccessToken();
  },

  // Ce dashboard est réservé au rôle ADMIN. Centralisé ici plutôt que
  // dupliqué (page de connexion + layout du dashboard appliquaient
  // auparavant la même règle séparément, avec un risque de divergence) :
  // déconnecte immédiatement (retire les cookies fraîchement posés) et
  // renvoie `false` si l'utilisateur connecté n'est pas admin.
  ensureAdmin: async (user: User): Promise<boolean> => {
    if (user.role === 'ADMIN') return true;
    await authService.logout();
    return false;
  },
};