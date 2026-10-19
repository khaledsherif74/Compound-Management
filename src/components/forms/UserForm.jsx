import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Input, PasswordInput, Select } from '@/components/ui';
import { getAssignableRoles } from '@/constants/permissions';
import { ROLES } from '@/constants/roles';
import { fieldError, serverMessage } from '@/utils/formErrors';
import { findFieldForMessage } from '@/utils/serverFieldErrors';
import { buildUpdateUserSchema, createUserSchema } from '@/validations/user.schema';

const FIELDS = ['firstName', 'lastName', 'username', 'phone', 'email', 'role', 'unitCode', 'maxVehicles', 'password'];
const HINTS = { username: /username/i, phone: /phone/i, email: /e-?mail/i, unitCode: /unit/i, maxVehicles: /max/i };

const emptyValues = {
  firstName: '',
  lastName: '',
  username: '',
  phone: '',
  email: '',
  role: ROLES.OWNER,
  unitCode: '',
  maxVehicles: '',
  password: '',
};

const valuesFromUser = user => ({
  ...emptyValues,
  firstName: user.firstName,
  lastName: user.lastName,
  username: user.username,
  phone: user.phone,
  email: user.email ?? '',
  role: user.role,
  maxVehicles: user.maxVehicles === null || user.maxVehicles === undefined ? '' : String(user.maxVehicles),
});

/**
 * Create / edit form for users. Fields follow the backend rules:
 * owner -> email + unit required and no password; other roles -> password.
 * `onSubmit` must reject with the backend message string; it is shown inline.
 */
export function UserForm({ mode, user, actorRole, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  const [serverError, setServerError] = useState(null);
  const schema = useMemo(() => (isEdit ? buildUpdateUserSchema(user.role) : createUserSchema), [isEdit, user]);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: isEdit ? valuesFromUser(user) : emptyValues });

  const role = watch('role');
  const isOwner = role === ROLES.OWNER;
  const wasOwner = isEdit && user.role === ROLES.OWNER;
  const becomesOwner = isEdit && !wasOwner && isOwner;
  const needsPassword = !isOwner && (!isEdit || wasOwner);
  const roleOptions = getAssignableRoles(actorRole).map(value => ({ value, label: t(`roles.${value}`) }));
  const err = name => fieldError(t, errors[name]);

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
      {!isEdit && isOwner ? <Alert tone="info">{t('users.ownerInfo')}</Alert> : null}
      {becomesOwner ? <Alert tone="warning">{t('users.roleChangeOwner')}</Alert> : null}
      {wasOwner && !isOwner ? <Alert tone="info">{t('users.formerOwnerPassword')}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t('users.fields.firstName')} required error={err('firstName')} {...register('firstName')} />
        <Input label={t('users.fields.lastName')} required error={err('lastName')} {...register('lastName')} />
        <Input
          label={t('users.fields.username')}
          autoCapitalize="none"
          required
          error={err('username')}
          {...register('username')}
        />
        <Input
          label={t('users.fields.phone')}
          hint={t('users.hints.phone')}
          type="tel"
          inputMode="tel"
          dir="ltr"
          maxLength={11}
          required
          error={err('phone')}
          {...register('phone')}
        />
        <Select
          label={t('users.fields.role')}
          options={roleOptions}
          required
          error={err('role')}
          {...register('role')}
        />
        <Input
          label={t('users.fields.email')}
          type="email"
          dir="ltr"
          required={isOwner}
          error={err('email')}
          {...register('email')}
        />
        {isOwner ? (
          <>
            {isEdit ? (
              <Input
                label={t('users.fields.unitCode')}
                hint={t('users.hints.unitLocked')}
                value={user.unitCode ?? ''}
                disabled
                readOnly
              />
            ) : (
              <Input
                label={t('users.fields.unitCode')}
                maxLength={10}
                required
                error={err('unitCode')}
                {...register('unitCode')}
              />
            )}
            <Input
              label={t('users.fields.maxVehicles')}
              hint={t('users.hints.maxVehicles')}
              type="number"
              min={0}
              inputMode="numeric"
              error={err('maxVehicles')}
              {...register('maxVehicles')}
            />
          </>
        ) : (
          <PasswordInput
            label={t('users.fields.password')}
            hint={isEdit && !wasOwner ? t('users.hints.passwordKeep') : t('users.hints.passwordMin')}
            autoComplete="new-password"
            required={needsPassword}
            error={err('password')}
            className="sm:col-span-2"
            {...register('password')}
          />
        )}
      </div>

      <div className="sticky bottom-0 -mx-5 -mb-4 flex justify-end gap-2 border-t border-line bg-surface px-5 py-3">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? t('common.save') : t('users.createSubmit')}
        </Button>
      </div>
    </form>
  );
}
