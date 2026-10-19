import { createSlice } from '@reduxjs/toolkit';
import i18n from '@/config/i18n';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import { applyTheme, getStoredThemePreference } from '@/utils/theme';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: getStoredThemePreference(),
    language: i18n.language,
    sidebarCollapsed: Boolean(storage.get(STORAGE_KEYS.SIDEBAR, false)),
    mobileNavOpen: false,
  },
  reducers: {
    themeChanged(state, action) {
      state.theme = action.payload;
    },
    languageChanged(state, action) {
      state.language = action.payload;
    },
    sidebarCollapsedChanged(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    setMobileNavOpen(state, action) {
      state.mobileNavOpen = action.payload;
    },
  },
});

export const { themeChanged, languageChanged, sidebarCollapsedChanged, setMobileNavOpen } = uiSlice.actions;

/* Side effects (DOM, storage, i18n) live in thunks so reducers stay pure. */
export const setTheme = preference => dispatch => {
  applyTheme(preference);
  dispatch(themeChanged(preference));
};

export const setLanguage = language => dispatch => {
  i18n.changeLanguage(language);
  dispatch(languageChanged(language));
};

export const toggleSidebar = () => (dispatch, getState) => {
  const next = !getState().ui.sidebarCollapsed;
  storage.set(STORAGE_KEYS.SIDEBAR, next);
  dispatch(sidebarCollapsedChanged(next));
};

export default uiSlice.reducer;
