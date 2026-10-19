import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FIELD_CLASS, FormField, describedBy, useFieldIds } from './FormField';

/**
 * Native select (best accessibility and mobile UX).
 * @param {{value: string|number, label: string}[]} options
 */
export const Select = forwardRef(function Select(
  { id, label, hint, error, required, options, placeholder, className, selectClassName, ...props },
  ref,
) {
  const ids = useFieldIds(id);
  return (
    <FormField ids={ids} label={label} hint={hint} error={error} required={required} className={className}>
      <div className="relative">
        <select
          ref={ref}
          id={ids.id}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy(ids, { error, hint })}
          className={cn(FIELD_CLASS, 'appearance-none pe-9', error && 'border-danger', selectClassName)}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          ) : null}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-faint"
        />
      </div>
    </FormField>
  );
});
