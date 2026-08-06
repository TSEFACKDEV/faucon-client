import axios from 'axios';
import Cookies from 'js-cookie';

// baseURL relatif : les appels partent vers `/api/*` qui est proxifié par
// Next.js (voir next.config.ts) vers le backend FAUCON. Le navigateur reste
// sur la même origine, ce qui contourne le CORS du serveur distant.
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('faucon_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('faucon_access_token');
      Cookies.remove('faucon_refresh_token');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;