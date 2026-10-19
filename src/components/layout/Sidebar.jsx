import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Button } from '@/components/ui';
import { selectSidebarCollapsed } from '@/store/selectors';
import { toggleSidebar } from '@/store/ui.slice';
import { cn } from '@/utils/cn';
import { NavList } from './NavList';

/** Desktop sidebar (lg and up). Mobile uses MobileNav. */
export function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const collapsed = useSelector(selectSidebarCollapsed);
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-e border-line bg-surface transition-[width] duration-200 lg:flex',
        collapsed ? 'w-[4.5rem]' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-line', collapsed ? 'justify-center' : 'px-4')}>
        <BrandLogo collapsed={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <NavList collapsed={collapsed} />
      </div>
      <div className="border-t border-line p-3">
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'md'}
          className={cn(collapsed ? 'mx-auto flex' : 'w-full justify-start')}
          aria-label={collapsed ? t('nav.expand') : t('nav.collapse')}
          aria-expanded={!collapsed}
          onClick={() => dispatch(toggleSidebar())}
        >
          <Icon aria-hidden="true" className="size-[18px] rtl:rotate-180" />
          {collapsed ? null : t('nav.collapse')}
        </Button>
      </div>
    </aside>
  );
}
