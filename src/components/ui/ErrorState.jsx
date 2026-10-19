import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { Button } from './Button';

/** Shows the backend message when available. `onRetry` renders the retry button. */
export function ErrorState({ title, message, onRetry, className }) {
  const { t } = useTranslation();
  return (
    <div role="alert" className={cn('flex flex-col items-center px-6 py-14 text-center', className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
        <TriangleAlert aria-hidden="true" className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-ink">{title ?? t('states.errorTitle')}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{message ?? t('states.errorDescription')}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      ) : null}
    </div>
  );
}
