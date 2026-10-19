import { Car, DoorOpen, History, ShieldAlert, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui';
import { DEFAULT_MAX_VEHICLES, VEHICLE_STATUS } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';
import { formatNumber } from '@/utils/formatNumber';

const STAFF_STATS = [
  { key: 'users', icon: Users, to: ROUTES.USERS },
  { key: 'vehicles', icon: Car, to: ROUTES.VEHICLES },
  { key: 'gates', icon: DoorOpen, to: ROUTES.GATES },
  { key: 'logsToday', icon: History, to: ROUTES.ACCESS_LOGS },
  { key: 'deniedToday', icon: ShieldAlert, to: `${ROUTES.ACCESS_LOGS}?action=DENIED`, danger: true },
];

const countBy = (vehicles, status) => vehicles.filter(vehicle => vehicle.status === status).length;

/** Owner tiles are derived from the owner's own vehicle list (a handful of rows). */
const buildOwnerStats = (section, maxVehicles) => {
  const make = (key, icon, value, to = ROUTES.VEHICLES) => ({ key, icon, to, section: section && { data: value, error: section.error } });
  const items = section?.data?.items ?? [];
  return [
    make('usage', Car, section?.data && `${section.data.total} / ${maxVehicles ?? DEFAULT_MAX_VEHICLES}`),
    make('approved', Car, section?.data && countBy(items, VEHICLE_STATUS.APPROVED)),
    make('pending', Car, section?.data && countBy(items, VEHICLE_STATUS.PENDING)),
    make('rejected', Car, section?.data && countBy(items, VEHICLE_STATUS.REJECTED)),
  ];
};

function StatCard({ label, icon: Icon, to, section, danger }) {
  const { t } = useTranslation();
  let value;
  if (!section) value = <Skeleton className="h-8 w-16" />;
  else if (section.error) value = <span className="text-sm font-normal text-muted">{t('dashboard.stats.error')}</span>;
  else value = typeof section.data === 'number' ? formatNumber(section.data) : section.data;

  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-surface p-4 shadow-sm transition-colors hover:border-field"
    >
      <div className="min-w-0">
        <p className="truncate text-sm text-muted">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-ink" dir="ltr">
          {value}
        </p>
      </div>
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          danger ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary-ink',
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
    </Link>
  );
}

/** Staff see the totals their plan allows; owners see their quota and vehicle statuses. */
export function StatsGrid({ plan, sections, isOwner, maxVehicles }) {
  const { t } = useTranslation();
  const stats = isOwner
    ? buildOwnerStats(sections.myVehicles, maxVehicles)
    : STAFF_STATS.filter(stat => plan[stat.key]).map(stat => ({ ...stat, section: sections[stat.key] }));

  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map(({ key, ...stat }) => (
        <StatCard key={key} label={t(`dashboard.stats.${key}`)} {...stat} />
      ))}
    </div>
  );
}
