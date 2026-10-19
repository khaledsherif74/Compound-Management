import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cover from '@/assets/images/gate-control-cover.png';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { PageFallback } from '@/components/common/PageFallback';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { ThemeMenu } from '@/components/layout/ThemeMenu';
import { ROUTES } from '@/constants/routes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/** Split screen: gate photo with brand on large screens, form column everywhere. */
export default function AuthLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  useDocumentTitle(t(pathname === ROUTES.RESET_PASSWORD ? 'auth.resetTitle' : 'auth.loginTitle'));

  return (
    <div className="grid min-h-screen bg-app lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={cover} alt="" className="absolute inset-0 size-full object-cover object-[28%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/45 to-brand-950/30" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <BrandLogo inverted />
          <div className="max-w-md">
            <p className="text-3xl font-semibold leading-snug text-white">{t('app.tagline')}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <BrandLogo className="lg:invisible" />
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeMenu />
          </div>
        </div>
        <main className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="w-full max-w-sm">
            <ErrorBoundary>
              <Suspense fallback={<PageFallback />}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
