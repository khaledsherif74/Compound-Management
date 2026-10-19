import { History, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/common/CopyButton';
import { DateTime } from '@/components/common/DateTime';
import { LicenseImage } from '@/components/common/LicenseImage';
import { PlateBadge } from '@/components/common/PlateBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge, Button, Drawer, Dropdown } from '@/components/ui';
import { VEHICLE_TYPES } from '@/constants/enums';
import { PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { usePermission } from '@/hooks/usePermission';
import { buildVehicleMenu } from './vehicleMenu';

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 text-end text-ink">{children}</dd>
    </div>
  );
}

/** Read-only details plus the same actions as the table row menu. */
export function VehicleDetailDrawer({ vehicle, open, onClose, handlers }) {
  const { t } = useTranslation();
  const { can } = usePermission();
  const navigate = useNavigate();
  if (!vehicle) return null;

  const isEmployee = vehicle.vehicleType === VEHICLE_TYPES.EMPLOYEE;
  const { onView: _omit, ...drawerHandlers } = handlers;
  const items = buildVehicleMenu({ t, vehicle, can, handlers: drawerHandlers });
  const holderName = isEmployee
    ? vehicle.employeeName
    : vehicle.owner && `${vehicle.owner.firstName} ${vehicle.owner.lastName}`;
  const holderPhone = isEmployee ? vehicle.employeePhone : null;
  const holderEmail = isEmployee ? null : vehicle.owner?.email;

  return (
    <Drawer open={open} onOpenChange={next => (next ? undefined : onClose())} title={t('vehicles.detailTitle')}>
      <div className="space-y-5">
        <div className="flex flex-col items-center gap-3 rounded-lg bg-subtle py-5">
          <PlateBadge size="lg" plateLetters={vehicle.plateLetters} plateNumbers={vehicle.plateNumbers} />
          <div className="flex items-center gap-2">
            <StatusBadge kind="vehicle" value={vehicle.status} />
            <Badge tone={isEmployee ? 'info' : 'neutral'}>{t(`vehicles.types.${vehicle.vehicleType}`)}</Badge>
          </div>
        </div>

        <dl className="divide-y divide-line">
          <Row label={t('vehicles.fields.brand')}>{vehicle.brand || t('common.none')}</Row>
          <Row label={t('vehicles.fields.color')}>{vehicle.color || t('common.none')}</Row>
          {holderName ? <Row label={t('vehicles.detail.holder')}>{holderName}</Row> : null}
          {isEmployee ? <Row label={t('vehicles.fields.employeeType')}>{vehicle.employeeType}</Row> : null}
          {holderPhone ? (
            <Row label={t('vehicles.detail.phone')}>
              <span className="inline-flex items-center gap-1" dir="ltr">
                {holderPhone}
                <CopyButton value={holderPhone} label={holderName} />
              </span>
            </Row>
          ) : null}
          {holderEmail ? (
            <Row label={t('vehicles.detail.email')}>
              <span className="inline-flex items-center gap-1" dir="ltr">
                {holderEmail}
                <CopyButton value={holderEmail} label={holderName} />
              </span>
            </Row>
          ) : null}
          <Row label={t('vehicles.detail.created')}>
            <DateTime value={vehicle.createdAt} />
          </Row>
        </dl>

        <section>
          <h3 className="mb-2 text-sm font-medium text-ink">{t('vehicles.fields.licenseImage')}</h3>
          <LicenseImage key={vehicle.licenseImage} src={vehicle.licenseImage} />
        </section>

        {can(PERMISSIONS.ACCESS_LOGS_VIEW) ? (
          <Button variant="outline" className="w-full" onClick={() => navigate(`${ROUTES.ACCESS_LOGS}?vehicleId=${vehicle.id}`)}>
            <History aria-hidden="true" className="size-4" />
            {t('vehicles.detail.viewLogs')}
          </Button>
        ) : null}

        {items.length > 0 ? (
          <Dropdown
            items={items}
            trigger={
              <Button variant="outline" className="w-full">
                <MoreHorizontal aria-hidden="true" className="size-4" />
                {t('common.actions')}
              </Button>
            }
          />
        ) : null}
      </div>
    </Drawer>
  );
}
