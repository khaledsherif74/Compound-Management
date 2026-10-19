import { lazy } from 'react';
import { PERMISSIONS as P } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';

/**
 * Authenticated routes. `permission` is "any of"; the sidebar uses constants/navigation.js,
 * so a new resource needs an entry in both places (see README).
 */
export const APP_ROUTES = [
  { path: ROUTES.DASHBOARD, permission: [P.DASHBOARD_VIEW], Component: lazy(() => import('@/pages/dashboard/DashboardPage')) },
  { path: ROUTES.USERS, permission: [P.USERS_VIEW], Component: lazy(() => import('@/pages/users/UsersPage')) },
  { path: ROUTES.VEHICLES, permission: [P.VEHICLES_VIEW], Component: lazy(() => import('@/pages/vehicles/VehiclesPage')) },
  { path: ROUTES.GATES, permission: [P.GATES_VIEW], Component: lazy(() => import('@/pages/gates/GatesPage')) },
  { path: ROUTES.ACCESS_LOGS, permission: [P.ACCESS_LOGS_VIEW, P.ACCESS_LOGS_VIEW_OWN], Component: lazy(() => import('@/pages/access-logs/AccessLogsPage')) },
  { path: ROUTES.AUDIT_LOGS, permission: [P.AUDIT_LOGS_VIEW], Component: lazy(() => import('@/pages/audit-logs/AuditLogsPage')) },
  { path: ROUTES.PROFILE, permission: [P.PROFILE_VIEW], Component: lazy(() => import('@/pages/profile/ProfilePage')) },
];
