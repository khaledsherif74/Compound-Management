import { ChevronRight, House } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';
import { useCurrentNav } from '@/hooks/useCurrentNav';

/** Home > current section, derived from the first path segment. */
export function Breadcrumbs() {
  const { t } = useTranslation();
  const { item, label } = useCurrentNav();
  const nested = item && item.path !== ROUTES.DASHBOARD;

  return (
    <nav aria-label={t('nav.breadcrumb')} className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm text-muted">
        {nested ? (
          <>
            <li>
              <Link to={ROUTES.DASHBOARD} aria-label={t('nav.dashboard')} className="inline-flex rounded hover:text-ink">
                <House aria-hidden="true" className="size-4" />
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </li>
          </>
        ) : null}
        <li aria-current="page" className="truncate font-medium text-ink">
          {label ?? t('nav.dashboard')}
        </li>
      </ol>
    </nav>
  );
}
