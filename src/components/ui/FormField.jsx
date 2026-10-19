import { useId } from 'react';
import { cn } from '@/utils/cn';

/** Shared look for text inputs and selects. Border meets 3:1 non-text contrast. */
export const FIELD_CLASS =
  'h-9 w-full rounded-md border border-field bg-surface px-3 text-sm text-ink transition-colors duration-150 ' +
  'placeholder:text-faint hover:border-faint focus-visible:border-primary ' +
  'disabled:cursor-not-allowed disabled:bg-subtle disabled:opacity-70';

/** Stable ids that wire label, hint and error text to the control. */
export function useFieldIds(id) {
  const auto = useId();
  const base = id ?? auto;
  return { id: base, hintId: `${base}-hint`, errorId: `${base}-error` };
}

export const describedBy = (ids, { error, hint }) =>
  error ? ids.errorId : hint ? ids.hintId : undefined;

export function FormField({ ids, label, hint, error, required, className, children }) {
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <label htmlFor={ids.id} className="mb-1.5 block text-sm font-medium text-ink">
          {label}
          {required ? (
            <span aria-hidden="true" className="ms-0.5 text-danger">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={ids.errorId} role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={ids.hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
