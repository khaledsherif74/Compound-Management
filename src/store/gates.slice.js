import { createSlice } from '@reduxjs/toolkit';
import { gatesApi } from '@/api/gates.api';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { createApiThunk } from './createApiThunk';

export const fetchGates = createApiThunk('gates/fetch', params => gatesApi.list(params));
export const createGate = createApiThunk('gates/create', body => gatesApi.create(body));
export const updateGate = createApiThunk('gates/update', ({ id, body }) => gatesApi.update(id, body));
export const setGateActive = createApiThunk('gates/setActive', ({ id, isActive }) =>
  gatesApi.setActive(id, isActive),
);
export const deleteGate = createApiThunk('gates/delete', async id => {
  await gatesApi.remove(id);
  return id;
});

const OPTIONS_PAGE_SIZE = 100;
const MAX_OPTION_PAGES = 20;

/** Loads every gate (all pages) for filter dropdowns. */
export const fetchGateOptions = createApiThunk('gates/fetchOptions', async () => {
  const gates = [];
  for (let page = 1; page <= MAX_OPTION_PAGES; page += 1) {
    // Sequential on purpose: each response says whether another page exists.
    // eslint-disable-next-line no-await-in-loop
    const result = await gatesApi.list({ page, limit: OPTIONS_PAGE_SIZE });
    gates.push(...result.gates);
    if (page >= result.totalPages) break;
  }
  return gates;
});

const initialState = {
  options: { items: [], status: REQUEST_STATUS.IDLE },
  items: [],
  total: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
  requestId: null,
};

const replaceGate = (state, gate) => {
  const index = state.items.findIndex(item => item.id === gate.id);
  if (index !== -1) state.items[index] = gate;
};

const gatesSlice = createSlice({
  name: 'gates',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGates.pending, (state, action) => {
        state.status = REQUEST_STATUS.LOADING;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchGates.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        const { gates, total, page, limit, totalPages } = action.payload;
        Object.assign(state, { items: gates, total, page, limit, totalPages });
        state.status = REQUEST_STATUS.SUCCEEDED;
      })
      .addCase(fetchGates.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.status = REQUEST_STATUS.FAILED;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(fetchGateOptions.fulfilled, (state, action) => {
        state.options = { items: action.payload, status: REQUEST_STATUS.SUCCEEDED };
      })
      .addCase(updateGate.fulfilled, (state, action) => replaceGate(state, action.payload))
      .addCase(setGateActive.fulfilled, (state, action) => replaceGate(state, action.payload))
      .addCase(deleteGate.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default gatesSlice.reducer;
