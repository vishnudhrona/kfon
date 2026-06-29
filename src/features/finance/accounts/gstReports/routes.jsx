import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '@/features/appRoute';

const GSTR2ARefundReport = lazy(() => import('./components/GSTR2ARefundReport'));
const GSTR1Report = lazy(() => import('./components/GSTR1Report'));
const B2BInvoicesReport = lazy(() => import('./components/B2BInvoicesReport'));

const gstReports = createRoute({
  path: 'finance/accounts/gst-reports',
  getParentRoute: () => appRoute
});

const gstr2aRefundRoute = createRoute({
  path: 'gstr2a',
  getParentRoute: () => gstReports,
  component: GSTR2ARefundReport
});

const gstr1Route = createRoute({
  path: 'gstr1',
  getParentRoute: () => gstReports,
  component: GSTR1Report
});

const b2bInvoicesRoute = createRoute({
  path: 'b2b',
  getParentRoute: () => gstReports,
  component: B2BInvoicesReport
});

export const gstReportsRoutes = [gstReports, gstr2aRefundRoute, gstr1Route, b2bInvoicesRoute];
