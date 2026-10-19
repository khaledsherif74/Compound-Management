import { createSlice } from '@reduxjs/toolkit';
import { accessLogsApi } from '@/api/accessLogs.api';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { createApiThunk } from './createApiThunk';

/**
 * arg: { params, mine, silent }. `mine` uses GET /access-logs/my (owners). `silent` is for
 * polling: no loading state, and it is skipped while a normal load is still running.
 */
export const fetchAccessLogs = createApiThunk(
  'accessLogs/fetch',
  async ({ params, mine }) => {
    const data = mine ? await accessLogsApi.listMine(params) : await accessLogsApi.list(params);
    return { ...data, fetchedAt: new Date().toISOString() };
  },
  {
    condition: (arg, { getState }) =>
      !(arg.silent && getState().accessLogs.status === REQUEST_STATUS.LOADING),
  },
);

export const createAccessLog = createApiThunk('accessLogs/create', body => accessLogsApi.create(body));

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
  requestId: null,
  fetchedAt: null,
  /** Message from the last failed background refresh; old rows stay visible. */
  refreshError: null,
};

const accessLogsSlice = createSlice({
  name: 'accessLogs',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAccessLogs.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        if (!action.meta.arg.silent) {
          state.status = REQUEST_STATUS.LOADING;
          state.error = null;
        }
      })
      .addCase(fetchAccessLogs.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        const { logs, total, page, limit, totalPages, fetchedAt } = action.payload;
        Object.assign(state, { items: logs, total, page, limit, totalPages, fetchedAt });
        state.status = REQUEST_STATUS.SUCCEEDED;
        state.refreshError = null;
      })
      .addCase(fetchAccessLogs.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        const message = action.payload ?? action.error.message;
        if (action.meta.arg.silent) {
          state.refreshError = message;
        } else {
          state.status = REQUEST_STATUS.FAILED;
          state.error = message;
        }
      });
  },
});

export default accessLogsSlice.reducer;
