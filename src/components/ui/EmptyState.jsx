import { Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  const { t } = useTranslation();
  return (
    <div className={cn('flex flex-col items-center px-6 py-14 text-center', className)}>
      <span className="flex size-12 items-center justify-center rounded-full bg-subtle text-muted">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold text-ink">{title ?? t('states.emptyTitle')}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description ?? t('states.emptyDescription')}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
