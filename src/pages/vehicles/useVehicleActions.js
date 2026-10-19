import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createVehicle, deleteVehicle, setVehicleStatus, updateVehicle } from '@/store/vehicles.slice';
import { buildCreateVehiclePayload, buildUpdateVehiclePayload } from '@/utils/vehiclePayload';

/**
 * Orchestrates vehicle mutations and toasts (thunks only).
 * `create` and `update` reject with the backend message for the form; the rest toast their own errors.
 */
export function useVehicleActions() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const create = useCallback(
    async (values, { isOwnerUser }) => {
      await dispatch(createVehicle(buildCreateVehiclePayload(values, { isOwnerUser }))).unwrap();
      toast.success(t(isOwnerUser ? 'vehicles.messages.submitted' : 'vehicles.messages.created'));
    },
    [dispatch, t],
  );

  /** @returns {Promise<boolean>} false when nothing changed (no request is sent) */
  const update = useCallback(
    async (vehicle, values) => {
      const body = buildUpdateVehiclePayload(values, vehicle);
      if (Object.keys(body).length === 0) {
        toast(t('vehicles.messages.noChanges'));
        return false;
      }
      await dispatch(updateVehicle({ id: vehicle.id, body })).unwrap();
      toast.success(t('vehicles.messages.updated'));
      return true;
    },
    [dispatch, t],
  );

  const changeStatus = useCallback(
    async (vehicle, status) => {
      try {
        await dispatch(setVehicleStatus({ id: vehicle.id, status })).unwrap();
        toast.success(t(`vehicles.messages.${status.toLowerCase()}`));
      } catch (message) {
        toast.error(message);
      }
    },
    [dispatch, t],
  );

  const remove = useCallback(
    async vehicle => {
      try {
        await dispatch(deleteVehicle(vehicle.id)).unwrap();
        toast.success(t('vehicles.messages.deleted'));
        return true;
      } catch (message) {
        toast.error(message);
        return false;
      }
    },
    [dispatch, t],
  );

  return { create, update, changeStatus, remove };
}
