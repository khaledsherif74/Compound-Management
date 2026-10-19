import { useCallback, useEffect, useMemo, useState } from 'react';
import { History, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from '@/components/common/DateTime';
import { PageHeader } from '@/components/common/PageHeader';
import { RawPlate } from '@/components/common/RawPlate';
import { LicenseImage } from '@/components/common/LicenseImage';
import { AccessLogForm } from '@/components/forms/AccessLogForm';
import { Button, Drawer, EmptyState, ErrorState, Modal, Pagination, Switch } from '@/components/ui';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { PERMISSIONS } from '@/constants/permissions';
import { usePermission } from '@/hooks/usePermission';
import { usePolling } from '@/hooks/usePolling';
import { useQueryParams } from '@/hooks/useQueryParams';
import { fetchAccessLogs } from '@/store/accessLogs.slice';
import { fetchGateOptions } from '@/store/gates.slice';
import { selectAccessLogsState, selectGateOptions } from '@/store/selectors';
import { parseLogFilters } from '@/utils/accessLogFilters';
import { cleanParams, clampPagination } from '@/utils/query';
import { AccessLogsTable } from './AccessLogsTable';
import { LogFilters } from './LogFilters';
import { useAccessLogActions } from './useAccessLogActions';

export default function AccessLogsPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { can } = usePermission();
  const actions = useAccessLogActions();

  const ownerView = !can(PERMISSIONS.ACCESS_LOGS_VIEW);
  const canCreate = can(PERMISSIONS.ACCESS_LOGS_CREATE);

  const [params, updateParams] = useQueryParams({ page: 1, limit: DEFAULT_PAGE_SIZE });
  const { page, limit } = clampPagination(params);
  const filters = useMemo(() => parseLogFilters(params), [params]);
  const { items, total, totalPages, status, error, fetchedAt, refreshError } = useSelector(selectAccessLogsState);
  const gates = useSelector(selectGateOptions);

  const [live, setLive] = useState(false);
  const [creating, setCreating] = useState(false);
  const [imageLog, setImageLog] = useState(null);

  // Owners have no filters; staff filters are validated before they reach the API.
  const queryKey = JSON.stringify(cleanParams({ ...(ownerView ? {} : filters), page, limit }));
  const load = useCallback(
    (silent = false) => dispatch(fetchAccessLogs({ params: JSON.parse(queryKey), mine: ownerView, silent })),
    [dispatch, queryKey, ownerView],
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!ownerView) dispatch(fetchGateOptions());
  }, [dispatch, ownerView]);

  usePolling(() => load(true), { enabled: live });

  const loading = status === REQUEST_STATUS.LOADING || status === REQUEST_STATUS.IDLE;
  const hasFilters = Object.values(filters).some(Boolean);

  const handleCreate = async values => {
    await actions.create(values);
    setCreating(false);
    if (page === 1) load();
    else updateParams({ page: 1 });
  };

  let content;
  if (status === REQUEST_STATUS.FAILED && items.length === 0) {
    content = <ErrorState message={error} onRetry={() => load()} className="rounded-lg border border-line bg-surface" />;
  } else if (status === REQUEST_STATUS.SUCCEEDED && items.length === 0) {
    content = (
      <EmptyState
        icon={History}
        title={t('accessLogs.emptyTitle')}
        description={t(ownerView ? 'accessLogs.emptyDescriptionOwner' : 'accessLogs.emptyDescription')}
        className="rounded-lg border border-line bg-surface"
      />
    );
  } else {
    content = <AccessLogsTable logs={items} loading={loading} ownerView={ownerView} onViewImage={setImageLog} />;
  }

  return (
    <>
      <PageHeader
        title={t(ownerView ? 'accessLogs.titleOwner' : 'accessLogs.title')}
        description={t(ownerView ? 'accessLogs.subtitleOwner' : 'accessLogs.subtitle')}
        actions={
          canCreate ? (
            <Button onClick={() => setCreating(true)}>
              <Plus aria-hidden="true" className="size-4" />
              {t('accessLogs.add')}
            </Button>
          ) : null
        }
      />

      {ownerView ? null : (
        <LogFilters
          filters={filters}
          gates={gates.items}
          onChange={updateParams}
          onReset={() => updateParams({ action: '', direction: '', gateId: '', vehicleId: '', from: '', to: '' })}
        />
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <p aria-live="polite">
          {refreshError ? (
            <span className="text-danger">{t('accessLogs.live.failed')}</span>
          ) : fetchedAt ? (
            <>
              {t('accessLogs.live.updated')}: <DateTime value={fetchedAt} withSeconds />
            </>
          ) : null}
        </p>
        <Switch label={t('accessLogs.live.label')} checked={live} onCheckedChange={setLive} title={t('accessLogs.live.hint')} />
      </div>

      {content}

      <Pagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        disabled={loading && !hasFilters && items.length === 0}
        onPageChange={next => updateParams({ page: next })}
        onLimitChange={next => updateParams({ limit: next })}
      />

      <Drawer open={creating} onOpenChange={next => (next ? undefined : setCreating(false))} title={t('accessLogs.createTitle')}>
        <AccessLogForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
      </Drawer>

      <Modal
        open={Boolean(imageLog)}
        onOpenChange={next => (next ? undefined : setImageLog(null))}
        title={t('accessLogs.imageTitle')}
        size="lg"
      >
        {imageLog ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <RawPlate value={imageLog.plateNumber} size="md" />
            </div>
            <LicenseImage key={imageLog.imagePath} src={imageLog.imagePath} alt={t('accessLogs.imageTitle')} />
          </div>
        ) : null}
      </Modal>
    </>
  );
}
