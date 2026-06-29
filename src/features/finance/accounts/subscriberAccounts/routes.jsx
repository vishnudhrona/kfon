import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const SubscriptionRenewal = lazy(() => import('./components/SubscriptionRenewal'));

const SubscriberFinance = lazy(() => import('./components/SubscriberFinance'));

const SubscriberPartnerTransfer = lazy(() => import('./components/SubscriberPartnerTransfer'));

const SubscriberAccount = lazy(() => import('./components/SubscriberAccount'));

const subscriberAccounts = createRoute({
  path: 'finance/accounts/subscriber-accounts',
  getParentRoute: () => appRoute
  // component: Layout
});

const subscriptionRenewalRoute = createRoute({
  path: 'renewal',
  getParentRoute: () => subscriberAccounts,
  component: SubscriptionRenewal
});

const subscriberAccountRoute = createRoute({
  path: 'account',
  getParentRoute: () => subscriberAccounts,
  component: SubscriberAccount
});

const subscriberFinanceRoute = createRoute({
  path: 'finance',
  getParentRoute: () => subscriberAccounts,
  component: SubscriberFinance
});

const subscriberPartnerTransferRoute = createRoute({
  path: 'partner-transfer',
  getParentRoute: () => subscriberAccounts,
  component: SubscriberPartnerTransfer
});

export const subscriberAccountsRoutes = [
  subscriberAccounts,
  subscriptionRenewalRoute,
  subscriberFinanceRoute,
  subscriberPartnerTransferRoute,
  subscriberAccountRoute
];
