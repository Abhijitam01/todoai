// Zustand Auth Store for TodoAI
// Tracks user, token, and authentication state globally

import { create } from "zustand";

export type AuthState = {
  user: null | { id: string; name: string; email: string };
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: AuthState["user"], token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setUser: (user, token) =>
    set({ user, token, isAuthenticated: true }),
  logout: () =>
    set({ user: null, token: null, isAuthenticated: false }),
})); 