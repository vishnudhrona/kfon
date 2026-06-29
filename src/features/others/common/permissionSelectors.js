import { STATE_REDUCER_KEY } from './permissionConstants';

const getPermissionState = (state) => state[STATE_REDUCER_KEY];

/**
 * Returns the array of allowed action names for a given menuKey.
 * Returns [] if menuKey is null/undefined or not in the map.
 */
export const selectPageActions = (state, menuKey) => {
  if (!menuKey) return [];
  return getPermissionState(state)?.permissionMap?.[menuKey] ?? [];
};
