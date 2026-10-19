/**
 * POST /access-logs body. `vehicleId`, `gate` and `color` are intentionally not sent:
 * the backend writes the body straight into the AccessLog model, which has no `gate` or `color`
 * column, and supervisors cannot list vehicles to pick one.
 */
export const buildCreateLogPayload = values => {
  const payload = {
    plateNumber: values.plateNumber.trim(),
    action: values.action,
    direction: values.direction,
  };
  const reason = values.reason.trim();
  const imagePath = values.imagePath.trim();
  if (reason) payload.reason = reason;
  if (imagePath) payload.imagePath = imagePath;
  return payload;
};
