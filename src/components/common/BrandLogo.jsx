import { useTranslation } from 'react-i18next';
import logo from '@/assets/brand/elhelb-logo.jpeg';
import { cn } from '@/utils/cn';

/** The ELHELB mark in a circle (hides the white JPEG corners) plus the product name. */
export function BrandLogo({ collapsed = false, inverted = false, className }) {
  const { t } = useTranslation();
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src={logo}
        alt={collapsed ? t('app.name') : ''}
        className="size-10 shrink-0 rounded-full ring-2 ring-accent/60"
      />
      {collapsed ? null : (
        <span className={cn('truncate text-base font-semibold', inverted ? 'text-white' : 'text-ink')}>
          {t('app.name')}
        </span>
      )}
    </div>
  );
}
