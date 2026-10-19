import {
  canDisableOrDeleteUser,
  canManageUser,
  getAssignableRoles,
  hasAnyPermission,
  hasPermission,
  PERMISSIONS as P,
  ROLE_PERMISSIONS,
} from './permissions';
import { ALL_ROLES, ROLES } from './roles';

describe('hasPermission', () => {
  it('limits OWNER to vehicles, own logs, dashboard and profile', () => {
    expect(hasPermission(ROLES.OWNER, P.VEHICLES_VIEW)).toBe(true);
    expect(hasPermission(ROLES.OWNER, P.VEHICLES_CREATE)).toBe(true);
    expect(hasPermission(ROLES.OWNER, P.ACCESS_LOGS_VIEW_OWN)).toBe(true);
    expect(hasPermission(ROLES.OWNER, P.ACCESS_LOGS_VIEW)).toBe(false);
    expect(hasPermission(ROLES.OWNER, P.USERS_VIEW)).toBe(false);
    expect(hasPermission(ROLES.OWNER, P.GATES_VIEW)).toBe(false);
    expect(hasPermission(ROLES.OWNER, P.VEHICLES_REVIEW)).toBe(false);
  });

  it('gives SUPERVISOR full logs and read-only gates but no vehicles or users', () => {
    expect(hasPermission(ROLES.SUPERVISOR, P.ACCESS_LOGS_VIEW)).toBe(true);
    expect(hasPermission(ROLES.SUPERVISOR, P.ACCESS_LOGS_CREATE)).toBe(true);
    expect(hasPermission(ROLES.SUPERVISOR, P.GATES_VIEW)).toBe(true);
    expect(hasPermission(ROLES.SUPERVISOR, P.GATES_MANAGE)).toBe(false);
    expect(hasPermission(ROLES.SUPERVISOR, P.VEHICLES_VIEW)).toBe(false);
    expect(hasPermission(ROLES.SUPERVISOR, P.USERS_VIEW)).toBe(false);
  });

  it('gives ROLLER users, vehicle review and delete, but not vehicle edit, gate CRUD or audit logs', () => {
    expect(hasPermission(ROLES.ROLLER, P.USERS_MANAGE)).toBe(true);
    expect(hasPermission(ROLES.ROLLER, P.VEHICLES_CREATE_EMPLOYEE)).toBe(true);
    expect(hasPermission(ROLES.ROLLER, P.VEHICLES_REVIEW)).toBe(true);
    expect(hasPermission(ROLES.ROLLER, P.VEHICLES_DELETE)).toBe(true);
    expect(hasPermission(ROLES.ROLLER, P.VEHICLES_UPDATE)).toBe(false);
    expect(hasPermission(ROLES.ROLLER, P.GATES_MANAGE)).toBe(false);
    expect(hasPermission(ROLES.ROLLER, P.AUDIT_LOGS_VIEW)).toBe(false);
  });

  it('gives SUB_ADMIN and ADMIN vehicle edit, gate CRUD and audit logs', () => {
    [ROLES.SUB_ADMIN, ROLES.ADMIN].forEach(role => {
      expect(hasPermission(role, P.VEHICLES_UPDATE)).toBe(true);
      expect(hasPermission(role, P.GATES_MANAGE)).toBe(true);
      expect(hasPermission(role, P.AUDIT_LOGS_VIEW)).toBe(true);
    });
  });

  it('denies everything for a missing or unknown role', () => {
    expect(hasPermission(null, P.DASHBOARD_VIEW)).toBe(false);
    expect(hasPermission(undefined, P.DASHBOARD_VIEW)).toBe(false);
    expect(hasPermission('GUEST', P.DASHBOARD_VIEW)).toBe(false);
  });

  it('only references permissions that exist', () => {
    const known = new Set(Object.values(P));
    ALL_ROLES.forEach(role => {
      ROLE_PERMISSIONS[role].forEach(permission => expect(known.has(permission)).toBe(true));
    });
  });
});

describe('hasAnyPermission', () => {
  it('is true when at least one permission matches', () => {
    expect(hasAnyPermission(ROLES.OWNER, [P.ACCESS_LOGS_VIEW, P.ACCESS_LOGS_VIEW_OWN])).toBe(true);
    expect(hasAnyPermission(ROLES.OWNER, [P.USERS_VIEW, P.GATES_VIEW])).toBe(false);
    expect(hasAnyPermission(ROLES.ADMIN, [])).toBe(false);
  });
});

describe('getAssignableRoles', () => {
  it('mirrors the backend restrictions', () => {
    expect(getAssignableRoles(ROLES.ROLLER)).toEqual([ROLES.OWNER, ROLES.SUPERVISOR]);
    expect(getAssignableRoles(ROLES.SUB_ADMIN)).toEqual([ROLES.OWNER, ROLES.SUPERVISOR, ROLES.ROLLER]);
    expect(getAssignableRoles(ROLES.ADMIN)).toEqual(ALL_ROLES);
    expect(getAssignableRoles(ROLES.OWNER)).toEqual([]);
    expect(getAssignableRoles(ROLES.SUPERVISOR)).toEqual([]);
  });
});

describe('canManageUser', () => {
  it('lets ROLLER manage only owners and supervisors', () => {
    expect(canManageUser(ROLES.ROLLER, ROLES.OWNER)).toBe(true);
    expect(canManageUser(ROLES.ROLLER, ROLES.SUPERVISOR)).toBe(true);
    expect(canManageUser(ROLES.ROLLER, ROLES.ROLLER)).toBe(false);
    expect(canManageUser(ROLES.ROLLER, ROLES.ADMIN)).toBe(false);
  });

  it('keeps SUB_ADMIN away from ADMIN and SUB_ADMIN accounts', () => {
    expect(canManageUser(ROLES.SUB_ADMIN, ROLES.ROLLER)).toBe(true);
    expect(canManageUser(ROLES.SUB_ADMIN, ROLES.SUB_ADMIN)).toBe(false);
    expect(canManageUser(ROLES.SUB_ADMIN, ROLES.ADMIN)).toBe(false);
  });

  it('lets ADMIN manage everyone and others nobody', () => {
    ALL_ROLES.forEach(target => expect(canManageUser(ROLES.ADMIN, target)).toBe(true));
    expect(canManageUser(ROLES.OWNER, ROLES.OWNER)).toBe(false);
    expect(canManageUser(ROLES.SUPERVISOR, ROLES.OWNER)).toBe(false);
  });
});

describe('canDisableOrDeleteUser', () => {
  it('never allows disabling or deleting an ADMIN, even for an ADMIN', () => {
    ALL_ROLES.forEach(actor => expect(canDisableOrDeleteUser(actor, ROLES.ADMIN)).toBe(false));
  });

  it('otherwise follows canManageUser', () => {
    expect(canDisableOrDeleteUser(ROLES.ROLLER, ROLES.OWNER)).toBe(true);
    expect(canDisableOrDeleteUser(ROLES.ADMIN, ROLES.SUB_ADMIN)).toBe(true);
    expect(canDisableOrDeleteUser(ROLES.SUB_ADMIN, ROLES.SUB_ADMIN)).toBe(false);
  });
});
