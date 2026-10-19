import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui';
import { ROLES } from '@/constants/roles';

const ROLE_TONES = {
  [ROLES.ADMIN]: 'danger',
  [ROLES.SUB_ADMIN]: 'warning',
  [ROLES.ROLLER]: 'info',
  [ROLES.SUPERVISOR]: 'brand',
  [ROLES.OWNER]: 'neutral',
};

export function RoleBadge({ role }) {
  const { t } = useTranslation();
  return <Badge tone={ROLE_TONES[role] ?? 'neutral'}>{t(`roles.${role}`)}</Badge>;
}
