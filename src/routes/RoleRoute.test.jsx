import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PERMISSIONS as P } from '@/constants/permissions';
import auth from '@/store/auth.slice';
import RoleRoute from './RoleRoute';

const renderFor = (role, permission) => {
  const store = configureStore({
    reducer: { auth },
    preloadedState: { auth: { user: { id: 'u1', role }, status: 'succeeded' } },
  });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <RoleRoute permission={permission}>
          <p>allowed content</p>
        </RoleRoute>
      </MemoryRouter>
    </Provider>,
  );
};

describe('RoleRoute', () => {
  it('renders the children when the role has the permission', () => {
    renderFor('ADMIN', P.AUDIT_LOGS_VIEW);
    expect(screen.getByText('allowed content')).toBeInTheDocument();
  });

  it('renders the 403 page when it does not', () => {
    renderFor('ROLLER', P.AUDIT_LOGS_VIEW);
    expect(screen.queryByText('allowed content')).not.toBeInTheDocument();
    expect(screen.getByText('403')).toBeInTheDocument();
  });

  it('accepts a list and allows access when any permission matches', () => {
    renderFor('OWNER', [P.ACCESS_LOGS_VIEW, P.ACCESS_LOGS_VIEW_OWN]);
    expect(screen.getByText('allowed content')).toBeInTheDocument();
  });
});
