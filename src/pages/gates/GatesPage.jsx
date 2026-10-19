import { useCallback, useEffect, useState } from 'react';
import { DoorOpen, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ConfirmDialog, EmptyState, ErrorState, Pagination } from '@/components/ui';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { PERMISSIONS } from '@/constants/permissions';
import { usePermission } from '@/hooks/usePermission';
import { useQueryParams } from '@/hooks/useQueryParams';
import { selectGateById, selectGatesState } from '@/store/selectors';
import { fetchGates } from '@/store/gates.slice';
import { clampPagination } from '@/utils/query';
import { GateCard, GateCardSkeleton } from './GateCard';
import { GateDrawer } from './GateDrawer';
import { useGateActions } from './useGateActions';

const CLOSED = { open: false, mode: 'create', id: null };
const GRID = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3';

export default function GatesPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { can } = usePermission();
  const actions = useGateActions();
  const canManage = can(PERMISSIONS.GATES_MANAGE);

  const [params, updateParams] = useQueryParams({ page: 1, limit: DEFAULT_PAGE_SIZE });
  const { page, limit } = clampPagination(params);
  const { items, total, totalPages, status, error } = useSelector(selectGatesState);

  const [drawer, setDrawer] = useState(CLOSED);
  const editing = useSelector(state => selectGateById(state, drawer.id));
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const load = useCallback(() => dispatch(fetchGates({ page, limit })), [dispatch, page, limit]);
  useEffect(() => {
    load();
  }, [load]);

  const loading = status === REQUEST_STATUS.LOADING || status === REQUEST_STATUS.IDLE;
  const closeDrawer = () => setDrawer(current => ({ ...current, open: false }));

  const handleSubmit = async values => {
    if (drawer.mode === 'create') {
      await actions.create(values);
      if (page === 1) load();
      else updateParams({ page: 1 });
    } else if (await actions.update(editing, values)) {
      load();
    }
    closeDrawer();
  };

  const handleToggle = async gate => {
    setTogglingId(gate.id);
    await actions.toggle(gate);
    setTogglingId(null);
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    const removed = await actions.remove(deleting);
    setDeleteBusy(false);
    if (!removed) return;
    setDeleting(null);
    if (items.length === 1 && page > 1) updateParams({ page: page - 1 });
    else load();
  };

  const addButton = canManage ? (
    <Button onClick={() => setDrawer({ open: true, mode: 'create', id: null })}>
      <Plus aria-hidden="true" className="size-4" />
      {t('gates.add')}
    </Button>
  ) : null;

  let content;
  if (status === REQUEST_STATUS.FAILED && items.length === 0) {
    content = <ErrorState message={error} onRetry={load} className="rounded-lg border border-line bg-surface" />;
  } else if (loading && items.length === 0) {
    content = (
      <div className={GRID} aria-busy="true">
        {Array.from({ length: 6 }, (_, index) => (
          <GateCardSkeleton key={index} />
        ))}
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <EmptyState
        icon={DoorOpen}
        title={t('gates.emptyTitle')}
        description={t(canManage ? 'gates.emptyDescription' : 'gates.emptyDescriptionReadOnly')}
        action={addButton}
        className="rounded-lg border border-line bg-surface"
      />
    );
  } else {
    content = (
      <div className={GRID} aria-busy={loading}>
        {items.map(gate => (
          <GateCard
            key={gate.id}
            gate={gate}
            canManage={canManage}
            toggling={togglingId === gate.id}
            onEdit={target => setDrawer({ open: true, mode: 'edit', id: target.id })}
            onToggle={handleToggle}
            onDelete={setDeleting}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <PageHeader title={t('gates.title')} description={t('gates.subtitle')} actions={addButton} />
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

      <GateDrawer open={drawer.open} mode={drawer.mode} gate={editing} onClose={closeDrawer} onSubmit={handleSubmit} />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={next => (next ? undefined : setDeleting(null))}
        title={t('gates.delete.title', { name: deleting?.gateName ?? '' })}
        description={t('gates.delete.body')}
        confirmLabel={t('gates.actions.delete')}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}
