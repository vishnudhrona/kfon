export const NEW_SUBSCRIBER_FORM = {
  formName: 'basicDetailsForm',
  title: 'basicDetails',
  sectionTitles: {
    basicDetails: 'basicDetails'
  },
  fieldLabels: {
    basicDetails: {
      applicationFormNo: 'applicationFormNo',
      applicantName: 'applicantName',
      dateOfBirth: 'dateOfBirth',
      mobileNo: 'mobileNo',
      emailAddress: 'emailAddress',
      gender: 'gender'
    }
  },
  fieldOptions: {
    gender: {
      male: 'male',
      female: 'female',
      others: 'others'
    }
  }
};

export const BASIC_DETAILS_FORM = {
  formName: 'basicDetailsForm',
  title: 'basicDetails',
  sectionTitles: {
    basicDetails: 'basicDetails',
    subscriptionDetails: 'subscriptionDetails',
    ontDeviceDetails: 'ontDeviceDetails',
    oltDeviceDetails: 'oltDeviceDetails'
  },
  fieldLabels: {
    basicDetails: {
      applicationFormNo: 'applicationFormNo',
      applicantName: 'applicantName',
      dateOfBirth: 'dateOfBirth',
      mobileNo: 'mobileNo',
      emailAddress: 'emailAddress',
      gender: 'gender'
    },
    subscriptionDetails: {
      planType: 'planType',
      desiredUserName: 'desiredUserName',
      selectedPackage: 'selectedPackage'
    },
    ontDeviceDetails: {
      deviceProvider: 'deviceProvider',
      deviceType: 'deviceType',
      vlanId: 'vlanId',
      deviceMake: 'deviceMake',
      deviceModel: 'deviceModel',
      deviceMacAddress: 'deviceMacAddress',
      oltType: 'oltType',
      configureSSID: 'configureSSID',
      ssid: 'ssid',
      ssidPassword: 'ssidPassword'
    },
    oltDeviceDetails: {
      deviceList: 'deviceList',
      ponPortNumber: 'ponPortNumber',
      ontPosition: 'ontPosition'
    }
  },
  fieldOptions: {
    gender: {
      male: 'male',
      female: 'female',
      others: 'others'
    }
  }
};

export const PLAN_TABLE_COLUMNS = [
  { header: 'ID', accessor: 'id' },
  { header: 'Plan', accessor: 'plan' },
  { header: 'Price', accessor: 'price' },
  { header: 'Speed', accessor: 'speed' },
  { header: 'Plan Volume', accessor: 'planVolume' },
  { header: 'Fallback Speed', accessor: 'fallbackSpeed' },
  { header: 'Validity', accessor: 'validity' }
];

// TODO: for temporary constants
export const PLAN_TABLE_DATA = [
  {
    id: 1,
    plan: 'Basic',
    price: '499',
    speed: '50 Mbps',
    planVolume: '150 GB',
    fallbackSpeed: '1 Mbps',
    validity: '30 Days'
  },
  {
    id: 2,
    plan: 'Standard',
    price: '799',
    speed: '100 Mbps',
    planVolume: '300 GB',
    fallbackSpeed: '2 Mbps',
    validity: '30 Days'
  },
  {
    id: 3,
    plan: 'Premium',
    price: '1299',
    speed: '200 Mbps',
    planVolume: '600 GB',
    fallbackSpeed: '5 Mbps',
    validity: '30 Days'
  },
  {
    id: 4,
    plan: 'Ultra',
    price: '1999',
    speed: '500 Mbps',
    planVolume: '1 TB',
    fallbackSpeed: '10 Mbps',
    validity: '30 Days'
  },
  {
    id: 5,
    plan: 'Unlimited',
    price: '2999',
    speed: '1 Gbps',
    planVolume: 'Unlimited',
    fallbackSpeed: '50 Mbps',
    validity: '30 Days'
  }
];

export const INSTALLATION_ADDRESS_RADIO_ITEMS = [
  { label: 'Urban', value: 'Urban' },
  { label: 'Rural', value: 'Rural' }
];

export const GST_INFORMATION_RADIO_ITEMS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' }
];

// TODO: for temporary constants
export const AADHAR_DETAILS_FIELDS = [
  'applicationName',
  'dateOfBirth',
  'mobileNo',
  'emailAddress',
  'gender',
  'aadhaarAddress'
];

export const SUBSCRIPTION_DETAILS_RADION_ITEMS = [
  { value: 'unlimited', label: 'Unlimited' },
  { value: 'fup', label: 'FUP' },
  { value: 'term-unlimited', label: 'Term-Plans Unlimited' },
  { value: 'term-fup', label: 'Term-Plans FUP' }
];
