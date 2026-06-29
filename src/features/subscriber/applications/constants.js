export const STATE_REDUCER_KEY = 'applications';
export const ENQUIRY_TABLE_KEY = 'enquiryList';
export const EWS_ENQUIRY_TABLE_KEY = 'ewsEnquiryList';
export const SUBSCRIBERS_LIST_TABLE_KEY = 'subscribers_list';

export const PACKAGE_LIST_TABLE_KEY = 'packageList';

export const COMPLETED_STATUS = 'Completed';

// Debounce (ms) for the username-availability check in ChangeUsernamePopup / UsernameInput
export const USERNAME_CHECK_DEBOUNCE_MS = 600;

// Subscriber-list filter status options. id = backend value, label = i18n key.
// TODO(temp): confirm ids against the real subscriber status enum (ideally fetch from API).
export const SUBSCRIBER_STATUS_FILTER = [
  { id: 'ACTIVE', label: 'active' },
  { id: 'INACTIVE', label: 'inactive' },
  { id: 'SUSPENDED', label: 'suspended' }
];

export const DEVICE_TYPES = {
  ONT: 'ONT',
  OLT: 'OLT'
};

export const TAXPAYER_TYPE = 'Sez';

export const ENQUIRY_CARD_CONFIG = {
  'Total Enquiries': {
    iconBg: '#3369CC',
    bgIconColor: '#EEF3FC'
  },
  Completed: {
    iconBg: '#B35AF0',
    bgIconColor: '#FDF4FF'
  },
  Pending: {
    iconBg: '#F5A623',
    bgIconColor: '#FFFAEB'
  },
  Pendings: {
    iconBg: '#F5A623',
    bgIconColor: '#FFFAEB'
  },
  'Pending Enquiries': {
    iconBg: '#F5A623',
    bgIconColor: '#FFFAEB'
  }
};

export const DROPDOWN_KEYS = {
  DEVICE_PROVIDER_LIST: 'deviceProviderList',
  DEVICE_LIST: 'deviceList',
  DEVICE_TYPE_LIST: 'deviceTypeList',
  OLT_TYPE_LIST: 'oltTypeList',
  OLT_DEVICE_LIST: 'oltDeviceList',
  PON_PORT_NUMBER_LIST: 'ponPortNumberList',
  PLAN_TYPE_LIST: 'planTypeList',
  PACKAGE_TYPE_LIST: 'packageTypeList',
  ENQUIRY_LIST: 'enquiryList',
  DISTRIBUTOR_LIST: 'distributorList',
  PARTNER_LIST: 'partnerList',
  FE_LIST: 'feList',
  LNP_LIST: 'lnpList',
  DISPOSITION_LIST: 'dispositionList',
  REASON_LIST: 'reasonList',
  ENQUIRY_STATUS_LIST: 'enquiryStatusList',
  RESIDENCE_PROOF_TYPE_LIST: 'residenceProofTypeList',
  IDENTITY_PROOF_TYPE_LIST: 'identityProofTypeList',
  EWS_PACKAGE_LIST: 'ewsPackageList'
};

export const ENQUIRY_BASE_COLUMNS = [
  { header: 'trackingId', accessor: 'trackingId' },
  { header: 'name', accessor: 'cusName' },
  { header: 'mobileNo', accessor: 'cusMobile' },
  { header: 'email', accessor: 'cusEmail' },
  { header: 'address', accessor: 'cusAddress' },
  { header: 'location', accessor: 'cusLocation' },
  { header: 'pinCode', accessor: 'cusPincode' },
  { header: 'city', accessor: 'cusCity' },
  { header: 'state', accessor: 'cusState' }
];

