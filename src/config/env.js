/**
 * Single access point for build-time environment variables.
 * VITE_API_BASE_URL falls back to a same-origin relative path so a reverse proxy works
 * without any rebuild.
 */
const apiBase = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const env = Object.freeze({
  API_BASE_URL: apiBase.replace(/\/+$/, ''),
  IS_DEV: import.meta.env.DEV,
});
