import { useTranslation } from 'react-i18next';
import { VehicleForm } from '@/components/forms/VehicleForm';
import { Drawer } from '@/components/ui';

/** Create/edit drawer. The form remounts per vehicle so values never leak between records. */
export function VehicleFormDrawer({ open, mode, vehicle, onClose, ...formProps }) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  if (isEdit && !vehicle) return null;

  return (
    <Drawer
      size="lg"
      open={open}
      onOpenChange={next => (next ? undefined : onClose())}
      title={isEdit ? t('vehicles.editTitle') : t('vehicles.createTitle')}
    >
      <VehicleForm key={isEdit ? vehicle.id : 'new'} mode={mode} vehicle={vehicle} onCancel={onClose} {...formProps} />
    </Drawer>
  );
}
