import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

const TONES = {
  danger: { box: 'bg-danger-soft text-danger-fg', icon: CircleAlert },
  warning: { box: 'bg-warning-soft text-warning-fg', icon: TriangleAlert },
  success: { box: 'bg-success-soft text-success-fg', icon: CircleCheck },
  info: { box: 'bg-info-soft text-info-fg', icon: Info },
};

/** Inline message. `danger` uses role="alert", the others use role="status". */
export function Alert({ tone = 'info', title, children, className }) {
  const { box, icon: Icon } = TONES[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-md px-3.5 py-3 text-sm', box, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? <div className={title ? 'mt-0.5' : undefined}>{children}</div> : null}
      </div>
    </div>
  );
}
