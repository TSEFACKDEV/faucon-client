import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  setLoading: (v) => set({ isLoading: v }),
}));