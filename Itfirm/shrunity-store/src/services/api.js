import axios from 'axios';
import { API_BASE_URL } from '../config';
import { tokenStorage } from './tokenStorage';

export const UNAUTHORIZED_EVENT = 'shrunity:unauthorized';
export const isAuthFailure = (error) => [401, 403].includes(error?.response?.status);
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // An expired/invalid token: drop it and tell AuthContext. A failed login (no token yet) is left alone.
    if (error.response?.status === 401 && tokenStorage.get()) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.error && typeof data.error === 'string') return data.error;
  if (!error?.response) {
    return "We couldn't reach the server. Check your connection and that the backend is running.";
  }
  return fallback;
}
