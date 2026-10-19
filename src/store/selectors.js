import { createSelector } from '@reduxjs/toolkit';
import { REQUEST_STATUS } from '@/constants/enums';
import { ROLE_PERMISSIONS } from '@/constants/permissions';

export const selectCurrentUser = state => state.auth.user;
export const selectUserRole = state => state.auth.user?.role ?? null;
export const selectIsAuthenticated = state => Boolean(state.auth.user);
export const selectIsSessionReady = state =>
  state.auth.status === REQUEST_STATUS.SUCCEEDED || state.auth.status === REQUEST_STATUS.FAILED;

export const selectPermissions = createSelector(
  selectUserRole,
  role => ROLE_PERMISSIONS[role] ?? new Set(),
);

export const selectTheme = state => state.ui.theme;
export const selectLanguage = state => state.ui.language;
export const selectSidebarCollapsed = state => state.ui.sidebarCollapsed;
export const selectMobileNavOpen = state => state.ui.mobileNavOpen;

export const selectUsersState = state => state.users;
export const selectUserById = createSelector(
  [selectUsersState, (_state, id) => id],
  (users, id) => users.items.find(user => user.id === id) ?? null,
);

export const selectVehiclesState = state => state.vehicles;
export const selectOwnerOptions = state => state.vehicles.owners;
export const selectVehicleById = createSelector(
  [selectVehiclesState, (_state, id) => id],
  (vehicles, id) => vehicles.items.find(vehicle => vehicle.id === id) ?? null,
);

export const selectGatesState = state => state.gates;
export const selectGateById = createSelector(
  [selectGatesState, (_state, id) => id],
  (gates, id) => gates.items.find(gate => gate.id === id) ?? null,
);

export const selectGateOptions = state => state.gates.options;
export const selectAccessLogsState = state => state.accessLogs;

export const selectAuditLogsState = state => state.auditLogs;

export const selectDashboardState = state => state.dashboard;
