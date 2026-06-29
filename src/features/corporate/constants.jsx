import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

export const STATE_REDUCER_KEY = 'corporate';

export const ENQUIRY_DETAILS_FIELDS = [
  { label: 'Customer Name', key: 'companyName' },
  { label: 'Contact Name', key: 'contactName' },
  { label: 'Contact Number', key: 'contactNumber' },
  { label: 'Email', key: 'emailId' },
  { label: 'Requested Service', key: 'requestedService' },
  { label: 'Latitude', key: 'latitude' },
  { label: 'Longitude', key: 'longitude' },
  { label: 'Customer Address', key: 'address' },
  { label: 'Document', key: 'document' },
  { label: 'Status', key: 'status' }
];

export const ENQ_CUSTOMER_DETAILS_COLUMNS = [
  { header: 'Customer Name', accessor: 'companyName' },
  { header: 'Contact Name', accessor: 'contactName' },
  { header: 'Contact Number', accessor: 'contactNumber' },
  { header: 'Partner ID', accessor: 'partnerId' },
  { header: 'Partner Name', accessor: 'partnerName' },
  { header: 'FE Name', accessor: 'feName' },
  { header: 'Service Type', accessor: 'serviceType' },
  { header: 'Loc Contact Person', accessor: 'locContactPerson' },
  { header: 'Loc Contact Number', accessor: 'locContactNumber' },
  { header: 'Loc Contact Email', accessor: 'locContactEmail' },
  { header: 'POP Name', accessor: 'popName' },
  { header: 'Locname District', accessor: 'locDistrict' },
  { header: 'Pincode Location Code', accessor: 'pincodeLocationCode' },
  { header: 'Address', accessor: 'address' },
  { header: 'Geolocation Address', accessor: 'geolocationAddress' },
  { header: 'Latitude', accessor: 'latitude' },
  { header: 'Longitude', accessor: 'longitude' },
  { header: 'No of Users/Systems', accessor: 'noOfUsers' },
  { header: 'Bandwidth (BW) Required from KFON', accessor: 'bandwidthRequired' },
  { header: 'No Of Private IP Required from KFON', accessor: 'privateIpRequired' },
  { header: 'No Of Static IP Required from KFON', accessor: 'staticIpRequired' },
  { header: 'No Of IP Required for e-office from KFON', accessor: 'eOfficeIpRequired' }
];

export const CUSTOMER_COMPANY_TYPE = [
  { label: 'PRIVATE', value: 'PRIVATE' },
  { label: 'GOVERNMENT', value: 'GOVERNMENT' },
  { label: 'GOVERNMENT_EO', value: 'GOVERNMENT_EO' }
];
export const CORPORATE_STATUS_OPTIONS = [
  { id: 'Open', name: 'Open', value: 'Open' },
  { id: 'Close', name: 'Close', value: 'Close' },
  { id: 'Rejected', name: 'Rejected', value: 'Rejected' },
  { id: 'Connected', name: 'Connected', value: 'Connected' },
  { id: 'In Progress', name: 'In Progress', value: 'In Progress' },
  { id: 'Feasible', name: 'Feasible', value: 'Feasible' },
  { id: 'Presently not Feasible', name: 'Presently not Feasible', value: 'Presently not Feasible' },
  { id: 'Partially Connected', name: 'Partially Connected', value: 'Partially Connected' }
];

export const SCOPE_OPTIONS = [
  { label: 'Scope 1', value: 'Scope 1' },
  { label: 'Scope 2', value: 'Scope 2' }
];

