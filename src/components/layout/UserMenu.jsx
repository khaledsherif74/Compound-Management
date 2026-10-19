import { LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RoleBadge } from '@/components/common/RoleBadge';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Dropdown } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  if (!user) return null;

  const items = [
    { key: 'profile', label: t('nav.profile'), icon: UserCircle, onSelect: () => navigate(ROUTES.PROFILE) },
    { key: 'sep', separator: true },
    { key: 'logout', label: t('auth.signOut'), icon: LogOut, onSelect: signOut },
  ];

  return (
    <Dropdown
      items={items}
      trigger={
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-md p-1 pe-2 transition-colors hover:bg-subtle"
        >
          <UserAvatar user={user} />
          <span className="hidden text-start sm:block">
            <span className="block max-w-36 truncate text-sm font-medium leading-tight text-ink">
              {user.firstName} {user.lastName}
            </span>
            <RoleBadge role={user.role} />
          </span>
        </button>
      }
    />
  );
}
