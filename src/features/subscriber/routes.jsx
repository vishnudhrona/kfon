import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';

import { appRoute } from '../appRoute';
import { applicationRoutes } from './applications/routes';

const WorkOrder = lazy(() => import('./workOrder/pages/WorkOrder'));

export const subscriberRoute = createRoute({
  path: 'subscribers',
  getParentRoute: () => appRoute,
  component: () => <Outlet />
});

const subscriberIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => subscriberRoute,
  beforeLoad: () => {
    throw redirect({ to: '/app/subscribers/enquiry-list' });
  }
});

const ewsWorkOrderRoute = createRoute({
  path: 'ews-work-order',
  getParentRoute: () => subscriberRoute,
  component: WorkOrder,
  context: () => ({ menuKey: MENU_KEYS.EWS_WORK_ORDER })
});

export const subscriberRoutes = [subscriberRoute, subscriberIndexRoute, ewsWorkOrderRoute, ...applicationRoutes];
