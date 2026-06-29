import { CRM_ROUTES } from '../crm/path';
import { FINANCE_ROUTES } from '../finance/path';
import { INVENTORY_ROUTES } from '../inventory/path';
import { PACKAGE_PLANS_ROUTES } from '../packagePlans/path';
import { REPORT_ROUTES } from '../reports/path';
import { SUBSCRIBER_APPLICATIONS_ROUTES } from '../subscriber/path';
import { SUPPORT_ROUTES } from '../ticket/path';
import { USER_ROLE_ROUTES } from '../user-role/path';

const ADMIN_ROUTES = {
  ADMIN: { label: 'menu.home', path: '/app', icon: 'HomeIcon' },
  DASHBOARD: { label: 'menu.dashboard', path: '/app/dashboard', icon: 'DevicePartner' },
  USER_DASHBOARD: { label: 'menu.userDashboard', path: '/app/dashboard', icon: '' },
  MONITORING_DASHBOARD: { label: 'menu.monitoringDashboard', path: '/app/dashboard/monitoring', icon: '' }
};

const PROFILE_ROUTES = {
  PROFILE: { label: 'menu.profile', path: '/app/profile', icon: 'ProfileMenuIcon' }
};

const CORPORATE_ROUTES = {
  CORPORATE: { label: 'menu.corporate', path: '/app/corporate', icon: 'CorporateMenuIcon' },
  CORPORATE_MAIN_MENU: { label: 'menu.corporate', icon: 'CorporateMenuIcon' },
  CORPORATE_CUSTOMERS: { label: 'menu.customers', icon: 'UserProfileIcon' },
  CORP_CUSTOMER_LIST: {
    label: 'menu.customerList',
    path: '/app/corporate/customer-list',
    icon: 'UserProfileIcon',
    activeOn: ['/app/corporate/customers/create-customer', '/app/corporate/customers/details']
  },
  CORPORATE_ENQUIRY_LIST: {
    label: 'menu.enquiryList',
    path: '/app/corporate/enquiry-list',
    icon: 'CorporateIcon',
    activeOn: [
      '/app/corporate/enquiry-detailed-view',
      '/app/corporate/edit-enquiry',
      '/app/corporate/create-enquiry'
    ]
  },
  CORPORATE_ENQUIRY_LOCATION_LIST: {
    label: 'menu.enquiryLocationList',
    path: '/app/corporate/enquiry-locations',
    icon: 'EnquiryLocationListChildIcon'
  },
  CREATE_CORPORATE_ENQUIRIES: {
    label: 'menu.createCorporateEnquiries',
    path: '/app/corporate/create-enquiry',
    icon: 'DeviceList'
  },
  'INVOICE-LOCATIONS-DETAILS': {
    label: 'menu.invoiceLocationsDetails',
    path: '/app/corporate/invoice-locations-details',
    icon: ''
  },
  'INVOICE-LOCATION-PRINT-ALL': {
    label: 'menu.invoiceLocationPrintAll',
    path: '/app/corporate/invoice-location-print-all',
    icon: ''
  },
  INV_PRINTALL: { label: 'menu.invPrintAll', path: '/app/corporate/inv-printall', icon: '' },
  CORPORATE_ENQUIRIES_LOCATION_LIST: {
    label: 'menu.corporateEnquiriesLocationList',
    path: '/app/corporate/location',
    icon: 'DeviceList'
  },
  CUSTOMERS: { label: 'menu.customers', path: '/app/corporate/customers', icon: 'DeviceList' },
  CREATE_CORPORATE_CUSTOMER: {
    label: 'menu.createCorporateCustomer',
    path: '/app/corporate/customers/create-customer',
    icon: 'DeviceList'
  },
  CORPORATE_PACKAGES: { label: 'menu.packages', path: '/app/corporate/packages', icon: 'PackageIcon' },
  CREATE_CORPORATE_PACKAGE: {
    label: 'menu.createCorporatePackage',
    path: '/app/corporate/packages/create-package',
    icon: 'DeviceList'
  },
  PROPOSAL: {
    label: 'menu.proposals',
    path: '/app/corporate/proposals-summary',
    icon: 'ProposalsChildIcon',
    activeOn: ['/app/corporate/proposals-list', '/app/corporate/proposals']
  },
  PROPOSAL_CARDS: { label: 'menu.proposalCards', path: '/app/corporate/proposals/proposal-cards', icon: '' },
  REVISE_PROPOSAL: {
    breadcrumbLabel: 'menu.reviseProposal',
    label: 'menu.reviseProposal',
    path: '/app/corporate/proposals/proposal-cards/revise-proposal',
    icon: ''
  },
  CREATE_CORPORATE_PROPOSAL: {
    label: 'menu.createCorporateProposal',
    path: '/app/corporate/proposals/create-proposal',
    icon: 'DeviceList'
  },
  CIRCUIT_PROVISIONING: {
    label: 'menu.circuitProvisioning',
    path: '/app/corporate/circuit-provisioning-summary',
    icon: 'CircuitProvisioningChildIcon',
    activeOn: [
      '/app/corporate/circuit-provisioning-list',
      '/app/corporate/circuit-provisioning',
      '/app/corporate/enquiry-detailed-view/circuit-provisioning'
    ]
  },
  CORPORATE_CIRCUIT_PROVISIONING: {
    label: 'menu.circuitProvisioning',
    path: '/app/corporate/circuit-provisioning-summary',
    icon: 'CircuitProvisioningChildIcon',
    activeOn: [
      '/app/corporate/circuit-provisioning-list',
      '/app/corporate/circuit-provisioning',
      '/app/corporate/enquiry-detailed-view/circuit-provisioning'
    ]
  },
  CORPORATE_SERVICE_PROVISIONING: {
    label: 'menu.serviceProvisioning',
    path: '/app/corporate/service-provisioning-summary',
    icon: 'ServiceProvisioningChildIcon',
    activeOn: [
      '/app/corporate/service-provisioning-orders',
      '/app/corporate/service-provisioning-list',
      '/app/corporate/service-provisioning'
    ]
  },
  SERVICE_PROVISIONING: {
    label: 'menu.serviceProvisioning',
    path: '/app/corporate/service-provisioning-summary',
    icon: 'ServiceProvisioningChildIcon',
    activeOn: [
      '/app/corporate/service-provisioning-orders',
      '/app/corporate/service-provisioning-list',
      '/app/corporate/service-provisioning'
    ]
  },
  PURCHASE_ORDER: {
    label: 'menu.purchaseOrder',
    path: '/app/corporate/purchase-orders-summary',
    icon: 'PurchaseOrderChildIcon',
    activeOn: ['/app/corporate/purchase-orders-list', '/app/corporate/purchase-orders']
  },
  CORPORATE_PURCHASE_ORDER: {
    label: 'menu.purchaseOrder',
    path: '/app/corporate/purchase-orders-summary',
    icon: 'PurchaseOrderChildIcon',
    activeOn: ['/app/corporate/purchase-orders-list', '/app/corporate/purchase-orders']
  },
  CORPORATE_PURCHASE_ORDER_LIST: {
    label: 'menu.purchaseOrder',
    path: '/app/corporate/purchase-orders-summary',
    icon: 'PurchaseOrderChildIcon',
    activeOn: ['/app/corporate/purchase-orders-list', '/app/corporate/purchase-orders']
  },
  CORPORATE_PURCHASE_ORDER_TABLE: {
    label: 'menu.purchaseOrder',
    path: '/app/corporate/purchase-orders-list',
    icon: 'PurchaseOrderChildIcon',
    activeOn: ['/app/corporate/purchase-orders-summary', '/app/corporate/purchase-orders']
  },
  PO_APPROVAL: { label: 'menu.poApproval', path: '/app/corporate/po-approval', icon: '' },
  LOCATIONS: { label: 'menu.locations', path: '/app/corporate/locations', icon: '' },
  WORKORDERS: { label: 'menu.workorders', path: '/app/corporate/workorders', icon: '' },
  'INVOICE-CUSTOMERS': { label: 'menu.invoiceCustomers', path: '/app/corporate/invoice-customers', icon: '' },
  'INVOICE-LOCATIONS': { label: 'menu.invoiceLocations', path: '/app/corporate/invoice-locations', icon: '' },
  DEMAND_NOTE_SUMMARY: { label: 'menu.demandNoteSummary', path: '/app/corporate/demand-note-summary', icon: '' },
  FRAMED_IP_SUBSCRIBERS: { label: 'menu.framedIpSubscribers', path: '/app/corporate/framed-ip-subscribers', icon: '' },
  SPECIAL_EVENT: { label: 'menu.specialEvent', path: '/app/corporate/special-event', icon: '' },
  PROPOSALS: {
    label: 'menu.proposals',
    path: '/app/corporate/proposals-summary',
    icon: 'ProposalsChildIcon',
    activeOn: ['/app/corporate/proposals-list', '/app/corporate/proposals']
  },
  CORPORATE_PROPOSAL_LIST: {
    label: 'menu.proposals',
    path: '/app/corporate/proposals-summary',
    icon: 'ProposalsChildIcon',
    activeOn: ['/app/corporate/proposals-list', '/app/corporate/proposals']
  },
  CORPORATE_PROPOSAL_TABLE: {
    label: 'menu.proposals',
    path: '/app/corporate/proposals-list',
    icon: 'ProposalsChildIcon',
    activeOn: ['/app/corporate/proposals-summary', '/app/corporate/proposals']
  }
};

