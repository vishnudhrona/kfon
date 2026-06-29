import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const LNPRetailInvoice = lazy(() => import('./components/LNPRetailInvoice'));

const MSPBuOeInvoice = lazy(() => import('./components/MSPBuOeInvoice'));

const AGNPRetailInvoice = lazy(() => import('./components/AGNPRetailInvoice'));

const LNPCorporateInvoice = lazy(() => import('./components/LNPCorporateInvoice'));

const AGNPCorporateInvoice = lazy(() => import('./components/AGNPCorporateInvoice'));

const SubscriberInvoiceReports = lazy(() => import('./components/SubscriberInvoiceReports'));

const ONTPurchase = lazy(() => import('./components/ONTPurchase'));

const SubscriberBPLInvoice = lazy(() => import('./components/SubscriberBPLInvoice'));

const EOSubscriberInvoice = lazy(() => import('./components/EOSubscriberInvoice'));

const LNPCorporateOTCInvoice = lazy(() => import('./components/LNPCorporateOTCInvoice'));

const MSPCorporateInvoice = lazy(() => import('./components/MSPCorporateInvoice'));

const OTTProviderInvoice = lazy(() => import('./components/OTTProviderInvoice'));

const invoiceDetails = createRoute({
  path: 'finance/invoices',
  getParentRoute: () => appRoute
});

const lnpRetailInvoice = createRoute({
  path: 'lnp-retail-invoice',
  getParentRoute: () => invoiceDetails,
  component: LNPRetailInvoice
});

const mspRetailBUOInvoice = createRoute({
  path: 'msp-buo-invoice',
  getParentRoute: () => invoiceDetails,
  component: MSPBuOeInvoice
});

const agnpRetailInvoice = createRoute({
  path: 'topup-receipt',
  getParentRoute: () => invoiceDetails,
  component: AGNPRetailInvoice
});

const lnpCorporateInvoice = createRoute({
  path: 'lnp-corporate-invoice',
  getParentRoute: () => invoiceDetails,
  component: LNPCorporateInvoice
});

const agnpCorporateInvoice = createRoute({
  path: 'agnp-corporate-invoice',
  getParentRoute: () => invoiceDetails,
  component: AGNPCorporateInvoice
});

const subscriberInvoiceReports = createRoute({
  path: 'subscriber-invoice',
  getParentRoute: () => invoiceDetails,
  component: SubscriberInvoiceReports
});

const ontPurchase = createRoute({
  path: 'ont-purchase',
  getParentRoute: () => invoiceDetails,
  component: ONTPurchase
});

const subscriberBPLInvoice = createRoute({
  path: 'subscriber-bpl-invoice',
  getParentRoute: () => invoiceDetails,
  component: SubscriberBPLInvoice
});

const subscriberEOInvoice = createRoute({
  path: 'subscriber-eo-invoice',
  getParentRoute: () => invoiceDetails,
  component: EOSubscriberInvoice
});

const lnpCorporateOTCInvoice = createRoute({
  path: 'lnp-corporate-otc-invoice',
  getParentRoute: () => invoiceDetails,
  component: LNPCorporateOTCInvoice
});

const mspCorporateInvoice = createRoute({
  path: 'msp-corporate-invoice',
  getParentRoute: () => invoiceDetails,
  component: MSPCorporateInvoice
});

const ottProviderInvoice = createRoute({
  path: 'ott-provider-invoice',
  getParentRoute: () => invoiceDetails,
  component: OTTProviderInvoice
});

export const invoiceDetailsRoutes = [
  invoiceDetails,
  lnpRetailInvoice,
  mspRetailBUOInvoice,
  agnpRetailInvoice,
  lnpCorporateInvoice,
  agnpCorporateInvoice,
  subscriberInvoiceReports,
  ontPurchase,
  subscriberBPLInvoice,
  subscriberEOInvoice,
  lnpCorporateOTCInvoice,
  mspCorporateInvoice,
  ottProviderInvoice
];
