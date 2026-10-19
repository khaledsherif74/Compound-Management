import { MoreHorizontal, Pencil, ScrollText, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/common/CopyButton';
import { DateTime } from '@/components/common/DateTime';
import { RoleBadge } from '@/components/common/RoleBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Button, Dropdown, Switch, Table, TableSkeleton, TBody, Td, Th, THead, Tr } from '@/components/ui';
import { canDisableOrDeleteUser, canManageUser, PERMISSIONS } from '@/constants/permissions';
import { DEFAULT_MAX_VEHICLES } from '@/constants/enums';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { usePermission } from '@/hooks/usePermission';

const COLUMNS = ['user', 'contact', 'role', 'unit', 'vehicles', 'status', 'created'];

function UserRow({ user, currentUserId, toggling, onEdit, onToggle, onDelete, onResend }) {
  const { t } = useTranslation();
  const { role: actorRole, can } = usePermission();
  const navigate = useNavigate();
  const name = `${user.firstName} ${user.lastName}`;
  const manage = can(PERMISSIONS.USERS_MANAGE);
  const editable = manage && canManageUser(actorRole, user.role);
  const protectedFromChange =
    !manage || !canDisableOrDeleteUser(actorRole, user.role) || user.id === currentUserId;
  const isOwner = user.role === ROLES.OWNER;

  const items = [
    { key: 'edit', label: t('users.actions.edit'), icon: Pencil, hidden: !editable, onSelect: () => onEdit(user) },
    {
      key: 'resend',
      label: t('users.actions.resend'),
      icon: Send,
      hidden: !editable || !isOwner || !user.email,
      onSelect: () => onResend(user),
    },
    {
      key: 'audit',
      label: t('users.actions.auditLogs'),
      icon: ScrollText,
      hidden: !can(PERMISSIONS.AUDIT_LOGS_VIEW),
      onSelect: () => navigate(`${ROUTES.AUDIT_LOGS}?userId=${user.id}`),
    },
    { key: 'sep', separator: true, hidden: protectedFromChange || !editable },
    {
      key: 'delete',
      label: t('users.actions.delete'),
      icon: Trash2,
      tone: 'danger',
      hidden: protectedFromChange,
      onSelect: () => onDelete(user),
    },
  ];

  return (
    <Tr>
      <Td>
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium">{name}</p>
            <p className="truncate text-xs text-muted" dir="ltr">
              @{user.username}
            </p>
          </div>
        </div>
      </Td>
      <Td>
        <div className="flex items-center gap-1">
          <span dir="ltr">{user.phone}</span>
          <CopyButton value={user.phone} label={name} />
        </div>
        <p className="text-xs text-muted" dir="ltr">
          {user.email || t('common.none')}
        </p>
      </Td>
      <Td>
        <RoleBadge role={user.role} />
      </Td>
      <Td>{user.unitCode || t('common.none')}</Td>
      <Td>
        {isOwner
          ? t('users.vehiclesUsed', { used: user.vehicleCount ?? 0, max: user.maxVehicles ?? DEFAULT_MAX_VEHICLES })
          : t('common.none')}
      </Td>
      <Td>
        {protectedFromChange ? (
          <StatusBadge kind="active" value={user.isActive} />
        ) : (
          <div className="flex items-center gap-2.5">
            <Switch
              checked={user.isActive}
              disabled={toggling}
              aria-label={t('users.actions.toggle', { name })}
              onCheckedChange={() => onToggle(user)}
            />
            <StatusBadge kind="active" value={user.isActive} />
          </div>
        )}
      </Td>
      <Td className="whitespace-nowrap text-muted">
        <DateTime value={user.createdAt} withTime={false} />
      </Td>
      <Td className="w-12">
        <Dropdown
          items={items}
          trigger={
            <Button variant="ghost" size="icon-sm" aria-label={t('users.actions.rowMenu', { name })}>
              <MoreHorizontal aria-hidden="true" className="size-4" />
            </Button>
          }
        />
      </Td>
    </Tr>
  );
}

export function UsersTable({ users, loading, ...rowProps }) {
  const { t } = useTranslation();
  const showSkeleton = loading && users.length === 0;

  return (
    <Table aria-busy={loading} className={loading && !showSkeleton ? 'opacity-70 transition-opacity' : undefined}>
      <THead>
        <tr>
          {COLUMNS.map(column => (
            <Th key={column}>{t(`users.columns.${column}`)}</Th>
          ))}
          <Th>
            <span className="sr-only">{t('common.actions')}</span>
          </Th>
        </tr>
      </THead>
      <TBody>
        {showSkeleton ? (
          <TableSkeleton rows={6} columns={COLUMNS.length + 1} />
        ) : (
          users.map(user => (
            <UserRow key={user.id} user={user} toggling={rowProps.togglingId === user.id} {...rowProps} />
          ))
        )}
      </TBody>
    </Table>
  );
}
