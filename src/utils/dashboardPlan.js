import { PERMISSIONS as P } from '@/constants/permissions';
import { ROLES } from '@/constants/roles';

/**
 * Which dashboard sections a user may load, derived from permissions so the dashboard never
 * calls an endpoint the role cannot use.
 * @param {(permission: string) => boolean} can
 * @param {string} role
 */
export const buildDashboardPlan = (can, role) => {
  const owner = role === ROLES.OWNER;
  const logs = can(P.ACCESS_LOGS_VIEW);
  const review = can(P.VEHICLES_REVIEW);
  return {
    users: can(P.USERS_VIEW),
    vehicles: review,
    pendingVehicles: review,
    gates: can(P.GATES_VIEW),
    logsToday: logs,
    deniedToday: logs,
    latestLogs: logs,
    latestDenied: logs,
    myVehicles: owner && can(P.VEHICLES_VIEW),
    myLogs: owner && can(P.ACCESS_LOGS_VIEW_OWN),
  };
};
