import { cn } from '@/utils/cn';

/** Decorative placeholder. Pair with an aria-busy container or a Spinner label. */
export function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-subtle', className)} />;
}
