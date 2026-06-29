import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../../appRoute';

const PartnerRequestList = lazy(() => import('./components/PartnerRequestList'));

const partnerReportsRoute = createRoute({
  path: 'reports/partner-requests',
  getParentRoute: () => appRoute,
  component: PartnerRequestList
});

export const partnerRequestsRoutes = [partnerReportsRoute];
