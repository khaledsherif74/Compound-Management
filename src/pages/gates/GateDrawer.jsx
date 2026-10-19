import { useTranslation } from 'react-i18next';
import { GateForm } from '@/components/forms/GateForm';
import { Drawer } from '@/components/ui';

/** Create/edit drawer. The form remounts per gate so values never leak between records. */
export function GateDrawer({ open, mode, gate, onClose, onSubmit }) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  if (isEdit && !gate) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={next => (next ? undefined : onClose())}
      title={isEdit ? t('gates.editTitle') : t('gates.createTitle')}
    >
      <GateForm key={isEdit ? gate.id : 'new'} mode={mode} gate={gate} onSubmit={onSubmit} onCancel={onClose} />
    </Drawer>
  );
}
