import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';
import { appRoute } from '@/features/appRoute';

const RechargeInsights = lazy(() => import('./components/RechargeInsights'));
const SubscriberRechargeReport = lazy(() => import('./components/SubscriberRechargeReport'));
const PartnerRechargeReport = lazy(() => import('./components/PartnerRechargeReport'));

const rechargeReports = createRoute({
  path: 'finance/accounts/recharge-reports',
  getParentRoute: () => appRoute
});

const rechargeInsightsRoute = createRoute({
  path: 'insights',
  getParentRoute: () => rechargeReports,
  component: RechargeInsights,
  context: () => ({ menuKey: MENU_KEYS.RECHARGE_INSIGHTS_REPORTS })
});

const subscriberRechargeRoute = createRoute({
  path: 'subscriber',
  getParentRoute: () => rechargeReports,
  component: SubscriberRechargeReport
});

const partnerRechargeRoute = createRoute({
  path: 'partner',
  getParentRoute: () => rechargeReports,
  component: PartnerRechargeReport
});

export const rechargeReportsRoutes = [rechargeReports, rechargeInsightsRoute, subscriberRechargeRoute, partnerRechargeRoute];
