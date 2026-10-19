import { Skeleton } from '@/components/ui';

/** Suspense fallback while a lazy page chunk loads. */
export function PageFallback() {
  return (
    <div aria-busy="true" className="space-y-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-80 max-w-full" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  );
}
