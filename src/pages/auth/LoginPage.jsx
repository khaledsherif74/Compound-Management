import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Input, PasswordInput } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { fieldError } from '@/utils/formErrors';
import { loginSchema } from '@/validations/auth.schema';

export default function LoginPage() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { identifier: '', password: '' } });

  // On success the store gets the user and PublicRoute redirects.
  const onSubmit = async values => {
    setServerError(null);
    try {
      await signIn(values);
    } catch (message) {
      setServerError(message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">{t('auth.loginTitle')}</h1>
      <p className="mt-1 text-sm text-muted">{t('auth.loginSubtitle')}</p>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {serverError ? <Alert tone="danger">{serverError}</Alert> : null}
        <Input
          label={t('auth.identifier')}
          autoComplete="username"
          autoCapitalize="none"
          required
          error={fieldError(t, errors.identifier)}
          {...register('identifier')}
        />
        <PasswordInput
          label={t('auth.password')}
          autoComplete="current-password"
          required
          error={fieldError(t, errors.password)}
          {...register('password')}
        />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          {t('auth.signIn')}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">{t('auth.contactAdmin')}</p>
    </div>
  );
}
