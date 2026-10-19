import { useCallback, useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { FilterBar } from '@/components/common/FilterBar';
import { PageHeader } from '@/components/common/PageHeader';
import { Button, ConfirmDialog, EmptyState, ErrorState, Pagination, Select } from '@/components/ui';
import { DEFAULT_PAGE_SIZE, REQUEST_STATUS } from '@/constants/enums';
import { getAssignableRoles, PERMISSIONS } from '@/constants/permissions';
import { ALL_ROLES, ROLES } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useQueryParams } from '@/hooks/useQueryParams';
import { selectUserById, selectUsersState } from '@/store/selectors';
import { fetchUsers } from '@/store/users.slice';
import { clampPagination } from '@/utils/query';
import { UserDrawer } from './UserDrawer';
import { UsersTable } from './UsersTable';
import { useUserActions } from './useUserActions';

const CLOSED_DRAWER = { open: false, mode: 'create', id: null };

export default function UsersPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user: me } = useAuth();
  const { role: actorRole, can } = usePermission();
  const actions = useUserActions();

  const [params, updateParams] = useQueryParams({ role: '', page: 1, limit: DEFAULT_PAGE_SIZE });
  const { page, limit } = clampPagination(params);
  const roleFilter = ALL_ROLES.includes(params.role) ? params.role : '';

  const { items, total, totalPages, status, error } = useSelector(selectUsersState);
  const [drawer, setDrawer] = useState(CLOSED_DRAWER);
  const editing = useSelector(state => selectUserById(state, drawer.id));
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const load = useCallback(
    () => dispatch(fetchUsers({ role: roleFilter, page, limit })),
    [dispatch, roleFilter, page, limit],
  );

  useEffect(() => {
    load();
  }, [load]);

  const canManage = can(PERMISSIONS.USERS_MANAGE);
  const filterRoles = actorRole === ROLES.ROLLER ? getAssignableRoles(actorRole) : ALL_ROLES;
  const loading = status === REQUEST_STATUS.LOADING;
  const closeDrawer = () => setDrawer(current => ({ ...current, open: false }));

  const handleSubmit = async values => {
    if (drawer.mode === 'create') {
      await actions.create(values);
      if (page === 1) load();
      else updateParams({ page: 1 });
    } else {
      const changed = await actions.update(editing, values);
      if (changed) load();
    }
    closeDrawer();
  };

  const handleToggle = async user => {
    setTogglingId(user.id);
    await actions.toggle(user);
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
      {t('users.add')}
    </Button>
  ) : null;

  let content;
  if (status === REQUEST_STATUS.FAILED && items.length === 0) {
    content = <ErrorState message={error} onRetry={load} className="rounded-lg border border-line bg-surface" />;
  } else if (status === REQUEST_STATUS.SUCCEEDED && items.length === 0) {
    content = (
      <EmptyState
        icon={Users}
        title={t('users.emptyTitle')}
        description={t('users.emptyDescription')}
        action={addButton}
        className="rounded-lg border border-line bg-surface"
      />
    );
  } else {
    content = (
      <UsersTable
        users={items}
        loading={loading || status === REQUEST_STATUS.IDLE}
        currentUserId={me.id}
        togglingId={togglingId}
        onEdit={user => setDrawer({ open: true, mode: 'edit', id: user.id })}
        onToggle={handleToggle}
        onDelete={setDeleting}
        onResend={actions.resend}
      />
    );
  }

  return (
    <>
      <PageHeader title={t('users.title')} description={t('users.subtitle')} actions={addButton} />

      <FilterBar canReset={Boolean(roleFilter)} onReset={() => updateParams({ role: '' })}>
        <Select
          label={t('users.filters.role')}
          placeholder={t('users.filters.allRoles')}
          value={roleFilter}
          className="w-52"
          options={filterRoles.map(value => ({ value, label: t(`roles.${value}`) }))}
          onChange={event => updateParams({ role: event.target.value })}
        />
      </FilterBar>

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

      <UserDrawer
        open={drawer.open}
        mode={drawer.mode}
        user={editing}
        actorRole={actorRole}
        onClose={closeDrawer}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={next => (next ? undefined : setDeleting(null))}
        title={t('users.delete.title', { name: deleting ? `${deleting.firstName} ${deleting.lastName}` : '' })}
        description={t('users.delete.body')}
        confirmLabel={t('users.actions.delete')}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}
