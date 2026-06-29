import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../../appRoute';

const EnquiryReportList = lazy(() => import('./components/EnquiryReportList'));

const enquiryReportsRoute = createRoute({
  path: 'reports/enquiry-reports',
  getParentRoute: () => appRoute,
  component: EnquiryReportList
});

export const enquiryReportsRoutes = [enquiryReportsRoute];
