import { DoorOpen, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/common/CopyButton';
import { DateTime } from '@/components/common/DateTime';
import { DirectionChips } from '@/components/common/DirectionChips';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button, Dropdown, Skeleton, Switch } from '@/components/ui';
import { cn } from '@/utils/cn';

export function GateCardSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-4 rounded-lg border border-line bg-surface p-5">
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-24" />
    </div>
  );
}

/** One gate. Controls appear only when `canManage`; otherwise the card is read-only. */
export function GateCard({ gate, canManage, toggling, onEdit, onToggle, onDelete }) {
  const { t } = useTranslation();

  const items = [
    { key: 'edit', label: t('gates.actions.edit'), icon: Pencil, onSelect: () => onEdit(gate) },
    { key: 'sep', separator: true },
    { key: 'delete', label: t('gates.actions.delete'), icon: Trash2, tone: 'danger', onSelect: () => onDelete(gate) },
  ];

  return (
    <article className={cn('flex flex-col gap-4 rounded-lg border border-line bg-surface p-5 shadow-sm', !gate.isActive && 'bg-subtle/60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-ink">
            <DoorOpen aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-ink">{gate.gateName}</h2>
            <p className="flex items-center gap-1 font-mono text-xs text-muted" dir="ltr">
              {gate.gateCode}
              <CopyButton value={gate.gateCode} label={gate.gateName} />
            </p>
          </div>
        </div>
        {canManage ? (
          <Dropdown
            items={items}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label={t('gates.actions.rowMenu', { name: gate.gateName })}>
                <MoreHorizontal aria-hidden="true" className="size-4" />
              </Button>
            }
          />
        ) : null}
      </div>

      <DirectionChips directions={gate.direction} />

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
        {canManage ? (
          <div className="flex items-center gap-2.5">
            <Switch
              checked={gate.isActive}
              disabled={toggling}
              aria-label={t('gates.actions.toggle', { name: gate.gateName })}
              onCheckedChange={() => onToggle(gate)}
            />
            <StatusBadge kind="active" value={gate.isActive} />
          </div>
        ) : (
          <StatusBadge kind="active" value={gate.isActive} />
        )}
        <DateTime value={gate.createdAt} withTime={false} className="text-xs text-muted" />
      </div>
    </article>
  );
}
