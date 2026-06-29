import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const FranchiseeCorporateInvoices = lazy(() => import('./components/FranchiseeCorporateInvoices'));
const OTCApproval = lazy(() => import('./components/OTCApproval'));
const SubscriberDetails = lazy(() => import('./components/SubscriberDetails'));
const LNPPartnerFinance = lazy(() => import('./components/LNPPartnerFinance'));
const Disbursement = lazy(() => import('./components/Disbursement'));
const LNPSummaryLocation = lazy(() => import('./components/LNPSummaryLocation'));
const LNPCreditNotes = lazy(() => import('./components/LNPCreditNotes'));
const LNPCumulativeSummary = lazy(() => import('./components/LNPCumulativeSummary'));

const myFinance = createRoute({
  path: 'myfinance',
  getParentRoute: () => appRoute
});

const franchiseeCorporateInvoicesRoute = createRoute({
  path: 'franchisee-corporate-invoices',
  getParentRoute: () => myFinance,
  component: FranchiseeCorporateInvoices
});

const otcApprovalRoute = createRoute({
  path: 'otc-approval',
  getParentRoute: () => myFinance,
  component: OTCApproval
});

const subscriberDetailsRoute = createRoute({
  path: 'subscriber-details',
  getParentRoute: () => myFinance,
  component: SubscriberDetails
});

const lnpPartnerFinanceRoute = createRoute({
  path: 'lnp-partner-finance',
  getParentRoute: () => myFinance,
  component: LNPPartnerFinance
});

const disbursementRoute = createRoute({
  path: 'disbursement',
  getParentRoute: () => myFinance,
  component: Disbursement
});

const lnpSummaryLocationRoute = createRoute({
  path: 'lnp-summary-location',
  getParentRoute: () => myFinance,
  component: LNPSummaryLocation
});

const lnpCreditNotesRoute = createRoute({
  path: 'lnp-credit-notes',
  getParentRoute: () => myFinance,
  component: LNPCreditNotes
});

const lnpCumulativeSummaryRoute = createRoute({
  path: 'lnp-cumulative-summary',
  getParentRoute: () => myFinance,
  component: LNPCumulativeSummary
});

export const myFinanceCorporateRoutes = [
  myFinance,
  franchiseeCorporateInvoicesRoute,
  otcApprovalRoute,
  subscriberDetailsRoute,
  lnpPartnerFinanceRoute,
  disbursementRoute,
  lnpSummaryLocationRoute,
  lnpCreditNotesRoute,
  lnpCumulativeSummaryRoute
];
