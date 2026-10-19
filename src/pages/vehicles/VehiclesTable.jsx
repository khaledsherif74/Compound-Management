import { Check, MoreHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateTime } from '@/components/common/DateTime';
import { PlateBadge } from '@/components/common/PlateBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge, Button, Dropdown, Table, TableSkeleton, TBody, Td, Th, THead, Tooltip, Tr } from '@/components/ui';
import { VEHICLE_STATUS, VEHICLE_TYPES } from '@/constants/enums';
import { PERMISSIONS } from '@/constants/permissions';
import { usePermission } from '@/hooks/usePermission';
import { formatPlate } from '@/utils/plate';
import { buildVehicleMenu } from './vehicleMenu';

function HolderCell({ vehicle }) {
  const { t } = useTranslation();
  if (vehicle.vehicleType === VEHICLE_TYPES.EMPLOYEE) {
    return (
      <>
        <p className="font-medium">{vehicle.employeeName}</p>
        <p className="text-xs text-muted">
          {vehicle.employeeType} <span dir="ltr">{vehicle.employeePhone}</span>
        </p>
      </>
    );
  }
  const { owner } = vehicle;
  return owner ? (
    <>
      <p className="font-medium">
        {owner.firstName} {owner.lastName}
      </p>
      <p className="text-xs text-muted" dir="ltr">
        {owner.email || t('common.none')}
      </p>
    </>
  ) : (
    t('common.none')
  );
}

function VehicleRow({ vehicle, showHolder, busy, handlers }) {
  const { t } = useTranslation();
  const { can } = usePermission();
  const plate = formatPlate(vehicle);
  const quickReview = can(PERMISSIONS.VEHICLES_REVIEW) && vehicle.status === VEHICLE_STATUS.PENDING;
  const items = buildVehicleMenu({ t, vehicle, can, handlers });

  return (
    <Tr>
      <Td>
        <button
          type="button"
          onClick={() => handlers.onView(vehicle)}
          aria-label={t('vehicles.actions.view')}
          className="rounded-md"
        >
          <PlateBadge size="sm" plateLetters={vehicle.plateLetters} plateNumbers={vehicle.plateNumbers} />
        </button>
      </Td>
      <Td>
        {[vehicle.brand, vehicle.color].filter(Boolean).join(' · ') || t('common.none')}
      </Td>
      {showHolder ? (
        <>
          <Td>
            <Badge tone={vehicle.vehicleType === VEHICLE_TYPES.EMPLOYEE ? 'info' : 'neutral'}>
              {t(`vehicles.types.${vehicle.vehicleType}`)}
            </Badge>
          </Td>
          <Td>
            <HolderCell vehicle={vehicle} />
          </Td>
        </>
      ) : null}
      <Td>
        <StatusBadge kind="vehicle" value={vehicle.status} />
      </Td>
      <Td className="whitespace-nowrap text-muted">
        <DateTime value={vehicle.createdAt} withTime={false} />
      </Td>
      <Td className="w-32">
        <div className="flex items-center justify-end gap-1">
          {quickReview ? (
            <>
              <Tooltip content={t('vehicles.actions.approve')}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-success hover:text-success"
                  aria-label={`${t('vehicles.actions.approve')} ${plate}`}
                  disabled={busy}
                  onClick={() => handlers.onStatus(vehicle, VEHICLE_STATUS.APPROVED)}
                >
                  <Check aria-hidden="true" className="size-4" />
                </Button>
              </Tooltip>
              <Tooltip content={t('vehicles.actions.reject')}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-danger hover:text-danger"
                  aria-label={`${t('vehicles.actions.reject')} ${plate}`}
                  disabled={busy}
                  onClick={() => handlers.onStatus(vehicle, VEHICLE_STATUS.REJECTED)}
                >
                  <X aria-hidden="true" className="size-4" />
                </Button>
              </Tooltip>
            </>
          ) : null}
          <Dropdown
            items={items}
            trigger={
              <Button variant="ghost" size="icon-sm" aria-label={t('vehicles.actions.rowMenu', { plate })}>
                <MoreHorizontal aria-hidden="true" className="size-4" />
              </Button>
            }
          />
        </div>
      </Td>
    </Tr>
  );
}

export function VehiclesTable({ vehicles, loading, showHolder, busyId, handlers }) {
  const { t } = useTranslation();
  const showSkeleton = loading && vehicles.length === 0;
  const columns = showHolder ? ['plate', 'vehicle', 'type', 'holder', 'status', 'created'] : ['plate', 'vehicle', 'status', 'created'];

  return (
    <Table aria-busy={loading} className={loading && !showSkeleton ? 'opacity-70 transition-opacity' : undefined}>
      <THead>
        <tr>
          {columns.map(column => (
            <Th key={column}>{t(`vehicles.columns.${column}`)}</Th>
          ))}
          <Th>
            <span className="sr-only">{t('common.actions')}</span>
          </Th>
        </tr>
      </THead>
      <TBody>
        {showSkeleton ? (
          <TableSkeleton rows={6} columns={columns.length + 1} />
        ) : (
          vehicles.map(vehicle => (
            <VehicleRow key={vehicle.id} vehicle={vehicle} showHolder={showHolder} busy={busyId === vehicle.id} handlers={handlers} />
          ))
        )}
      </TBody>
    </Table>
  );
}
