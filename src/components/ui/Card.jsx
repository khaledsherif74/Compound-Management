import { cn } from '@/utils/cn';

export function Card({ className, ...props }) {
  return <section className={cn('rounded-lg border border-line bg-surface shadow-sm', className)} {...props} />;
}

export function CardHeader({ title, description, actions, className }) {
  return (
    <header className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4', className)}>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description ? <p className="mt-0.5 text-sm text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cn('p-5', className)} {...props} />;
}
