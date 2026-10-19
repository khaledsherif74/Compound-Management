import {
  Car,
  DoorOpen,
  History,
  LayoutDashboard,
  ScrollText,
  UserCircle,
  Users,
} from 'lucide-react';
import { PERMISSIONS as P } from './permissions';
import { ROUTES } from './routes';

/**
 * Drives the sidebar, breadcrumbs and route guards.
 * `permissions` means "any of". Owners see `ownerLabelKey` when it is set.
 * @type {{key: string, path: string, icon: Function, labelKey: string, ownerLabelKey?: string,
 *   permissions: string[], inNav: boolean}[]}
 */
export const NAV_ITEMS = Object.freeze([
  { key: 'dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard, labelKey: 'nav.dashboard', permissions: [P.DASHBOARD_VIEW], inNav: true },
  { key: 'users', path: ROUTES.USERS, icon: Users, labelKey: 'nav.users', permissions: [P.USERS_VIEW], inNav: true },
  { key: 'vehicles', path: ROUTES.VEHICLES, icon: Car, labelKey: 'nav.vehicles', ownerLabelKey: 'nav.myVehicles', permissions: [P.VEHICLES_VIEW], inNav: true },
  { key: 'gates', path: ROUTES.GATES, icon: DoorOpen, labelKey: 'nav.gates', permissions: [P.GATES_VIEW], inNav: true },
  { key: 'access-logs', path: ROUTES.ACCESS_LOGS, icon: History, labelKey: 'nav.accessLogs', ownerLabelKey: 'nav.myAccessLogs', permissions: [P.ACCESS_LOGS_VIEW, P.ACCESS_LOGS_VIEW_OWN], inNav: true },
  { key: 'audit-logs', path: ROUTES.AUDIT_LOGS, icon: ScrollText, labelKey: 'nav.auditLogs', permissions: [P.AUDIT_LOGS_VIEW], inNav: true },
  { key: 'profile', path: ROUTES.PROFILE, icon: UserCircle, labelKey: 'nav.profile', permissions: [P.PROFILE_VIEW], inNav: false },
]);
