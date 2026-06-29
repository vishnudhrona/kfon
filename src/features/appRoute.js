import { createRoute, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import NotFound from '@/components/common/NotFound';
import { STORAGE_KEYS } from '@/constants';
import { ROUTES } from '@/features/components/routeConfig';
import { getMenuTree } from '@/features/components/selector';
import { attemptTokenRefresh } from '@/features/public/pages/login/refreshUtils';
import MainLayout from '@/layout/main_layout';
import { rootRoute } from '@/routes/rootRoute';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { isTokenExpired } from '@/utils/jwtUtils';
import { fetchMenusDirectly, findMenuByPath, mergeWithRoutes } from '@/utils/menuUtils';

const ForceResetPassword = lazy(() => import('./public/pages/login/components/ForceResetPassword'));

const ALWAYS_ACCESSIBLE_PREFIXES = ['/app/dashboard', '/app/profile', '/app/reset-password'];

// Module-level flag: false only until the first real navigation after a full
// page load. A direct URL entry / browser refresh reloads the bundle and resets
// this to false; in-app navigation (Link / router.navigate) keeps it true.
// Used to skip the menu-permission check for in-app navigation while still
// enforcing it when the user types/pastes a URL directly.
let initialLoadHandled = false;

function isAlwaysAccessiblePath(pathname) {
  if (pathname === '/app' || pathname === '/app/') return true;
  return ALWAYS_ACCESSIBLE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

export const appRoute = createRoute({
  path: 'app',
  getParentRoute: () => rootRoute,
  beforeLoad: async ({ location, preload }) => {
    let token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
    if (!token || isTokenExpired(token)) {
      const refreshed = await attemptTokenRefresh();
      if (!refreshed) {
        throw redirect({ to: '/auth/login' });
      }
      token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
    }

    // Direct URL entry / refresh = first non-preload run after bundle load.
    // In-app navigation runs after the flag is already set → bypass menu check.
    // Preload (link hover) must not flip the flag.
    const isDirectUrlEntry = !initialLoadHandled;
    if (!preload) {
      initialLoadHandled = true;
    }
    if (!isDirectUrlEntry) {
      return;
    }

    const { store } = await import('@/app/store');
    let menuTree = getMenuTree(store.getState());

    if (!menuTree || menuTree.length === 0) {
      menuTree = await fetchMenusDirectly(token);
    }

    const isAlwaysAccessible = isAlwaysAccessiblePath(location.pathname);

    if (!isAlwaysAccessible) {
      if (!menuTree || menuTree.length === 0) {
        throw redirect({ to: '/app/dashboard' });
      }

      const mergedMenus = mergeWithRoutes(menuTree, ROUTES);
      const isInMenuTree = findMenuByPath(mergedMenus, location.pathname);

      if (!isInMenuTree) {
        throw redirect({ to: '/app/dashboard' });
      }
    }
  },
  component: MainLayout
});

export const appDashboardRoute = createRoute({
  path: '/',
  getParentRoute: () => appRoute,
  beforeLoad: () => {
    throw redirect({ to: 'dashboard' });
  }
});

export const forceResetPasswordRoute = createRoute({
  path: 'reset-password',
  getParentRoute: () => appRoute,
  component: ForceResetPassword
});

export const appNotFoundRoute = createRoute({
  path: '$',
  getParentRoute: () => appRoute,
  component: NotFound
});
