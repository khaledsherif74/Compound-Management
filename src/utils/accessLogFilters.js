import { format } from 'date-fns';
import { LOG_ACTIONS, LOG_DIRECTIONS } from '@/constants/enums';
import { isoDate, oneOf, uuid } from './filterParsing';

/** Validates URL query values so a hand-edited URL can never cause a backend 400. */
export const parseLogFilters = raw => ({
  action: oneOf(raw.action, LOG_ACTIONS),
  direction: oneOf(raw.direction, LOG_DIRECTIONS),
  gateId: uuid(raw.gateId),
  vehicleId: uuid(raw.vehicleId),
  from: isoDate(raw.from),
  to: isoDate(raw.to),
});

/** ISO string -> value for <input type="datetime-local"> in local time. */
export const toLocalInputValue = iso => (iso ? format(new Date(iso), "yyyy-MM-dd'T'HH:mm") : '');

/**
 * datetime-local value -> ISO string ('' when empty or invalid).
 * `endOfMinute` makes an upper bound inclusive of the whole minute picked.
 */
export const fromLocalInputValue = (value, endOfMinute = false) => {
  const time = Date.parse(value);
  if (Number.isNaN(time)) return '';
  return new Date(endOfMinute ? time + 59999 : time).toISOString();
};

/** ISO strings compare correctly as text. */
export const isRangeInvalid = ({ from, to }) => Boolean(from && to && from > to);
