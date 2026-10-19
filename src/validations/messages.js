/**
 * Zod messages are i18n keys. Pass params for interpolation; fieldError() resolves both.
 * @param {string} key
 * @param {Record<string, string|number>} [params]
 */
export const msg = (key, params) => (params ? JSON.stringify({ key, ...params }) : key);