export const LOCATION_DETAILS_PREVIEW_DATA = [
  { key: 'Company Name', value: 'Rahim1' },
  { key: 'Company Address', value: 'Rahim1Rahim1Rahim1' },
  { key: 'Billing Account Number', value: '8926664769' },
  { key: 'Proposal Name', value: 'TEST 1' },
  { key: 'Service Type', value: '1:1 Internet Lease Line' },
  { key: 'Package', value: '100-FUP20Mbps-1Mbps-OGB-ILL 1:1' },
  { key: 'Loc Code', value: 'RAHIM/PO/01/012' },
  { key: 'ARC package value', value: '100' },
  { key: 'OTC value', value: '000' },
  { key: 'Loc Name', value: 'Test' },
  { key: 'Loc Pincode', value: '686545' },
  { key: 'Loc District', value: 'Kottayam' },
  { key: 'Loc Address', value: '111,check Post,Tholpetty' },
  { key: 'Last Mile Connectivity Diagram', value: 'Test' },
  { key: 'Mobile No', value: '000' },
  { key: 'Email ID', value: 'Test' },
  { key: 'Aadhar number', value: '000' },
  { key: 'Ration card number', value: 'Test' },
  { key: 'Circuit details', value: '000' },
  { key: 'Location Type', value: 'Urban' },
  { key: 'Service Provider', value: 'LNP' },
  { key: 'LNP', value: '6096977243 (ITMSP)' }
];

export const DUMMY_ENQ_CUSTOMER_DETAILS_DATA = {
  companyName: 'CompName_Feasibility_Check',
  contactName: 'ContName_FC',
  contactNumber: '9535430820',
  partnerId: 'PARTNER001',
  partnerName: 'Partner Name',
  feName: 'HARSA NEW FE',
  serviceType: 'VPN',
  locContactPerson: 'CP_FCK_A',
  locContactNumber: '9535430821',
  locContactEmail: 'sri@gmail.com',
  popName: 'POP_001',
  locDistrict: 'Kollam',
  pincodeLocationCode: 'LOC_FCK1',
  address: 'Sita Tower,Thiruvananthapuram',
  geolocationAddress: 'Geolocation Address Test',
  latitude: '8.520954',
  longitude: '76.944992',
  noOfUsers: '23',
  bandwidthRequired: '123',
  privateIpRequired: '23',
  staticIpRequired: '123',
  eOfficeIpRequired: '23',
  feasibilityStatus: 'Feasible',
  scope: 'Scope 1',
  remarks: ''
};

export const LOCATION_INVOICE_DATA = [
  {
    label: 'MSP-FIN',
    date: '2025-07-31 17:15:08',
    data: 'Approved the Locations and Invoice Generated'
  },
  {
    label: 'MSP-FIN',
    date: '2025-07-31 17:15:08',
    data: 'Approved the Locations and Invoice Generated'
  },
  {
    label: 'MSP-FIN',
    date: '2025-07-31 17:15:08',
    data: 'Approved the Locations and Invoice Generated'
  },
  {
    label: 'MSP-FIN',
    date: '2025-07-31 17:15:08',
    data: 'Approved the Locations and Invoice Generated'
  }
];

export const SUBSCRIBER_DEVICE_DETAILS = [
  { key: 'Device Type', value: 'TCKT1001' },
  { key: 'Status', value: 'Open' },
  { key: 'Issue', value: 'Internet not working' },
  { key: 'Submitted', value: '2025-09-10 09:30AM' },
  { key: 'Created By', value: 'kfon.websmesub' }
];

export const SUBSCRIBER_PACKAGE_DETAILS = [
  {
    label: 'packageData',
    data: '500MB'
  },
  {
    label: 'dataUsed',
    data: '500MB'
  },
  {
    label: 'addOnData',
    data: '500MB'
  },
  {
    label: 'addOnDataUsed',
    data: '500MB'
  },
  {
    label: 'remainingVolume',
    data: '500MB'
  },
  {
    label: 'currentBandwidthProfile',
    data: '500MB'
  },
  {
    label: 'remarks',
    data: '500MB'
  }
];

