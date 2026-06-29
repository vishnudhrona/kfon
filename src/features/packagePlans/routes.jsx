import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';
import { ROUTE_FEATURES } from '@/constants/routes';
import { redirectToFirstPermitted } from '@/utils/permissionUtils';

import { appRoute } from '../appRoute';
import AddSubPackage from './components/AddSubPackage';
import CorporatePackage from './components/CorporatePackage';
import Combination from './components/services/Comination';
import MainServices from './components/services/MainServices';
import SubServices from './components/services/SubServices';
import SubPackageList from './components/SubPackageList';

const PackageList = lazy(() => import('./components/PackageList'))
const PlanPackage = lazy(() => import('./components/PlanPackage'))

const PACKAGE_PLANS_MENU_TO_PATH = [
  { menuKey: MENU_KEYS.MANAGE_PACKAGES, path: 'package-list' },
  { menuKey: MENU_KEYS.RETAIL, path: 'retail' },
  { menuKey: MENU_KEYS.CORPORATE, path: 'corporate' }
];

const packagesRoot = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.PACKAGES,
  getParentRoute: () => appRoute,
  component: Outlet
});

const packagesIndex = createRoute({
  path: '/',
  getParentRoute: () => packagesRoot,
  beforeLoad: () => redirectToFirstPermitted(PACKAGE_PLANS_MENU_TO_PATH, 'package-list')
});

const packageListRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.PACKAGE_LIST,
  getParentRoute: () => packagesRoot,
  component: PackageList,
  context: () => ({ menuKey: MENU_KEYS.MANAGE_PACKAGES })
});

const managePackagesRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.ADD_RETAIL_PACKAGE,
  getParentRoute: () => packagesRoot,
  component: PlanPackage,
  context: () => ({ menuKey: MENU_KEYS.RETAIL })
});

const editPackageRoute = createRoute({
  path: 'edit-package/$packageId',
  getParentRoute: () => packagesRoot,
  component: PlanPackage,
  context: () => ({ menuKey: MENU_KEYS.RETAIL })
});

const corporatePackageRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.ADD_CORPORATE_PACKAGE,
  getParentRoute: () => packagesRoot,
  component: CorporatePackage,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE })
});

const editCorporatePackageRoute = createRoute({
  path: 'edit-corporate-package/$packageId',
  getParentRoute: () => packagesRoot,
  component: CorporatePackage,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE })
});

const addSubPackageRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.SUB_PACKAGE,
  getParentRoute: () => packagesRoot,
  component: AddSubPackage,
  context: () => ({ menuKey: MENU_KEYS.MANAGE_PACKAGES })
});

const subPackageListRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.SUB_PACKAGE_LIST,
  getParentRoute: () => packagesRoot,
  component: SubPackageList,
  context: () => ({ menuKey: MENU_KEYS.MANAGE_PACKAGES })
});

const mainServicesRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.MAIN_SERVICES,
  getParentRoute: () => packagesRoot,
  component: MainServices,
  context: () => ({ menuKey: MENU_KEYS.MANAGE_PACKAGES })
});

const subServicesRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.SUB_SERVICES,
  getParentRoute: () => packagesRoot,
  component: SubServices,
  context: () => ({ menuKey: MENU_KEYS.MANAGE_PACKAGES })
});

const combinationRoute = createRoute({
  path: ROUTE_FEATURES.PACKAGE_PLANS.COMBINATION,
  getParentRoute: () => packagesRoot,
  component: Combination,
  context: () => ({ menuKey: MENU_KEYS.MANAGE_PACKAGES })
});

export const packagePlansRoutes = [
  packagesRoot,
  packagesIndex,
  packageListRoute,
  managePackagesRoute,
  editPackageRoute,
  corporatePackageRoute,
  editCorporatePackageRoute,
  addSubPackageRoute,
  subPackageListRoute,
  mainServicesRoute,
  subServicesRoute,
  combinationRoute
];
