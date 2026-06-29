import { usePageActions } from '@/hooks/usePageActions';

/**
 * Renders children if the current page's permissions include `action` AND `condition` is true.
 * Returns `fallback` (default null) when either check fails.
 *
 * @param {string} action - Action name to check (e.g. 'update_feasibility')
 * @param {string} [menuKey] - Optional: override the route's menuKey
 * @param {boolean} [condition=true] - Additional boolean condition that must also be true
 * @param {React.ReactNode} [fallback=null] - Rendered when access is denied
 */
export default function PermissionGuard({ action, menuKey, condition = true, fallback = null, children }) {
  const { hasPermission } = usePageActions(menuKey);
  if (!hasPermission(action) || !condition) return fallback;
  return children;
}