export const CORPORATE_KEYS = {
  ENQUIRY_LIST: SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST,
  ENQUIRY_EXPANDED_LIST: SERVER_SIDE_TABLE_KEYS.ENQUIRY_EXPANDED_LIST,
  ENQUIRY_LOCATION_LIST: SERVER_SIDE_TABLE_KEYS.ENQUIRY_LOCATION_LIST,
  CORPORATE_CUSTOMER_LIST: SERVER_SIDE_TABLE_KEYS.CORPORATE_CUSTOMER_LIST,
  CORPORATE_PACKAGES: SERVER_SIDE_TABLE_KEYS.CORPORATE_PACKAGES,
  CORPORATE_PROPOSAL_LIST: SERVER_SIDE_TABLE_KEYS.CORPORATE_PROPOSAL_LIST,
  CORPORATE_PURCHASE_ORDER_LIST: SERVER_SIDE_TABLE_KEYS.CORPORATE_PURCHASE_ORDER_LIST,
  SERVICES_LIST: 'serviceTypeList',
  ENQUIRY_DROPDOWN_LIST: 'enquiryList',
  COMPANY_TYPE_LIST: 'companyTypeList',
  SERVICE_TYPES_LIST: 'serviceTypesList',
  SUB_SERVICE_TYPES_LIST: 'subServiceTypesList',
  PLAN_TYPES_LIST: 'planTypesList',
  PROPOSAL_REVISIONS: 'proposalRevisions',
  PROPOSAL_DETAILS: 'proposalDetails',
  ENQUIRY_DETAILS: 'enquiryDetails',
  PACKAGE_TYPES_LIST: 'packageTypesList',
  PACKAGES_LIST: 'packagesList'
};

export const DUMMY_PACKAGES_DATA = {
  data: [
    {
      packageId: '888',
      packageName: 'Govt. Ultra New',
      packageType: 'FUP',
      renewalFee: '0904654199',
      validity: '365',
      speed: '200',
      planVolume: '15000 GB',
      fallbackSpeed: '5 Mbps',
      otc: '2500.00',
      serviceName: 'FTTH',
      subServiceName: 'GOVT_Essential',
      createdDate: '01-12-2025 12:55:55'
    },
    {
      packageId: '887',
      packageName: 'Govt. Turbo',
      packageType: 'Unlimited',
      renewalFee: '9004654199',
      validity: '365',
      speed: '100',
      planVolume: '10000 GB',
      fallbackSpeed: '2 Mbps',
      otc: '2500.00',
      serviceName: 'FTTH',
      subServiceName: 'GOVT_Essential',
      createdDate: '02-12-2025 12:55:55'
    },
    {
      packageId: '886',
      packageName: '100 - FUP 20Mbps-1Mbps-0GB',
      packageType: 'Unlimited',
      renewalFee: '9004654199',
      validity: '365',
      speed: '20',
      planVolume: '15000 GB',
      fallbackSpeed: '1 Mbps',
      otc: '500.00',
      serviceName: 'FTTH',
      subServiceName: 'GOVT_Essential',
      createdDate: '02-12-2025 12:55:55'
    }
  ]
};

export const DUMMY_PROPOSAL_DATA = {
  data: [
    {
      slNo: 1,
      status: 'Open',
      proposalName: 'New Proposal',
      proposalDocument: 'Document',
      customerName: 'Sema',
      companyType: 'Government',
      currentStatus: 'WIP-Created',
      nextStatus: 'Waiting for Review',
      poNo: 'PO-2544',
      createdDate: '2025-10-16 10:55:55'
    },
    {
      slNo: 2,
      status: 'Open',
      proposalName: 'Shardha-line Kerala State Broadband',
      proposalDocument: 'View Document',
      customerName: 'Shardha-line Kerala State Broadband',
      companyType: 'Government TO',
      currentStatus: 'WIP-Created',
      nextStatus: 'Waiting for Review',
      poNo: 'PO-2544',
      createdDate: '2025-07-31 17:00:55'
    },
    {
      slNo: 3,
      status: 'Open',
      proposalName: 'Proposal 123',
      proposalDocument: 'View Document',
      customerName: 'TESTING-CAR 43',
      companyType: 'Government',
      currentStatus: 'Proposal Created',
      nextStatus: 'Awaiting for Review',
      poNo: 'PO-3544',
      createdDate: '2025-10-16 10:55:55'
    },
    {
      slNo: 4,
      status: 'Proposal',
      proposalName: 'New Proposal',
      proposalDocument: 'View Document',
      customerName: 'Sema',
      companyType: 'Government',
      currentStatus: 'WIP-Created',
      nextStatus: 'Waiting for Review',
      poNo: 'PO-1544',
      createdDate: '2025-10-16 10:55:55'
    },
    {
      slNo: 5,
      status: 'In Progress',
      proposalName: 'Kerala Fiber Network Expansion',
      proposalDocument: 'View Document',
      customerName: 'Kerala State IT Mission',
      companyType: 'Government EO',
      currentStatus: 'Under Review',
      nextStatus: 'Pending Approval',
      poNo: 'PO-4455',
      createdDate: '2025-11-20 14:30:00'
    },
    {
      slNo: 6,
      status: 'Open',
      proposalName: 'Corporate Internet Package',
      proposalDocument: 'View Document',
      customerName: 'Tech Solutions Ltd',
      companyType: 'Private',
      currentStatus: 'Draft',
      nextStatus: 'Ready for Submission',
      poNo: 'PO-5566',
      createdDate: '2025-12-01 09:15:30'
    },
    {
      slNo: 7,
      status: 'Closed',
      proposalName: 'Educational Institution Connectivity',
      proposalDocument: 'View Document',
      customerName: 'University of Kerala',
      companyType: 'Government',
      currentStatus: 'Approved',
      nextStatus: 'Implementation',
      poNo: 'PO-6677',
      createdDate: '2025-09-15 11:45:00'
    }
  ]
};

