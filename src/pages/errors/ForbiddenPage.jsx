import { useTranslation } from 'react-i18next';
import StatusPage from './StatusPage';

export default function ForbiddenPage() {
  const { t } = useTranslation();
  return <StatusPage code="403" title={t('statusPages.forbiddenTitle')} description={t('statusPages.forbiddenBody')} />;
}
