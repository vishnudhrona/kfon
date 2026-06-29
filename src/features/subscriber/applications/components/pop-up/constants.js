export const getFieldOptions = {
  subscriptionTypeOptions: [
    { id: 'homeConnection', name: 'home' },
    { id: 'smeConnection', name: 'sme' },
    { id: 'ewsConnection', name: 'ews' }
  ],
  connectionTypeOptions: [
    { id: 'basic', name: 'basic' },
    { id: 'eKYC', name: 'eKYC' }
  ]
};

export const NEW_SUBSCRIBER_PATHS = {
  homeConnection: 'home-new-subscriber',
  smeConnection: 'sme-new-subscriber'
};
