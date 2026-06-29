import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../appRoute';
import PartnerPreviewList from './prtnerFinance/component/PartnerPreviewList';

const AgnpDashboard = lazy(() => import('./agnpDashboard/component/Dashboard'));
const Inventory = lazy(() => import('./inventory/component/Inventory'));
const DevicePartner = lazy(() => import('./inventory/component/DevicePartner'));
const Subscription = lazy(() => import('./subscriptiion/component/Subscription'));
const Invoice = lazy(() => import('./invoice/component/Invoice'));
const Approval = lazy(() => import('./invoice/component/Approval'));
const Summary = lazy(() => import('./invoice/component/Summary'));
const Partnerfinance = lazy(() => import('./invoice/component/Partnerfinance'));
const Financetransaction = lazy(() => import('./invoice/component/Financetransaction'));
const Gstwallet = lazy(() => import('./invoice/component/Gstwallet'));
const Lnprevenue = lazy(() => import('./invoice/component/Lnprevenue'));
const Gstdetails = lazy(() => import('./invoice/component/Gstdetails'));
const Ticket = lazy(() => import('./support/component/Ticket'));
const Mandateforms = lazy(() => import('./prtnerFinance/component/Mandateforms'));

const Dashboard = createRoute({
  path: 'agnp-dashboard',
  getParentRoute: () => appRoute,
  component: AgnpDashboard
});

const DeviceDetails = createRoute({
  path: 'device-details',
  getParentRoute: () => appRoute,
  component: Inventory
});

const DevicePartnerRoute = createRoute({
  path: 'device-partner-details',
  getParentRoute: () => appRoute,
  component: DevicePartner
});

const SubscriptionRoute = createRoute({
  path: 'subscription',
  getParentRoute: () => appRoute,
  component: Subscription
});

const InvoiceRoute = createRoute({
  path: 'agnp-finance/invoice',
  getParentRoute: () => appRoute,
  component: Invoice
});

const InvoiceApprovalRoute = createRoute({
  path: 'agnp-finance/invoice-approval',
  getParentRoute: () => appRoute,
  component: Approval
});

const InvoiceSummaryRoute = createRoute({
  path: 'agnp-finance/summary',
  getParentRoute: () => appRoute,
  component: Summary
});

const PartnerRoute = createRoute({
  path: 'agnp-finance/partner-finance',
  getParentRoute: () => appRoute,
  component: Partnerfinance
});

const TransactionRoute = createRoute({
  path: 'agnp-finance/finance-transaction',
  getParentRoute: () => appRoute,
  component: Financetransaction
});

const GstWalletRoute = createRoute({
  path: 'agnp-finance/gst-wallet',
  getParentRoute: () => appRoute,
  component: Gstwallet
});

const LnpRevenueRoute = createRoute({
  path: 'agnp-finance/lnp-revenue',
  getParentRoute: () => appRoute,
  component: Lnprevenue
});

const GstDetailsRoute = createRoute({
  path: 'agnp-finance/gst-details',
  getParentRoute: () => appRoute,
  component: Gstdetails
});

const TicketRoute = createRoute({
  path: 'agnp-support/ticket',
  getParentRoute: () => appRoute,
  component: Ticket
});

const partnerListRoute = createRoute({
  path: 'partner-list/$id',
  getParentRoute: () => appRoute,
  component: PartnerPreviewList
});

const LnpslistRoute = createRoute({
  path: 'lnp-list/$id',
  getParentRoute: () => appRoute,
  component: PartnerPreviewList
});

const AgnpListRoute = createRoute({
  path: 'agnp-list/$id',
  getParentRoute: () => appRoute,
  component: PartnerPreviewList
});

const MandateFormsRoute = createRoute({
  path: 'franchisees/mandateforms',
  getParentRoute: () => appRoute,
  component: Mandateforms
});

export const agnpRoutes = [
  Dashboard,
  DeviceDetails,
  DevicePartnerRoute,
  SubscriptionRoute,
  InvoiceRoute,
  InvoiceApprovalRoute,
  InvoiceSummaryRoute,
  PartnerRoute,
  TransactionRoute,
  GstWalletRoute,
  LnpRevenueRoute,
  GstDetailsRoute,
  TicketRoute,
  partnerListRoute,
  LnpslistRoute,
  MandateFormsRoute,
  AgnpListRoute
];
