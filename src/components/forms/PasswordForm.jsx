import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PasswordStrength } from '@/components/common/PasswordStrength';
import { Alert, Button, PasswordInput } from '@/components/ui';
import { fieldError, serverMessage } from '@/utils/formErrors';
import { findFieldForMessage } from '@/utils/serverFieldErrors';
import { changePasswordSchema } from '@/validations/auth.schema';

const FIELDS = ['currentPassword', 'newPassword'];
const HINTS = { currentPassword: /current password/i };

/** Change-password form. `onSubmit({currentPassword, newPassword})` rejects with the backend message. */
export function PasswordForm({ onSubmit }) {
  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const submit = async ({ currentPassword, newPassword }) => {
    setServerError(null);
    try {
      await onSubmit({ currentPassword, newPassword });
      reset();
    } catch (message) {
      const field = findFieldForMessage(message, FIELDS, HINTS);
      if (field) setError(field, { message: serverMessage(message) }, { shouldFocus: true });
      else setServerError(message);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="max-w-md space-y-4">
      {serverError ? <Alert tone="danger">{serverError}</Alert> : null}
      <PasswordInput
        label={t('profile.currentPassword')}
        autoComplete="current-password"
        required
        error={fieldError(t, errors.currentPassword)}
        {...register('currentPassword')}
      />
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
      <Button type="submit" loading={isSubmitting}>
        {t('profile.changeSubmit')}
      </Button>
    </form>
  );
}
