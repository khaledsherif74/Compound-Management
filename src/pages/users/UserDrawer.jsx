import { useTranslation } from 'react-i18next';
import { UserForm } from '@/components/forms/UserForm';
import { Drawer } from '@/components/ui';

/** Create/edit drawer. The form remounts per user so values never leak between records. */
export function UserDrawer({ open, mode, user, actorRole, onClose, onSubmit }) {
  const { t } = useTranslation();
  const isEdit = mode === 'edit';
  if (isEdit && !user) return null;

  return (
    <Drawer
      size="lg"
      open={open}
      onOpenChange={next => (next ? undefined : onClose())}
      title={isEdit ? t('users.editTitle') : t('users.createTitle')}
    >
      <UserForm
        key={isEdit ? user.id : 'new'}
        mode={mode}
        user={user}
        actorRole={actorRole}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Drawer>
  );
}
