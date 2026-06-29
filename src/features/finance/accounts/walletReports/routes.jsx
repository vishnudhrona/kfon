import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const LNPWalletReport = lazy(() => import('./components/LNPWalletReport'));
const SubscriberWalletReport = lazy(() => import('./components/SubscriberWalletReport'));
const AGNPWalletReport = lazy(() => import('./components/AGNPWalletReport'));

const walletReports = createRoute({
  path: 'finance/accounts/wallet-reports',
  getParentRoute: () => appRoute
});

const lnpWalletRoute = createRoute({
  path: 'lnp',
  getParentRoute: () => walletReports,
  component: LNPWalletReport
});

const subscriberWalletRoute = createRoute({
  path: 'subscriber',
  getParentRoute: () => walletReports,
  component: SubscriberWalletReport
});

const agnpWalletRoute = createRoute({
  path: 'agnp',
  getParentRoute: () => walletReports,
  component: AGNPWalletReport
});

export const walletReportsRoutes = [walletReports, lnpWalletRoute, subscriberWalletRoute, agnpWalletRoute];
