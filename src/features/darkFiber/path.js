export const DARKFIBER_ROUTES = {
  DARKFIBRE: {
    label: 'menu.darkFibreEnquiries',
    breadcrumbLabel: 'menu.darkFibreEnquiriesList',
    path: '/app/darkfiber/enquiry-list',
    icon: 'darkFibreEnquiryIcon'
  },
  ENQUIRIES_LIST: { label: 'menu.enquiryList', path: '/app/darkfiber/enquiry-list', icon: 'darkFibreEnquiryIcon' },
  PURCHASE_ORDER: { label: 'menu.purchaseOrder', path: '/app/darkfiber/purchase-order-list', icon: '' },
  CUSTOMERS: { label: 'menu.customers', path: '/app/darkfiber/customer-list', icon: '' },
  PROPOSAL_LIST: {
    label: 'menu.proposal',
    breadcrumbLabel: 'menu.proposalList',
    path: '/app/darkfiber/enquiry-list/proposal-list',
    icon: ''
  },
  ENQUIRY_DETAILS: {
    label: 'menu.darkFiberEnquiriesDetails',
    path: '/app/darkfiber/enquiry-list/enquiry-details/:enquiryId',
    icon: ''
  },
  COMPANY_PROFILE: {
    label: 'menu.addCustomerKycDetails',
    path: '/app/darkfiber/enquiry-list/company-profile/:enquiryId',
    icon: ''
  }
};
