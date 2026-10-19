import { cleanParams } from '@/utils/query';
import { apiClient, data } from './axiosClient';

export const vehiclesApi = {
  list: params => apiClient.get('/vehicles', { params: cleanParams(params) }).then(data),
  get: id => apiClient.get(`/vehicles/${id}`).then(data),
  create: body => apiClient.post('/vehicles', body).then(data),
  update: (id, body) => apiClient.patch(`/vehicles/${id}`, body).then(data),
  setStatus: (id, status) => apiClient.patch(`/vehicles/${id}/status`, { status }).then(data),
  remove: id => apiClient.delete(`/vehicles/${id}`),
};
