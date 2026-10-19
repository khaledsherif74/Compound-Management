import { cleanParams } from '@/utils/query';
import { apiClient, data } from './axiosClient';

export const auditLogsApi = {
  list: params => apiClient.get('/audit-logs', { params: cleanParams(params) }).then(data),
};
