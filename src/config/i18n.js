import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import { storage, STORAGE_KEYS } from '@/utils/storage';

export const DEFAULT_LANGUAGE = 'en';

export const LANGUAGES = Object.freeze({
  en: { label: 'English', dir: 'ltr' },
  ar: { label: 'العربية', dir: 'rtl' },
});

const getInitialLanguage = () => {
  const stored = storage.get(STORAGE_KEYS.LANG);
  return typeof stored === 'string' && Object.hasOwn(LANGUAGES, stored) ? stored : DEFAULT_LANGUAGE;
};

/** Keeps <html lang dir> in sync so logical CSS properties flip correctly. */
export const applyDocumentLanguage = lng => {
  const root = document.documentElement;
  root.lang = lng;
  root.dir = LANGUAGES[lng]?.dir ?? 'ltr';
};

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  returnNull: false,
});

applyDocumentLanguage(i18n.language);

i18n.on('languageChanged', lng => {
  applyDocumentLanguage(lng);
  storage.set(STORAGE_KEYS.LANG, lng);
});

export default i18n;
