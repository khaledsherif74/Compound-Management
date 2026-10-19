import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/ui';
import { NAV_ITEMS } from '@/constants/navigation';
import { ROLES } from '@/constants/roles';
import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/utils/cn';

/** Role-filtered navigation. `collapsed` renders icons only, with tooltips. */
export function NavList({ collapsed = false, onNavigate }) {
  const { t, i18n } = useTranslation();
  const { role, canAny } = usePermission();
  const tooltipSide = i18n.dir() === 'rtl' ? 'left' : 'right';
  const items = NAV_ITEMS.filter(item => item.inNav && canAny(item.permissions));

  return (
    <nav aria-label={t('nav.primary')}>
      <ul className="space-y-1">
        {items.map(item => {
          const label = t(role === ROLES.OWNER && item.ownerLabelKey ? item.ownerLabelKey : item.labelKey);
          return (
            <li key={item.key}>
              <Tooltip content={collapsed ? label : null} side={tooltipSide}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onNavigate}
                  aria-label={collapsed ? label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-0',
                      isActive ? 'bg-primary-soft text-primary-ink' : 'text-muted hover:bg-subtle hover:text-ink',
                    )
                  }
                >
                  <item.icon aria-hidden="true" className="size-[18px] shrink-0" />
                  {collapsed ? null : <span className="truncate">{label}</span>}
                </NavLink>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
