const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns `value` when it is one of `allowed` (array or enum object), otherwise ''. */
export const oneOf = (value, allowed) =>
  (Array.isArray(allowed) ? allowed : Object.values(allowed)).includes(value) ? value : '';

export const uuid = value => (UUID.test(value ?? '') ? value : '');

/** Valid date string -> ISO string, otherwise ''. */
export const isoDate = value => {
  const time = Date.parse(value ?? '');
  return Number.isNaN(time) ? '' : new Date(time).toISOString();
};
