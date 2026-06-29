import { isEmpty, max, omit } from 'lodash-es';

import { getRequest } from '@/app/axios';
import { store } from '@/app/store';
import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from '@/features/components/action';
import { mainMenusApi } from '@/features/components/api';
import { actions as permissionActions } from '@/features/others/common/permissionSlice';

import { flattenPermissions } from './permissionUtils';

/**
 * Converts a human-readable menu name to an UPPER_SNAKE_CASE key
 * e.g. "Add Stock" → "ADD_STOCK", "New Ticket" → "NEW_TICKET"
 */
export function nameToKey(name) {
  if (!name) return '';
  return name
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^A-Z0-9_]/g, '');
}

export async function fetchMenusDirectly(token) {
  try {
    const { url } = mainMenusApi();
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const response = await getRequest(url, {
      baseURL,
      config: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    // Handle both direct array response and { data: [...] } wrapped response
    const responseData = response?.data?.data ?? response?.data;
    if (Array.isArray(responseData)) {
      store.dispatch({
        type: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MAIN_MENUS][1],
        payload: {
          data: responseData
        }
      });
      store.dispatch(permissionActions.setPermissions(flattenPermissions(responseData)));
      return responseData;
    }
  } catch (error) {
    console.error('Failed to fetch menus in beforeLoad', error);
  }
  return [];
}

export function getMenuDepth(menu, level = 1) {
  if (isEmpty(menu?.submenu)) return level;
  return max(menu.submenu.map((item) => getMenuDepth(item, level + 1)));
}

export function renameTopSubMenuIfNeeded(menu) {
  const depth = getMenuDepth(menu);

  if (depth >= 4 && !isEmpty(menu.submenu)) {
    return {
      ...omit(menu, ['submenu']),
      topSubMenu: menu.submenu
    };
  }
  return menu;
}

export function mergeWithRoutes(items, routes) {
  if (!Array.isArray(items)) return [];

  const applyMerge = (menuList) =>
    menuList.map((item) => {
      const key = nameToKey(item.menuKey || item.name);
      const route = routes[key] || {};
      // Spread item without children (API field), then apply route overrides
      const merged = { ...omit(item, ['children']), ...route, key };
      // Always set value for display; fall back to name if no route label
      merged.value = route.label || item.name;

      // API uses 'children', internal menu uses 'submenu'
      const nestedItems = item.children || item.submenu;
      if (nestedItems?.length) {
        merged.submenu = applyMerge(nestedItems);
      }

      return merged;
    });

  return applyMerge(items).map(renameTopSubMenuIfNeeded);
}

/**
 * Checks if the pathname is a child route of the menu path
 * @param {string} pathname - The current pathname
 * @param {string} menuPath - The menu item path
 * @returns {boolean} - True if pathname is a child of menuPath
 */
export function isParentPath(pathname, menuPath) {
  if (!menuPath || !pathname) return false;

  // Exact match is handled separately
  if (pathname === menuPath) return false;

  // Check if pathname starts with menuPath and the next character is a slash
  // This prevents false matches like /app/inventory/device matching /app/inventory/device-list
  if (pathname.startsWith(menuPath)) {
    const nextChar = pathname[menuPath.length];
    return nextChar === '/' || nextChar === undefined;
  }

  return false;
}

/**
 * Helper to search in a submenu property (either 'submenu' or 'topSubMenu')
 */
function searchInSubmenu(menu, submenuKey, pathname, currentTopParent, i, menus) {
  const submenu = menu[submenuKey];
  if (!submenu || submenu.length === 0) return null;

  const result = findMenuByPath(submenu, pathname, currentTopParent, menu);
  if (!result) return null;

  // Mark this parent as active since child was found
  const modifiedMenu = {
    ...menu,
    activeItem: true,
    [submenuKey]: result.modifiedMenus
  };
  const modifiedMenus = [...menus];
  modifiedMenus[i] = modifiedMenu;

  return {
    ...result,
    modifiedMenus
  };
}

/**
 * Recursively searches through menu structure to find a menu item by path
 * and marks the matched item and all its parents with activeItem: true
 * @param {Array} menus - Array of menu items to search
 * @param {string} pathname - The path to match
 * @param {Object|null} topParent - The topmost parent menu (used during recursion)
 * @param {Object|null} immediateParent - The direct parent of current level (used during recursion)
 * @param {boolean} exactMatchOnly - If true, only exact matches are considered
 * @returns {Object|null} - { matchedMenu, topParent, immediateParent, modifiedMenus } or null if not found
 */
export function findMenuByPath(menus, pathname, topParent = null, immediateParent = null, exactMatchOnly = false) {
  if (!Array.isArray(menus)) return null;

  // Pre-scan: explicit top-level activeOn aliases take priority over structural hierarchy.
  // Only runs on the second (non-exact) pass and at top level so recursive calls are unaffected.
  // The submenu search is intentionally omitted — by definition the aliased path is not in this
  // menu's subtree (if it were, the main loop would find it without the pre-scan).
  if (!topParent) {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      // On the exactMatchOnly pass, only exact alias matches fire (not prefix).
      // This prevents a child path like /app/dashboard/partners-dashboard/detail from
      // pre-empting an exact structural match that the second pass would find.
      const isAliasMatch =
        Array.isArray(menu.activeOn) &&
        menu.activeOn.some((p) => pathname === p || (!exactMatchOnly && isParentPath(pathname, p)));
      if (!isAliasMatch) continue;

      // Search this menu's subtree for a deeper match (e.g. PARTNERS_DASHBOARD inside PARTNERS).
      const submenuResult = searchInSubmenu(menu, 'submenu', pathname, menu, i, menus);
      if (submenuResult) return submenuResult;
      const topSubMenuResult = searchInSubmenu(menu, 'topSubMenu', pathname, menu, i, menus);
      if (topSubMenuResult) return topSubMenuResult;

      const modifiedMenu = { ...menu, activeItem: true };
      const modifiedMenus = [...menus];
      modifiedMenus[i] = modifiedMenu;
      return { matchedMenu: modifiedMenu, topParent: menu, immediateParent: null, modifiedMenus };
    }
  }

  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i];
    const currentTopParent = topParent || menu;

    // Check if current menu path matches
    const isExactMatch = menu.path === pathname;
    const isParentMatch = !exactMatchOnly && isParentPath(pathname, menu.path);
    // Allow a menu to remain active when the URL falls under one of its
    // declared alias prefixes (e.g. proposals-summary stays active on proposals-list/<id>).
    const isAliasMatch = !exactMatchOnly
      && Array.isArray(menu.activeOn)
      && menu.activeOn.some((p) => pathname === p || isParentPath(pathname, p));

    if (isExactMatch || isParentMatch || isAliasMatch) {
      // Prefer a deeper (leaf) match inside the submenu over this parent item.
      // This handles the case where a group header shares the same path as its first child.
      const submenuResult = searchInSubmenu(menu, 'submenu', pathname, currentTopParent, i, menus);
      if (submenuResult) return submenuResult;

      const topSubMenuResult = searchInSubmenu(menu, 'topSubMenu', pathname, currentTopParent, i, menus);
      if (topSubMenuResult) return topSubMenuResult;

      const modifiedMenu = { ...menu, activeItem: true };
      const modifiedMenus = [...menus];
      modifiedMenus[i] = modifiedMenu;

      return {
        matchedMenu: modifiedMenu,
        topParent: currentTopParent,
        immediateParent: immediateParent,
        modifiedMenus
      };
    }

    // Search in submenu if it exists
    const submenuResult = searchInSubmenu(menu, 'submenu', pathname, currentTopParent, i, menus);
    if (submenuResult) return submenuResult;

    // Search in topSubMenu if it exists
    const topSubMenuResult = searchInSubmenu(menu, 'topSubMenu', pathname, currentTopParent, i, menus);
    if (topSubMenuResult) return topSubMenuResult;
  }

  // If no exact match found in first pass, try parent path matching
  if (exactMatchOnly) {
    return findMenuByPath(menus, pathname, topParent, immediateParent, false);
  }

  return null;
}

