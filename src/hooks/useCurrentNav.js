import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '@/constants/navigation';
import { ROLES } from '@/constants/roles';
import { usePermission } from '@/hooks/usePermission';

/** Navigation entry for the current first path segment, with its (role-specific) label. */
export function useCurrentNav() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { role } = usePermission();
  const section = `/${pathname.split('/')[1] ?? ''}`;
  const item = NAV_ITEMS.find(entry => entry.path === section) ?? null;
  const label = item ? t(role === ROLES.OWNER && item.ownerLabelKey ? item.ownerLabelKey : item.labelKey) : null;
  return { item, label };
}
