export const SUBSCRIBER_APPLICATIONS_ROUTES = {
  SUBSCRIBERS: {
    label: 'menu.subscribers',
    path: '/app/subscribers',
    icon: 'OnboardingSubscriberMenuIcon',
    activeOn: ['/app/dashboard/subscribers-dashboard']
  },
  RETAIL_SUBSCRIBER_ENQUIRY: {
    label: 'menu.subscriberEnquiryList',
    path: '/app/subscribers/enquiry-list',
    icon: 'EnquiryListChildIcon'
  },
  HOME_CONNECTION: { label: 'menu.homeConnection', path: '/app/subscribers/home-connection', icon: '' },
  SME_CONNECTION: { label: 'menu.smeConnection', path: '/app/subscribers/sme-connection', icon: '' },
  EKYC_HOME_CONNECTION: { label: 'menu.ekycHomeConnection', path: '/app/subscribers/ekyc-home-connection', icon: '' },
  EKYC_SME_CONNECTION: { label: 'menu.ekycSmeConnection', path: '/app/subscribers/ekyc-sme-connection', icon: '' },
  EKYC_EWS_CONNECTION: { label: 'menu.ekycEwsConnection', path: '/app/subscribers/ekyc-ews-connection', icon: '' },
  VERIFY_SUBSCRIBER: { label: 'menu.verifySubscriber', path: '/app/subscribers/verify-subscriber', icon: '' },
  EWS_WORK_ORDER: {
    label: 'menu.ewsWorkOrder',
    path: '/app/subscribers/ews-work-order',
    icon: 'EwsWorkOrderChildIcon'
  },
  SUBSCRIBERS_LIST: { label: 'menu.subscriberList', path: '/app/subscribers/subscribers-list', icon: 'SubscriberListChildIcon' }
};
