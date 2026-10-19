import { Car, DoorOpen, History, Plus, ScrollText, UserCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS as P } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { usePermission } from '@/hooks/usePermission';

/** Shortcuts that navigate to a page. Each is shown only if the role may use that page. */
const ACTIONS = [
  { key: 'addVehicle', to: ROUTES.VEHICLES, icon: Plus, permission: P.VEHICLES_CREATE },
  { key: 'addUser', to: ROUTES.USERS, icon: Users, permission: P.USERS_MANAGE },
  { key: 'addLog', to: ROUTES.ACCESS_LOGS, icon: Plus, permission: P.ACCESS_LOGS_CREATE },
  { key: 'viewLogs', to: ROUTES.ACCESS_LOGS, icon: History, permission: P.ACCESS_LOGS_VIEW },
  { key: 'myLogs', to: ROUTES.ACCESS_LOGS, icon: History, permission: P.ACCESS_LOGS_VIEW_OWN },
  { key: 'manageGates', to: ROUTES.GATES, icon: DoorOpen, permission: P.GATES_MANAGE },
  { key: 'viewGates', to: ROUTES.GATES, icon: DoorOpen, permission: P.GATES_VIEW, unlessCan: P.GATES_MANAGE },
  { key: 'auditLogs', to: ROUTES.AUDIT_LOGS, icon: ScrollText, permission: P.AUDIT_LOGS_VIEW },
  { key: 'profile', to: ROUTES.PROFILE, icon: UserCircle, permission: P.PROFILE_VIEW },
];

export function QuickActions() {
  const { t } = useTranslation();
  const { can } = usePermission();
  const actions = ACTIONS.filter(action => can(action.permission) && !(action.unlessCan && can(action.unlessCan)));

  return (
    <section aria-labelledby="quick-actions-title" className="mb-6">
      <h2 id="quick-actions-title" className="mb-3 text-sm font-semibold text-muted">
        {t('dashboard.quick.title')}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {actions.map(({ key, to, icon: Icon }) => (
          <li key={key}>
            <Link
              to={to}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-field bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:bg-subtle"
            >
              <Icon aria-hidden="true" className="size-4" />
              {t(`dashboard.quick.${key}`)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
