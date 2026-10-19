import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { CENTERED_PANEL_CLASS, OVERLAY_CLASS } from './dialogStyles';

/**
 * Confirmation for destructive actions. The parent keeps `open` true while `loading`
 * and closes it once the async action settles.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  tone = 'danger',
  loading = false,
  onConfirm,
}) {
  const { t } = useTranslation();
  return (
    <AlertDialog.Root open={open} onOpenChange={next => (loading ? undefined : onOpenChange(next))}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={OVERLAY_CLASS} />
        <AlertDialog.Content className={cn(CENTERED_PANEL_CLASS, 'max-w-md p-5')}>
          <div className="flex gap-4">
            <span
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                tone === 'danger' ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary-ink',
              )}
            >
              <TriangleAlert aria-hidden="true" className="size-5" />
            </span>
            <div className="min-w-0">
              <AlertDialog.Title className="text-base font-semibold text-ink">{title}</AlertDialog.Title>
              <AlertDialog.Description className="mt-1 text-sm text-muted">
                {description}
              </AlertDialog.Description>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" disabled={loading}>
                {t('common.cancel')}
              </Button>
            </AlertDialog.Cancel>
            <Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
              {confirmLabel ?? t('common.confirm')}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
