import { VEHICLE_TYPES } from '@/constants/enums';

const optional = value => {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

/**
 * POST /vehicles body.
 * Employee: employee fields, never ownerId. Owner vehicle: staff must send ownerId,
 * an owner account sends none (the backend uses the signed-in user).
 */
export const buildCreateVehiclePayload = (values, { isOwnerUser }) => {
  const payload = {
    vehicleType: values.vehicleType,
    plateLetters: values.plateLetters.trim(),
    plateNumbers: values.plateNumbers.trim(),
  };
  ['brand', 'color', 'licenseImage'].forEach(key => {
    const value = optional(values[key]);
    if (value !== undefined) payload[key] = value;
  });

  if (values.vehicleType === VEHICLE_TYPES.EMPLOYEE) {
    payload.employeeName = values.employeeName.trim();
    payload.employeePhone = values.employeePhone.trim();
    payload.employeeType = values.employeeType.trim();
  } else if (!isOwnerUser) {
    payload.ownerId = values.ownerId;
  }
  return payload;
};

/** PATCH /vehicles/:id body with only the changed fields. Cleared optional fields become null. */
export const buildUpdateVehiclePayload = (values, original) => {
  const payload = {};
  ['plateLetters', 'plateNumbers'].forEach(key => {
    const next = values[key].trim();
    if (next !== original[key]) payload[key] = next;
  });
  ['brand', 'color', 'licenseImage'].forEach(key => {
    const next = values[key].trim();
    if (next !== (original[key] ?? '')) payload[key] = next || null;
  });
  if (original.vehicleType === VEHICLE_TYPES.EMPLOYEE) {
    ['employeeName', 'employeePhone', 'employeeType'].forEach(key => {
      const next = values[key].trim();
      if (next !== (original[key] ?? '')) payload[key] = next;
    });
  }
  return payload;
};
