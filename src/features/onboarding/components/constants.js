export const transformRowToPreviewData = (data, t, handlers = {}) => {
  if (!data || Object.keys(data).length === 0) return [];
  const {
    basicDetails = {},
    agreementDetails = {},
    bankDetails = {},
    kycGstInformation = {}
  } = data;

  const dynamicFields = [
    { label: 'partnerId', value: basicDetails?.partnerId ?? '-' },
    { label: 'companyName', value: basicDetails?.companyName ?? '-' },
    {
      label: 'cableTVLicense/CompanyRegistrationNo',
      value: agreementDetails?.companyRegistrationNo ?? '-'
    },
    {
      label: 'companyAddress',
      value: [basicDetails?.addressLine1, basicDetails?.addressLine2].filter(Boolean).join(', ') || '-'
    },
    { label: 'district', value: basicDetails.district ?? '-' },
    { label: 'contactPerson', value: basicDetails.keyContactName ?? '-' },
    { label: 'phone', value: basicDetails.keyContactNumber ?? '-' },
    { label: 'alternatePhone', value: basicDetails.alternatePhone ?? '-' },
    { label: 'email', value: basicDetails.email ?? '-' },
    {
      label: 'locationType',
      value: basicDetails.locationType === 0 ? 'Urban' : basicDetails.locationType === 1 ? 'Rural' : '-'
    },
    { label: 'vlanID', value: basicDetails.vlanId ?? '-' },
    { label: 'serviceableArea', type: 'button', buttonLabel: 'addServiceArea', onClick: handlers.onAddServiceArea },
    { label: 'serviceableArea', type: 'button', buttonLabel: 'view', onClick: handlers.onViewServiceableArea },
    { label: 'popName', value: (() => { const p = agreementDetails.popName; return Array.isArray(p) ? p.map((x) => x?.name ?? x).join(', ') : (p?.name ?? p ?? '-'); })() },
    { label: 'brasIp', value: agreementDetails.brasIp ?? '-' },
    { label: 'switchIp', value: bankDetails.switchIp ?? '-' },
    { label: 'interface', value: bankDetails.interface ?? '-' },
    { label: 'portNo', value: bankDetails.portNo ?? '-' },
    { label: 'portSpeed', value: bankDetails.portSpeed ?? '-' },
    { label: 'rconvergeAgreementType', value: bankDetails.bankDocument ?? '-' },
    { label: 'lastRenewedRconvergeAgreementDate', value: bankDetails.bankDocument ?? '-' },
    { label: 'rconvergeAgreementNo', value: bankDetails.bankDocument ?? '-' },
    { label: 'cableTVLicense/CompanyRegistrationProof', type: 'button', buttonLabel: 'view' },
    { label: 'oltProvider', value: agreementDetails.oltProvider ?? '-' },
    { label: 'addPonPort', type: 'button', buttonLabel: 'addPonPortDetails', onClick: handlers.onAddPonPort },
    { label: 'ponPort', type: 'button', buttonLabel: 'view', onClick: handlers.onViewPonPort },
    { label: 'panNumber', value: kycGstInformation?.pan ?? '-' },
    { label: 'panCardProof', type: 'button', buttonLabel: 'view', onClick: handlers.onViewPanCardProof },
    { label: 'aadharNumber', value: kycGstInformation?.aadhaarNumber ?? '-' },
    { label: 'aadharDocument', type: 'button', buttonLabel: 'view', onClick: handlers.onViewAadharDocument },
    { label: 'gstinNo', value: kycGstInformation?.gstin ?? '-' },
    { label: 'gstinProof', type: 'button', buttonLabel: 'view', onClick: handlers.onViewGstinProof },
    { label: 'sacNo', value: kycGstInformation?.sac ?? '-' },
    { label: 'taxPayerType', value: kycGstInformation?.taxPayerType ?? '-' },
    { label: 'legalNameOfBusiness', value: kycGstInformation?.legalName ?? '-' },
    { label: 'tradeNameOfBusiness', value: kycGstInformation?.tradeName ?? '-' },
    { label: 'gstDeclaration', value: kycGstInformation?.gstDeclaration ?? '-' },
    { label: 'subscriberOnlineRecharge', value: bankDetails?.subscriberOnlineRecharge ?? '-' },
    { label: 'paymentMode', value: bankDetails?.paymentMode ?? '-' },
    { label: 'bankAccountHolderName', value: bankDetails?.bankAcHolderName ?? '-' },
    { label: 'bankAccountType', value: bankDetails?.bankAcType ?? '-' },
    { label: 'ifscCode', value: bankDetails?.bankIfsc ?? '-' },
    { label: 'bankName', value: bankDetails?.bankName ?? '-' },
    { label: 'bankBranch', value: bankDetails?.bankBranch ?? '-' },
    { label: 'bankAccountNo', value: bankDetails?.bankAcNo ?? '-' },
    { label: 'bankDetailsProof', type: 'button', buttonLabel: 'view' },
    { label: 'linkEstablishmentStatus', value: agreementDetails?.linkEstablishmentStatus ?? '-' },
    { label: 'linkType', value: agreementDetails?.linkType ?? '-' },
    { label: 'dateOfLinkEstablishment', value: agreementDetails?.dateOfLinkEstablishment ?? '-' },
    { label: 'frcReceived', value: agreementDetails?.frcReceived ?? '-' },
    { label: 'frcPaymentDate', value: agreementDetails?.frcPaymentDate ?? '-' },
    { label: 'reasonForNotLinkDelivery', value: agreementDetails?.reasonForNotLinkDelivery ?? '-' },
    { label: 'briefReason', value: agreementDetails?.briefReason ?? '-' }
  ];

  return dynamicFields.map((field) => ({
    ...field,
    label: t(field.label),
    placeholder: field.placeholder ? t(field.placeholder) : undefined,
    buttonLabel: field.buttonLabel ? t(field.buttonLabel) : undefined,
    value: field.value && typeof field.value === 'string' && field.value !== '-' ? field.value : field.value,
    onClick: field.onClick,
    rules: field.rules
      ? {
          ...field.rules,
          required: field.rules.required ? t(field.rules.required) : undefined
        }
      : undefined
  }));
};

export const ADD_SERVICE_AREA = [
  { header: 'Sl No', accessor: 'slno' },
  { header: 'Pincode', accessor: 'pinCode' },
  { header: 'Post Office', accessor: 'postOfficeName' }
];

export const ADD_PON_PORT = [
  { header: 'Sl No', accessor: 'slno' },
  { header: 'OLT Device', accessor: 'oltDevice' },
  { header: 'Port No', accessor: 'portNo' }
];
