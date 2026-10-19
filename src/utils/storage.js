const PREFIX = 'cm:';

/** Keys for non-sensitive UI preferences only. Never store auth tokens here. */
export const STORAGE_KEYS = Object.freeze({
  THEME: 'theme',
  LANG: 'lang',
  SIDEBAR: 'sidebar',
});

/** localStorage wrapper that never throws (private mode, quota, disabled storage). */
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* ignore: preference simply will not persist */
    }
  },
  remove(key) {
    try {
      window.localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
};
