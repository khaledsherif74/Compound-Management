import { createSlice } from '@reduxjs/toolkit';
import { usersApi } from '@/api/users.api';
import { vehiclesApi } from '@/api/vehicles.api';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { ROLES } from '@/constants/roles';
import { createApiThunk } from './createApiThunk';

export const fetchVehicles = createApiThunk('vehicles/fetch', params => vehiclesApi.list(params));
export const createVehicle = createApiThunk('vehicles/create', body => vehiclesApi.create(body));
export const updateVehicle = createApiThunk('vehicles/update', ({ id, body }) => vehiclesApi.update(id, body));
export const setVehicleStatus = createApiThunk('vehicles/setStatus', ({ id, status }) =>
  vehiclesApi.setStatus(id, status),
);
export const deleteVehicle = createApiThunk('vehicles/delete', async id => {
  await vehiclesApi.remove(id);
  return id;
});

const OWNER_PAGE_SIZE = 100;
const MAX_OWNER_PAGES = 20;

/** Loads every OWNER account (all pages) for the searchable owner select. Staff only. */
export const fetchOwnerOptions = createApiThunk('vehicles/fetchOwners', async () => {
  const owners = [];
  for (let page = 1; page <= MAX_OWNER_PAGES; page += 1) {
    // Sequential on purpose: each response says whether another page exists.
    // eslint-disable-next-line no-await-in-loop
    const result = await usersApi.list({ role: ROLES.OWNER, page, limit: OWNER_PAGE_SIZE });
    owners.push(...result.users);
    if (page >= result.totalPages) break;
  }
  return owners;
});

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
  requestId: null,
  owners: { items: [], status: REQUEST_STATUS.IDLE, error: null },
};

/** Update responses lack the `owner` relation, so merge into the cached row. */
const mergeVehicle = (state, vehicle) => {
  const index = state.items.findIndex(item => item.id === vehicle.id);
  if (index !== -1) state.items[index] = { ...state.items[index], ...vehicle };
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchVehicles.pending, (state, action) => {
        state.status = REQUEST_STATUS.LOADING;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        const { vehicles, total, page, limit, totalPages } = action.payload;
        Object.assign(state, { items: vehicles, total, page, limit, totalPages });
        state.status = REQUEST_STATUS.SUCCEEDED;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.status = REQUEST_STATUS.FAILED;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => mergeVehicle(state, action.payload))
      .addCase(setVehicleStatus.fulfilled, (state, action) => mergeVehicle(state, action.payload))
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(fetchOwnerOptions.pending, state => {
        state.owners.status = REQUEST_STATUS.LOADING;
        state.owners.error = null;
      })
      .addCase(fetchOwnerOptions.fulfilled, (state, action) => {
        state.owners = { items: action.payload, status: REQUEST_STATUS.SUCCEEDED, error: null };
      })
      .addCase(fetchOwnerOptions.rejected, (state, action) => {
        state.owners.status = REQUEST_STATUS.FAILED;
        state.owners.error = action.payload ?? action.error.message;
      });
  },
});

export default vehiclesSlice.reducer;
