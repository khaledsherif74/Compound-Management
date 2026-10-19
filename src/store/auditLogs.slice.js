import { createSlice } from '@reduxjs/toolkit';
import { auditLogsApi } from '@/api/auditLogs.api';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { createApiThunk } from './createApiThunk';

export const fetchAuditLogs = createApiThunk('auditLogs/fetch', params => auditLogsApi.list(params));

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
  requestId: null,
};

const auditLogsSlice = createSlice({
  name: 'auditLogs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAuditLogs.pending, (state, action) => {
        state.status = REQUEST_STATUS.LOADING;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        const { logs, total, page, limit, totalPages } = action.payload;
        Object.assign(state, { items: logs, total, page, limit, totalPages });
        state.status = REQUEST_STATUS.SUCCEEDED;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.status = REQUEST_STATUS.FAILED;
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default auditLogsSlice.reducer;
