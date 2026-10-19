import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui';

const VEHICLE_TONES = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger' };

const LOG_TONES = { ENTRY: 'success', EXIT: 'info', DENIED: 'danger' };

/** Maps a (kind, value) pair to tone + label. Other kinds are added with their features. */
const RESOLVERS = {
  active: value =>
    value ? { tone: 'success', labelKey: 'status.active' } : { tone: 'neutral', labelKey: 'status.disabled' },
  log: value => ({ tone: LOG_TONES[value] ?? 'neutral', labelKey: `status.${value}` }),
  direction: value => ({ tone: 'neutral', labelKey: `status.${value}` }),
  vehicle: value => ({ tone: VEHICLE_TONES[value] ?? 'neutral', labelKey: `status.${value}` }),
};

export function StatusBadge({ kind, value }) {
  const { t } = useTranslation();
  const { tone, labelKey } = RESOLVERS[kind](value);
  return (
    <Badge tone={tone} dot>
      {t(labelKey)}
    </Badge>
  );
}
