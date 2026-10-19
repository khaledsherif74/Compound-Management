/**
 * Finds which form field a backend message is about, so it can be shown inline.
 * Joi messages quote the field ("phone" length must be...); others are matched by hint.
 * @param {string} message
 * @param {string[]} fields known field names
 * @param {Record<string, RegExp>} [hints] field -> pattern for unquoted messages
 * @returns {string | null}
 */
export const findFieldForMessage = (message, fields, hints = {}) => {
  const quoted = /"([A-Za-z]+)"/.exec(message ?? '');
  if (quoted && fields.includes(quoted[1])) return quoted[1];
  const hit = Object.entries(hints).find(([field, pattern]) => fields.includes(field) && pattern.test(message));
  return hit ? hit[0] : null;
};
