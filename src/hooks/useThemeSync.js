import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectTheme } from '@/store/selectors';
import { applyTheme, subscribeToSystemTheme } from '@/utils/theme';

/** Follows OS theme changes while the preference is "system". */
export function useThemeSync() {
  const theme = useSelector(selectTheme);
  useEffect(() => {
    if (theme !== 'system') return undefined;
    return subscribeToSystemTheme(() => applyTheme('system'));
  }, [theme]);
}
