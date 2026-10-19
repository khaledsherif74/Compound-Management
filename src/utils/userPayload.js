import { ROLES } from '@/constants/roles';

/** Empty string -> null (backend default), otherwise an integer. */
const parseMaxVehicles = value => (value.trim() === '' ? null : Number(value));

/** POST /users body. Owners never send a password; non-owners never send unitCode. */
export const buildCreatePayload = values => {
  const payload = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    username: values.username.trim(),
    phone: values.phone.trim(),
    role: values.role,
  };
  const email = values.email.trim();
  if (email) payload.email = email;

  if (values.role === ROLES.OWNER) {
    payload.unitCode = values.unitCode.trim();
    const maxVehicles = parseMaxVehicles(values.maxVehicles);
    if (maxVehicles !== null) payload.maxVehicles = maxVehicles;
  } else {
    payload.password = values.password;
  }
  return payload;
};

/** PATCH /users/:id body containing only what changed (backend requires at least one key). */
export const buildUpdatePayload = (values, original) => {
  const payload = {};
  ['firstName', 'lastName', 'username', 'phone'].forEach(key => {
    const next = values[key].trim();
    if (next !== original[key]) payload[key] = next;
  });

  const email = values.email.trim();
  if (email !== (original.email ?? '')) payload.email = email || null;
  if (values.role !== original.role) payload.role = values.role;

  if (values.role === ROLES.OWNER) {
    const maxVehicles = parseMaxVehicles(values.maxVehicles);
    if (maxVehicles !== (original.maxVehicles ?? null)) payload.maxVehicles = maxVehicles;
  } else if (values.password) {
    payload.password = values.password;
  }
  return payload;
};
