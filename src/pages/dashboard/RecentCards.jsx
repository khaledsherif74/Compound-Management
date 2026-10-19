import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DateTime } from '@/components/common/DateTime';
import { PlateBadge } from '@/components/common/PlateBadge';
import { RawPlate } from '@/components/common/RawPlate';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui';
import { VEHICLE_STATUS, VEHICLE_TYPES } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import { formatPlate } from '@/utils/plate';
import { DashboardCard } from './DashboardCard';

const isEmptyList = list => list.length === 0;

/** Compact list of gate events: plate, gate, time, action (denied rows show the reason). */
export function LogsCard({ title, section, emptyText, to, onRetry }) {
  const { t } = useTranslation();
  return (
    <DashboardCard title={title} to={to} section={section} isEmpty={isEmptyList} emptyText={emptyText} onRetry={onRetry}>
      {logs => (
        <ul className="divide-y divide-line">
          {logs.map((log, index) => (
            <li key={`${log.timestamp}-${index}`} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <RawPlate value={log.plateNumber} />
                <div className="min-w-0 text-xs text-muted">
                  <p className="font-mono" dir="ltr">
                    {log.gate || t('common.none')}
                  </p>
                  <DateTime value={log.timestamp} withSeconds />
                  {log.reason ? <p className="truncate">{log.reason}</p> : null}
                </div>
              </div>
              <StatusBadge kind="log" value={log.action} />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}

/** Newest pending vehicles with approve/reject. `busyId` disables the row being updated. */
export function PendingVehiclesCard({ section, busyId, onStatus, onRetry }) {
  const { t } = useTranslation();
  return (
    <DashboardCard
      title={t('dashboard.cards.pendingVehicles')}
      to={ROUTES.VEHICLES}
      section={section}
      isEmpty={isEmptyList}
      emptyText={t('dashboard.cards.noPending')}
      onRetry={onRetry}
    >
      {vehicles => (
        <ul className="divide-y divide-line">
          {vehicles.map(vehicle => {
            const plate = formatPlate(vehicle);
            const holder =
              vehicle.vehicleType === VEHICLE_TYPES.EMPLOYEE
                ? vehicle.employeeName
                : vehicle.owner && `${vehicle.owner.firstName} ${vehicle.owner.lastName}`;
            return (
              <li key={vehicle.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <PlateBadge size="sm" plateLetters={vehicle.plateLetters} plateNumbers={vehicle.plateNumbers} />
                  <p className="truncate text-sm text-muted">{holder}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-success hover:text-success"
                    aria-label={`${t('vehicles.actions.approve')} ${plate}`}
                    disabled={busyId === vehicle.id}
                    onClick={() => onStatus(vehicle, VEHICLE_STATUS.APPROVED)}
                  >
                    <Check aria-hidden="true" className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-danger hover:text-danger"
                    aria-label={`${t('vehicles.actions.reject')} ${plate}`}
                    disabled={busyId === vehicle.id}
                    onClick={() => onStatus(vehicle, VEHICLE_STATUS.REJECTED)}
                  >
                    <X aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardCard>
  );
}

/** Owner's vehicles (first five) with their approval status. */
export function MyVehiclesCard({ section, onRetry }) {
  const { t } = useTranslation();
  const shaped = section && (section.error ? section : { data: section.data.items.slice(0, 5) });
  return (
    <DashboardCard
      title={t('dashboard.cards.myVehicles')}
      to={ROUTES.VEHICLES}
      section={shaped}
      isEmpty={isEmptyList}
      emptyText={t('dashboard.cards.noVehicles')}
      onRetry={onRetry}
    >
      {vehicles => (
        <ul className="divide-y divide-line">
          {vehicles.map(vehicle => (
            <li key={vehicle.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <PlateBadge size="sm" plateLetters={vehicle.plateLetters} plateNumbers={vehicle.plateNumbers} />
              <StatusBadge kind="vehicle" value={vehicle.status} />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
