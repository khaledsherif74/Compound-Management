import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { ROUTES } from '@/constants/routes';

/** Shared body of the 403 and 404 pages. */
export default function StatusPage({ code, title, description }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-semibold tracking-tight text-primary-ink" dir="ltr">
        {code}
      </p>
      <h1 className="mt-4 text-xl font-semibold text-ink">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      <Button className="mt-6" onClick={() => navigate(ROUTES.DASHBOARD)}>
        {t('statusPages.backHome')}
      </Button>
    </div>
  );
}
