import api from '@/lib/axios';
import Cookies from 'js-cookie';
import { AuthResponse, User, ApiResponse } from '@/types';

const COOKIE_OPTIONS = { expires: 7, secure: false, sameSite: 'lax' as const };

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
    Cookies.set('faucon_access_token', result.tokens.accessToken, COOKIE_OPTIONS);
    Cookies.set('faucon_refresh_token', result.tokens.refreshToken, COOKIE_OPTIONS);
    return result;
  },

  logout: async (): Promise<void> => {
    const refreshToken = Cookies.get('faucon_refresh_token');
    try {
      await api.post('/auth/logout', { refreshToken });
    } finally {
      Cookies.remove('faucon_access_token');
      Cookies.remove('faucon_refresh_token');
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
    const { data } = await api.put<ApiResponse<User>>('/auth/profile', payload);
    return data.data!;
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get('faucon_access_token');
  },
};