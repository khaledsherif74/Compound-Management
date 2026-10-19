import { Check, Eye, Pencil, Trash2, X } from 'lucide-react';
import { VEHICLE_STATUS } from '@/constants/enums';
import { PERMISSIONS } from '@/constants/permissions';

const STATUS_ACTIONS = [
  { status: VEHICLE_STATUS.APPROVED, labelKey: 'vehicles.actions.approve', icon: Check },
  { status: VEHICLE_STATUS.REJECTED, labelKey: 'vehicles.actions.reject', icon: X },
  { status: VEHICLE_STATUS.PENDING, labelKey: 'vehicles.actions.markPending', icon: null },
];

/**
 * Menu items for one vehicle, filtered by permission. Shared by the table row and detail drawer
 * so both always offer the same actions.
 */
export const buildVehicleMenu = ({ t, vehicle, can, handlers }) => {
  const review = can(PERMISSIONS.VEHICLES_REVIEW);
  const items = [];
  if (handlers.onView) {
    items.push({ key: 'view', label: t('vehicles.actions.view'), icon: Eye, onSelect: () => handlers.onView(vehicle) });
  }
  if (can(PERMISSIONS.VEHICLES_UPDATE)) {
    items.push({ key: 'edit', label: t('vehicles.actions.edit'), icon: Pencil, onSelect: () => handlers.onEdit(vehicle) });
  }
  if (review) {
    STATUS_ACTIONS.filter(action => action.status !== vehicle.status).forEach(action =>
      items.push({
        key: action.status,
        label: t(action.labelKey),
        icon: action.icon,
        onSelect: () => handlers.onStatus(vehicle, action.status),
      }),
    );
  }
  if (can(PERMISSIONS.VEHICLES_DELETE)) {
    items.push({ key: 'sep', separator: true });
    items.push({
      key: 'delete',
      label: t('vehicles.actions.delete'),
      icon: Trash2,
      tone: 'danger',
      onSelect: () => handlers.onDelete(vehicle),
    });
  }
  return items;
};