export const DUMMY_REVISED_PROPOSAL_DATA = {
  data: [
    {
      slNo: 1,
      proposalName: 'SMB Proposal',
      proposalDocument: 'FUP',
      companyName: 'SMB Fibers',
      currentStatus: 'Proposal Rejected By MD',
      nextStatus: 'Waiting For Proposal Resubmission By MSP-MKTG',
      version: 1,
      createdDate: '02-12-2025 12:55:55'
    }
  ]
};

export const DUMMY_ENQUIRY_DATA = {
  data: [
    {
      enquiryId: 'ENQ001',
      companyName: 'Tech Solutions Ltd.',
      contactPerson: 'Alice Johnson',
      email: 'alice.johnson@techsolutions.com',
      contactNumber: '123-456-7890',
      requestedService: 'Internet',
      connectionType: 'Fiber',
      industry: 'IT Services',
      status: 'Open',
      source: 'Website',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    },
    {
      enquiryId: 'ENQ002',
      companyName: 'Green Energy Corp.',
      contactPerson: 'Bob Smith',
      email: 'bob.smith@greenenergy.com',
      contactNumber: '987-654-3210',
      requestedService: 'Solar',
      connectionType: 'Wireless',
      industry: 'Renewable Energy',
      status: 'Closed',
      source: 'Referral',
      createdBy: 'Admin'
    }
  ]
};

export const VISIBLE_COLUMNS_CORP_ENQ_LOCATION = [
  { header: 'select', accessor: 'select' },
  { header: 'slNo', accessor: 'slNo' },
  { header: 'status', accessor: 'status' },
  { header: 'feName', accessor: 'feName' },
  { header: 'partnerId', accessor: 'partnerId' },
  { header: 'partnerName', accessor: 'partnerName' },
  { header: 'customerName', accessor: 'customerName' },
  { header: 'contactName', accessor: 'contactName' },
  { header: 'contactNumber', accessor: 'contactNumber' },
  { header: 'contactEmail', accessor: 'contactEmail' },
  { header: 'serviceType', accessor: 'serviceType' },
  { header: 'locName', accessor: 'locName' },
  { header: 'district', accessor: 'District' },
  { header: 'additionalServices', accessor: 'additionalServices' },
  { header: 'receivedFrom', accessor: 'receivedFrom' }
];

export const getCorporatePackagesColumns = () => [
  { header: 'packageId', accessor: 'packageId' },
  { header: 'packageName', accessor: 'packageName' },
  { header: 'packageType', accessor: 'packageType' },
  { header: 'renewalFee', accessor: 'renewalFee' },
  { header: 'validity', accessor: 'validity' },
  { header: 'speed', accessor: 'speed' },
  { header: 'planVolume', accessor: 'planVolume' },
  { header: 'fallbackSpeed', accessor: 'fallbackSpeed' },
  { header: 'otc', accessor: 'otc' },
  { header: 'serviceName', accessor: 'serviceName' },
  { header: 'subServiceName', accessor: 'subServiceName' },
  { header: 'createdDate', accessor: 'createdDate' }
];

