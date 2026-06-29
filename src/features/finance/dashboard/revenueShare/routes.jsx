import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const RevenueShareDashboard = lazy(() => import('./components/RevenueShareDashboard'));

const revenueShareDashboardRoute = createRoute({
  path: 'finance/dashboard/revenue-share',
  getParentRoute: () => appRoute,
  component: RevenueShareDashboard
});

export const revenueShareDashboardRoutes = [revenueShareDashboardRoute];
