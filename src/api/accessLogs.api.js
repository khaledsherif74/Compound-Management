import { cleanParams } from '@/utils/query';
import { apiClient, data } from './axiosClient';

export const accessLogsApi = {
  list: params => apiClient.get('/access-logs', { params: cleanParams(params) }).then(data),
  /** OWNER only: own vehicles, last 3 days. */
  listMine: params => apiClient.get('/access-logs/my', { params: cleanParams(params) }).then(data),
  create: body => apiClient.post('/access-logs', body).then(data),
};