export const getCorporateProposalColumns = () => [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'status', accessor: 'status' },
  { header: 'proposalName', accessor: 'proposalName' },
  { header: 'proposalDocument', accessor: 'proposalDocument' },
  { header: 'customerName', accessor: 'customerName' },
  { header: 'companyType', accessor: 'companyType' },
  { header: 'currentStatus', accessor: 'currentStatus' },
  { header: 'nextStatus', accessor: 'nextStatus' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'poNo', accessor: 'poNo' },
  { header: 'action', accessor: 'action' }
];

export const getRevisedProposalColumns = () => [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'proposalName', accessor: 'proposalName' },
  { header: 'proposalDocument', accessor: 'proposalDocument' },
  { header: 'companyName', accessor: 'companyName' },
  { header: 'currentStatus', accessor: 'currentStatus' },
  { header: 'nextStatus', accessor: 'nextStatus' },
  { header: 'version', accessor: 'version' },
  { header: 'createdDate', accessor: 'createdDate' }
];

export const VISIBLE_COLUMNS_CORPORATE_ENQUIRY_LIST = [
  { header: 'enquiryId', accessor: 'enquiryId' },
  { header: 'customerName', accessor: 'companyName' },
  { header: 'contactName', accessor: 'contactName' },
  // { header: 'contactNumber', accessor: 'contactNumber' },
  // { header: 'emailId', accessor: 'emailId' },
  { header: 'status', accessor: 'status' },
  // { header: 'source', accessor: 'source' },
  { header: 'createdBy', accessor: 'createdBy' },
  { header: 'assignTo', accessor: 'assignTo' },
  { header: 'createdDate', accessor: 'createdDate' },
  // { header: 'requestedService', accessor: 'requestedService' },
  // { header: 'customerAddress', accessor: 'customerAddress' },
  { header: 'companyType', accessor: 'industry' },
  { header: 'totalNoOfConnections', accessor: 'totalNoOfConnections' },
  { header: 'additionalServices', accessor: 'additionalServices' },
  { header: 'feasibleConnections', accessor: 'feasibleConnections' },
  { header: 'nonFeasibleConnections', accessor: 'nonFeasibleConnections' },
  { header: 'action', accessor: 'action' }
];

export const DUMMY_ENQ_LOCATION_DATA = {
  data: [
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    },
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    }
  ]
};

export const VISIBLE_COLUMNS_CORPORATE_CUSTOMER = [
  { header: 'id', accessor: 'id' },
  { header: 'customerName', accessor: 'companyName' },
  { header: 'contactPersonName', accessor: 'contactName' },
  { header: 'contactMobile', accessor: 'contactNumber' },
  { header: 'contactEmail', accessor: 'emailId' },
  { header: 'pinCode', accessor: 'pinCode' },
  { header: 'companyType', accessor: 'companyType' },
  { header: 'kycDetails', accessor: 'kycDetails' },
  { header: 'taxPayerType', accessor: 'taxPayerType' },
  { header: 'createdDate', accessor: 'createdDate' },
  { header: 'approvalStatus', accessor: 'approvalStatus' },
  { header: 'action', accessor: 'action' }
];

