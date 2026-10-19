import { cn } from '@/utils/cn';

const TONES = {
  neutral: 'bg-subtle text-muted',
  brand: 'bg-primary-soft text-primary-ink',
  success: 'bg-success-soft text-success-fg',
  warning: 'bg-warning-soft text-warning-fg',
  danger: 'bg-danger-soft text-danger-fg',
  info: 'bg-info-soft text-info-fg',
};

const DOTS = {
  neutral: 'bg-faint',
  brand: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

export function Badge({ tone = 'neutral', dot = false, className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
        className,
      )}
    >
      {dot ? <span aria-hidden="true" className={cn('size-1.5 rounded-full', DOTS[tone])} /> : null}
      {children}
    </span>
  );
}
