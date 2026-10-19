import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PageFallback } from '@/components/common/PageFallback';
import { MobileNav } from '@/components/layout/MobileNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { useCurrentNav } from '@/hooks/useCurrentNav';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { label } = useCurrentNav();
  const isFirstRender = useRef(true);

  useDocumentTitle(label);

  // Move focus to the content after client-side navigation (keyboard and screen-reader users).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-app">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-on-primary"
      >
        {t('nav.skipToContent')}
      </a>
      <Sidebar />
      <MobileNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main id="main" tabIndex={-1} className="mx-auto w-full max-w-page flex-1 p-4 outline-none sm:p-6">
          <ErrorBoundary resetKey={pathname}>
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