export const DUMMY_CORPORATE_CUSTOMER_DATA = {
  data: [
    {
      id: '01',
      companyName: 'IT Infra',
      contactName: 'Corporate Customer ENKYC',
      contactNumber: '9004654199',
      emailId: 'ashamalathomas@gmail.com',
      pinCode: '695004',
      companyType: 'Private',
      kycStatus: 'Add KYC',
      taxPayerType: 'Regular',
      createdDate: '2025-08-18 14:54:01',
      approvalStatus: 'Approved by KFON-FIN'
    },
    {
      id: '02',
      companyName: 'ACS',
      contactName: 'Corporate Customer ENKYC',
      contactNumber: '9004654199',
      emailId: 'ashamalathomas@gmail.com',
      pinCode: '695004',
      companyType: 'Government',
      kycStatus: 'Add KYC',
      taxPayerType: 'SEZ',
      createdDate: '2025-07-29 09:33:14',
      approvalStatus: 'Approved by KFON-FIN'
    },
    {
      id: '03',
      companyName: 'CORPORATE WIFI MANAGEMENT(CC)',
      contactName: 'Corporate Customer ENKYC',
      contactNumber: '9004654199',
      emailId: 'ashamalathomas@gmail.com',
      pinCode: '695004',
      companyType: 'Private',
      kycStatus: 'Add KYC',
      taxPayerType: 'Regular',
      createdDate: '2025-07-16 13:05:30',
      approvalStatus: 'Approved by KFON-FIN'
    },
    {
      id: '04',
      companyName: 'Government_corp_curd_HARSHA_NL21',
      contactName: 'Corporate Customer',
      contactNumber: '9004654199',
      emailId: 'ashamalathomas@gmail.com',
      pinCode: '695004',
      companyType: 'Government',
      kycStatus: 'Add KYC',
      taxPayerType: 'SEZ',
      createdDate: '2025-05-10 17:55:58',
      approvalStatus: 'Blocked for New Kyc creation'
    },
    {
      id: '05',
      companyName: 'Government_corp_curd_HARSHA_NL21',
      contactName: 'Corporate Customer ENKYC',
      contactNumber: '9004654199',
      emailId: 'ashamalathomas@gmail.com',
      pinCode: '695004',
      companyType: 'Private',
      kycStatus: 'Add KYC',
      taxPayerType: 'Regular',
      createdDate: '2025-05-10 10:56:01',
      approvalStatus: 'Approved by KFON-FIN'
    },
    {
      id: '06',
      companyName: 'Government_corp_curd_HARSHA_NL21',
      contactName: 'Corporate Customer ENKYC',
      contactNumber: '9004654199',
      emailId: 'jam.roshnih@gmail.com',
      pinCode: '225004',
      companyType: 'Government EO',
      kycStatus: 'Add KYC',
      taxPayerType: 'Regular',
      createdDate: '2025-05-10 10:56:01',
      approvalStatus: 'Approved by KFON-FIN'
    },
    {
      id: '07',
      companyName: 'Government_corp_curd_HARSHA_NL21',
      contactName: 'Corporate Customer',
      contactNumber: '9004654199',
      emailId: 'ashamalathomas@gmail.com',
      pinCode: '695004',
      companyType: 'Private',
      kycStatus: 'Add KYC',
      taxPayerType: 'Regular',
      createdDate: '2025-05-10 10:56:01',
      approvalStatus: 'Approved by KFON-FIN'
    },
    {
      id: '08',
      companyName: 'Government_corp_curd_HARSHA_NL21',
      contactName: 'Corporate Customer',
      contactNumber: '9004654199',
      emailId: 'ashamalathomas@gmail.com',
      pinCode: '995004',
      companyType: 'Government EO',
      kycStatus: 'Add KYC',
      taxPayerType: 'SEZ',
      createdDate: '2025-05-10 10:56:01',
      approvalStatus: 'Approved by KFON-FIN'
    }
  ]
};

export const CUSTOMER_DETAILS_DUMMY_DATA = [
  { label: 'companyName', value: 'DEMO' },
  { label: 'contactPersonName', value: 'VISWA MOHAN' },
  { label: 'contactMobile', value: 'Home Connection' },
  { label: 'contactEmail', value: 'ahasan12@gmail.com' },
  { label: 'gstin', value: '32AAGFE7027D1ZW' },
  { label: 'gstinDocument', value: 'Document.pdf', isDocument: true },
  { label: 'sac', value: 'ertret' },
  { label: 'serviceDescription', value: 'ertret' },
  { label: 'supportingDocument', value: 'Document.pdf', isDocument: true },
  {
    label: 'address',
    value:
      'Kerala Fiber Optic Network Limited Second Floor, B Block, Divisional Office, Jeevan Prakash, Pattom, Thiruvananthapuram – 695004'
  },
  { label: 'pinCode', value: '695004' },
  { label: 'panNumber', value: 'viswa.mohan@railwire.co.in' },
  { label: 'panDocument', value: 'Document.pdf', isDocument: true },
  { label: 'taxPayerType', value: 'Regular' },
  { label: 'legalNameOfBusiness', value: 'ELECTROCARE' },
  { label: 'tradeName', value: 'ELECTRO CARE' },
  { label: 'lutDocument', value: 'Document.pdf', isDocument: true }
];

