import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';

import { appRoute } from '../appRoute';
import PartnerPreviewList from './pages/PartnerPreviewList';

const Onboarding = lazy(() => import('./pages/Onboarding'));
const PartnerList = lazy(() => import('./pages/PartnerList'));
const PartnerNew = lazy(() => import('./pages/PartnerNew'));
const VlanAssociation = lazy(() => import('./pages/VlanAssociation'));
const VlanRequest = lazy(() => import('./pages/VlanRequest'));

const partnersRoute = createRoute({
  path: 'partners',
  getParentRoute: () => appRoute,
  component: () => <Outlet />
});

const partnersIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => partnersRoute,
  beforeLoad: () => {
    throw redirect({ to: '/app/partners/enquiry-list' });
  }
});

const partnersEnquiryListRoute = createRoute({
  path: 'enquiry-list',
  getParentRoute: () => partnersRoute,
  component: Outlet,
  context: () => ({ menuKey: MENU_KEYS.PARTNERS_ENQUIRY_LIST })
});

const partnersEnquiryListIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => partnersEnquiryListRoute,
  validateSearch: (search) => ({ type: search.type === 'AGNP' ? 'AGNP' : 'LNP' }),
  component: () => <PartnerList />
});

const partnersListRoute = createRoute({
  path: 'list',
  getParentRoute: () => partnersRoute,
  component: Outlet,
  context: () => ({ menuKey: MENU_KEYS.PARTNERS_LIST })
});

const partnerListIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => partnersListRoute,
  validateSearch: (search) => ({ type: search.type === 'AGNP' ? 'AGNP' : 'LNP' }),
  component: () => <PartnerList />
});

const partnerNewRoute = createRoute({
  path: 'new',
  getParentRoute: () => partnersEnquiryListRoute,
  component: PartnerNew,
  context: () => ({ menuKey: MENU_KEYS.PARTNERS_LIST })
});

const lnpPartnerPreviewRoute = createRoute({
  path: 'lnp/$id',
  getParentRoute: () => partnersListRoute,
  component: PartnerPreviewList,
  context: () => ({ menuKey: MENU_KEYS.PARTNERS_LIST })
});

const agnpPartnerPreviewRoute = createRoute({
  path: 'agnp/$id',
  getParentRoute: () => partnersListRoute,
  component: PartnerPreviewList,
  context: () => ({ menuKey: MENU_KEYS.PARTNERS_LIST })
});

export const onboardingRoute = createRoute({
  path: 'onboarding/$type/$enquiryId',
  getParentRoute: () => partnersEnquiryListRoute,
  component: Onboarding,
  context: ({ params }) => ({
    headerTitle: params.type === 'lnp' ? 'lnpCompanyRegistrationDetails' : 'agnpCompanyRegistrationDetails'
  })
});

const vlanMappingRoute = createRoute({
  path: 'vlan-mapping',
  getParentRoute: () => partnersRoute,
  component: Outlet
});

const vlanAssociationRoute = createRoute({
  path: 'vlan-association',
  getParentRoute: () => vlanMappingRoute,
  component: VlanAssociation
});

const vlanRequestRoute = createRoute({
  path: 'vlan-request',
  getParentRoute: () => vlanMappingRoute,
  component: VlanRequest
});

export const onboardingRoutes = [
  partnersRoute,
  partnersIndexRoute,
  partnersEnquiryListRoute,
  partnersListRoute,
  partnersEnquiryListIndexRoute,
  partnerListIndexRoute,
  partnerNewRoute,
  lnpPartnerPreviewRoute,
  agnpPartnerPreviewRoute,
  onboardingRoute,
  vlanMappingRoute,
  vlanAssociationRoute,
  vlanRequestRoute
];
