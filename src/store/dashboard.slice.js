import { createSlice } from '@reduxjs/toolkit';
import { startOfDay } from 'date-fns';
import { accessLogsApi } from '@/api/accessLogs.api';
import { gatesApi } from '@/api/gates.api';
import { usersApi } from '@/api/users.api';
import { vehiclesApi } from '@/api/vehicles.api';
import { LOG_ACTIONS, REQUEST_STATUS, VEHICLE_STATUS } from '@/constants/enums';
import { getErrorMessage } from '@/utils/apiError';
import { createApiThunk } from './createApiThunk';

/** Each job returns just what its card needs. Totals come from `limit=1` list calls. */
const JOBS = {
  users: () => usersApi.list({ limit: 1 }).then(result => result.total),
  vehicles: () => vehiclesApi.list({ limit: 1 }).then(result => result.total),
  // No status filter exists server-side: scan the newest 50 vehicles for pending ones.
  pendingVehicles: () =>
    vehiclesApi
      .list({ limit: 50 })
      .then(result => result.vehicles.filter(vehicle => vehicle.status === VEHICLE_STATUS.PENDING).slice(0, 5)),
  gates: () => gatesApi.list({ limit: 1 }).then(result => result.total),
  logsToday: since => accessLogsApi.list({ from: since, limit: 1 }).then(result => result.total),
  deniedToday: since =>
    accessLogsApi.list({ from: since, action: LOG_ACTIONS.DENIED, limit: 1 }).then(result => result.total),
  latestLogs: () => accessLogsApi.list({ limit: 10 }).then(result => result.logs),
  latestDenied: () =>
    accessLogsApi.list({ action: LOG_ACTIONS.DENIED, limit: 5 }).then(result => result.logs),
  // Owners have at most a handful of vehicles, so one page of 100 gives exact status counts.
  myVehicles: () => vehiclesApi.list({ limit: 100 }).then(result => ({ total: result.total, items: result.vehicles })),
  myLogs: () => accessLogsApi.listMine({ limit: 5 }).then(result => result.logs),
};

/**
 * arg: plan object from utils/dashboardPlan.js. Resolves with
 * { sections: { [name]: { data } | { error } } } so one failing card never blanks the page.
 */
export const fetchDashboard = createApiThunk('dashboard/fetch', async plan => {
  const since = startOfDay(new Date()).toISOString();
  const entries = await Promise.all(
    Object.keys(JOBS)
      .filter(name => plan[name])
      .map(async name => {
        try {
          return [name, { data: await JOBS[name](since) }];
        } catch (error) {
          return [name, { error: getErrorMessage(error) }];
        }
      }),
  );
  return { sections: Object.fromEntries(entries), fetchedAt: new Date().toISOString() };
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { sections: {}, status: REQUEST_STATUS.IDLE, fetchedAt: null, requestId: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDashboard.pending, (state, action) => {
        state.status = REQUEST_STATUS.LOADING;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.sections = action.payload.sections;
        state.fetchedAt = action.payload.fetchedAt;
        state.status = REQUEST_STATUS.SUCCEEDED;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.status = REQUEST_STATUS.FAILED;
      });
  },
});

export default dashboardSlice.reducer;
