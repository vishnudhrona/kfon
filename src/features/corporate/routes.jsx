import { createRoute, redirect } from '@tanstack/react-router';
import { lazy } from 'react';

import { MENU_KEYS } from '@/constants/permissions';

import { appRoute } from '../appRoute';

const CorpEnqLocationList = lazy(() => import('@/features/corporate/components/CorpEnqLocationList'));
const CorporateEnquiryList = lazy(() => import('@/features/corporate/components/CorporateEnquiryList'));
const CorporateCustomer = lazy(() => import('@/features/corporate/components/CorporateCustomer'));
const CreateCorporateCustomer = lazy(() => import('@/features/corporate/components/CreateCorporateCustomer'));
const CreateCorporateEnquiry = lazy(() => import('@/features/corporate/components/CreateCorporateEnquiry'));
const EditCorporateEnquiry = lazy(() =>
  import('@/features/corporate/components/CreateCorporateEnquiry').then((m) => ({ default: m.EditCorporateEnquiryForm }))
);
const CustomerDetails = lazy(() => import('@/features/corporate/components/CustomerDetails'));
const CorpEnqCustomerDetails = lazy(() => import('@/features/corporate/components/CorpEnqCustomerDetails'));
const RevisedProposalList = lazy(() => import('@/features/corporate/components/RevisedProposalList'));
const ProposalDetails = lazy(() => import('@/features/corporate/components/ProposalDetails'));
const CreateCorporateProposal = lazy(() => import('@/features/corporate/components/CreateCorporateProposal'));
const CreatePurchaseOrder = lazy(() => import('@/features/corporate/components/CreatePurchaseOrder'));
const CorporateEnquiryDetailedView = lazy(() => import('@/features/corporate/components/CorporateEnquiryDetailedView'));
const CorporateEnquiryCardList = lazy(() => import('@/features/corporate/components/CorporateEnquiryCardList'));
const ProposalCardList = lazy(() => import('@/features/corporate/components/ProposalCardList'));
const CorporateEnquiryLocationsList = lazy(() => import('@/features/corporate/components/CorporateEnquiryLocationsList'));
const CorporateCircuitProvisioning = lazy(() => import('@/features/corporate/components/CorporateCircuitProvisioning'));
const CorporateServiceProvisioning = lazy(() => import('@/features/corporate/components/CorporateServiceProvisioning'));
const CorporatePurchaseOrderWiseLocationsList = lazy(() => import('@/features/corporate/components/CorporatePurchaseOrderWiseLocationsList'));
const CorporateProposalSummaryList = lazy(() => import('@/features/corporate/components/CorporateProposalSummaryList'));
const CorporateProposalTableView = lazy(() => import('@/features/corporate/components/CorporateProposalTableView'));
const CorporatePurchaseOrderSummaryList = lazy(() => import('@/features/corporate/components/CorporatePurchaseOrderSummaryList'));
const CorporatePurchaseOrderTableView = lazy(() => import('@/features/corporate/components/CorporatePurchaseOrderTableView'));
const CorporateCircuitProvisioningSummaryList = lazy(() => import('@/features/corporate/components/CorporateCircuitProvisioningSummaryList'));
const CorporateServiceProvisioningSummaryList = lazy(() => import('@/features/corporate/components/CorporateServiceProvisioningSummaryList'));
const CorporateCustomerListView = lazy(() => import('@/features/corporate/components/CorporateCustomerListView'));

export const corporateRoot = createRoute({
  path: 'corporate',
  getParentRoute: () => appRoute
});

// export const corporateDashboard = createRoute({
//   path: 'dashboard',
//   getParentRoute: () => corporateRoot,
//   component: CorporateEnquiryList
// });

