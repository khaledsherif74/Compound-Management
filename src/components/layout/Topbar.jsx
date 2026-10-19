import { Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { setMobileNavOpen } from '@/store/ui.slice';
import { Breadcrumbs } from './Breadcrumbs';
import { LanguageToggle } from './LanguageToggle';
import { ThemeMenu } from './ThemeMenu';
import { UserMenu } from './UserMenu';

export function Topbar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label={t('nav.openMenu')}
        onClick={() => dispatch(setMobileNavOpen(true))}
      >
        <Menu aria-hidden="true" className="size-5" />
      </Button>
      <Breadcrumbs />
      <div className="ms-auto flex items-center gap-1">
        <LanguageToggle />
        <ThemeMenu />
        <UserMenu />
      </div>
    </header>
  );
}
