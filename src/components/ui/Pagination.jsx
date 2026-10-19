import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { Select } from './Select';

const LIMIT_OPTIONS = [10, 20, 50, 100].map(value => ({ value, label: String(value) }));

/** Server-side pagination footer. Chevrons mirror automatically in RTL. */
export function Pagination({ page, limit, total, totalPages, onPageChange, onLimitChange, disabled = false }) {
  const { t } = useTranslation();
  if (!total) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav
      aria-label={t('pagination.rowsPerPage')}
      className="flex flex-wrap items-center justify-between gap-3 pt-3 text-sm text-muted"
    >
      <p>{t('pagination.summary', { from, to, total })}</p>
      <div className="flex items-center gap-3">
        {onLimitChange ? (
          <Select
            aria-label={t('pagination.rowsPerPage')}
            value={limit}
            disabled={disabled}
            options={LIMIT_OPTIONS}
            onChange={event => onLimitChange(Number(event.target.value))}
            className="w-20"
            selectClassName="h-8"
          />
        ) : null}
        <span aria-live="polite">{t('pagination.page', { page, totalPages })}</span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t('pagination.previous')}
            disabled={disabled || page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t('pagination.next')}
            disabled={disabled || page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
