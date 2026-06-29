import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const LNPSummaryDetails = lazy(() => import('./components/LNPSummaryDetails'));
const LNPSummaryCorporate = lazy(() => import('./components/LNPSummaryCorporate'));
const GSTINStatusLNP = lazy(() => import('./components/GSTINStatusLNP'));
const SubscriberSummaryDetails = lazy(() => import('./components/SubscriberSummaryDetails'));
const LNPSpecialIncentive = lazy(() => import('./components/LNPSpecialIncentive'));
const AGNPSummary = lazy(() => import('./components/AGNPSummary'));
const InvoiceWiseAgeingReport = lazy(() => import('./components/InvoiceWiseAgeingReport'));
const InvoicePaymentReport = lazy(() => import('./components/InvoicePaymentReport'));
const RetentionIncentiveReport = lazy(() => import('./components/RetentionIncentiveReport'));
const CorporateCustomerPayment = lazy(() => import('./components/CorporateCustomerPayment'));
const CorporateInvoicePayment = lazy(() => import('./components/CorporateInvoicePayment'));

const reportsRoute = createRoute({
  path: 'finance/invoices/reports',
  getParentRoute: () => appRoute
});

const lnpSummaryDetails = createRoute({
  path: 'lnp-summary-details',
  getParentRoute: () => reportsRoute,
  component: LNPSummaryDetails
});

const lnpSummaryCorporate = createRoute({
  path: 'lnp-summary-corporate',
  getParentRoute: () => reportsRoute,
  component: LNPSummaryCorporate
});

const gstinStatusLnp = createRoute({
  path: 'gstin-status-lnp',
  getParentRoute: () => reportsRoute,
  component: GSTINStatusLNP
});

const subscriberSummaryDetails = createRoute({
  path: 'subscriber-summary-details',
  getParentRoute: () => reportsRoute,
  component: SubscriberSummaryDetails
});

const lnpSpecialIncentive = createRoute({
  path: 'lnp-special-incentive',
  getParentRoute: () => reportsRoute,
  component: LNPSpecialIncentive
});

const agnpSummary = createRoute({
  path: 'agnp-summary',
  getParentRoute: () => reportsRoute,
  component: AGNPSummary
});

const invoiceWiseAgeingReport = createRoute({
  path: 'invoice-wise-ageing-report',
  getParentRoute: () => reportsRoute,
  component: InvoiceWiseAgeingReport
});

const invoicePaymentReport = createRoute({
  path: 'invoice-payment-report',
  getParentRoute: () => reportsRoute,
  component: InvoicePaymentReport
});

const retentionIncentiveReport = createRoute({
  path: 'retention-incentive-report',
  getParentRoute: () => reportsRoute,
  component: RetentionIncentiveReport
});

const corporateCustomerPayment = createRoute({
  path: 'corporate-customer-payment',
  getParentRoute: () => reportsRoute,
  component: CorporateCustomerPayment
});

const corporateInvoicePayment = createRoute({
  path: 'corporate-invoice-payment',
  getParentRoute: () => reportsRoute,
  component: CorporateInvoicePayment
});

export const invoiceReportsRoutes = [
  reportsRoute,
  lnpSummaryDetails,
  lnpSummaryCorporate,
  gstinStatusLnp,
  subscriberSummaryDetails,
  lnpSpecialIncentive,
  agnpSummary,
  invoiceWiseAgeingReport,
  invoicePaymentReport,
  retentionIncentiveReport,
  corporateCustomerPayment,
  corporateInvoicePayment
];
