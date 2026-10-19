import axios from 'axios';
import { env } from '@/config/env';
import { normalizeApiError } from '@/utils/apiError';

/** Calls where a 401 means "bad credentials / no session", not "session expired". */
const SESSION_FREE_PATHS = ['/auth/login', '/auth/me', '/auth/logout', '/auth/reset-password'];

let unauthorizedHandler = null;

/** Registered once at startup (see api/session.js). The only place a 401 is acted on. */
export const setUnauthorizedHandler = handler => {
  unauthorizedHandler = handler;
};

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    const normalized = normalizeApiError(error);
    const url = error?.config?.url ?? '';
    if (normalized.statusCode === 401 && !SESSION_FREE_PATHS.some(path => url.endsWith(path))) {
      unauthorizedHandler?.(normalized);
    }
    return Promise.reject(normalized);
  },
);

/** Backend envelope: { status, data, message?, meta? } */
export const envelope = response => response.data;
export const data = response => response.data.data;
