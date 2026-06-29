import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const AccountTopupReceiptDetails = lazy(() => import('./components/AccountTopupReceiptDetails'));
const SubscriberAdvancedTopupVoucher = lazy(() => import('./components/SubscriberAdvancedTopupVoucher'));
const TransferredToSubscriber = lazy(() => import('./components/TransferredToSubscriber'));
const Revenue = lazy(() => import('./components/Revenue'));
const GSTWallet = lazy(() => import('./components/GSTWallet'));
const FinanceTransactions = lazy(() => import('./components/FinanceTransactions'));
const SubscriberFinance = lazy(() => import('./components/SubscriberFinance'));
const DisbursementDetails = lazy(() => import('./components/DisbursementDetails'));
const SubscriberInvoice = lazy(() => import('./components/SubscriberInvoice'));
const MonthlyLNPInvoice = lazy(() => import('./components/MonthlyLNPInvoice'));
const OnlineTransactionHistory = lazy(() => import('./components/OnlineTransactionHistory'));
const SubscriberOnlineRecharge = lazy(() => import('./components/SubscriberOnlineRecharge'));
const OnlineTopUp = lazy(() => import('./components/OnlineTopUp'));
const OnlineTopUpSuccess = lazy(() => import('../../common/components/WalletTopUpSuccessPage'));
const OnlineTopUpFailure = lazy(() => import('../../common/components/WalletTopUpFailurePage'));
const SubscriberWalletTopUpSuccess = lazy(() => import('../../common/components/SubscriberWalletTopUpSuccessPage'));
const SubscriberWalletTopUpFailure = lazy(() => import('../../common/components/SubscriberWalletTopUpFailurePage'));

const myAccounts = createRoute({
  path: 'finance',
  getParentRoute: () => appRoute
});

const accountTopupReceiptDetailsRoute = createRoute({
  path: 'account-topup-receipt-details',
  getParentRoute: () => myAccounts,
  component: AccountTopupReceiptDetails
});

const subscriberAdvancedTopupVoucherRoute = createRoute({
  path: 'subscriber-advanced-topup-voucher',
  getParentRoute: () => myAccounts,
  component: SubscriberAdvancedTopupVoucher
});

const transferredToSubscriberRoute = createRoute({
  path: 'transferred-to-subscriber',
  getParentRoute: () => myAccounts,
  component: TransferredToSubscriber
});

const revenueRoute = createRoute({
  path: 'revenue',
  getParentRoute: () => myAccounts,
  component: Revenue
});

const gstWalletRoute = createRoute({
  path: 'gst-wallet',
  getParentRoute: () => myAccounts,
  component: GSTWallet
});

const financeTransactionsRoute = createRoute({
  path: 'finance-transactions',
  getParentRoute: () => myAccounts,
  component: FinanceTransactions
});

const subscriberFinanceRoute = createRoute({
  path: 'subscriber-finance',
  getParentRoute: () => myAccounts,
  component: SubscriberFinance
});

const disbursementDetailsRoute = createRoute({
  path: 'disbursement-details',
  getParentRoute: () => myAccounts,
  component: DisbursementDetails
});

const subscriberInvoiceRoute = createRoute({
  path: 'subscriber-invoice',
  getParentRoute: () => myAccounts,
  component: SubscriberInvoice
});

const monthlyLNPInvoiceRoute = createRoute({
  path: 'monthly-lnp-invoice',
  getParentRoute: () => myAccounts,
  component: MonthlyLNPInvoice
});

const onlineTransactionHistoryRoute = createRoute({
  path: 'online-transaction-history',
  getParentRoute: () => myAccounts,
  component: OnlineTransactionHistory
});

const subscriberOnlineRechargeRoute = createRoute({
  path: 'subscriber-online-recharge',
  getParentRoute: () => myAccounts,
  component: SubscriberOnlineRecharge
});

const onlineTopUpRoute = createRoute({
  path: 'online-top-up',
  getParentRoute: () => myAccounts,
  component: Outlet
});

const onlineTopUpIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => onlineTopUpRoute,
  component: OnlineTopUp
});

const topUpSuccessRoute = createRoute({
  path: 'top-up-success',
  getParentRoute: () => onlineTopUpRoute,
  component: OnlineTopUpSuccess
});

const topUpFailureRoute = createRoute({
  path: 'top-up-failure',
  getParentRoute: () => onlineTopUpRoute,
  component: OnlineTopUpFailure
});

const subscriberTopUpSuccessRoute = createRoute({
  path: 'subscriber-top-up-success',
  getParentRoute: () => onlineTopUpRoute,
  component: SubscriberWalletTopUpSuccess
});

const subscriberTopUpFailureRoute = createRoute({
  path: 'subscriber-top-up-failure',
  getParentRoute: () => onlineTopUpRoute,
  component: SubscriberWalletTopUpFailure
});

export const myFinanceAccountsRoutes = [
  myAccounts,
  accountTopupReceiptDetailsRoute,
  subscriberAdvancedTopupVoucherRoute,
  transferredToSubscriberRoute,
  revenueRoute,
  gstWalletRoute,
  financeTransactionsRoute,
  subscriberFinanceRoute,
  disbursementDetailsRoute,
  subscriberInvoiceRoute,
  monthlyLNPInvoiceRoute,
  onlineTransactionHistoryRoute,
  subscriberOnlineRechargeRoute,
  onlineTopUpRoute,
  onlineTopUpIndexRoute,
  topUpSuccessRoute,
  topUpFailureRoute,
  subscriberTopUpSuccessRoute,
  subscriberTopUpFailureRoute
];
