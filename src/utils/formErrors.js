/**
 * Resolves a react-hook-form error to display text. Handles three message shapes:
 * a plain i18n key, a JSON `{key, ...params}` from validations/messages.js,
 * and a JSON `{raw}` created by serverMessage() for backend text.
 */
export const fieldError = (t, error) => {
  const message = error?.message;
  if (!message) return undefined;
  if (!message.startsWith('{')) return t(message);
  try {
    const { key, raw, ...params } = JSON.parse(message);
    return raw ?? t(key, params);
  } catch {
    return message;
  }
};

/** Wraps backend text so fieldError() shows it verbatim (no i18n key lookup). */
export const serverMessage = raw => JSON.stringify({ raw });
