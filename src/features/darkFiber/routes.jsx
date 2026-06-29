import { createRoute, Outlet, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { appRoute } from '../appRoute';

const DarkEnquiryList = lazy(() => import('./components/EnquiryList'));
const PurchaseOrder = lazy(() => import('./components/PurchaseOrder'));
const CustomersList = lazy(() => import('./components/CustomersList'));
const CreateProposal = lazy(() => import('./components/CreateProposal'));
const ProposalList = lazy(() => import('./components/ProposalList'));

const DarkFiberDetails = lazy(() => import('./components/DarkFiberDetails'));
const CompanyProfile = lazy(() => import('./components/CompanyProfile'));

const darkfiberRoute = createRoute({
  path: 'darkfiber',
  getParentRoute: () => appRoute,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/app/darkfiber' || location.pathname === '/app/darkfiber/') {
      throw redirect({ to: '/app/darkfiber/enquiry-list' });
    }
  }
});

const enquiryListRoute = createRoute({
  path: 'enquiry-list',
  getParentRoute: () => darkfiberRoute,
  component: Outlet
});

const enquiryListIndexRoute = createRoute({
  path: '/',
  getParentRoute: () => enquiryListRoute,
  component: DarkEnquiryList
});

const enquiryDetailsRoute = createRoute({
  path: 'enquiry-details/$enquiryId',
  getParentRoute: () => enquiryListRoute,
  component: DarkFiberDetails
});

const purchaseOrderRoute = createRoute({
  path: 'purchase-order-list',
  getParentRoute: () => darkfiberRoute,
  component: PurchaseOrder
});

const customerListRoute = createRoute({
  path: 'customer-list',
  getParentRoute: () => darkfiberRoute,
  component: CustomersList
});

const createProposalRoute = createRoute({
  path: 'create-proposal',
  getParentRoute: () => enquiryListRoute,
  component: CreateProposal
});

const proposalListRoute = createRoute({
  path: 'proposal-list',
  getParentRoute: () => enquiryListRoute,
  component: ProposalList
});

const companyProfileRoute = createRoute({
  path: 'company-profile/$enquiryId',
  getParentRoute: () => enquiryListRoute,
  component: CompanyProfile
});

export const darkfiberRoutes = [
  darkfiberRoute,
  enquiryListRoute,
  enquiryListIndexRoute,
  enquiryDetailsRoute,
  purchaseOrderRoute,
  customerListRoute,
  createProposalRoute,
  proposalListRoute,
  companyProfileRoute
];
