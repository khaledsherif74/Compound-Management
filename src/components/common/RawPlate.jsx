import { useTranslation } from 'react-i18next';
import { splitPlateText } from '@/utils/plate';
import { PlateBadge } from './PlateBadge';

/** Plate from free text (camera reading or manual entry). Falls back to plain text if unparseable. */
export function RawPlate({ value, size = 'sm' }) {
  const { t } = useTranslation();
  const { letters, numbers } = splitPlateText(value);
  if (!letters && !numbers) {
    return (
      <span className="font-mono text-sm" dir="auto">
        {value || t('common.none')}
      </span>
    );
  }
  return <PlateBadge size={size} plateLetters={letters} plateNumbers={numbers} />;
}
