import { ROLES } from './roles';

/** Single source of truth for what each role may see and do. Backend stays authoritative. */
export const PERMISSIONS = Object.freeze({
  DASHBOARD_VIEW: 'dashboard:view',
  PROFILE_VIEW: 'profile:view',
  USERS_VIEW: 'users:view',
  USERS_MANAGE: 'users:manage',
  VEHICLES_VIEW: 'vehicles:view',
  VEHICLES_CREATE: 'vehicles:create',
  VEHICLES_CREATE_EMPLOYEE: 'vehicles:create-employee',
  VEHICLES_UPDATE: 'vehicles:update',
  VEHICLES_REVIEW: 'vehicles:review',
  VEHICLES_DELETE: 'vehicles:delete',
  GATES_VIEW: 'gates:view',
  GATES_MANAGE: 'gates:manage',
  ACCESS_LOGS_VIEW: 'access-logs:view',
  ACCESS_LOGS_VIEW_OWN: 'access-logs:view-own',
  ACCESS_LOGS_CREATE: 'access-logs:create',
  AUDIT_LOGS_VIEW: 'audit-logs:view',
});

const P = PERMISSIONS;
const COMMON = [P.DASHBOARD_VIEW, P.PROFILE_VIEW];

const OWNER = [...COMMON, P.VEHICLES_VIEW, P.VEHICLES_CREATE, P.ACCESS_LOGS_VIEW_OWN];
const SUPERVISOR = [...COMMON, P.ACCESS_LOGS_VIEW, P.ACCESS_LOGS_CREATE, P.GATES_VIEW];
const ROLLER = [
  ...SUPERVISOR,
  P.USERS_VIEW,
  P.USERS_MANAGE,
  P.VEHICLES_VIEW,
  P.VEHICLES_CREATE,
  P.VEHICLES_CREATE_EMPLOYEE,
  P.VEHICLES_REVIEW,
  P.VEHICLES_DELETE,
];
const SUB_ADMIN = [...ROLLER, P.VEHICLES_UPDATE, P.GATES_MANAGE, P.AUDIT_LOGS_VIEW];
const ADMIN = [...SUB_ADMIN];

export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.OWNER]: new Set(OWNER),
  [ROLES.SUPERVISOR]: new Set(SUPERVISOR),
  [ROLES.ROLLER]: new Set(ROLLER),
  [ROLES.SUB_ADMIN]: new Set(SUB_ADMIN),
  [ROLES.ADMIN]: new Set(ADMIN),
});

export const hasPermission = (role, permission) =>
  Boolean(role && ROLE_PERMISSIONS[role]?.has(permission));

/** True when the role holds at least one of the given permissions. */
export const hasAnyPermission = (role, permissions) =>
  permissions.some(permission => hasPermission(role, permission));

const ASSIGNABLE_ROLES = {
  [ROLES.ROLLER]: [ROLES.OWNER, ROLES.SUPERVISOR],
  [ROLES.SUB_ADMIN]: [ROLES.OWNER, ROLES.SUPERVISOR, ROLES.ROLLER],
  [ROLES.ADMIN]: Object.values(ROLES),
};

/** Roles the actor may pick in the user form (mirrors restrict.middleware.js). */
export const getAssignableRoles = actorRole => ASSIGNABLE_ROLES[actorRole] ?? [];

/** Whether the actor may edit or manage an existing account with `targetRole`. */
export const canManageUser = (actorRole, targetRole) => {
  if (actorRole === ROLES.ADMIN) return true;
  if (actorRole === ROLES.SUB_ADMIN) return ![ROLES.ADMIN, ROLES.SUB_ADMIN].includes(targetRole);
  if (actorRole === ROLES.ROLLER) return [ROLES.OWNER, ROLES.SUPERVISOR].includes(targetRole);
  return false;
};

/** Admin accounts can never be disabled or deleted, regardless of who asks. */
export const canDisableOrDeleteUser = (actorRole, targetRole) =>
  targetRole !== ROLES.ADMIN && canManageUser(actorRole, targetRole);
