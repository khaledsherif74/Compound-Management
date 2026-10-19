import { format, isValid, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const LOCALES = { ar, en: enUS };

/** Formats an ISO string or Date in the active language. Returns '' for invalid input. */
export const formatDate = (value, language = 'en', withTime = true, withSeconds = false) => {
  const date = value instanceof Date ? value : parseISO(String(value ?? ''));
  if (!isValid(date)) return '';
  return format(date, withTime ? (withSeconds ? 'dd MMM yyyy, HH:mm:ss' : 'dd MMM yyyy, HH:mm') : 'dd MMM yyyy', {
    locale: LOCALES[language] ?? enUS,
  });
};
