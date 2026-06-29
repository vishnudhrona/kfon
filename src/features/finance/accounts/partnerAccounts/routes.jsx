import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const PartnerAccountBalance = lazy(() => import('./components/PartnerAccountBalance'));

const PartnerAccountDisbursement = lazy(() => import('./components/PartnerAccountDisbursement'));

const PartnerAccountTopUpReceipt = lazy(() => import('./components/PartnerAccountTopUpReceipt'));

const PartnerFinance = lazy(() => import('./components/PartnerFinance'));

const SubscriberOnlineRecharge = lazy(() => import('./components/SubscriberOnlineRecharge'));

const CorporateSubscriberOnlineRecharge = lazy(() => import('./components/CorporateSubscriberOnlineRecharge'));

const LNPOnlineRecharge = lazy(() => import('./components/LNPOnlineRecharge'));

const LNPPartnerFinanceCorporate = lazy(() => import('./components/LNPPartnerFinanceCorporate'));

const AGNPPartnerFinanceCorporate = lazy(() => import('./components/AGNPPartnerFinanceCorporate'));

const OnePlusOneReport = lazy(() => import('./components/OnePlusOneReport'));

const partnerAccounts = createRoute({
  path: 'finance/accounts/partner-accounts',
  getParentRoute: () => appRoute
  // component: Layout
});

const partnerAccountBalanceRoute = createRoute({
  path: 'balance',
  getParentRoute: () => partnerAccounts,
  component: PartnerAccountBalance
});

const partnerAccountDisbursementRoute = createRoute({
  path: 'disbursement',
  getParentRoute: () => partnerAccounts,
  component: PartnerAccountDisbursement
});

const partnerAccountTopupReceiptRoute = createRoute({
  path: 'topup-receipt',
  getParentRoute: () => partnerAccounts,
  component: PartnerAccountTopUpReceipt
});

const partnerFinanceRoute = createRoute({
  path: 'finance',
  getParentRoute: () => partnerAccounts,
  component: PartnerFinance
});

const subscriberOnlineRechargeRoute = createRoute({
  path: 'subscriber-recharge',
  getParentRoute: () => partnerAccounts,
  component: SubscriberOnlineRecharge
});

const corporateSubscriberOnlineRechargeRoute = createRoute({
  path: 'corporate-recharge',
  getParentRoute: () => partnerAccounts,
  component: CorporateSubscriberOnlineRecharge
});

const lnpOnlineRechargeRoute = createRoute({
  path: 'lnp-recharge',
  getParentRoute: () => partnerAccounts,
  component: LNPOnlineRecharge
});

const lnpPartnerFinanceCorporateRoute = createRoute({
  path: 'lnp-corporate',
  getParentRoute: () => partnerAccounts,
  component: LNPPartnerFinanceCorporate
});

const agnpPartnerFinanceCorporateRoute = createRoute({
  path: 'agnp-corporate',
  getParentRoute: () => partnerAccounts,
  component: AGNPPartnerFinanceCorporate
});

const onePlusOneReportRoute = createRoute({
  path: 'one-plus-one',
  getParentRoute: () => partnerAccounts,
  component: OnePlusOneReport
});

export const partnerAccountsRoutes = [
  partnerAccounts,
  partnerAccountBalanceRoute,
  partnerAccountDisbursementRoute,
  partnerAccountTopupReceiptRoute,
  partnerFinanceRoute,
  subscriberOnlineRechargeRoute,
  corporateSubscriberOnlineRechargeRoute,
  lnpOnlineRechargeRoute,
  lnpPartnerFinanceCorporateRoute,
  agnpPartnerFinanceCorporateRoute,
  onePlusOneReportRoute
];
