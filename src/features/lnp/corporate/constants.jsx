import { Button } from '@kfonbss/bss-ui-components';

export const STATE_REDUCER_KEY = 'lnp-corporate-subs';

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

export const getSubscriberDetails = ({ setIsDocOpen }) => {
  return [
    { key: 'Company Name', value: 'Rahim1' },
    { key: 'Company Address', value: 'Rahim1Rahim1Rahim1' },
    { key: 'Billing Account Number', value: '8926664769' },
    { key: 'Circuit Details', value: '' },
    { key: 'Username', value: 'kfoncor.rahimpo05' },
    { key: 'Loc Name', value: 'Test' },
    { key: 'Loc Code', value: 'RAHIM/PO/01/007' },
    { key: 'Loc Address', value: '106,check Post,Tholpetty' },
    { key: 'PO No', value: 'RAHIM/PO/01' },
    { key: 'Package', value: '4-FUP19Mbps-1Mbps-1GB-FTTH' },
    { key: 'Commission Date', value: '2025-07-28' },
    {
      key: 'Commission Document',
      value: (
        <Button variant={'outline'} onClick={() => setIsDocOpen(true)}>
          View Doc
        </Button>
      )
    },
    { key: 'Expiry Date', value: '2025-08-26' },
    { key: 'LNP ID', value: '6096977243' },
    { key: 'LNP Name', value: 'ITMSP' },
    { key: 'District', value: 'Kottayam' }
  ];
};

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