// Routes for new menu structure from API
const NEW_MENU_ROUTES = {
  // Inventory Master group and its items (name-to-key mapping for mergeWithRoutes)
  INVENTORY_MASTER: { label: 'menu.inventoryMaster', icon: 'InventoryMasterMenuIcon' },
  DEVICE_TYPE: { label: 'menu.deviceType', path: '/app/inventory/device-type-list', icon: 'DeviceTypeChildIcon' },
  DEVICE_MAKE: { label: 'menu.deviceMake', path: '/app/inventory/device-make-list', icon: 'DeviceMakeChildIcon' },
  DEVICE_CATEGORY: { label: 'menu.deviceCategory', path: '/app/inventory/device-category-list', icon: 'DeviceCategoryChildIcon' },
  DEVICE_MODEL: { label: 'menu.deviceModel', path: '/app/inventory/device-model-list', icon: 'DeviceModelChildIcon' },
  DEVICE_VENDOR: { label: 'menu.deviceVendor', path: '/app/inventory/device-supplier-list', icon: 'DeviceVendorChildIcon' },

  // Subscribers top menu
  ONBOARDING_SUBSCRIBER: { label: 'menu.onboardingSubscriber', icon: 'OnboardingSubscriberMenuIcon' },
  SUBSCRIBERS_LIST: { label: 'menu.subscribersList', path: '/app/subscribers/list', icon: 'SubscribersListChildIcon' },
  SUBSCRIBER_ENQUIRY_LIST: { label: 'menu.enquiryList', path: '/app/subscribers/enquiry-list', icon: 'EnquiryListChildIcon' },
  SUBSCRIBERS_DASHBOARD: { label: 'menu.subscribersDashboard', path: '/app/dashboard/subscribers-dashboard', icon: 'SubscribersDashboardChildIcon' },

  // Partners — Onboarding Partner group and Partners List
  PARTNERS: { label: 'menu.partners', path: '/app/partners', icon: 'OnboardingPartnerMenuIcon', activeOn: ['/app/dashboard/partners-dashboard'] },
  ONBOARDING_PARTNER: { label: 'menu.onboardingPartner', icon: 'OnboardingPartnerMenuIcon' },
  PARTNERS_ENQUIRY_LIST: { label: 'menu.partnersEnquiryList', path: '/app/partners/enquiry-list', icon: 'PartnerEnquiryListChildIcon' },
  PARTNERS_LIST: { label: 'menu.partnerList', path: '/app/partners/list', icon: 'PartnerListChildIcon' },
  PARTNERS_DASHBOARD: { label: 'menu.partnersDashboard', path: '/app/dashboard/partners-dashboard', icon: 'PartnerDashboardChildIcon' },
  PARTNER_NEW: { label: 'menu.newEnquiry', path: '/app/partners/enquiry-list/new', icon: '' },
  LNP_PARTNER_PREVIEW: { label: 'menu.lnpPartnerDetails', path: '/app/partners/list/lnp', icon: '' },
  AGNP_PARTNER_PREVIEW: { label: 'menu.agnpPartnerDetails', path: '/app/partners/list/agnp', icon: '' },
  VLAN_MAPPING_PARENT: { label: 'menu.vlanMapping', path: '/app/partners/vlan-mapping', icon: 'VlanAssociationChildIcon' },
  VLAN_MAPPING: { label: 'menu.vlanAssociation', path: '/app/partners/vlan-mapping/vlan-association', icon: 'VlanAssociationChildIcon' },
  VLAN_REQUEST: { label: 'menu.vlanRequest', path: '/app/partners/vlan-mapping/vlan-request', icon: '' },

  // "Users" top menu — API sends name "Users" → nameToKey → "USERS", but USER_ROLE_ROUTES uses key "USER"
  USERS: { label: 'menu.userManagement', path: '/app/users', icon: 'UserManagemetIcon' },

  // Partner Operations group
  PARTNER_OPERATIONS: { label: 'menu.partnerOperations', icon: 'PartnerOperationsMenuIcon' },
  FINANCE: { label: 'menu.finance', path: '/app/finance/revenue-share', icon: '' },
  REVENUE_SHARE: { label: 'menu.revenueShare', path: '/app/finance/revenue-share/list', icon: 'RevenueShareChildIcon' },

  // Parent group headers keyed by nameToKey(displayName) — these rows carry no menuKey,
  // so mergeWithRoutes resolves their icon via the group's display name.
  // No label: value falls back to the DB display name.
  NEW_TICKET: { icon: 'NewTicketMenuIcon' },
  ADD_PACKAGE: { icon: 'AddPackageMenuIcon' },
  PACKAGE_LIST: { icon: 'PackageListMenuIcon' },
  USER_MANAGEMENT: { icon: 'UserManagemetIcon' },
  PARTNER_REPORTS: { icon: 'PartnerReportsMenuIcon' },
  ENQUIRY: { icon: 'EnquiryReportMenuIcon' },
  SUBSCRIBER_REPORTS: { icon: 'SubscriberReportsMenuIcon' }
};

export const ROUTES = {
  ...ADMIN_ROUTES,
  ...INVENTORY_ROUTES,
  ...SUPPORT_ROUTES,
  ...CORPORATE_ROUTES,
  ...USER_ROLE_ROUTES,
  ...PROFILE_ROUTES,
  ...NEW_MENU_ROUTES,
  ...PACKAGE_PLANS_ROUTES,
  ...CRM_ROUTES,
  ...REPORT_ROUTES,
  ...FINANCE_ROUTES,
  ...SUBSCRIBER_APPLICATIONS_ROUTES
};
