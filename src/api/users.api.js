import { cleanParams } from '@/utils/query';
import { apiClient, data, envelope } from './axiosClient';

export const usersApi = {
  list: params => apiClient.get('/users', { params: cleanParams(params) }).then(data),
  get: id => apiClient.get(`/users/${id}`).then(data),
  /** @returns the full envelope: { data: user, message, meta: { passwordRecoverySent } } */
  create: body => apiClient.post('/users', body).then(envelope),
  update: (id, body) => apiClient.patch(`/users/${id}`, body).then(data),
  setActive: (id, isActive) => apiClient.patch(`/users/${id}/disable`, { isActive }).then(data),
  remove: id => apiClient.delete(`/users/${id}`),
  sendPasswordRecovery: id => apiClient.post(`/users/${id}/password-reset`),
};
