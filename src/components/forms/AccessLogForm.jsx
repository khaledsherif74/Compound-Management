import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Input, Select } from '@/components/ui';
import { LOG_ACTIONS, LOG_DIRECTIONS } from '@/constants/enums';
import { fieldError, serverMessage } from '@/utils/formErrors';
import { findFieldForMessage } from '@/utils/serverFieldErrors';
import { accessLogSchema } from '@/validations/accessLog.schema';

const FIELDS = ['plateNumber', 'action', 'direction', 'reason', 'imagePath'];

/** Manual log entry. `onSubmit` rejects with the backend message. */
export function AccessLogForm({ onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(accessLogSchema),
    defaultValues: {
      plateNumber: '',
      action: LOG_ACTIONS.ENTRY,
      direction: LOG_DIRECTIONS.GATE_IN,
      reason: '',
      imagePath: '',
    },
  });

  const actionOptions = Object.values(LOG_ACTIONS).map(value => ({ value, label: t(`status.${value}`) }));
  const directionOptions = Object.values(LOG_DIRECTIONS).map(value => ({ value, label: t(`status.${value}`) }));

  const submit = async values => {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (message) {
      const field = findFieldForMessage(message, FIELDS);
      if (field) setError(field, { message: serverMessage(message) }, { shouldFocus: true });
      else setServerError(message);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
      {serverError ? <Alert tone="danger">{serverError}</Alert> : null}
      <Input
        label={t('accessLogs.fields.plateNumber')}
        hint={t('accessLogs.hints.plateNumber')}
        dir="auto"
        autoComplete="off"
        required
        error={fieldError(t, errors.plateNumber)}
        {...register('plateNumber')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label={t('accessLogs.fields.action')} options={actionOptions} required {...register('action')} />
        <Select label={t('accessLogs.fields.direction')} options={directionOptions} required {...register('direction')} />
      </div>
      <Input
        label={t('accessLogs.fields.reason')}
        maxLength={255}
        error={fieldError(t, errors.reason)}
        {...register('reason')}
      />
      <Input
        label={t('accessLogs.fields.imagePath')}
        hint={t('accessLogs.hints.imagePath')}
        dir="ltr"
        maxLength={500}
        error={fieldError(t, errors.imagePath)}
        {...register('imagePath')}
      />
      <div className="sticky bottom-0 -mx-5 -mb-4 flex justify-end gap-2 border-t border-line bg-surface px-5 py-3">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {t('accessLogs.createSubmit')}
        </Button>
      </div>
    </form>
  );
}
