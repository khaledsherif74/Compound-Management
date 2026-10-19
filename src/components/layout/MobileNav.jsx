import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Drawer } from '@/components/ui';
import { selectMobileNavOpen } from '@/store/selectors';
import { setMobileNavOpen } from '@/store/ui.slice';
import { NavList } from './NavList';

/** Navigation drawer for screens below lg. Closes after a link is followed. */
export function MobileNav() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const open = useSelector(selectMobileNavOpen);
  const setOpen = value => dispatch(setMobileNavOpen(value));

  return (
    <Drawer side="start" open={open} onOpenChange={setOpen} title={t('app.name')}>
      <NavList onNavigate={() => setOpen(false)} />
    </Drawer>
  );
}
