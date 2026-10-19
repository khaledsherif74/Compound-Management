import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/formatDate';

export function DateTime({ value, withTime = true, withSeconds = false, className }) {
  const { t, i18n } = useTranslation();
  const text = formatDate(value, i18n.language, withTime, withSeconds);
  if (!text) return <span className={className}>{t('common.none')}</span>;
  return (
    <time dateTime={String(value)} className={className}>
      {text}
    </time>
  );
}
