import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../../appRoute';

const OnboardedSubscribersReportList = lazy(() => import('./components/OnboardedSubscribersReportList'));

const onboardedSubscribersReportsRoute = createRoute({
  path: 'reports/onboarded-subscribers-reports',
  getParentRoute: () => appRoute,
  component: OnboardedSubscribersReportList
});

export const onboardedSubscribersReportsRoutes = [onboardedSubscribersReportsRoute];
