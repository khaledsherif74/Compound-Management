/** Mirrors backend src/constants/roles.js. */
export const ROLES = Object.freeze({
  OWNER: 'OWNER',
  SUPERVISOR: 'SUPERVISOR',
  ROLLER: 'ROLLER',
  SUB_ADMIN: 'SUB_ADMIN',
  ADMIN: 'ADMIN',
});

export const ALL_ROLES = Object.freeze(Object.values(ROLES));