/**
 * Recursively finds the first leaf menu item (has a path and no submenu children with paths)
 * that the user has permission for, walking the submenu/topSubMenu tree.
 * @param {Array} items - Menu items to search
 * @param {Object} permissionMap - Flat map of { menuKey: actions[] }
 * @returns {string|null} - The path of the first permitted leaf, or null
 */
export function getFirstPermittedLeafPath(items, permissionMap) {
  if (!Array.isArray(items)) return null;
  for (const item of items) {
    const children = item.submenu ?? item.topSubMenu;
    if (children?.length) {
      const found = getFirstPermittedLeafPath(children, permissionMap);
      if (found) return found;
    } else if (item.path && item.menuKey && item.menuKey in permissionMap) {
      return item.path;
    }
  }
  return null;
}

/**
 * Determines the side menu items based on the matched menu result
 */
export function getSideMenuItems(result, defaultSideMenu) {
  const modifiedTopParent = result.modifiedMenus.find((menu) => menu.key === result.topParent.key);

  // For 4-level deep menus (where topSubMenu exists), use the immediate parent's children
  if (modifiedTopParent?.topSubMenu && result.immediateParent) {
    // Check if matched item is a direct child of top parent shown in topSubMenu
    if (result.immediateParent.key === result.topParent.key) {
      const matchedInTopSubMenu = modifiedTopParent.topSubMenu.find((item) => item.key === result.matchedMenu.key);
      return matchedInTopSubMenu?.submenu;
    }

    // Find the immediate parent in the topSubMenu (L2 items).
    const modifiedImmediateParent = modifiedTopParent.topSubMenu.find(
      (item) => item.key === result.immediateParent.key
    );
    if (modifiedImmediateParent) {
      return modifiedImmediateParent.submenu ?? modifiedTopParent.topSubMenu;
    }

    // immediateParent is an L3 group (not directly in L2 topSubMenu).
    // Walk through each L2 item's submenu to find which one contains the immediateParent,
    // then return that L2 item's submenu so the sidebar shows the correct L3 siblings.
    for (const l2Item of modifiedTopParent.topSubMenu) {
      const l2Submenu = l2Item.submenu || [];
      const foundInL2 = l2Submenu.find((item) => item.key === result.immediateParent.key);
      if (foundInL2) {
        return l2Submenu;
      }
    }

    // Final fallback: return topSubMenu so the sidebar never fully clears.
    return modifiedTopParent.topSubMenu;
  }

  // For regular menus, use topSubMenu or submenu from top parent
  const sideMenuItems = modifiedTopParent?.topSubMenu || modifiedTopParent?.submenu;

  return sideMenuItems && sideMenuItems.length > 0 ? sideMenuItems : defaultSideMenu;
}
