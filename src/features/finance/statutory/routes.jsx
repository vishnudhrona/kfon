import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const RevenueControlReport = lazy(() => import('./components/RevenueControlReport'));
const Gstr2aPartnersReport = lazy(() => import('./components/Gstr2aPartnersReport'));
const Gstr1RetailCorporateReport = lazy(() => import('./components/Gstr1RetailCorporateReport'));
const SubInvoiceB2BRetailsReport = lazy(() => import('./components/SubInvoiceB2BRetailsReport'));
const SubInvoiceB2CRetailsReport = lazy(() => import('./components/SubInvoiceB2CRetailsReport'));
const SubInvoiceB2BCorporateReport = lazy(() => import('./components/SubInvoiceB2BCorporateReport'));
const SubInvoiceB2CCorporateReport = lazy(() => import('./components/SubInvoiceB2CCorporateReport'));
const NldReport = lazy(() => import('./components/NldReport'));
const AgrReport = lazy(() => import('./components/AgrReport'));

const statutoryRootRoute = createRoute({
  path: 'finance/statutory',
  getParentRoute: () => appRoute
});

const revenueControlRoute = createRoute({
  path: 'revenue-control',
  getParentRoute: () => statutoryRootRoute,
  component: RevenueControlReport
});

const gstr2aPartnersRoute = createRoute({
  path: 'gstr2a-partners',
  getParentRoute: () => statutoryRootRoute,
  component: Gstr2aPartnersReport
});

const gstr1RetailCorporateRoute = createRoute({
  path: 'gstr1-retail-corporate',
  getParentRoute: () => statutoryRootRoute,
  component: Gstr1RetailCorporateReport
});

const subInvoiceB2bRoute = createRoute({
  path: 'sub-invoice-b2b',
  getParentRoute: () => statutoryRootRoute,
  component: SubInvoiceB2BRetailsReport
});

const subInvoiceB2cRetailsRoute = createRoute({
  path: 'sub-invoice-b2c-retails',
  getParentRoute: () => statutoryRootRoute,
  component: SubInvoiceB2CRetailsReport
});

const subInvoiceB2bCorporateRoute = createRoute({
  path: 'sub-invoice-b2b-corporate',
  getParentRoute: () => statutoryRootRoute,
  component: SubInvoiceB2BCorporateReport
});

const subInvoiceB2cCorporateRoute = createRoute({
  path: 'sub-invoice-b2c-corporate',
  getParentRoute: () => statutoryRootRoute,
  component: SubInvoiceB2CCorporateReport
});

const nldReportRoute = createRoute({
  path: 'nld-report',
  getParentRoute: () => statutoryRootRoute,
  component: NldReport
});

const agrReportRoute = createRoute({
  path: 'agr-report',
  getParentRoute: () => statutoryRootRoute,
  component: AgrReport
});

export const statutoryRoutes = [
  statutoryRootRoute,
  revenueControlRoute,
  gstr2aPartnersRoute,
  gstr1RetailCorporateRoute,
  subInvoiceB2bRoute,
  subInvoiceB2cRetailsRoute,
  subInvoiceB2bCorporateRoute,
  subInvoiceB2cCorporateRoute,
  nldReportRoute,
  agrReportRoute
];
