import { useCallback, useEffect, useState } from 'react';
import { Car, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '@/components/common/PageHeader';
import { Alert, Badge, Button, ConfirmDialog, EmptyState, ErrorState, Pagination } from '@/components/ui';
import { DEFAULT_MAX_VEHICLES, DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { PERMISSIONS } from '@/constants/permissions';
import { ROLES } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useQueryParams } from '@/hooks/useQueryParams';
import { selectOwnerOptions, selectVehicleById, selectVehiclesState } from '@/store/selectors';
import { fetchOwnerOptions, fetchVehicles } from '@/store/vehicles.slice';
import { formatPlate } from '@/utils/plate';
import { clampPagination } from '@/utils/query';
import { VehicleDetailDrawer } from './VehicleDetailDrawer';
import { VehicleFormDrawer } from './VehicleFormDrawer';
import { VehiclesTable } from './VehiclesTable';
import { useVehicleActions } from './useVehicleActions';

const CLOSED = { open: false, mode: 'create', id: null };

export default function VehiclesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user: me, role } = useAuth();
  const { can } = usePermission();
  const actions = useVehicleActions();

  const isOwnerUser = role === ROLES.OWNER;
  const canCreateEmployee = can(PERMISSIONS.VEHICLES_CREATE_EMPLOYEE);

  const [params, updateParams] = useQueryParams({ page: 1, limit: DEFAULT_PAGE_SIZE });
  const { page, limit } = clampPagination(params);
  const { items, total, totalPages, status, error } = useSelector(selectVehiclesState);
  const owners = useSelector(selectOwnerOptions);

  const [form, setForm] = useState(CLOSED);
  const [detail, setDetail] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const editing = useSelector(state => selectVehicleById(state, form.id));
  const viewing = useSelector(state => selectVehicleById(state, detail.id));

  const load = useCallback(() => dispatch(fetchVehicles({ page, limit })), [dispatch, page, limit]);
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (form.open && form.mode === 'create' && !isOwnerUser) dispatch(fetchOwnerOptions());
  }, [dispatch, form.open, form.mode, isOwnerUser]);

  const loading = status === REQUEST_STATUS.LOADING;
  const usage = isOwnerUser ? { used: total, max: me.maxVehicles ?? DEFAULT_MAX_VEHICLES } : null;
  const limitReached = Boolean(usage) && status === REQUEST_STATUS.SUCCEEDED && usage.used >= usage.max;
  const closeForm = () => setForm(current => ({ ...current, open: false }));

  const handleSubmit = async values => {
    if (form.mode === 'create') {
      await actions.create(values, { isOwnerUser });
      if (page === 1) load();
      else updateParams({ page: 1 });
    } else if (await actions.update(editing, values)) {
      load();
    }
    closeForm();
  };

  const handleStatus = async (vehicle, next) => {
    setBusyId(vehicle.id);
    await actions.changeStatus(vehicle, next);
    setBusyId(null);
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    const removed = await actions.remove(deleting);
    setDeleteBusy(false);
    if (!removed) return;
    setDeleting(null);
    setDetail({ open: false, id: null });
    if (items.length === 1 && page > 1) updateParams({ page: page - 1 });
    else load();
  };

  const handlers = {
    onView: vehicle => setDetail({ open: true, id: vehicle.id }),
    onEdit: vehicle => {
      setDetail(current => ({ ...current, open: false }));
      setForm({ open: true, mode: 'edit', id: vehicle.id });
    },
    onStatus: handleStatus,
    onDelete: setDeleting,
  };

  const addButton = (
    <Button disabled={limitReached} onClick={() => setForm({ open: true, mode: 'create', id: null })}>
      <Plus aria-hidden="true" className="size-4" />
      {t('vehicles.add')}
    </Button>
  );

  let content;
  if (status === REQUEST_STATUS.FAILED && items.length === 0) {
    content = <ErrorState message={error} onRetry={load} className="rounded-lg border border-line bg-surface" />;
  } else if (status === REQUEST_STATUS.SUCCEEDED && items.length === 0) {
    content = (
      <EmptyState
        icon={Car}
        title={t('vehicles.emptyTitle')}
        description={t(isOwnerUser ? 'vehicles.emptyDescriptionOwner' : 'vehicles.emptyDescription')}
        action={limitReached ? null : addButton}
        className="rounded-lg border border-line bg-surface"
      />
    );
  } else {
    content = (
      <VehiclesTable
        vehicles={items}
        loading={loading || status === REQUEST_STATUS.IDLE}
        showHolder={!isOwnerUser}
        busyId={busyId}
        handlers={handlers}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={t(isOwnerUser ? 'vehicles.titleOwner' : 'vehicles.title')}
        description={t(isOwnerUser ? 'vehicles.subtitleOwner' : 'vehicles.subtitle')}
        actions={
          <>
            {usage ? <Badge tone={limitReached ? 'warning' : 'brand'}>{t('vehicles.limit.usage', usage)}</Badge> : null}
            {addButton}
          </>
        }
      />

      {limitReached ? (
        <Alert tone="warning" className="mb-4">
          {t('vehicles.limit.reached', { max: usage.max })}
        </Alert>
      ) : null}

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

      <VehicleDetailDrawer
        open={detail.open}
        vehicle={viewing}
        handlers={handlers}
        onClose={() => setDetail(current => ({ ...current, open: false }))}
      />

      <VehicleFormDrawer
        open={form.open}
        mode={form.mode}
        vehicle={editing}
        isOwnerUser={isOwnerUser}
        canCreateEmployee={canCreateEmployee}
        owners={owners}
        usage={usage}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={next => (next ? undefined : setDeleting(null))}
        title={t('vehicles.delete.title', { plate: deleting ? formatPlate(deleting) : '' })}
        description={t('vehicles.delete.body')}
        confirmLabel={t('vehicles.actions.delete')}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}
