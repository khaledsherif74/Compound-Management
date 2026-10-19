import { cn } from '@/utils/cn';
import { Skeleton } from './Skeleton';

/** Scroll container + table. The header sticks inside the container (default max height 70vh). */
export function Table({ className, children, ...props }) {
  return (
    <div className={cn('max-h-[70vh] overflow-auto rounded-lg border border-line bg-surface', className)}>
      <table className="w-full border-collapse text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

export const THead = props => <thead {...props} />;

export const TBody = ({ className, ...props }) => (
  <tbody className={cn('divide-y divide-line', className)} {...props} />
);

const ROW_TONES = {
  danger: 'bg-danger-soft/50',
  info: 'bg-info-soft/40',
  success: 'bg-success-soft/40',
  warning: 'bg-warning-soft/50',
};

export function Tr({ tone, className, ...props }) {
  return (
    <tr
      className={cn('transition-colors hover:bg-subtle/70', tone && ROW_TONES[tone], className)}
      {...props}
    />
  );
}

export function Th({ className, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        'sticky top-0 z-10 whitespace-nowrap border-b border-line bg-subtle px-4 py-2.5 text-start text-xs font-semibold text-muted',
        className,
      )}
      {...props}
    />
  );
}

export const Td = ({ className, ...props }) => (
  <td className={cn('px-4 py-3 align-middle text-ink', className)} {...props} />
);

/** Placeholder rows shown while a list loads. */
export function TableSkeleton({ rows = 6, columns = 5 }) {
  return Array.from({ length: rows }, (_, row) => (
    <tr key={row} aria-hidden="true">
      {Array.from({ length: columns }, (_, col) => (
        <td key={col} className="px-4 py-3.5">
          <Skeleton className="h-4 w-full max-w-[10rem]" />
        </td>
      ))}
    </tr>
  ));
}
