import { act, render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import auth, { sessionExpired } from '@/store/auth.slice';
import ProtectedRoute from './ProtectedRoute';

const user = { id: 'u1', firstName: 'Ahmed', lastName: 'Ali', role: 'ADMIN' };

const renderProtected = authState => {
  const store = configureStore({ reducer: { auth }, preloadedState: { auth: authState } });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/secret']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/secret" element={<p>secret page</p>} />
          </Route>
          <Route path="/login" element={<p>login page</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return store;
};

describe('ProtectedRoute', () => {
  it('shows a spinner and no content while the session is being checked', () => {
    renderProtected({ user: null, status: 'loading' });
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('secret page')).not.toBeInTheDocument();
    expect(screen.queryByText('login page')).not.toBeInTheDocument();
  });

  it('redirects to /login when there is no session', () => {
    renderProtected({ user: null, status: 'failed' });
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('secret page')).not.toBeInTheDocument();
  });

  it('renders the page for a signed-in user', () => {
    renderProtected({ user, status: 'succeeded' });
    expect(screen.getByText('secret page')).toBeInTheDocument();
  });

  it('redirects to /login as soon as the session expires', () => {
    const store = renderProtected({ user, status: 'succeeded' });
    expect(screen.getByText('secret page')).toBeInTheDocument();
    act(() => {
      store.dispatch(sessionExpired());
    });
    expect(screen.getByText('login page')).toBeInTheDocument();
  });
});
