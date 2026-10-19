import { Languages } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '@/config/i18n';
import { Button } from '@/components/ui';
import { setLanguage } from '@/store/ui.slice';

/** Shows the name of the language it will switch to. */
export function LanguageToggle() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const target = i18n.language === 'ar' ? 'en' : 'ar';

  return (
    <Button
      variant="ghost"
      size="md"
      aria-label={t('language.toggle')}
      onClick={() => dispatch(setLanguage(target))}
    >
      <Languages aria-hidden="true" className="size-4" />
      <span lang={target}>{LANGUAGES[target].label}</span>
    </Button>
  );
}
