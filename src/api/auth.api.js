import { apiClient, data } from './axiosClient';

export const authApi = {
  /** @returns {Promise<{user: object, token: string}>} token is ignored: the cookie is the session. */
  login: credentials => apiClient.post('/auth/login', credentials).then(data),
  getMe: () => apiClient.get('/auth/me').then(data),
  logout: () => apiClient.post('/auth/logout'),
  updatePassword: body => apiClient.patch('/auth/password', body),
  resetPassword: body => apiClient.post('/auth/reset-password', body),
};
