import { useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { fetchMainMenus } from '@/features/components/action';
import { ROUTES } from '@/features/components/routeConfig';
import { getMenuTree } from '@/features/components/selector';
import { actions } from '@/features/components/slice';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { findMenuByPath, getSideMenuItems, mergeWithRoutes } from '@/utils/menuUtils';

function translateMenuValues(items, t) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => {
    const translated = { ...item, value: item.value ? t(item.value) : item.value };
    if (item.submenu?.length) translated.submenu = translateMenuValues(item.submenu, t);
    if (item.topSubMenu?.length) translated.topSubMenu = translateMenuValues(item.topSubMenu, t);
    return translated;
  });
}

export function useMenu() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const menuTree = useSelector(getMenuTree);

  // Stable merged menus (no active flags) — used as the base for path lookups
  const mergedMenusRef = useRef([]);
  // Display menus with activeItem flags applied — drives the top nav render
  const [displayMenus, setDisplayMenus] = useState([]);

  // Fetch menus once on mount
  useEffect(() => {
    const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      dispatch(fetchMainMenus());
    }
  }, [dispatch]);

  // Rebuild translated tree and re-apply active flags on path, menu data, or language change.
  useEffect(() => {
    if (!menuTree?.length) {
      mergedMenusRef.current = [];
      setDisplayMenus([]);
      return;
    }
    mergedMenusRef.current = translateMenuValues(mergeWithRoutes(menuTree, ROUTES), t);

    const isDashboardPath =
      location.pathname === '/app/dashboard' || location.pathname.startsWith('/app/dashboard/');

    const result = findMenuByPath(mergedMenusRef.current, location.pathname, null, null, true);

    if (!result) {
      const dashboardMenu = mergedMenusRef.current.find((m) => m.key === 'DASHBOARD');
      dispatch(actions.setActiveTopMenuKey('DASHBOARD'));
      dispatch(actions.setCurrentSideMenu(
        isDashboardPath ? (dashboardMenu?.submenu ?? dashboardMenu?.topSubMenu ?? []) : []
      ));
      setDisplayMenus(mergedMenusRef.current);
      return;
    }

    dispatch(actions.setActiveSideMenuKey(result.matchedMenu.key));
    dispatch(actions.setActiveTopMenuKey(result.topParent.key));
    setDisplayMenus(result.modifiedMenus);
    dispatch(actions.setCurrentSideMenu(getSideMenuItems(result, [])));
  }, [location.pathname, menuTree, dispatch, t, i18n.language]);

  const handleTopMenuClick = useCallback(
    (item) => {
      const submenu = item?.submenu ?? item?.topSubMenu ?? [];
      dispatch(actions.setCurrentSideMenu(submenu));
      dispatch(actions.setActiveTopMenuKey(item.key));
      return submenu;
    },
    [dispatch]
  );

  return {
    handleTopMenuClick,
    topMenus: displayMenus
  };
}
