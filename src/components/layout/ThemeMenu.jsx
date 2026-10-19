import { Monitor, Moon, Sun } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown } from '@/components/ui';
import { selectTheme } from '@/store/selectors';
import { setTheme } from '@/store/ui.slice';
import { resolveTheme } from '@/utils/theme';

const OPTIONS = [
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
  { value: 'system', icon: Monitor },
];

export function ThemeMenu() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const TriggerIcon = resolveTheme(theme) === 'dark' ? Moon : Sun;

  const items = OPTIONS.map(({ value, icon }) => ({
    key: value,
    label: t(`theme.${value}`),
    icon,
    checked: theme === value,
    onSelect: () => dispatch(setTheme(value)),
  }));

  return (
    <Dropdown
      items={items}
      trigger={
        <Button variant="ghost" size="icon" aria-label={t('theme.toggle')}>
          <TriggerIcon aria-hidden="true" className="size-4" />
        </Button>
      }
    />
  );
}
