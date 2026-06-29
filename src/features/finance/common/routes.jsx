import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const walletTopUpSuccessRoute = createRoute({
    path: 'finance/wallet-top-up-success',
    getParentRoute: () => appRoute,
    component: lazy(() => import('./components/WalletTopUpSuccessPage'))
});

const walletTopUpFailureRoute = createRoute({
    path: 'finance/wallet-top-up-failure',
    getParentRoute: () => appRoute,
    component: lazy(() => import('./components/WalletTopUpFailurePage'))
});

export const financeCommonRoutes = [walletTopUpSuccessRoute, walletTopUpFailureRoute];
