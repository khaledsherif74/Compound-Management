import { useTranslation } from 'react-i18next';
import { PlateBadge } from '@/components/common/PlateBadge';
import { Input } from '@/components/ui';
import { fieldError } from '@/utils/formErrors';

/**
 * Live plate preview + letters/numbers inputs. A uniqueness conflict (409) marks both inputs
 * and shows one shared message instead of repeating it under each field.
 */
export function PlateFields({ register, errors, letters, numbers, conflict }) {
  const { t } = useTranslation();
  const empty = !letters && !numbers;

  return (
    <fieldset className="space-y-3">
      <div className="flex justify-center rounded-lg bg-subtle py-4">
        <PlateBadge
          size="lg"
          muted={empty}
          plateLetters={letters || 'أ ب ج'}
          plateNumbers={numbers || '1234'}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t('vehicles.fields.plateLetters')}
          hint={t('vehicles.hints.plateLetters')}
          dir="rtl"
          lang="ar"
          autoComplete="off"
          required
          invalid={Boolean(conflict)}
          error={fieldError(t, errors.plateLetters)}
          {...register('plateLetters')}
        />
        <Input
          label={t('vehicles.fields.plateNumbers')}
          hint={t('vehicles.hints.plateNumbers')}
          dir="ltr"
          inputMode="numeric"
          autoComplete="off"
          required
          invalid={Boolean(conflict)}
          error={fieldError(t, errors.plateNumbers)}
          {...register('plateNumbers')}
        />
      </div>
      {conflict ? (
        <p role="alert" className="text-sm text-danger">
          {conflict}
        </p>
      ) : null}
    </fieldset>
  );
}
