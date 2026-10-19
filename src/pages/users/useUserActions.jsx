import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ROLES } from '@/constants/roles';
import {
  createUser,
  deleteUser,
  sendUserRecovery,
  setUserActive,
  updateUser,
} from '@/store/users.slice';
import { notifyWithAction } from '@/utils/notify';
import { buildCreatePayload, buildUpdatePayload } from '@/utils/userPayload';

const fullName = user => `${user.firstName} ${user.lastName}`;

/**
 * Orchestrates user mutations and their toasts. Dispatches thunks only (no api calls).
 * `create` and `update` reject with the backend message so the form can show it;
 * `toggle`, `remove` and `resend` report their own errors.
 */
export function useUserActions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const resend = useCallback(
    async user => {
      try {
        await dispatch(sendUserRecovery(user.id)).unwrap();
        toast.success(t('users.messages.recoverySent'));
      } catch (message) {
        toast.error(message);
      }
    },
    [dispatch, t],
  );

  const create = useCallback(
    async values => {
      const { data: user, meta } = await dispatch(createUser(buildCreatePayload(values))).unwrap();
      if (user.role !== ROLES.OWNER) {
        toast.success(t('users.messages.created'));
      } else if (meta?.passwordRecoverySent === false) {
        notifyWithAction({
          message: t('users.messages.recoveryFailed'),
          actionLabel: t('users.messages.resendAction'),
          onAction: () => resend(user),
        });
      } else {
        toast.success(t('users.messages.createdOwner'));
      }
    },
    [dispatch, resend, t],
  );

  /** @returns {Promise<boolean>} false when nothing changed (no request is sent) */
  const update = useCallback(
    async (user, values) => {
      const body = buildUpdatePayload(values, user);
      if (Object.keys(body).length === 0) {
        toast(t('users.messages.noChanges'));
        return false;
      }
      await dispatch(updateUser({ id: user.id, body })).unwrap();
      toast.success(t('users.messages.updated'));
      return true;
    },
    [dispatch, t],
  );

  const toggle = useCallback(
    async user => {
      const isActive = !user.isActive;
      try {
        await dispatch(setUserActive({ id: user.id, isActive })).unwrap();
        toast.success(t(isActive ? 'users.messages.enabled' : 'users.messages.disabled', { name: fullName(user) }));
      } catch (message) {
        toast.error(message);
      }
    },
    [dispatch, t],
  );

  const remove = useCallback(
    async user => {
      try {
        await dispatch(deleteUser(user.id)).unwrap();
        toast.success(t('users.messages.deleted'));
        return true;
      } catch (message) {
        toast.error(message);
        return false;
      }
    },
    [dispatch, t],
  );

  return { create, update, toggle, remove, resend };
}
