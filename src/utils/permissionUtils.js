// src/utils/permissionUtils.js
import { redirect } from '@tanstack/react-router';

import { store } from '@/app/store';

/**
 * Throws a TanStack Router redirect to the first route in `menuToPathMap`
 * that the current user has permission for.
 *
 * Call this inside a route's `beforeLoad` to implement permission-aware
 * index redirects for any feature section.
 *
 * @param {Array<{ menuKey: string, path: string }>} menuToPathMap - Ordered list of menuKey→path entries
 * @param {string} fallbackPath - Path to redirect to if no permission matches
 *
 * @example
 * beforeLoad: () => redirectToFirstPermitted(INVENTORY_MENU_TO_PATH, 'device-list')
 */
export function redirectToFirstPermitted(menuToPathMap, fallbackPath) {
  const permissionMap = store.getState()?.permissions?.permissionMap ?? {};
  const firstAllowed = menuToPathMap.find(({ menuKey }) => menuKey in permissionMap);
  throw redirect({ to: firstAllowed?.path ?? fallbackPath });
}

/**
 * Recursively walks the permissions tree returned by the API
 * and returns a flat map of { [menuKey]: string[] } (action names).
 *
 * Nodes without a menuKey (clickable: false, navZone: "TOP" or group nodes)
 * are skipped but their children are still walked.
 *
 * @param {Array} tree - Top-level permissions array from API
 * @returns {Object} flat map e.g. { partners_list: ['update_feasibility'] }
 */
export function flattenPermissions(tree = []) {
  const map = {};

  function walk(nodes) {
    for (const node of nodes) {
      if (node.menuKey) {
        map[node.menuKey] = (node.actions || []).map((a) => a.name).filter(Boolean);
      }
      if (node.children?.length) {
        walk(node.children);
      }
    }
  }

  walk(tree);
  return map;
}
