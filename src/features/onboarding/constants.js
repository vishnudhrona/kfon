export const STATE_REDUCER_KEY = 'onboarding-key';
export const LNP_KEY = 'LNP';
export const YES_KEY = 'Yes';
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// Partner category pill colors (Figma). Keyed by upper-cased category value.
export const PARTNER_CATEGORY_STYLES = {
  RUBY: { bg: '#E0115F', color: 'white' },
  GOLD: { bg: '#EFBF04', color: 'black' },
  SILVER: { bg: '#C4C4C4', color: 'black' },
  BRONZE: { bg: '#CE8946', color: 'black' },
  DIAMOND: { bg: '#ACCFE6', color: 'black' },
  PLATINUM: { bg: '#D9D9D9', color: 'black' },
  SEED: { bg: '#A3A879', color: 'black' },
  YTS: { bg: '#96A8DA', color: 'black' }
};

export const DEFAULT_CATEGORY_STYLE = { bg: 'primary.500', color: 'white' };

export const DOCUMENT_TYPE_MAP = {
  cancelledChequeCopy: 'BANK_CHEQUE',
  panCardSupportingDocument: 'PAN_CARD',
  gstRegistrationDocument: 'GST_DOCUMENT',
  cableTvLicenseOrCompanyRegCert: 'CABLE_TV_LICENCE',
  agreementCopy: 'AGREEMENT_COPY',
  aadhaarCopy: 'AADHAAR_COPY'
};

export const VISIBLE_COLUMNS_LNP_PARTNERS_LIST = [
  { accessor: 'id', header: 'Id' },
  { accessor: 'status.name', header: 'Status' },
  { accessor: 'trackingId', header: 'Tracking ID' },
  { accessor: 'partnerName', header: 'Name' },
  { accessor: 'partnerMobile', header: 'Mobile' },
  { accessor: 'partnerPhone', header: 'Phone' },
  { accessor: 'partnerEmail', header: 'Email' },
  { accessor: 'district', header: 'District' },
  { accessor: 'partnerLocation', header: 'Location' },
  { accessor: 'partnerPincode', header: 'Pincode' },
  { accessor: 'createdBy', header: 'Created By' },
  // { accessor: 'createdByEmpName', header: 'Created By Name' },
  { accessor: 'createdDt', header: 'Submitted' }
];

export const VISIBLE_COLUMNS_AGNP_PARTNERS_LIST = [
  { accessor: 'agnpId', header: 'Id' },
  { accessor: 'status.name', header: 'Status' },
  { accessor: 'trackingId', header: 'Tracking ID' },
  { accessor: 'agnpName', header: 'AGNP Name' },
  { accessor: 'agnpContactName', header: 'Contact Name' },
  { accessor: 'agnpMobileNumber', header: 'Mobile Number' },
  { accessor: 'agnpEmail', header: 'Email' },
  { accessor: 'agnpDistrict', header: 'District' },
  { accessor: 'agnpLocation', header: 'Location' },
  { accessor: 'agnpPincode', header: 'Pincode' },
  { accessor: 'agnpCreatedBy', header: 'Created By' },
  { accessor: 'createdDt', header: 'Submitted' }
];

export const VISIBLE_COLUMNS_VLAN_ASSOCIATION = [
  { accessor: 'franchiseId', header: 'Partner ID' },
  { accessor: 'franchiseName', header: 'Partner Name' },
  { accessor: 'vlanId', header: 'VLAN ID' },
  { accessor: 'vlanShortName', header: 'VLAN Short Name' },
  { accessor: 'nasType', header: 'NAS Profile' }
];

export const VISIBLE_COLUMNS_VLAN_REQUEST = [
  { accessor: 'partnerId', header: 'Partner ID' },
  { accessor: 'partnerCompanyName', header: 'Partner Company Name' },
  { accessor: 'district', header: 'District' },
  { accessor: 'status.name', header: 'Status' },
  { accessor: 'remarks', header: 'Remarks' },
  { accessor: 'createdBy', header: 'Created By' },
  { accessor: 'createdOn', header: 'Created On' },
  { accessor: 'updatedOn', header: 'Updated On' }
];