// --- Dummy data (no backend detail/data-usage endpoints yet) ---
export const SUBSCRIBER_DETAIL_DUMMY = {
  name: 'Boddu Viswa Mohan Rao',
  address: '1-274 Gummam Veedi Aryad Talavaram Alappuzha Aryad Kerala 688527',
  username: 'kfon.termont',
  partner: 'RICTIND',
  mobile: '9100240047',
  email: 'viswa.mohan@railwire.co.in',
  subscriberId: '4938',
  subscriptionExpiry: '2027-01-03',
  cafStatus: 'Active',
  createdOn: '2026-05-23',
  lastTopup: '5,656.92 on 2026-05-23 18:22:46',
  subscriptionType: 'Home Connection',
  packageName: 'KFON Basic-MT',
  applicationNumber: 'KFON8850000137B',
  accountBalance: '0.00',
  deviceProvider: 'KFON',
  deviceType: 'ONT',
  deviceModel: 'UTL802GW-DG',
  macAddress: '19v:eee:5ra:www148',
  deviceMake: 'United Telecoms Limited',
  deviceCategory: 'Type-2-Dual Band',
  gponSerialNumber: '1400p000008',
  oltType: 'GPON'
};

export const SUBSCRIBER_LIST_DUMMY = Array.from({ length: 6 }).map((_, i) => ({
  subscriberId: 4923 + i,
  appNo: 4923 + i,
  username: 'kfon.ttteute',
  name: 'kfon.ttteute',
  packageName: 'KFON-OTT BP-Star-MT-4500 GB-45 Mbps',
  expiryDate: '22-May-2026',
  speed: '45',
  mobile: '9876543210',
  email: 'axiskagd@gmail.com',
  franchisee: 'FIRECRACKERS',
  registrationDate: '22-May-2026',
  daysLeft: '1',
  status: 'ACTIVE'
}));

export const DATA_USAGE_SESSION_COLUMNS = [
  'startTime',
  'endTime',
  'sessionTime',
  'upload',
  'download',
  'total',
  'mac',
  'framedIp',
  'ipv6Prefix',
  'ipv6Delegated'
];

export const SUBSCRIBER_DATA_USAGE_DUMMY = {
  name: 'Boddu Viswa Mohan Rao',
  partner: 'RICTIND',
  username: 'kfon.sriharshapkgmobnkycsbtp01',
  subscriptionExpiry: '2026-12-01',
  packageName: 'KFON Basic-HY NEW 0Mbps',
  subscriberId: '4918',
  subscriptionType: 'Home Connection',
  bandwidthProfile: 'FU20480_2048',
  remarks: 'None',
  stats: [
    { key: 'packageData', value: '6000', unit: 'GB' },
    { key: 'dataUsed', value: '0', unit: 'MB' },
    { key: 'addOnData', value: 'NA', unit: '' },
    { key: 'addOnUsed', value: '0', unit: 'MB' }
  ],
  remaining: { value: '6000', unit: 'GB' },
  session: {
    rows: [['--:--:--', '--:--:--', '--:--:--', '100MB', '80MB', '180MB', 'MAC', 'Framed-IP', 'IPv6 Prefix', 'IPv6 Delegated']],
    totalRow: ['100MB', '80MB', '180MB', '-', '-', '-', '-']
  }
};

export const STATUS_DISPLAY_MAP = {
  OPEN: 'Open',
  PENDING: 'Pending',
  CLOSED: 'Closed',
  CONNECTED: 'Connected',
  FEASIBLE: 'Feasible',
  'IN PROGRESS': 'In Progress',
  REJECTED: 'Rejected',
  'PRESENTLY NOT FEASIBLE': 'Not Feasible',
  'PARTIALLY CONNECTED': 'Partially Connected',
  FE_RECEIVED: 'FE Received',
  LNP_RECEIVED: 'LNP Received',
  KYC_COMPLETED_FRC_PENDING: 'Connected',
  ACTIVE: 'Active',
  SUBMITTED: 'Submitted',
  VERIFIED: 'Verified',
  RE_SUBMITTED: 'Re-Submitted',
  IN_ACTIVE: 'In-Active',
  ENQUIRY: 'Enquiry'
};
