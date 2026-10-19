import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

/** Announces itself to screen readers; pass `label` to override the default text. */
export function Spinner({ className, label }) {
  const { t } = useTranslation();
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2 aria-hidden="true" className={cn('size-4 animate-spin', className)} />
      <span className="sr-only">{label ?? t('common.loading')}</span>
    </span>
  );
}
