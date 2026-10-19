import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Checkbox, Input } from '@/components/ui';
import { GATE_DIRECTION_LIST } from '@/constants/enums';
import { fieldError, serverMessage } from '@/utils/formErrors';
import { findFieldForMessage } from '@/utils/serverFieldErrors';
import { gateSchema } from '@/validations/gate.schema';

const FIELDS = ['gateName', 'gateCode', 'direction'];
const HINTS = { gateCode: /gate code/i, gateName: /gate name/i };

/** Create / edit gate. `onSubmit` rejects with the backend message (409 shows under gateCode). */
export function GateForm({ mode, gate, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(gateSchema),
    defaultValues: isEdit
      ? { gateName: gate.gateName, gateCode: gate.gateCode, direction: gate.direction }
      : { gateName: '', gateCode: '', direction: [] },
  });

  const submit = async values => {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (message) {
      const field = findFieldForMessage(message, FIELDS, HINTS);
      if (field) setError(field, { message: serverMessage(message) }, { shouldFocus: true });
      else setServerError(message);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
      {serverError ? <Alert tone="danger">{serverError}</Alert> : null}
      <Input
        label={t('gates.fields.gateName')}
        required
        maxLength={50}
        error={fieldError(t, errors.gateName)}
        {...register('gateName')}
      />
      <Input
        label={t('gates.fields.gateCode')}
        hint={t('gates.hints.gateCode')}
        dir="ltr"
        required
        maxLength={50}
        autoCapitalize="none"
        error={fieldError(t, errors.gateCode)}
        {...register('gateCode')}
      />
      <Controller
        name="direction"
        control={control}
        render={({ field }) => (
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium text-ink">
              {t('gates.fields.direction')}
              <span aria-hidden="true" className="ms-0.5 text-danger">
                *
              </span>
            </legend>
            <div className="flex gap-6">
              {GATE_DIRECTION_LIST.map(direction => (
                <Checkbox
                  key={direction}
                  label={t(`gates.directions.${direction}`)}
                  checked={field.value.includes(direction)}
                  onCheckedChange={checked =>
                    field.onChange(
                      GATE_DIRECTION_LIST.filter(item =>
                        item === direction ? checked === true : field.value.includes(item),
                      ),
                    )
                  }
                />
              ))}
            </div>
            {errors.direction ? (
              <p role="alert" className="mt-1.5 text-xs text-danger">
                {fieldError(t, errors.direction)}
              </p>
            ) : null}
          </fieldset>
        )}
      />

      <div className="sticky bottom-0 -mx-5 -mb-4 flex justify-end gap-2 border-t border-line bg-surface px-5 py-3">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? t('common.save') : t('gates.createSubmit')}
        </Button>
      </div>
    </form>
  );
}
