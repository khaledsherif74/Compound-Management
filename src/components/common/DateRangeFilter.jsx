import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui';
import { fromLocalInputValue, isRangeInvalid, toLocalInputValue } from '@/utils/accessLogFilters';

/**
 * From / To datetime pickers. Values are ISO strings (as kept in the URL); `onChange` gets a
 * partial `{ from }` or `{ to }`. The upper bound includes the whole minute picked.
 */
export function DateRangeFilter({ from, to, onChange }) {
  const { t } = useTranslation();
  const rangeError = isRangeInvalid({ from, to }) ? t('filters.rangeInvalid') : undefined;
  return (
    <>
      <Input
        label={t('filters.from')}
        type="datetime-local"
        dir="ltr"
        value={toLocalInputValue(from)}
        className="w-52"
        onChange={event => onChange({ from: fromLocalInputValue(event.target.value) })}
      />
      <Input
        label={t('filters.to')}
        type="datetime-local"
        dir="ltr"
        value={toLocalInputValue(to)}
        error={rangeError}
        className="w-52"
        onChange={event => onChange({ to: fromLocalInputValue(event.target.value, true) })}
      />
    </>
  );
}
