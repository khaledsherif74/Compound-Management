import { createSlice } from '@reduxjs/toolkit';
import { usersApi } from '@/api/users.api';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { createApiThunk } from './createApiThunk';

export const fetchUsers = createApiThunk('users/fetch', params => usersApi.list(params));
/** Resolves with the full envelope: { data: user, message, meta: { passwordRecoverySent } }. */
export const createUser = createApiThunk('users/create', body => usersApi.create(body));
export const updateUser = createApiThunk('users/update', ({ id, body }) => usersApi.update(id, body));
export const setUserActive = createApiThunk('users/setActive', ({ id, isActive }) =>
  usersApi.setActive(id, isActive),
);
export const deleteUser = createApiThunk('users/delete', async id => {
  await usersApi.remove(id);
  return id;
});
export const sendUserRecovery = createApiThunk('users/recovery', id => usersApi.sendPasswordRecovery(id));

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  totalPages: 0,
  status: REQUEST_STATUS.IDLE,
  error: null,
  /** Only the latest list request may write results (ignores out-of-order responses). */
  requestId: null,
};

/** Merges a mutation response into the cached row (responses lack vehicleCount). */
const mergeUser = (state, user) => {
  const index = state.items.findIndex(item => item.id === user.id);
  if (index !== -1) state.items[index] = { ...state.items[index], ...user };
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = REQUEST_STATUS.LOADING;
        state.error = null;
        state.requestId = action.meta.requestId;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        const { users, total, page, limit, totalPages } = action.payload;
        Object.assign(state, { items: users, total, page, limit, totalPages });
        state.status = REQUEST_STATUS.SUCCEEDED;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        if (action.meta.requestId !== state.requestId) return;
        state.status = REQUEST_STATUS.FAILED;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => mergeUser(state, action.payload))
      .addCase(setUserActive.fulfilled, (state, action) => mergeUser(state, action.payload))
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export default usersSlice.reducer;