export const DROPDOWN_FALLBACK_DATA = {
  SERVICES: [
    { name: 'Direct Internet Access', id: 'dia' },
    { name: 'Broadband', id: 'broadband' },
    { name: 'Voice Services', id: 'voice' },
    { name: 'VPN', id: 'vpn' }
  ],
  ENQUIRIES: [
    { name: 'Enquiry 1', id: '1' },
    { name: 'Enquiry 2', id: '2' }
  ],
  COMPANY_TYPES: [
    { name: 'PRIVATE', id: 'private' },
    { name: 'GOVERNMENT', id: 'government' },
    { name: 'GOVERNMENT EO', id: 'government_eo' }
  ]
};
export const DUMMY_PROPOSAL_DETAILS_DATA = {
  id: '1',
  customerId: '01',
  customerName: 'IT Infra',
  proposalName: 'Reported issues fixed',
  billingFrequency: 'Monthly',
  remarks: 'Issues resolved and verified',
  standardTerms: 'View Details',
  specialTerms:
    '<h1>Heading1</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum sit nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque gravida id etiam sit sed arcu euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliquam.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis nisl cursus bibendum sit nulla accumsan sodales ornare. At urna viverra non suspendisse neque, lorem. Pretium condimentum pellentesque gravida id etiam sit sed arcu euismod. Rhoncus proin orci duis scelerisque molestie cursus tincidunt aliquam.</p><p><a href="#">Link text reuse anchor component</a></p>',
  totalAmount: '998,931.00',
  connectionBreakup: [
    {
      id: 'cb1',
      serviceType: 'Internet Lease Line',
      packageName: 'Unlimited',
      packageCost: '998,930.00',
      otcCharges: '4',
      noOfConnections: '3',
      totalAmount: '998,931.00',
      description: 'Test',
      discountPercent: '10'
    }
  ],
  connectionBreakupTotal: {
    packageName: 'total',
    packageCost: '998,930.00',
    otcCharges: '1.00',
    noOfConnections: '1',
    totalAmount: '998,931.00'
  },
  history: [
    {
      role: 'MSP-MKG',
      date: '20-12-2025 Fri 11:25 AM',
      status: 'Done',
      message: 'Done',
      isRight: true
    },
    {
      role: 'KFON-CSO',
      date: '19-12-2025 Thu 11:25 AM',
      status: 'Approved',
      message: 'Approved',
      isRight: false
    },
    {
      role: 'MSP-MKG',
      date: '18-12-2025 Wed 11:25 AM',
      status: 'Test',
      message: 'Test',
      isRight: true
    }
  ],
  discountHistory: [
    {
      discountPercent: '1',
      proposedBy: 'MSP-MKG',
      createDate: '2025-12-20 00:20:23'
    }
  ]
};

export const getConnectionBreakupColumns = () => [
  { header: 'serviceType', accessor: 'serviceType' },
  { header: 'packageName', accessor: 'packageName' },
  { header: 'packageCostA', accessor: 'packageCost' },
  { header: 'otcChargesB', accessor: 'otcCharges' },
  { header: 'noOfConnectionsC', accessor: 'noOfConnections' },
  { header: 'totalAmountFormula', accessor: 'totalAmount' },
  { header: 'description', accessor: 'description' },
  { header: 'discountPercent', accessor: 'discountPercent' }
];

export const BILLING_FREQUENCY_OPTIONS = [
  { id: 'monthly', labelKey: 'monthly' },
  { id: 'quarterly', labelKey: 'quarterly' },
  { id: 'yearly', labelKey: 'yearly' }
];

