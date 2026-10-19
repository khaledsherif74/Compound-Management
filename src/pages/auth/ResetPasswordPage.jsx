import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PasswordStrength } from '@/components/common/PasswordStrength';
import { Alert, Button, PasswordInput } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { resetPassword } from '@/store/auth.slice';
import { fieldError } from '@/utils/formErrors';
import { resetPasswordSchema, resetTokenSchema } from '@/validations/auth.schema';

/** Target of the emailed link: /reset-password?token=<64 chars>. */
export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const goToLogin = () => navigate(ROUTES.LOGIN);

  if (!resetTokenSchema.safeParse(token).success) {
    return (
      <div>
        <Alert tone="danger" title={t('auth.invalidLinkTitle')}>
          {t('auth.invalidLinkBody')}
        </Alert>
        <Button variant="outline" className="mt-5 w-full" onClick={goToLogin}>
          {t('auth.backToLogin')}
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <Alert tone="success" title={t('auth.resetSuccessTitle')}>
          {t('auth.resetSuccessBody')}
        </Alert>
        <Button size="lg" className="mt-5 w-full" onClick={goToLogin}>
          {t('auth.backToLogin')}
        </Button>
      </div>
    );
  }

  const onSubmit = async ({ newPassword }) => {
    setServerError(null);
    try {
      await dispatch(resetPassword({ token, newPassword })).unwrap();
      setDone(true);
    } catch (message) {
      setServerError(message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">{t('auth.resetTitle')}</h1>
      <p className="mt-1 text-sm text-muted">{t('auth.resetSubtitle')}</p>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {serverError ? <Alert tone="danger">{serverError}</Alert> : null}
        <div>
          <PasswordInput
            label={t('auth.newPassword')}
            autoComplete="new-password"
            required
            error={fieldError(t, errors.newPassword)}
            {...register('newPassword')}
          />
          <PasswordStrength password={watch('newPassword')} />
        </div>
        <PasswordInput
          label={t('auth.confirmPassword')}
          autoComplete="new-password"
          required
          error={fieldError(t, errors.confirmPassword)}
          {...register('confirmPassword')}
        />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {t('auth.setPassword')}
        </Button>
      </form>
    </div>
  );
}
