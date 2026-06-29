import { useMatches } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { selectPageActions } from '@/features/others/common/permissionSelectors';

/**
 * Reads the current route's menuKey from TanStack Router match context,
 * looks up allowed actions in Redux, and returns a hasPermission() checker.
 *
 * @param {string} [overrideMenuKey] - Optional: use instead of route's menuKey
 * @returns {{ hasPermission: (action: string) => boolean, actions: string[] }}
 */
export function usePageActions(overrideMenuKey) {
  const matches = useMatches();
  const routeMenuKey = matches.at(-1)?.context?.menuKey ?? null;
  const menuKey = overrideMenuKey ?? routeMenuKey;

  const actions = useSelector((state) => selectPageActions(state, menuKey));

  const hasPermission = useCallback(
    (actionName) => actions.includes(actionName),
    [actions]
  );

  return { hasPermission, actions };
}
