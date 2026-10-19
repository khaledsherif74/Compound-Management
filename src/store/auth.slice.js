import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth.api';
import { REQUEST_STATUS } from '@/constants/enums';
import { createApiThunk } from './createApiThunk';

/** Runs once on app start. `condition` makes StrictMode's double effect harmless. */
export const bootstrapSession = createApiThunk('auth/bootstrap', () => authApi.getMe(), {
  condition: (_, { getState }) => getState().auth.status === REQUEST_STATUS.IDLE,
});

export const login = createApiThunk('auth/login', async credentials => {
  const { user } = await authApi.login(credentials);
  return user;
});

/** Re-reads the profile (adds vehicleCount). Unlike bootstrap it can run any time. */
export const refreshMe = createApiThunk('auth/refreshMe', () => authApi.getMe());

export const logout = createApiThunk('auth/logout', () => authApi.logout());
export const changePassword = createApiThunk('auth/changePassword', body => authApi.updatePassword(body));
export const resetPassword = createApiThunk('auth/resetPassword', body => authApi.resetPassword(body));

const initialState = {
  user: null,
  /** Session bootstrap status. */
  status: REQUEST_STATUS.IDLE,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired(state) {
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(bootstrapSession.pending, state => {
        state.status = REQUEST_STATUS.LOADING;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.status = REQUEST_STATUS.SUCCEEDED;
        state.user = action.payload;
      })
      .addCase(bootstrapSession.rejected, (state, action) => {
        if (action.meta.condition) return;
        state.status = REQUEST_STATUS.FAILED;
        state.user = null;
      })
      .addCase(refreshMe.fulfilled, (state, action) => {
        if (state.user) state.user = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
      })
      .addCase(logout.rejected, state => {
        state.user = null;
      });
  },
});

export const { sessionExpired } = authSlice.actions;
export default authSlice.reducer;
