import { routes as publicRoutes } from '@/features/public/routes';

import { agnpRoutes } from './agnp/routes';
import { appDashboardRoute, appNotFoundRoute, appRoute, forceResetPasswordRoute } from './appRoute';
import { corporateRoutes } from './corporate/routes';
import { crmRoutes } from './crm/routes';
import { darkfiberRoutes } from './darkFiber/routes';
import { dashboardRoutes } from './dashboard/routes';
import { financeRoutes } from './finance/routes';
import { inventoryRoutes } from './inventory/routes';
import { lnpRoutes } from './lnp/routes';
import { onboardingRoutes } from './onboarding/routes';
import { packagePlansRoutes } from './packagePlans/routes';
import { enquiryReportsRoutes } from './reports/enquiryReports/routes';
import { onboardedSubscribersReportsRoutes } from './reports/onboardedSubscribersReports/routes';
import { partnerRequestsRoutes } from './reports/partnerReports/routes';
import { subscriberRoutes } from './subscriber/routes.jsx';
import { ticketRoutes } from './ticket/routes';
import { userRoleRoutes } from './user-role/routes';

export const routes = [
  ...publicRoutes,
  appRoute,
  appDashboardRoute,
  forceResetPasswordRoute,
  ...inventoryRoutes,
  ...packagePlansRoutes,
  ...financeRoutes,
  ...lnpRoutes,
  ...onboardingRoutes,
  ...userRoleRoutes,
  ...dashboardRoutes,
  ...corporateRoutes,
  ...subscriberRoutes,
  ...agnpRoutes,
  ...ticketRoutes,
  ...darkfiberRoutes,
  ...crmRoutes,
  ...enquiryReportsRoutes,
  ...partnerRequestsRoutes,
  ...onboardedSubscribersReportsRoutes,
  appNotFoundRoute
];
