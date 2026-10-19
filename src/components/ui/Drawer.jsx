import { cn } from '@/utils/cn';
import { DialogShell } from './DialogShell';

const SIZES = { md: 'max-w-md', lg: 'max-w-xl' };

const SIDES = {
  end: 'end-0 border-s data-[state=open]:animate-slide-in-end data-[state=closed]:animate-slide-out-end',
  start:
    'start-0 border-e data-[state=open]:animate-slide-in-start data-[state=closed]:animate-slide-out-start',
};

/** Side panel. `end` (default) is right in LTR / left in RTL; `start` is the opposite edge. */
export function Drawer({ size = 'md', side = 'end', ...props }) {
  return (
    <DialogShell
      contentClassName={cn(
        'fixed inset-y-0 z-50 w-full bg-surface shadow-overlay outline-none',
        SIDES[side],
        SIZES[size],
      )}
      {...props}
    />
  );
}
