import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';

/** Row of filter controls with a reset button that appears when any filter is active. */
export function FilterBar({ children, canReset = false, onReset }) {
  const { t } = useTranslation();
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-line bg-surface p-3">
      {children}
      {canReset ? (
        <Button variant="ghost" onClick={onReset}>
          <X aria-hidden="true" className="size-4" />
          {t('common.clearFilters')}
        </Button>
      ) : null}
    </div>
  );
}
