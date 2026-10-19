import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { FIELD_CLASS, FormField, describedBy, useFieldIds } from './FormField';

/** Text input with label, hint, error, optional leading icon and trailing adornment. */
export const Input = forwardRef(function Input(
  { id, label, hint, error, invalid, required, startIcon: StartIcon, endAdornment, className, inputClassName, ...props },
  ref,
) {
  const ids = useFieldIds(id);
  return (
    <FormField ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        {StartIcon ? (
          <StartIcon
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-faint"
          />
        ) : null}
        <input
          ref={ref}
          id={ids.id}
          aria-invalid={error || invalid ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy(ids, { error, hint })}
          className={cn(
            FIELD_CLASS,
            StartIcon && 'ps-9',
            endAdornment && 'pe-10',
            (error || invalid) && 'border-danger',
            inputClassName,
          )}
          {...props}
        />
        {endAdornment ? (
          <div className="absolute end-1 top-1/2 -translate-y-1/2">{endAdornment}</div>
        ) : null}
      </div>
    </FormField>
  );
});
