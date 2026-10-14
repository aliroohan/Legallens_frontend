import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // true while getMe query is in-flight on mount

  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // start true; set to false after getMe resolves

      setUser: (user) =>
        set({ user, isAuthenticated: true, isLoading: false }, false, 'auth/setUser'),

      clearUser: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }, false, 'auth/clearUser'),

      setLoading: (loading) => set({ isLoading: loading }, false, 'auth/setLoading'),
    }),
    { name: 'LegalLens:Auth' }
  )
);
