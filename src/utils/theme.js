import { storage, STORAGE_KEYS } from './storage';

export const THEME_PREFERENCES = Object.freeze(['light', 'dark', 'system']);

const DARK_QUERY = '(prefers-color-scheme: dark)';

export const getSystemTheme = () => (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light');

/** Maps a preference (light | dark | system) to the theme actually shown. */
export const resolveTheme = preference =>
  preference === 'system' ? getSystemTheme() : preference;

export const getStoredThemePreference = () => {
  const stored = storage.get(STORAGE_KEYS.THEME, 'system');
  return THEME_PREFERENCES.includes(stored) ? stored : 'system';
};

/** Applies the theme to <html>, persists the preference, returns the resolved theme. */
export const applyTheme = preference => {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
  storage.set(STORAGE_KEYS.THEME, preference);
  return resolved;
};

/** Calls onChange when the OS theme changes. Returns an unsubscribe function. */
export const subscribeToSystemTheme = onChange => {
  const media = window.matchMedia(DARK_QUERY);
  const handler = () => onChange(getSystemTheme());
  media.addEventListener('change', handler);
  return () => media.removeEventListener('change', handler);
};
