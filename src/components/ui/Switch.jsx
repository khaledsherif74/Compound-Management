import { forwardRef } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cn } from '@/utils/cn';
import { useFieldIds } from './FormField';

/** Provide `label` for a visible label, otherwise `aria-label` is required. */
export const Switch = forwardRef(function Switch({ id, label, className, ...props }, ref) {
  const ids = useFieldIds(id);
  const control = (
    <RadixSwitch.Root
      ref={ref}
      id={ids.id}
      className={cn(
        'inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150',
        'bg-field data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-55',
        !label && className,
      )}
      {...props}
    >
      <RadixSwitch.Thumb className="block size-4 rounded-full bg-white shadow-sm transition-transform duration-150 data-[state=checked]:translate-x-4 rtl:data-[state=checked]:-translate-x-4" />
    </RadixSwitch.Root>
  );

  if (!label) return control;
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {control}
      <label htmlFor={ids.id} className="text-sm text-ink">
        {label}
      </label>
    </div>
  );
});
