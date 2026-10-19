import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createGate, deleteGate, setGateActive, updateGate } from '@/store/gates.slice';
import { buildCreateGatePayload, buildUpdateGatePayload } from '@/utils/gatePayload';

/** Gate mutations + toasts (thunks only). create/update reject with the backend message for the form. */
export function useGateActions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const create = useCallback(
    async values => {
      await dispatch(createGate(buildCreateGatePayload(values))).unwrap();
      toast.success(t('gates.messages.created'));
    },
    [dispatch, t],
  );

  /** @returns {Promise<boolean>} false when nothing changed (no request is sent) */
  const update = useCallback(
    async (gate, values) => {
      const body = buildUpdateGatePayload(values, gate);
      if (Object.keys(body).length === 0) {
        toast(t('gates.messages.noChanges'));
        return false;
      }
      await dispatch(updateGate({ id: gate.id, body })).unwrap();
      toast.success(t('gates.messages.updated'));
      return true;
    },
    [dispatch, t],
  );

  const toggle = useCallback(
    async gate => {
      const isActive = !gate.isActive;
      try {
        await dispatch(setGateActive({ id: gate.id, isActive })).unwrap();
        toast.success(t(isActive ? 'gates.messages.enabled' : 'gates.messages.disabled', { name: gate.gateName }));
      } catch (message) {
        toast.error(message);
      }
    },
    [dispatch, t],
  );

  const remove = useCallback(
    async gate => {
      try {
        await dispatch(deleteGate(gate.id)).unwrap();
        toast.success(t('gates.messages.deleted'));
        return true;
      } catch (message) {
        toast.error(message);
        return false;
      }
    },
    [dispatch, t],
  );

  return { create, update, toggle, remove };
}
