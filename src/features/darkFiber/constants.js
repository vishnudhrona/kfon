export const PROPOSAL_LIST_COLUMNS = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'proposalId', accessor: 'proposalId' },
  { header: 'version', accessor: 'version' },
  { header: 'proposalName', accessor: 'proposalName' },
  { header: 'customerName', accessor: 'customerName' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'noOfConnections', accessor: 'noOfConnections' },
  { header: 'amount', accessor: 'amount' },
  { header: 'status', accessor: 'status' },
  { header: 'action', accessor: 'action' }
];

export const MOCK_PROPOSAL_DATA = [
  {
    slNo: '01',
    proposalId: 'A-001',
    version: '2',
    proposalName: 'BSNL',
    customerName: 'Axis Bank',
    createdDate: '2025-06-10 14:54:01',
    noOfConnections: '30',
    amount: '25238',
    status: 'Approved',
    action: '...'
  },
  {
    slNo: '02',
    proposalId: 'S-002',
    version: '1',
    proposalName: 'Jio',
    customerName: 'SBI Bank',
    createdDate: '2025-07-22 09:33:14',
    noOfConnections: '20',
    amount: '10000',
    status: 'Verified',
    action: '...'
  },
  {
    slNo: '03',
    proposalId: 'T-003',
    version: '1',
    proposalName: 'Kerala',
    customerName: 'Tourism Department',
    createdDate: '2025-07-16 13:05:30',
    noOfConnections: '10',
    amount: '5000',
    status: 'Recommended',
    action: '...'
  },
  {
    slNo: '04',
    proposalId: 'K-004',
    version: '1',
    proposalName: 'Kerala Vision',
    customerName: 'Kerala State Backward Classes',
    createdDate: '2025-06-10 17:55:58',
    noOfConnections: '10',
    amount: '5000',
    status: 'Approved',
    action: '...'
  },
  {
    slNo: '05',
    proposalId: 'S-005',
    version: '1',
    proposalName: 'Airtel',
    customerName: 'Kerala State Backward Classes',
    createdDate: '2025-06-10 10:56:01',
    noOfConnections: '10',
    amount: '5000',
    status: 'Approved',
    action: '...'
  }
];

export const DARKFIBER_COLUMNS = [
  { header: 'requestId', accessor: 'requestId' },
  { header: 'companyName', accessor: 'companyName' },
  { header: 'companyPhoneNum', accessor: 'companyPhone' },
  { header: 'contactPersonName', accessor: 'contactPersonName' },
  { header: 'contactPersonPhone', accessor: 'contactPersonPhone' },
  { header: 'assignTo', accessor: 'assignTo' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'status', accessor: 'status' },
  { header: 'companyProfile', accessor: 'companyProfile' },
  { header: 'darkFiberDetails', accessor: 'darkFiberDetails' },
  { header: 'action', accessor: 'action' }
];

export const MOCK_DATA = [
  {
    requestId: '003',
    companyName: 'BSNL',
    companyPhone: '9876543210',
    contactPersonName: 'Vishnu NR',
    contactPersonPhone: '9876543210',
    assignTo: 'Sunil Kumar (FE)',
    createdDate: '16-12-2025 11:04:05',
    status: 'Assigned',
    companyProfile: 'Not Updated',
    darkFiberDetails: 'Not Updated',
    action: '...'
  },
  {
    requestId: '001',
    companyName: 'SBI Bank',
    companyPhone: '8876543210',
    contactPersonName: 'Sarath babu John',
    contactPersonPhone: '8876543210',
    assignTo: '-',
    createdDate: '16-12-2025 11:04:05',
    status: 'Open',
    companyProfile: 'Not Updated',
    darkFiberDetails: 'Not Updated',
    action: '...'
  },
  {
    requestId: '002',
    companyName: 'Bank of Baroda',
    companyPhone: '7876543210',
    contactPersonName: 'Asif Mohammed',
    contactPersonPhone: '7876543210',
    assignTo: '-',
    createdDate: '16-12-2025 11:04:05',
    status: 'Open',
    companyProfile: 'Not Updated',
    darkFiberDetails: 'Not Updated',
    action: '...'
  },
  {
    requestId: '001',
    companyName: 'SBI Bank',
    companyPhone: '8876543210',
    contactPersonName: 'Sarath babu John',
    contactPersonPhone: '8876543210',
    assignTo: '-',
    createdDate: '16-12-2025 11:04:05',
    status: 'Open',
    companyProfile: 'Not Updated',
    darkFiberDetails: 'Not Updated',
    action: '...'
  },
  {
    requestId: '002',
    companyName: 'Bank of Baroda',
    companyPhone: '7876543210',
    contactPersonName: 'Asif Mohammed',
    contactPersonPhone: '7876543210',
    assignTo: '-',
    createdDate: '16-12-2025 11:04:05',
    status: 'Open',
    companyProfile: 'Not Updated',
    darkFiberDetails: 'Not Updated',
    action: '...'
  },
  {
    requestId: '001',
    companyName: 'SBI Bank',
    companyPhone: '8876543210',
    contactPersonName: 'Sarath babu John',
    contactPersonPhone: '8876543210',
    assignTo: '-',
    createdDate: '16-12-2025 11:04:05',
    status: 'Open',
    companyProfile: 'Not Updated',
    darkFiberDetails: 'Not Updated',
    action: '...'
  },
  {
    requestId: '002',
    companyName: 'Bank of Baroda',
    companyPhone: '7876543210',
    contactPersonName: 'Asif Mohammed',
    contactPersonPhone: '7876543210',
    assignTo: '-',
    createdDate: '16-12-2025 11:04:05',
    status: 'Open',
    companyProfile: 'Not Updated',
    darkFiberDetails: 'Not Updated',
    action: '...'
  }
];

export const STATE_REDUCER_KEY = 'darkFiber';
export const NOT_UPDATED = 'Not Updated';
