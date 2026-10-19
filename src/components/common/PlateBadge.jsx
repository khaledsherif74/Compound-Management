import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { formatPlate, toArabicIndicDigits } from '@/utils/plate';

const SIZES = {
  sm: { box: 'min-w-28 text-[10px]', body: 'gap-2 px-2 py-0.5 text-sm' },
  md: { box: 'min-w-36 text-xs', body: 'gap-3 px-3 py-1 text-lg' },
  lg: { box: 'min-w-52 text-sm', body: 'gap-4 px-4 py-2 text-3xl' },
};

/**
 * Egyptian-style plate: blue header, digits on the left, Arabic letters on the right.
 * The frame is forced LTR so the layout never mirrors; letters keep their own RTL direction.
 * The plate stays light in dark mode because it mimics a physical object.
 */
export function PlateBadge({ plateLetters, plateNumbers, size = 'md', muted = false, className }) {
  const { t } = useTranslation();
  const { box, body } = SIZES[size];
  return (
    <div
      dir="ltr"
      role="img"
      aria-label={t('vehicles.plateAria', { plate: formatPlate({ plateLetters, plateNumbers }) })}
      className={cn(
        'inline-flex select-none flex-col overflow-hidden rounded-md border-2 border-slate-800 bg-white text-slate-900 shadow-sm',
        muted && 'opacity-50',
        box,
        className,
      )}
    >
      <div aria-hidden="true" className="flex items-center justify-between bg-blue-700 px-2 py-px font-semibold leading-tight text-white">
        <span className="tracking-wider">EGYPT</span>
        <span lang="ar">مصر</span>
      </div>
      <div aria-hidden="true" className={cn('flex items-center justify-center font-bold leading-tight', body)} lang="ar">
        <span>{toArabicIndicDigits(plateNumbers)}</span>
        <span dir="rtl" className="tracking-[0.2em]">
          {toArabicIndicDigits(plateLetters)}
        </span>
      </div>
    </div>
  );
}
