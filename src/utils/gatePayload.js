import { GATE_DIRECTION_LIST } from '@/constants/enums';

/** Keeps the canonical In, Out order and drops duplicates. */
const normalizeDirections = directions => GATE_DIRECTION_LIST.filter(item => directions.includes(item));

/** POST /gates body. */
export const buildCreateGatePayload = values => ({
  gateName: values.gateName.trim(),
  gateCode: values.gateCode.trim(),
  direction: normalizeDirections(values.direction),
});

/** PATCH /gates/:id body with only the changed fields (backend requires at least one key). */
export const buildUpdateGatePayload = (values, original) => {
  const payload = {};
  ['gateName', 'gateCode'].forEach(key => {
    const next = values[key].trim();
    if (next !== original[key]) payload[key] = next;
  });
  const direction = normalizeDirections(values.direction);
  if (direction.join() !== normalizeDirections(original.direction).join()) payload.direction = direction;
  return payload;
};
