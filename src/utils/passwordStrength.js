/**
 * Rough strength score from 0 (empty) to 4 (strong). Only a UX hint:
 * the backend rule is simply "at least 8 characters".
 */
export const getPasswordStrength = (password = '') => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;
  // Anything typed counts as at least weak; below the backend minimum it never exceeds that.
  return password.length < 8 ? 1 : Math.max(score, 1);
};
