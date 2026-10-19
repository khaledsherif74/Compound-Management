import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/api/auth.api';
import reducer, { bootstrapSession, login, logout, sessionExpired } from './auth.slice';

vi.mock('@/api/auth.api', () => ({
  authApi: {
    getMe: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    updatePassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

const user = { id: 'u1', firstName: 'Ahmed', lastName: 'Ali', role: 'ADMIN' };
const makeStore = () => configureStore({ reducer: { auth: reducer } });

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth slice', () => {
  it('starts signed out and not yet bootstrapped', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual({ user: null, status: 'idle' });
  });

  it('stores the user when the session bootstrap succeeds', async () => {
    authApi.getMe.mockResolvedValue(user);
    const store = makeStore();
    await store.dispatch(bootstrapSession());
    expect(store.getState().auth).toEqual({ user, status: 'succeeded' });
  });

  it('marks the session as checked but signed out when bootstrap fails', async () => {
    authApi.getMe.mockRejectedValue(new Error('Please log in to reach this endpoint.'));
    const store = makeStore();
    await store.dispatch(bootstrapSession());
    expect(store.getState().auth).toEqual({ user: null, status: 'failed' });
  });

  it('runs the bootstrap request only once even if dispatched twice (StrictMode)', async () => {
    authApi.getMe.mockResolvedValue(user);
    const store = makeStore();
    const first = store.dispatch(bootstrapSession());
    store.dispatch(bootstrapSession());
    await first;
    expect(authApi.getMe).toHaveBeenCalledTimes(1);
    expect(store.getState().auth.status).toBe('succeeded');
  });

  it('signs in and never keeps the token in state', async () => {
    authApi.login.mockResolvedValue({ user, token: 'secret-jwt' });
    const store = makeStore();
    await store.dispatch(login({ identifier: 'ahmed', password: 'pw' }));
    expect(store.getState().auth.user).toEqual(user);
    expect(Object.keys(store.getState().auth)).toEqual(['user', 'status']);
    expect(JSON.stringify(store.getState())).not.toContain('secret-jwt');
  });

  it('rejects login with the backend message', async () => {
    authApi.login.mockRejectedValue(new Error('Invalid credentials'));
    const store = makeStore();
    await expect(store.dispatch(login({ identifier: 'x', password: 'y' })).unwrap()).rejects.toBe('Invalid credentials');
    expect(store.getState().auth.user).toBeNull();
  });

  it('signs out locally even when the logout request fails', async () => {
    authApi.login.mockResolvedValue({ user, token: 't' });
    authApi.logout.mockRejectedValue(new Error('Network down'));
    const store = makeStore();
    await store.dispatch(login({ identifier: 'ahmed', password: 'pw' }));
    await store.dispatch(logout());
    expect(store.getState().auth.user).toBeNull();
  });

  it('clears the user when the session expires', async () => {
    authApi.login.mockResolvedValue({ user, token: 't' });
    const store = makeStore();
    await store.dispatch(login({ identifier: 'ahmed', password: 'pw' }));
    store.dispatch(sessionExpired());
    expect(store.getState().auth.user).toBeNull();
  });
});
