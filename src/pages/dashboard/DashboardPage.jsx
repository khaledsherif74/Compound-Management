import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader } from '@/components/common/PageHeader';
import { RoleBadge } from '@/components/common/RoleBadge';
import { Button } from '@/components/ui';
import { REQUEST_STATUS } from '@/constants/enums';
import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { fetchDashboard } from '@/store/dashboard.slice';
import { selectDashboardState } from '@/store/selectors';
import { buildDashboardPlan } from '@/utils/dashboardPlan';
import { useVehicleActions } from '@/pages/vehicles/useVehicleActions';
import { QuickActions } from './QuickActions';
import { LogsCard, MyVehiclesCard, PendingVehiclesCard } from './RecentCards';
import { StatsGrid } from './StatsGrid';

/** Role-aware overview built only from list endpoints the role may call. No gate controls. */
export default function DashboardPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, role } = useAuth();
  const { can } = usePermission();
  const { changeStatus } = useVehicleActions();
  const { sections, status } = useSelector(selectDashboardState);
  const [busyId, setBusyId] = useState(null);

  const isOwner = role === ROLES.OWNER;
  const plan = useMemo(() => buildDashboardPlan(can, role), [can, role]);
  const load = useCallback(() => dispatch(fetchDashboard(plan)), [dispatch, plan]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatus = async (vehicle, next) => {
    setBusyId(vehicle.id);
    await changeStatus(vehicle, next);
    setBusyId(null);
    load();
  };

  const refreshing = status === REQUEST_STATUS.LOADING;

  return (
    <>
      <PageHeader
        title={t('dashboard.welcome', { name: user.firstName })}
        description={t(isOwner ? 'dashboard.subtitleOwner' : 'dashboard.subtitle')}
        actions={
          <>
            <RoleBadge role={role} />
            <Button variant="outline" loading={refreshing} onClick={load}>
              {refreshing ? null : <RefreshCw aria-hidden="true" className="size-4" />}
              {t('dashboard.refresh')}
            </Button>
          </>
        }
      />

      <StatsGrid plan={plan} sections={sections} isOwner={isOwner} maxVehicles={user.maxVehicles} />
      <QuickActions />

      <div className="grid gap-6 xl:grid-cols-2">
        {plan.pendingVehicles ? (
          <PendingVehiclesCard section={sections.pendingVehicles} busyId={busyId} onStatus={handleStatus} onRetry={load} />
        ) : null}
        {plan.latestDenied ? (
          <LogsCard
            title={t('dashboard.cards.latestDenied')}
            section={sections.latestDenied}
            emptyText={t('dashboard.cards.noDenied')}
            to={`${ROUTES.ACCESS_LOGS}?action=DENIED`}
            onRetry={load}
          />
        ) : null}
        {plan.latestLogs ? (
          <LogsCard
            title={t('dashboard.cards.latestLogs')}
            section={sections.latestLogs}
            emptyText={t('dashboard.cards.noLogs')}
            to={ROUTES.ACCESS_LOGS}
            onRetry={load}
          />
        ) : null}
        {plan.myVehicles ? <MyVehiclesCard section={sections.myVehicles} onRetry={load} /> : null}
        {plan.myLogs ? (
          <LogsCard
            title={t('dashboard.cards.myLogs')}
            section={sections.myLogs}
            emptyText={t('dashboard.cards.noMyLogs')}
            to={ROUTES.ACCESS_LOGS}
            onRetry={load}
          />
        ) : null}
      </div>
    </>
  );
}