export const corporateEnquiryListRoute = createRoute({
  path: 'enquiry-list',
  getParentRoute: () => corporateRoot,
  component: CorporateEnquiryList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const corporateCustomerRoute = createRoute({
  path: 'customers',
  getParentRoute: () => corporateRoot,
  component: CorporateCustomer
});

export const corporateCustomerListRoute = createRoute({
  path: 'customer-list',
  getParentRoute: () => corporateRoot,
  component: CorporateCustomerListView
});

export const createCorporateCustomerRoute = createRoute({
  path: 'customers/create-customer',
  getParentRoute: () => corporateRoot,
  component: CreateCorporateCustomer,
  validateSearch: (search) => ({
    customerId: search.customerId ?? undefined,
    enquiryId: search.enquiryId ?? undefined
  })
});

export const createCorporateEnquiryRoute = createRoute({
  path: 'create-enquiry',
  getParentRoute: () => corporateRoot,
  component: CreateCorporateEnquiry
});

export const editCorporateEnquiryRoute = createRoute({
  path: 'edit-enquiry/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: EditCorporateEnquiry
});
export const corporateIndex = createRoute({
  path: '/',
  getParentRoute: () => corporateRoot,
  beforeLoad: () => {
    throw redirect({ to: 'dashboard' });
  }
});
export const locationList = createRoute({
  path: 'location',
  getParentRoute: () => corporateRoot,
  component: CorpEnqLocationList
});

export const locationListById = createRoute({
  path: 'location/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorpEnqLocationList
});

export const locationDetails = createRoute({
  path: 'corporate-enquiry-details/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorpEnqCustomerDetails
});

export const corporateCustomerDetailsRoute = createRoute({
  path: 'customers/details/$customerId',
  getParentRoute: () => corporateRoot,
  component: CustomerDetails
});

export const createCorporateProposalRoute = createRoute({
  path: 'proposals/create-proposal',
  getParentRoute: () => corporateRoot,
  component: CreateCorporateProposal,
  validateSearch: (search) => ({
    enquiryId: search.enquiryId ?? '',
    version: search.version ? Number(search.version) : undefined
  }),
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const reviseCorporateProposalRoute = createRoute({
  path: 'proposals/create-proposal/revise',
  getParentRoute: () => corporateRoot,
  component: CreateCorporateProposal,
  validateSearch: (search) => ({
    enquiryId: search.enquiryId ?? '',
    version: search.version ? Number(search.version) : undefined
  }),
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const editCorporateProposalRoute = createRoute({
  path: 'proposals/edit/$proposalId',
  getParentRoute: () => corporateRoot,
  component: CreateCorporateProposal
});

export const createPurchaseOrderRoute = createRoute({
  path: 'proposals/create-po/$proposalId',
  getParentRoute: () => corporateRoot,
  component: CreatePurchaseOrder
});

export const corporateEnquiryDetailedViewRoute = createRoute({
  path: 'enquiry-detailed-view/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporateEnquiryDetailedView
});

export const corporateEnquiryDetailedViewReviseRoute = createRoute({
  path: 'enquiry-detailed-view/revise-proposal/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporateEnquiryDetailedView
});

export const proposalDetailsRoute = createRoute({
  path: 'proposals/$proposalId/details',
  getParentRoute: () => corporateRoot,
  component: ProposalDetails
});

export const revisionDetailsRoute = createRoute({
  path: 'proposals/$proposalId/revisions/$revisionId/details',
  getParentRoute: () => corporateRoot,
  component: ProposalDetails
});

export const revisedProposalListRoute = createRoute({
  path: 'proposals/$proposalId/revisions',
  getParentRoute: () => corporateRoot,
  component: RevisedProposalList
});

export const corporateEnquiryCardListRoute = createRoute({
  path: 'enquiry-cards',
  getParentRoute: () => corporateRoot,
  component: CorporateEnquiryCardList
});

export const corporateProposalSummaryRoute = createRoute({
  path: 'proposals-summary',
  getParentRoute: () => corporateRoot,
  component: CorporateProposalSummaryList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const corporateProposalListRoute = createRoute({
  path: 'proposals-list/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporateProposalTableView,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const corporatePurchaseOrderSummaryRoute = createRoute({
  path: 'purchase-orders-summary',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderSummaryList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const corporatePurchaseOrderListRoute = createRoute({
  path: 'purchase-orders-list/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderTableView,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const proposalCardListRoute = createRoute({
  path: 'proposals/proposal-cards',
  getParentRoute: () => corporateRoot,
  component: ProposalCardList,
  validateSearch: (search) => ({ enquiryId: search.enquiryId ?? '' }),
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const reviseProposalCardListRoute = createRoute({
  path: 'proposals/proposal-cards/revise-proposal',
  getParentRoute: () => corporateRoot,
  component: ProposalCardList,
  validateSearch: (search) => ({ enquiryId: search.enquiryId ?? '' }),
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LIST })
});

export const corporateEnquiryLocationsListRoute = createRoute({
  path: 'enquiry-locations',
  getParentRoute: () => corporateRoot,
  component: CorporateEnquiryLocationsList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LOCATION_LIST })
});

export const corporateCircuitProvisioningRoute = createRoute({
  path: 'circuit-provisioning/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporateCircuitProvisioning,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_CIRCUIT_PROVISIONING })
});

export const corporateServiceProvisioningSummaryRoute = createRoute({
  path: 'service-provisioning-summary',
  getParentRoute: () => corporateRoot,
  component: CorporateServiceProvisioningSummaryList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_SERVICE_PROVISIONING })
});

export const corporateServiceProvisioningTableRoute = createRoute({
  path: 'service-provisioning-list/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderWiseLocationsList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_SERVICE_PROVISIONING })
});

export const corporateServiceProvisioningOrdersRoute = createRoute({
  path: 'service-provisioning-orders/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderTableView,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_SERVICE_PROVISIONING })
});

export const corporateServiceProvisioningRoute = createRoute({
  path: 'service-provisioning/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporateServiceProvisioning,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LOCATION_LIST })
});

export const corporatePOWiseLocationsRoute = createRoute({
  path: 'po-wise-locations/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderWiseLocationsList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_ENQUIRY_LOCATION_LIST })
});

export const corporateCircuitProvisioningSummaryRoute = createRoute({
  path: 'circuit-provisioning-summary',
  getParentRoute: () => corporateRoot,
  component: CorporateCircuitProvisioningSummaryList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_CIRCUIT_PROVISIONING })
});

export const corporateCircuitProvisioningTableRoute = createRoute({
  path: 'circuit-provisioning-list/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderTableView,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_CIRCUIT_PROVISIONING })
});

export const corporateCircuitProvisioningLocationsRoute = createRoute({
  path: 'enquiry-detailed-view/circuit-provisioning/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderWiseLocationsList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_CIRCUIT_PROVISIONING })
});

export const corporateServiceProvisioningLocationsRoute = createRoute({
  path: 'enquiry-detailed-view/service-provisioning/$enquiryId',
  getParentRoute: () => corporateRoot,
  component: CorporatePurchaseOrderWiseLocationsList,
  context: () => ({ menuKey: MENU_KEYS.CORPORATE_SERVICE_PROVISIONING })
});

export const corporateRoutes = [
  corporateRoot,
  corporateIndex,
  // corporateDashboard,
  corporateEnquiryListRoute,
  corporateCustomerRoute,
  corporateCustomerListRoute,
  createCorporateCustomerRoute,
  createCorporateEnquiryRoute,
  editCorporateEnquiryRoute,
  locationList,
  locationListById,
  locationDetails,
  corporateCustomerDetailsRoute,
  createCorporateProposalRoute,
  reviseCorporateProposalRoute,
  editCorporateProposalRoute,
  revisedProposalListRoute,
  proposalDetailsRoute,
  revisionDetailsRoute,
  createPurchaseOrderRoute,
  corporateEnquiryDetailedViewRoute,
  corporateEnquiryDetailedViewReviseRoute,
  corporateEnquiryCardListRoute,
  corporateProposalSummaryRoute,
  corporateProposalListRoute,
  corporatePurchaseOrderSummaryRoute,
  corporatePurchaseOrderListRoute,
  proposalCardListRoute,
  reviseProposalCardListRoute,
  corporateEnquiryLocationsListRoute,
  corporateCircuitProvisioningSummaryRoute,
  corporateCircuitProvisioningTableRoute,
  corporateCircuitProvisioningRoute,
  corporateServiceProvisioningSummaryRoute,
  corporateServiceProvisioningTableRoute,
  corporateServiceProvisioningOrdersRoute,
  corporateServiceProvisioningRoute,
  corporatePOWiseLocationsRoute,
  corporateCircuitProvisioningLocationsRoute,
  corporateServiceProvisioningLocationsRoute
];
