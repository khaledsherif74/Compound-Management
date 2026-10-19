import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Input, Select } from '@/components/ui';
import { DEFAULT_MAX_VEHICLES, REQUEST_STATUS, VEHICLE_TYPES } from '@/constants/enums';
import { fieldError, serverMessage } from '@/utils/formErrors';
import { findFieldForMessage } from '@/utils/serverFieldErrors';
import { buildCreateVehicleSchema, buildUpdateVehicleSchema } from '@/validations/vehicle.schema';
import { OwnerSelect } from './OwnerSelect';
import { PlateFields } from './PlateFields';

const FIELDS = ['plateLetters', 'plateNumbers', 'brand', 'color', 'licenseImage', 'ownerId', 'employeeName', 'employeePhone', 'employeeType'];
const HINTS = { ownerId: /ownerId|owner does not exist/i };
const PLATE_CONFLICT = /already registered|license plate/i;

const emptyValues = {
  vehicleType: VEHICLE_TYPES.OWNER,
  ownerId: '',
  plateLetters: '',
  plateNumbers: '',
  brand: '',
  color: '',
  licenseImage: '',
  employeeName: '',
  employeePhone: '',
  employeeType: '',
};

const valuesFromVehicle = vehicle =>
  Object.fromEntries(Object.keys(emptyValues).map(key => [key, vehicle[key] ?? emptyValues[key]]));

/**
 * Create / edit vehicle form.
 * - `isOwnerUser`: resident adding their own car (no owner picker, no type choice).
 * - staff: pick an owner (searchable) or, with `canCreateEmployee`, an employee vehicle.
 * - `usage` {used, max}: the resident's quota. `onSubmit` rejects with the backend message.
 */
export function VehicleForm({ mode, vehicle, isOwnerUser, canCreateEmployee, owners, usage, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  const [serverError, setServerError] = useState(null);
  const [plateConflict, setPlateConflict] = useState(null);

  const schema = useMemo(
    () => (isEdit ? buildUpdateVehicleSchema(vehicle.vehicleType) : buildCreateVehicleSchema({ needsOwner: !isOwnerUser })),
    [isEdit, vehicle, isOwnerUser],
  );

  const {
    register,
    handleSubmit,
    watch,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: isEdit ? valuesFromVehicle(vehicle) : emptyValues });

  const [letters, numbers, ownerId, formType] = watch(['plateLetters', 'plateNumbers', 'ownerId', 'vehicleType']);
  const vehicleType = isEdit ? vehicle.vehicleType : formType;
  const isEmployee = vehicleType === VEHICLE_TYPES.EMPLOYEE;
  const err = name => fieldError(t, errors[name]);

  const selectedOwner = owners.items.find(owner => owner.id === ownerId);
  const ownerUsage = selectedOwner
    ? {
        used: selectedOwner.vehicleCount ?? 0,
        max: selectedOwner.maxVehicles ?? DEFAULT_MAX_VEHICLES,
      }
    : null;
  const ownerFull = ownerUsage ? ownerUsage.used >= ownerUsage.max : false;

  const submit = async values => {
    setServerError(null);
    setPlateConflict(null);
    try {
      await onSubmit(values);
    } catch (message) {
      const field = findFieldForMessage(message, FIELDS, HINTS);
      if (PLATE_CONFLICT.test(message)) setPlateConflict(message);
      else if (field) setError(field, { message: serverMessage(message) }, { shouldFocus: true });
      else setServerError(message);
    }
  };

  const typeOptions = Object.values(VEHICLE_TYPES).map(value => ({ value, label: t(`vehicles.types.${value}`) }));

  return (
    <form noValidate onSubmit={handleSubmit(submit)} className="space-y-4">
      {serverError ? <Alert tone="danger">{serverError}</Alert> : null}
      {!isEdit && isOwnerUser && usage ? (
        <Alert tone={usage.used >= usage.max ? 'warning' : 'info'}>
          <p>{t('vehicles.limit.usage', usage)}</p>
          <p>{t('vehicles.limit.approvalNote')}</p>
        </Alert>
      ) : null}

      {!isEdit && canCreateEmployee ? (
        <Select label={t('vehicles.fields.vehicleType')} options={typeOptions} {...register('vehicleType')} />
      ) : null}

      {!isEmployee && !isOwnerUser ? (
        isEdit ? (
          <Input
            label={t('vehicles.fields.owner')}
            value={vehicle.owner ? `${vehicle.owner.firstName} ${vehicle.owner.lastName}` : ''}
            disabled
            readOnly
          />
        ) : (
          <Controller
            name="ownerId"
            control={control}
            render={({ field }) => (
              <OwnerSelect
                owners={owners.items}
                loading={owners.status === REQUEST_STATUS.LOADING}
                value={field.value}
                onChange={field.onChange}
                label={t('vehicles.fields.owner')}
                required
                error={err('ownerId') ?? (owners.status === REQUEST_STATUS.FAILED ? owners.error : undefined)}
                hint={
                  ownerUsage
                    ? t(ownerFull ? 'vehicles.ownerSelect.full' : 'vehicles.ownerSelect.usage', ownerUsage)
                    : t('vehicles.hints.ownerSearch')
                }
              />
            )}
          />
        )
      ) : null}

      <PlateFields register={register} errors={errors} letters={letters} numbers={numbers} conflict={plateConflict} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={t('vehicles.fields.brand')} error={err('brand')} {...register('brand')} />
        <Input label={t('vehicles.fields.color')} error={err('color')} {...register('color')} />
        <Input
          label={t('vehicles.fields.licenseImage')}
          hint={t('vehicles.hints.licenseImage')}
          type="url"
          dir="ltr"
          className="sm:col-span-2"
          error={err('licenseImage')}
          {...register('licenseImage')}
        />
        {isEmployee ? (
          <>
            <Input label={t('vehicles.fields.employeeName')} required error={err('employeeName')} {...register('employeeName')} />
            <Input
              label={t('vehicles.fields.employeePhone')}
              type="tel"
              dir="ltr"
              maxLength={20}
              required
              error={err('employeePhone')}
              {...register('employeePhone')}
            />
            <Input
              label={t('vehicles.fields.employeeType')}
              required
              className="sm:col-span-2"
              error={err('employeeType')}
              {...register('employeeType')}
            />
          </>
        ) : null}
      </div>

      <div className="sticky bottom-0 -mx-5 -mb-4 flex justify-end gap-2 border-t border-line bg-surface px-5 py-3">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isEdit ? t('common.save') : t('vehicles.createSubmit')}
        </Button>
      </div>
    </form>
  );
}
