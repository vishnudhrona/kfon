import { createRoute } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../appRoute';

const DeviceList = lazy(() => import('./inventory/component/DeviceList'));
const PartnerDeviceList = lazy(() => import('./inventory/component/PartnerDeviceList'));
const ClosedKyc = lazy(() => import('./subscriberApplication/component/ClosedKyc'));
const PendingAction = lazy(() => import('./subscriberApplication/component/PendingAction'));
const PendingActionPreview = lazy(() => import('./subscriberApplication/component/PendingActionPreview'));
const RejectedKyc = lazy(() => import('./subscriberApplication/component/RejectedKyc'));
const SubmitKyc = lazy(() => import('./subscriberApplication/component/SubmitKyc'));
const CorpEnqLocationList = lazy(() => import('./corporate/components/CorpEnqLocationList'));
const Subscribers = lazy(() => import('./corporate/components/Subscribers'));
const Location = lazy(() => import('./corporate/components/Location'));
const SubscribersDetails = lazy(() => import('./corporate/components/SubscribersDetails'));
const LocationDetails = lazy(() => import('./corporate/components/LocationDetails'));
const RetailSubscribersList = lazy(() => import('./mySubscribers/retailSubscribers/components/RetailSubscribersList'));
const RetailSubscriberDetails = lazy(
  () => import('./mySubscribers/retailSubscribers/components/RetailSubscriberDetails')
);
const StaticIpRenewal = lazy(() => import('./mySubscribers/retailSubscribers/components/StaticIpRenewal'));
const OnlineSubscribers = lazy(() => import('./mySubscribers/retailSubscribers/components/OnlineSubscribers'));

const pendingActionRoute = createRoute({
  path: 'pendingaction',
  getParentRoute: () => appRoute,
  component: PendingAction
});

const rejectedKycRoute = createRoute({
  path: 'rejectedkyc',
  getParentRoute: () => appRoute,
  component: RejectedKyc
});

const submitKycRoute = createRoute({
  path: 'submitkyc',
  getParentRoute: () => appRoute,
  component: SubmitKyc
});

const closedKyc = createRoute({
  path: 'closedkyc',
  getParentRoute: () => appRoute,
  component: ClosedKyc
});

const tablePreview = createRoute({
  path: 'tablepreview',
  getParentRoute: () => appRoute,
  component: PendingActionPreview
});

const deviceList = createRoute({
  path: '/inventory/devicelist',
  getParentRoute: () => appRoute,
  component: DeviceList
});

const partnerDeviceList = createRoute({
  path: '/inventory/partnerdevicelist',
  getParentRoute: () => appRoute,
  component: PartnerDeviceList
});

const corpEnqLocationList = createRoute({
  path: 'my-subscribers/corporate-subscribers/corporate-enquiries-location-list',
  getParentRoute: () => appRoute,
  component: CorpEnqLocationList
});

const location = createRoute({
  path: 'my-subscribers/corporate-subscribers/location',
  getParentRoute: () => appRoute,
  component: Location
});

const locationDetails = createRoute({
  path: 'my-subscribers/corporate-subscribers/location/$locationId',
  getParentRoute: () => appRoute,
  component: LocationDetails
});

const subscribers = createRoute({
  path: 'my-subscribers/corporate-subscribers/subscribers',
  getParentRoute: () => appRoute,
  component: Subscribers
});

const subscribersDetails = createRoute({
  path: 'my-subscribers/corporate-subscribers/subscribers/$subscriberId',
  getParentRoute: () => appRoute,
  component: SubscribersDetails
});

const retailSubscribersList = createRoute({
  path: 'my-subscribers/retail-subscribers/subscribersList',
  getParentRoute: () => appRoute,
  component: RetailSubscribersList
});

const retailSubscribersDetails = createRoute({
  path: 'my-subscribers/retail-subscribers/subscribers/$subscriberId',
  getParentRoute: () => appRoute,
  component: RetailSubscriberDetails
});

const staticIpRenewal = createRoute({
  path: 'my-subscribers/retail-subscribers/staticIpRenewal',
  getParentRoute: () => appRoute,
  component: StaticIpRenewal
});

const onlineSubscribers = createRoute({
  path: 'my-subscribers/retail-subscribers/onlineSubscribers',
  getParentRoute: () => appRoute,
  component: OnlineSubscribers
});

export const lnpRoutes = [
  pendingActionRoute,
  rejectedKycRoute,
  submitKycRoute,
  closedKyc,
  tablePreview,
  deviceList,
  partnerDeviceList,
  corpEnqLocationList,
  location,
  locationDetails,
  subscribers,
  subscribersDetails,
  retailSubscribersList,
  retailSubscribersDetails,
  staticIpRenewal,
  onlineSubscribers
];
