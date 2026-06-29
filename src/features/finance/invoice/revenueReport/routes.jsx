import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const RevenueReports = lazy(() => import('./components/RevenueReports'));

const revenueReports = createRoute({
  path: 'finance/invoice/revenue-report',
  getParentRoute: () => appRoute,
  component: () => <Outlet />
});

const revenueReportsIndex = createRoute({
  path: '/',
  getParentRoute: () => revenueReports,
  component: RevenueReports
});

const revenueReportsDetail = createRoute({
  path: '$reportId',
  getParentRoute: () => revenueReports,
  component: RevenueReports
});

export const revenueReportRoutes = [revenueReports, revenueReportsIndex, revenueReportsDetail];
