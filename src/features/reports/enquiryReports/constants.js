export const ENQUIRY_REPORT_COLUMNS = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'customerName', accessor: 'customerName' },
  { header: 'dateOfEnquiry', accessor: 'dateOfEnquiry' },
  { header: 'plan', accessor: 'plan' },
  { header: 'status', accessor: 'status' }
];

export const MOCK_ENQUIRY_REPORT_DATA = [
  {
    slNo: '01',
    customerName: 'Vishnu NR',
    status: 'Connected',
    dateOfEnquiry: '2026-01-15',
    plan: 'KFON Fiber 100 Mbps'
  },
  {
    slNo: '02',
    customerName: 'Sarath Babu',
    status: 'Processing',
    dateOfEnquiry: '2026-01-20',
    plan: 'KFON Fiber 50 Mbps'
  },
  {
    slNo: '03',
    customerName: 'Asif Mohammed',
    status: 'Not Feasible',
    dateOfEnquiry: '2026-02-01',
    plan: 'KFON Fiber 200 Mbps'
  },
  {
    slNo: '04',
    customerName: 'Sunil Kumar',
    status: 'Connected',
    dateOfEnquiry: '2026-02-05',
    plan: 'KFON Fiber 100 Mbps'
  },
  {
    slNo: '05',
    customerName: 'Anitha Menon',
    status: 'Processing',
    dateOfEnquiry: '2026-02-10',
    plan: 'KFON Fiber 50 Mbps'
  },
  {
    slNo: '06',
    customerName: 'Rajesh Kumar',
    status: 'Connected',
    dateOfEnquiry: '2026-02-12',
    plan: 'KFON Fiber 200 Mbps'
  },
  {
    slNo: '07',
    customerName: 'Priya Nair',
    status: 'Not Feasible',
    dateOfEnquiry: '2026-02-14',
    plan: 'KFON Fiber 50 Mbps'
  },
  {
    slNo: '08',
    customerName: 'Deepak Menon',
    status: 'Processing',
    dateOfEnquiry: '2026-02-15',
    plan: 'KFON Fiber 100 Mbps'
  },
  {
    slNo: '09',
    customerName: 'Lakshmi Devi',
    status: 'Connected',
    dateOfEnquiry: '2026-02-16',
    plan: 'KFON Fiber 50 Mbps'
  },
  {
    slNo: '10',
    customerName: 'Arun Prasad',
    status: 'Connected',
    dateOfEnquiry: '2026-02-17',
    plan: 'KFON Fiber 200 Mbps'
  }
];

export const TILE_CARDS = [
  {
    key: 'total',
    label: 'Total',
    statusKey: null,
    count: 1536,
    percentage: 18.4,
    isIncrease: true,
    chartColor: '#008FFB'
  },
  {
    key: 'connected',
    label: 'Connected',
    statusKey: 'Connected',
    count: 980,
    percentage: 12.5,
    isIncrease: true,
    chartColor: '#00E396'
  },
  {
    key: 'processing',
    label: 'Processing',
    statusKey: 'Processing',
    count: 356,
    percentage: 5.3,
    isIncrease: false,
    chartColor: '#FEB019'
  },
  {
    key: 'notFeasible',
    label: 'Not Feasible',
    statusKey: 'Not Feasible',
    count: 200,
    percentage: 2.1,
    isIncrease: false,
    chartColor: '#FF4560'
  }
];

export const ENQUIRY_REPORT_TABS = ['Home', 'BPL', 'Corporate', 'Government', 'DarkFibre'];

export const TAB_TILE_COUNTS = {
  Home: { total: 1536, connected: 980, processing: 356, notFeasible: 200, totalPct: 18.4, connectedPct: 12.5, processingPct: 5.3, notFeasiblePct: 2.1 },
  BPL: { total: 842, connected: 510, processing: 214, notFeasible: 118, totalPct: 22.1, connectedPct: 15.3, processingPct: 8.2, notFeasiblePct: 3.4 },
  Corporate: { total: 654, connected: 420, processing: 168, notFeasible: 66, totalPct: 10.7, connectedPct: 8.9, processingPct: 4.1, notFeasiblePct: 1.8 },
  Government: { total: 312, connected: 198, processing: 84, notFeasible: 30, totalPct: 14.3, connectedPct: 9.6, processingPct: 6.7, notFeasiblePct: 2.5 },
  DarkFibre: { total: 428, connected: 267, processing: 112, notFeasible: 49, totalPct: 7.2, connectedPct: 5.8, processingPct: 3.9, notFeasiblePct: 1.4 }
};

export const STATE_REDUCER_KEY = 'enquiryReports';
