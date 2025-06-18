import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "./store/auth";

// Centralised base URL (supports NEXT_PUBLIC_API_URL override)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// If you see a type error for axios, run: npm install --save-dev @types/axios

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Add token to every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Global error handler && token refresh
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    if (err.response?.status === 401) {
      const { refreshToken } = useAuthStore.getState();

      // If we have a refresh token, try to refresh once
      if (refreshToken) {
        try {
          const resp = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          const { accessToken: newAccess, refreshToken: newRefresh } = resp.data.data.tokens;
          const { user } = useAuthStore.getState();

          useAuthStore.getState().setAuth(user, newAccess, newRefresh);

          // Retry original request with new token
          if (err.config) {
            err.config.headers = err.config.headers || {};
            err.config.headers.Authorization = `Bearer ${newAccess}`;
            return api.request(err.config);
          }
        } catch (refreshErr) {
          // Refresh failed, logout
          useAuthStore.getState().logout();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshErr);
        }
      } else {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
export { api }; 