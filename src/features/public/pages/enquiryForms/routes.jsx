import { createRoute, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { STORAGE_KEYS } from '@/constants';
import { rootRoute } from '@/routes/rootRoute';
import { getDataFromStorage } from '@/utils/encryptionUtils';
import { isTokenExpired } from '@/utils/jwtUtils';

const EnqLayout = lazy(() => import('@/layout/EnquiryLayout'));
const EnquiryIndex = lazy(() => import('./components/EnquiryIndex'));
const CorporateGovernmentEnquiry = lazy(() => import('./components/CorporateGovernmentEnquiry'));
const AGNPEnquiry = lazy(() => import('./components/AGNPEnquiry'));
const LNPEnquiry = lazy(() => import('./components/LNPEnquiry'));
const PartnerEnquiry = lazy(() => import('./components/PartnerEnquiry'));
const DarkFibreEnquiry = lazy(() => import('./components/DarkFibreEnquiry'));
const BPLEnquiry = lazy(() => import('./components/BPLEnquiry'));
const HomeEnquiry = lazy(() => import('./components/HomeEnquiry'));
const ComplaintRegistration = lazy(() => import('./components/ComplaintRegistration'));

const enqRoute = createRoute({
  path: 'enquiry',
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
    if (token && !isTokenExpired(token)) {
      throw redirect({ to: '/app' });
    }
  },
  component: EnqLayout
});

const enquiryHome = createRoute({
  path: '/',
  getParentRoute: () => enqRoute,
  beforeLoad: () => {
    throw redirect({ to: 'home' });
  }
});

const enquiryRoute = createRoute({
  path: '/$type',
  getParentRoute: () => enqRoute,
  component: EnquiryIndex
});

const corporateRoute = createRoute({
  path: '/corporate',
  getParentRoute: () => enqRoute,
  component: CorporateGovernmentEnquiry
});

const agnpRoute = createRoute({
  path: '/agnp',
  getParentRoute: () => enqRoute,
  component: AGNPEnquiry
});

const lnpRoute = createRoute({
  path: '/lnp',
  getParentRoute: () => enqRoute,
  component: LNPEnquiry
});

const partnerRoute = createRoute({
  path: '/partner',
  getParentRoute: () => enqRoute,
  component: PartnerEnquiry
});

const darkFibreRoute = createRoute({
  path: '/dark-fibre',
  getParentRoute: () => enqRoute,
  component: DarkFibreEnquiry
});

const bplRoute = createRoute({
  path: '/bpl',
  getParentRoute: () => enqRoute,
  component: BPLEnquiry
});

const homeRoute = createRoute({
  path: '/home',
  getParentRoute: () => enqRoute,
  component: HomeEnquiry
});

const complaintRoute = createRoute({
  path: '/complaint',
  getParentRoute: () => enqRoute,
  component: ComplaintRegistration
});

export const enquiryRoutes = [
  enqRoute,
  enquiryRoute,
  enquiryHome,
  agnpRoute,
  lnpRoute,
  partnerRoute,
  darkFibreRoute,
  bplRoute,
  corporateRoute,
  homeRoute,
  complaintRoute
];
