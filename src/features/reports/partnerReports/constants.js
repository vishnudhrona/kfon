export const PARTNER_REQUEST_COLUMNS = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'state', accessor: 'state' },
  { header: 'district', accessor: 'district' },
  { header: 'partnerName', accessor: 'partnerName' },
  { header: 'requestType', accessor: 'requestType' },
  { header: 'dateOfRequest', accessor: 'dateOfRequest' },
  { header: 'status', accessor: 'status' }
];

export const MOCK_PARTNER_REQUEST_DATA = [
  {
    slNo: '01',
    partnerName: 'Telelink Solutions',
    status: 'Onboarded',
    dateOfRequest: '2026-01-10',
    requestType: 'LNP Partner',
    state: 'Kerala',
    district: 'Thiruvananthapuram'
  },
  {
    slNo: '02',
    partnerName: 'NetConnect Pvt Ltd',
    status: 'Processing',
    dateOfRequest: '2026-01-18',
    requestType: 'AGNP Partner',
    state: 'Kerala',
    district: 'Ernakulam'
  },
  {
    slNo: '03',
    partnerName: 'FiberLink Enterprises',
    status: 'Rejected',
    dateOfRequest: '2026-01-25',
    requestType: 'LNP Partner',
    state: 'Kerala',
    district: 'Kozhikode'
  },
  {
    slNo: '04',
    partnerName: 'Kerala Net Services',
    status: 'Onboarded',
    dateOfRequest: '2026-02-02',
    requestType: 'AGNP Partner',
    state: 'Kerala',
    district: 'Thrissur'
  },
  {
    slNo: '05',
    partnerName: 'DigiConnect Ltd',
    status: 'Processing',
    dateOfRequest: '2026-02-06',
    requestType: 'LNP Partner',
    state: 'Kerala',
    district: 'Kollam'
  },
  {
    slNo: '06',
    partnerName: 'BroadNet Technologies',
    status: 'Onboarded',
    dateOfRequest: '2026-02-09',
    requestType: 'AGNP Partner',
    state: 'Kerala',
    district: 'Malappuram'
  },
  {
    slNo: '07',
    partnerName: 'SpeedLink Communications',
    status: 'Rejected',
    dateOfRequest: '2026-02-11',
    requestType: 'LNP Partner',
    state: 'Kerala',
    district: 'Palakkad'
  },
  {
    slNo: '08',
    partnerName: 'Infowave Systems',
    status: 'Processing',
    dateOfRequest: '2026-02-13',
    requestType: 'AGNP Partner',
    state: 'Kerala',
    district: 'Kannur'
  },
  {
    slNo: '09',
    partnerName: 'ConnectKerala Pvt Ltd',
    status: 'Onboarded',
    dateOfRequest: '2026-02-15',
    requestType: 'LNP Partner',
    state: 'Kerala',
    district: 'Kottayam'
  },
  {
    slNo: '10',
    partnerName: 'DataPath Solutions',
    status: 'Onboarded',
    dateOfRequest: '2026-02-17',
    requestType: 'AGNP Partner',
    state: 'Kerala',
    district: 'Alappuzha'
  }
];

export const PARTNER_REQUEST_TILE_CARDS = [
  {
    key: 'total',
    label: 'Total Enquiries',
    statusKey: null,
    isIncrease: true,
    chartColor: '#008FFB'
  },
  {
    key: 'onboarded',
    label: 'Onboarded',
    statusKey: 'Onboarded',
    isIncrease: true,
    chartColor: '#00E396'
  },
  {
    key: 'processing',
    label: 'Processing',
    statusKey: 'Processing',
    isIncrease: false,
    chartColor: '#FEB019'
  },
  {
    key: 'rejected',
    label: 'Rejected',
    statusKey: 'Rejected',
    isIncrease: false,
    chartColor: '#FF4560'
  }
];

export const PARTNER_REQUEST_TABS = ['All', 'LNP Partner', 'AGNP Partner'];

export const PARTNER_TAB_TILE_COUNTS = {
  All: { total: 1248, onboarded: 720, processing: 318, rejected: 210, totalPct: 15.2, onboardedPct: 10.8, processingPct: 4.6, rejectedPct: 1.9 },
  'LNP Partner': { total: 684, onboarded: 410, processing: 172, rejected: 102, totalPct: 18.3, onboardedPct: 12.1, processingPct: 6.4, rejectedPct: 2.7 },
  'AGNP Partner': { total: 564, onboarded: 310, processing: 146, rejected: 108, totalPct: 11.6, onboardedPct: 8.9, processingPct: 3.4, rejectedPct: 1.4 }
};

export const STATE_REDUCER_KEY = 'partnerReports';
