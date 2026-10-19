import { AUDIT_ACTIONS, AUDIT_ENTITIES } from '@/constants/enums';
import { isoDate, oneOf, uuid } from './filterParsing';

/** Validates URL query values so a hand-edited URL can never cause a backend 400. */
export const parseAuditFilters = raw => ({
  action: oneOf(raw.action, AUDIT_ACTIONS),
  entity: oneOf(raw.entity, AUDIT_ENTITIES),
  userId: uuid(raw.userId),
  from: isoDate(raw.from),
  to: isoDate(raw.to),
});
