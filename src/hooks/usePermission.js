import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectPermissions, selectUserRole } from '@/store/selectors';

/** `can(p)` for one permission, `canAny([p, q])` for "at least one of". */
export function usePermission() {
  const role = useSelector(selectUserRole);
  const permissions = useSelector(selectPermissions);

  const can = useCallback(permission => permissions.has(permission), [permissions]);
  const canAny = useCallback(list => list.some(permission => permissions.has(permission)), [permissions]);

  return { role, can, canAny };
}