export const VISIBLE_COLUMNS_PURCHASE_ORDER_LIST = [
  { header: 'slNo', accessor: 'slNo' },
  { header: 'poNo', accessor: 'poNo' },
  { header: 'poNoSystem', accessor: 'poNoSystem' },
  { header: 'poDoc', accessor: 'poDoc' },
  { header: 'customerName', accessor: 'customerName' },
  { header: 'companyType', accessor: 'companyType' },
  { header: 'serviceStartDate', accessor: 'serviceStartDate' },
  { header: 'serviceEndDate', accessor: 'serviceEndDate' },
  { header: 'annualRecurringCharges', accessor: 'annualRecurringCharges' },
  { header: 'oneTimeCharges', accessor: 'oneTimeCharges' },
  { header: 'totalAmount', accessor: 'totalAmount' },
  { header: 'billingFrequency', accessor: 'billingFrequency' },
  { header: 'status', accessor: 'status' },
  { header: 'nextStatus', accessor: 'nextStatus' },
  { header: 'createdDate', accessor: 'createdDate' }
];

export const DUMMY_PURCHASE_ORDER_DATA = {
  data: [
    {
      slNo: 1,
      poNo: '123',
      poNoSystem: 'CE/PO/0468',
      poDoc: 'View Document',
      customerName: 'NEWBSS',
      companyType: 'Government',
      serviceStartDate: '2025-08-18 14:54:01',
      serviceEndDate: '2025-09-18 14:54:01',
      annualRecurringCharges: '300.00',
      oneTimeCharges: '100.00',
      totalAmount: '400.00',
      billingFrequency: 'Quarterly',
      status: 'MSP-MKG Created',
      nextStatus: 'Waiting for Creation',
      createdDate: '2025-09-18 14:54:01'
    },
    {
      slNo: 2,
      poNo: 'SRIHARSHA',
      poNoSystem: 'CE/PO/0468',
      poDoc: 'View Document',
      customerName: 'TESTING CABLES',
      companyType: 'Government EC',
      serviceStartDate: '2025-07-29 09:33:14',
      serviceEndDate: '2025-07-29 09:33:14',
      annualRecurringCharges: '32.00',
      oneTimeCharges: '323.00',
      totalAmount: '323.00',
      billingFrequency: 'Monthly',
      status: 'MSP-MKG Created',
      nextStatus: 'Task Completed',
      createdDate: '2025-07-29 09:33:14'
    },
    {
      slNo: 3,
      poNo: 'SRIHARSHA',
      poNoSystem: 'CE/PO/0468',
      poDoc: 'View Document',
      customerName: 'Tourism Department',
      companyType: 'Government EO',
      serviceStartDate: '2025-07-16 13:05:30',
      serviceEndDate: '2025-07-16 13:05:30',
      annualRecurringCharges: '1000.00',
      oneTimeCharges: '0.00',
      totalAmount: '1000.00',
      billingFrequency: 'Monthly',
      status: 'MSP-MKG Created',
      nextStatus: 'Task Completed',
      createdDate: '2025-07-16 13:05:30'
    },
    {
      slNo: 4,
      poNo: 'SRIHARSHA',
      poNoSystem: 'CE/PO/0468',
      poDoc: 'View Document',
      customerName: 'Kerala State Backward Classes',
      companyType: 'Government',
      serviceStartDate: '2025-06-10 17:55:58',
      serviceEndDate: '2025-06-10 17:55:58',
      annualRecurringCharges: '200.00',
      oneTimeCharges: '2.00',
      totalAmount: '100.00',
      billingFrequency: 'Monthly',
      status: 'MSP-MKG Created',
      nextStatus: 'Task Completed',
      createdDate: '2025-06-10 17:55:58'
    },
    {
      slNo: 5,
      poNo: '1PO No Customer',
      poNoSystem: 'CE/PO/0468',
      poDoc: 'View Document',
      customerName: 'Kerala State Backward Classes',
      companyType: 'Government EO',
      serviceStartDate: '2025-06-10 10:56:01',
      serviceEndDate: '2025-06-10 10:56:01',
      annualRecurringCharges: '2.00',
      oneTimeCharges: '4.00',
      totalAmount: '2.00',
      billingFrequency: 'Quarterly',
      status: 'MSP-MKG Created',
      nextStatus: 'Task Completed',
      createdDate: '2025-06-10 10:56:01'
    }
  ]
};
