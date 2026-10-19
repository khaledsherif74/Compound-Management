import { forwardRef } from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useFieldIds } from './FormField';

export const Checkbox = forwardRef(function Checkbox(
  { id, label, description, className, ...props },
  ref,
) {
  const ids = useFieldIds(id);
  return (
    <div className={cn('flex items-start gap-2.5', className)}>
      <RadixCheckbox.Root
        ref={ref}
        id={ids.id}
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border border-field bg-surface transition-colors data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:opacity-60"
        {...props}
      >
        <RadixCheckbox.Indicator>
          <Check aria-hidden="true" className="size-3 text-on-primary" strokeWidth={3} />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <div className="min-w-0">
        <label htmlFor={ids.id} className="text-sm text-ink">
          {label}
        </label>
        {description ? <p className="text-xs text-muted">{description}</p> : null}
      </div>
    </div>
  );
});
