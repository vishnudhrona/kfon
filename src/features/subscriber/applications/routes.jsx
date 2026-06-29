import { createRoute, Outlet } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';
import { appRoute } from '@/features/appRoute';

import { subscriberRoute } from '../routes.jsx';
import { fetchEnquiryList } from './actions';
import { HomeConnectionPage, SmeConnectionPage } from './pages/ConnectionPages';
import { getEnquiryList } from './selectors';

const EnquiryList = lazy(() => import('./pages/EnquiryList'));
const SubscribersList = lazy(() => import('./pages/SubscribersList'));
const SubscriberDetails = lazy(() => import('./pages/SubscriberDetails'));
const ViewDataUsage = lazy(() => import('./pages/ViewDataUsage'));
const RadiusDetails = lazy(() => import('./pages/RadiusDetails'));
const EwsEnquiryPage = lazy(() => import('./pages/EwsEnquiryPage'));
const EwsConnection = lazy(() => import('./pages/EwsConnection'));
const EkycHomeConnection = lazy(() => import('./pages/EkycHomeConnection'));
const EkycSmeConnection = lazy(() => import('./pages/EkycSmeConnection'));
const VerifyApplication = lazy(() => import('./pages/VerifyApplication'));
const ViewApplication = lazy(() => import('./pages/ViewApplication'));

const enquiryListRoute = createRoute({
  path: 'enquiry-list',
  getParentRoute: () => subscriberRoute,
  component: () => <Outlet />,
  context: () => ({ menuKey: MENU_KEYS.SUBSCRIBER_ENQUIRY_LIST })
});

const enquiryListIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => enquiryListRoute,
  component: EnquiryList
});

const homeConnectionRoute = createRoute({
  path: 'home-connection',
  getParentRoute: () => subscriberRoute,
  component: HomeConnectionPage,
  context: () => ({ headerTitle: 'homeConnection' })
});

const smeConnectionRoute = createRoute({
  path: 'sme-connection',
  getParentRoute: () => subscriberRoute,
  component: SmeConnectionPage,
  context: () => ({ headerTitle: 'smeConnection' })
});

const ekycHomeConnection = createRoute({
  path: 'ekyc-home-connection',
  getParentRoute: () => subscriberRoute,
  component: EkycHomeConnection,
  context: () => ({ headerTitle: 'homeConnection' })
});

const ekycSmeConnection = createRoute({
  path: 'ekyc-sme-connection',
  getParentRoute: () => subscriberRoute,
  component: EkycSmeConnection,
  context: () => ({ headerTitle: 'smeConnection' })
});

const ekycEwsConnection = createRoute({
  path: 'ekyc-ews-connection',
  getParentRoute: () => subscriberRoute,
  component: EwsConnection,
  context: () => ({ headerTitle: 'ewsConnectionTitle' })
});

const verifySubscriberRoute = createRoute({
  path: 'verify-subscriber',
  getParentRoute: () => subscriberRoute,
  component: VerifyApplication
});

const viewSubscriberRoute = createRoute({
  path: 'view-subscriber',
  getParentRoute: () => subscriberRoute,
  component: ViewApplication,
  context: () => ({ menuKey: MENU_KEYS.SUBSCRIBER_ENQUIRY_LIST })
});

const ewsEnquiryRoute = createRoute({
  path: 'ews-enquiry',
  getParentRoute: () => subscriberRoute,
  component: EwsEnquiryPage
});

const kycPendingActionRoute = createRoute({
  path: 'applications/kyc/pending-action',
  getParentRoute: () => appRoute,
  component: EnquiryList,
  context: () => ({ overrideFetchAction: fetchEnquiryList, overrideDataSelector: getEnquiryList })
});

const subscribersListRoute = createRoute({
  path: 'subscribers-list',
  getParentRoute: () => subscriberRoute,
  component: () => <Outlet />
});

const subscribersListIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => subscribersListRoute,
  component: SubscribersList
});

const subscriberDetailsRoute = createRoute({
  path: 'subscriber-details/$subscriberId',
  getParentRoute: () => subscribersListRoute,
  component: SubscriberDetails
});

const subscriberDataUsageRoute = createRoute({
  path: 'subscriber-data-usage/$subscriberId',
  getParentRoute: () => subscribersListRoute,
  component: ViewDataUsage
});

const subscriberRadiusDetailsRoute = createRoute({
  path: 'subscriber-radius-details/$username',
  getParentRoute: () => subscribersListRoute,
  component: RadiusDetails
});

export const applicationRoutes = [
  enquiryListRoute,
  enquiryListIndexRoute,
  homeConnectionRoute,
  smeConnectionRoute,
  ekycHomeConnection,
  ekycSmeConnection,
  ekycEwsConnection,
  verifySubscriberRoute,
  kycPendingActionRoute,
  subscribersListRoute,
  subscribersListIndexRoute,
  viewSubscriberRoute,
  ewsEnquiryRoute,
  subscriberDetailsRoute,
  subscriberDataUsageRoute,
  subscriberRadiusDetailsRoute
];
