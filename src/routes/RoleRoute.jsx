import { usePermission } from '@/hooks/usePermission';
import ForbiddenPage from '@/pages/errors/ForbiddenPage';

/**
 * Guards a page by permission. Renders the 403 page in place (layout stays) when denied.
 * @param {string | string[]} permission one permission, or a list meaning "any of"
 */
export default function RoleRoute({ permission, children }) {
  const { canAny } = usePermission();
  const required = Array.isArray(permission) ? permission : [permission];
  return canAny(required) ? children : <ForbiddenPage />;
}
