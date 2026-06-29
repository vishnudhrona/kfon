import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';

import { appRoute } from '../appRoute';

const Dashboard = lazy(() => import('./component'));
const DashboardTable = lazy(() => import('./component/DashboardTable'));

const LnpDashboard = lazy(() => import('./component/LnpDashBoard'));
const MonitoringDashBoard = lazy(() => import('./component/MonitoringDashBoard'));
const PartnerDashboard = lazy(() => import('./component/PartnerDashBoard/PartnerDashboard'));
const EnquiryDashboard = lazy(() => import('./component/EnquiryDashBoard/EnquiryDashboard'));
const InventoryDashboard = lazy(() => import('./component/InventoryDashBoard/InventoryLedger'));

const dashboardRoute = createRoute({
  path: 'dashboard',
  getParentRoute: () => appRoute,
  component: () => <Outlet />
});

const dashboardIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => dashboardRoute,
  component: Dashboard
});

const dashboardDetailsRoute = createRoute({
  path: 'details/$cardId',
  getParentRoute: () => dashboardRoute,
  component: DashboardTable
});

const lnpDashboardRoute = createRoute({
  path: 'lnp',
  getParentRoute: () => dashboardRoute,
  component: LnpDashboard
});

const monitoringDashboardRoute = createRoute({
  path: 'monitoring',
  getParentRoute: () => dashboardRoute,
  component: MonitoringDashBoard
});

const partnersDashboardRoute = createRoute({
  path: 'partners-dashboard',
  getParentRoute: () => dashboardRoute,
  component: PartnerDashboard,
  context: () => ({ menuKey: MENU_KEYS.PARTNERS_DASHBOARD })
});

const subscribersDashboardRoute = createRoute({
  path: 'subscribers-dashboard',
  getParentRoute: () => dashboardRoute,
  component: EnquiryDashboard,
  context: () => ({ menuKey: MENU_KEYS.SUBSCRIBERS_DASHBOARD })
});

const inventoryDashboardRoute = createRoute({
  path: 'inventory-dashboard',
  getParentRoute: () => dashboardRoute,
  component: InventoryDashboard,
  context: () => ({ menuKey: MENU_KEYS.INVENTORY_DASHBOARD })
});

export const dashboardRoutes = [
  dashboardRoute,
  dashboardIndexRoute,
  dashboardDetailsRoute,
  lnpDashboardRoute,
  monitoringDashboardRoute,
  partnersDashboardRoute,
  subscribersDashboardRoute,
  inventoryDashboardRoute
];
