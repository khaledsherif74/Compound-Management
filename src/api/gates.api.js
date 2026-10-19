import { cleanParams } from '@/utils/query';
import { apiClient, data } from './axiosClient';

export const gatesApi = {
  list: params => apiClient.get('/gates', { params: cleanParams(params) }).then(data),
  get: id => apiClient.get(`/gates/${id}`).then(data),
  create: body => apiClient.post('/gates', body).then(data),
  update: (id, body) => apiClient.patch(`/gates/${id}`, body).then(data),
  setActive: (id, isActive) => apiClient.patch(`/gates/${id}/disable`, { isActive }).then(data),
  remove: id => apiClient.delete(`/gates/${id}`),
};
