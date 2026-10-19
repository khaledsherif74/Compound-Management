import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/common/CopyButton';
import { DateTime } from '@/components/common/DateTime';
import { JsonViewer } from '@/components/common/JsonViewer';
import { RoleBadge } from '@/components/common/RoleBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Badge, Button, Table, TableSkeleton, TBody, Td, Th, THead, Tooltip, Tr } from '@/components/ui';
import { auditActionTone } from '@/utils/auditActions';
import { cn } from '@/utils/cn';

const COLUMNS = ['time', 'actor', 'action', 'entity', 'ip', 'agent'];

const hasDetails = details =>
  details !== null && details !== undefined && !(typeof details === 'object' && Object.keys(details).length === 0);

function Actor({ log, onFilterUser }) {
  const { t } = useTranslation();
  const { user } = log;
  if (!user) return <span className="text-muted">{t('audit.system')}</span>;
  return (
    <div className="flex items-center gap-2.5">
      <UserAvatar user={user} size="sm" />
      <div className="min-w-0">
        <Tooltip content={t('audit.details.filterByUser')}>
          <button type="button" onClick={() => onFilterUser(user.id)} className="block max-w-40 truncate rounded text-start font-medium hover:underline">
            {user.firstName} {user.lastName}
          </button>
        </Tooltip>
        <RoleBadge role={user.role} />
      </div>
    </div>
  );
}

function AuditRow({ log, expanded, onToggle, onFilterUser }) {
  const { t } = useTranslation();
  const detailsId = `audit-details-${log.id}`;

  return (
    <Fragment>
      <Tr className={cn(expanded && 'bg-subtle/70')}>
        <Td className="w-10 pe-0">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-expanded={expanded}
            aria-controls={detailsId}
            aria-label={expanded ? t('audit.collapse') : t('audit.expand')}
            onClick={() => onToggle(log.id)}
          >
            <ChevronRight aria-hidden="true" className={cn('size-4 transition-transform rtl:-scale-x-100', expanded && 'rotate-90 rtl:rotate-90')} />
          </Button>
        </Td>
        <Td className="whitespace-nowrap">
          <DateTime value={log.createdAt} withSeconds />
        </Td>
        <Td>
          <Actor log={log} onFilterUser={onFilterUser} />
        </Td>
        <Td>
          <Badge tone={auditActionTone(log.action)}>{t(`audit.actions.${log.action}`, { defaultValue: log.action })}</Badge>
        </Td>
        <Td>{log.entity ? t(`audit.entities.${log.entity}`, { defaultValue: log.entity }) : t('common.none')}</Td>
        <Td className="font-mono text-xs" dir="ltr">
          {log.ip || t('common.none')}
        </Td>
        <Td className="max-w-48 truncate text-xs text-muted" title={log.userAgent ?? undefined} dir="ltr">
          {log.userAgent || t('common.none')}
        </Td>
      </Tr>
      {expanded ? (
        <tr id={detailsId} className="bg-subtle/40">
          <td colSpan={COLUMNS.length + 1} className="px-4 py-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <section>
                <h3 className="mb-2 text-sm font-medium text-ink">{t('audit.details.title')}</h3>
                {hasDetails(log.details) ? <JsonViewer data={log.details} /> : <p className="text-sm text-muted">{t('audit.details.none')}</p>}
              </section>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted">{t('audit.details.entityId')}</dt>
                  <dd className="flex items-center gap-1 break-all font-mono text-xs" dir="ltr">
                    {log.entityId || t('common.none')}
                    {log.entityId ? <CopyButton value={log.entityId} label={t('audit.details.entityId')} /> : null}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">{t('audit.details.userAgent')}</dt>
                  <dd className="break-all text-xs" dir="ltr">
                    {log.userAgent || t('common.none')}
                  </dd>
                </div>
              </dl>
            </div>
          </td>
        </tr>
      ) : null}
    </Fragment>
  );
}

export function AuditLogsTable({ logs, loading, expandedIds, onToggle, onFilterUser }) {
  const { t } = useTranslation();
  const showSkeleton = loading && logs.length === 0;

  return (
    <Table aria-busy={loading} className={loading && !showSkeleton ? 'opacity-70 transition-opacity' : undefined}>
      <THead>
        <tr>
          <Th className="w-10">
            <span className="sr-only">{t('audit.expand')}</span>
          </Th>
          {COLUMNS.map(column => (
            <Th key={column}>{t(`audit.columns.${column}`)}</Th>
          ))}
        </tr>
      </THead>
      <TBody>
        {showSkeleton ? (
          <TableSkeleton rows={8} columns={COLUMNS.length + 1} />
        ) : (
          logs.map(log => (
            <AuditRow key={log.id} log={log} expanded={expandedIds.has(log.id)} onToggle={onToggle} onFilterUser={onFilterUser} />
          ))
        )}
      </TBody>
    </Table>
  );
}
