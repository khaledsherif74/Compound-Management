import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, ErrorState, Skeleton } from '@/components/ui';

/**
 * Card whose body follows its own section state: skeleton until loaded, error with retry,
 * empty text, or `children(data)`. `section` is { data } | { error } | undefined.
 */
export function DashboardCard({ title, to, section, isEmpty, emptyText, onRetry, children }) {
  const { t } = useTranslation();

  let body;
  if (!section) {
    body = (
      <div aria-busy="true" className="space-y-3 p-5">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-4/6" />
      </div>
    );
  } else if (section.error) {
    body = <ErrorState message={section.error} onRetry={onRetry} className="py-8" />;
  } else if (isEmpty(section.data)) {
    body = <p className="px-5 py-10 text-center text-sm text-muted">{emptyText}</p>;
  } else {
    body = children(section.data);
  }

  return (
    <Card>
      <CardHeader
        title={title}
        actions={
          to ? (
            <Link to={to} className="rounded text-sm font-medium text-primary-ink hover:underline">
              {t('dashboard.cards.viewAll')}
            </Link>
          ) : null
        }
      />
      {body}
    </Card>
  );
}
