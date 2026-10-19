import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState, ErrorState, Pagination } from '@/components/ui';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { useQueryParams } from '@/hooks/useQueryParams';
import { fetchAuditLogs } from '@/store/auditLogs.slice';
import { selectAuditLogsState } from '@/store/selectors';
import { parseAuditFilters } from '@/utils/auditFilters';
import { cleanParams, clampPagination } from '@/utils/query';
import { AuditFilters } from './AuditFilters';
import { AuditLogsTable } from './AuditLogsTable';

export default function AuditLogsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [params, updateParams] = useQueryParams({ page: 1, limit: DEFAULT_PAGE_SIZE });
  const { page, limit } = clampPagination(params);
  const filters = useMemo(() => parseAuditFilters(params), [params]);
  const { items, total, totalPages, status, error } = useSelector(selectAuditLogsState);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const queryKey = JSON.stringify(cleanParams({ ...filters, page, limit }));
  const load = useCallback(() => dispatch(fetchAuditLogs(JSON.parse(queryKey))), [dispatch, queryKey]);
  useEffect(() => {
    load();
  }, [load]);

  const toggle = id =>
    setExpandedIds(current => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const loading = status === REQUEST_STATUS.LOADING || status === REQUEST_STATUS.IDLE;
  const actor = items.find(log => log.user?.id === filters.userId)?.user;
  const userName = actor ? `${actor.firstName} ${actor.lastName}` : null;

  let content;
  if (status === REQUEST_STATUS.FAILED && items.length === 0) {
    content = <ErrorState message={error} onRetry={load} className="rounded-lg border border-line bg-surface" />;
  } else if (status === REQUEST_STATUS.SUCCEEDED && items.length === 0) {
    content = (
      <EmptyState
        icon={ScrollText}
        title={t('audit.emptyTitle')}
        description={t('audit.emptyDescription')}
        className="rounded-lg border border-line bg-surface"
      />
    );
  } else {
    content = (
      <AuditLogsTable
        logs={items}
        loading={loading}
        expandedIds={expandedIds}
        onToggle={toggle}
        onFilterUser={userId => updateParams({ userId })}
      />
    );
  }

  return (
    <>
      <PageHeader title={t('audit.title')} description={t('audit.subtitle')} />
      <AuditFilters
        filters={filters}
        userName={userName}
        onChange={updateParams}
        onReset={() => updateParams({ action: '', entity: '', userId: '', from: '', to: '' })}
      />
      {content}
      <Pagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        disabled={loading}
        onPageChange={next => updateParams({ page: next })}
        onLimitChange={next => updateParams({ limit: next })}
      />
    </>
  );
}
