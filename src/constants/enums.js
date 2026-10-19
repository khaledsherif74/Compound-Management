/** Mirrors backend Prisma enums and constants. */
export const VEHICLE_TYPES = Object.freeze({ OWNER: 'OWNER', EMPLOYEE: 'EMPLOYEE' });
export const VEHICLE_STATUS = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
});
export const LOG_ACTIONS = Object.freeze({ ENTRY: 'ENTRY', EXIT: 'EXIT', DENIED: 'DENIED' });
export const LOG_DIRECTIONS = Object.freeze({ GATE_IN: 'GATE_IN', GATE_OUT: 'GATE_OUT' });
export const GATE_DIRECTIONS = Object.freeze({ IN: 'In', OUT: 'Out' });
/** Canonical display order for a gate's directions. */
export const GATE_DIRECTION_LIST = Object.freeze([GATE_DIRECTIONS.IN, GATE_DIRECTIONS.OUT]);

/** Owner vehicle limit when `maxVehicles` is null. */
export const DEFAULT_MAX_VEHICLES = 2;

/** Request lifecycle shared by every slice. */
export const REQUEST_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

export const DEFAULT_PAGE_SIZE = 20;

/** Actions written by the backend audit service (used for the filter and labels). */
export const AUDIT_ACTIONS = Object.freeze([
  'LOGIN', 'LOGIN_FAILED', 'LOGOUT',
  'USER_CREATE', 'USER_UPDATE', 'USER_ENABLE', 'USER_DISABLE', 'USER_DELETE',
  'PASSWORD_RECOVERY_EMAIL_SENT', 'PASSWORD_RECOVERY_EMAIL_FAILED', 'PASSWORD_RESET',
  'VEHICLE_CREATE', 'VEHICLE_UPDATE', 'VEHICLE_STATUS_CHANGE', 'VEHICLE_DELETE',
  'GATE_CREATE', 'GATE_UPDATE', 'GATE_CHANGE_STATUS', 'GATE_DELETE',
]);
export const AUDIT_ENTITIES = Object.freeze(['User', 'Vehicle', 'Gate']);
