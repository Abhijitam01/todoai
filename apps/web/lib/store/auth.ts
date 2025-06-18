// Zustand Auth Store for TodoAI
// Tracks user, token, and authentication state globally

import { create } from "zustand";

export type AuthUser = { id: string; name?: string; email: string } | null;

export interface AuthState {
  user: AuthUser;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  // Set both user and tokens, persists to localStorage
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  // Clear auth tokens
  logout: () => void;
}

// Helper to persist tokens in localStorage so that page refresh keeps auth
const persist = (key: string, value: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

const load = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: load<AuthUser>("todoai:user", null),
  accessToken: load<string | null>("todoai:accessToken", null),
  refreshToken: load<string | null>("todoai:refreshToken", null),
  isAuthenticated: !!load<string | null>("todoai:accessToken", null),
  setAuth: (user, accessToken, refreshToken) => {
    persist("todoai:user", user);
    persist("todoai:accessToken", accessToken);
    persist("todoai:refreshToken", refreshToken);
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },
  logout: () => {
    persist("todoai:user", null);
    persist("todoai:accessToken", null);
    persist("todoai:refreshToken", null);
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
})); 