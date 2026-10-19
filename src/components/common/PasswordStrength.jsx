import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { getPasswordStrength } from '@/utils/passwordStrength';

const BAR_TONES = ['', 'bg-danger', 'bg-warning', 'bg-primary', 'bg-success'];

/** Four-segment meter with a text label so color is never the only signal. */
export function PasswordStrength({ password }) {
  const { t } = useTranslation();
  const score = getPasswordStrength(password);
  return (
    <div className="mt-2">
      <div
        role="meter"
        aria-label={t('auth.strengthLabel')}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={score}
        aria-valuetext={t(`auth.strength.${score}`)}
        className="flex gap-1"
      >
        {[1, 2, 3, 4].map(step => (
          <span
            key={step}
            className={cn('h-1 flex-1 rounded-full bg-line-strong transition-colors', step <= score && BAR_TONES[score])}
          />
        ))}
      </div>
      <p aria-live="polite" className="mt-1 text-xs text-muted">
        {t(`auth.strength.${score}`)}
      </p>
    </div>
  );
}
