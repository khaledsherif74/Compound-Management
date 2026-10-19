import { useTranslation } from 'react-i18next';
import StatusPage from './StatusPage';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return <StatusPage code="404" title={t('statusPages.notFoundTitle')} description={t('statusPages.notFoundBody')} />;
}
