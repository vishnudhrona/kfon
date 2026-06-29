export const STATE_REDUCER_KEY = 'enquiry-forms';

export const LNP_ENQ_FORM = {
  formName: 'lnpForm',
  title: 'localConnectivityNetworkPartnerEnquiry',
  sectionTitles: {
    company: 'companyInformation',
    personal: 'personalInformation'
  },
  fieldLabels: {
    company: {
      companyName: 'partnerCompanyName',
      currentlyAssociatedWithAnyOtherISP: 'currentlyAssociatedWithAnyOtherISP?',
      contactName: 'contactName'
    },
    personal: {
      partnerMobileNumber: 'partnerMobileNumber',
      landLineNumber: 'landLineNumber',
      email: 'partnerEmail',
      fullAddress: 'partnerFullAddress',
      location: 'partnerLocation',
      locationLatitude: 'partnerLocationLatitude',
      locationLongitude: 'partnerLocationLongitude',
      pinCode: 'partnerPinCode',
      postOffice: 'postOffice',
      district: 'district',
      uploadCableTVRegistrationLicense: 'uploadCableTVRegistrationLicense',
      totalNoOfExistingCableTVSubscriber: 'totalNoOfExistingCableTVSubscriber',
      totalNoOfExistingInternetSubscriber: 'totalNoOExistingInternetSubscriber',
      totalFibreAvailable: 'totalQuantityOfFibreAvailable(in KM)',
      createdBy: 'createdBy'
    }
  }
};

export const AGNP_ENQ_FORM = {
  formName: 'agnpForm',
  title: 'agnpEnquiry',
  sectionTitles: {
    company: 'companyInformation',
    geographic: 'geographicInformation'
  },
  fieldLabels: {
    company: {
      name: 'agnpName',
      currentlyAssociatedWithAnyOtherISP: 'currentlyAssociatedWithAnyOtherISP?',
      contactName: 'agnpContactName',
      agnpMobileNumber: 'agnpMobileNumber',
      agnpAltMobileNumber: 'agnpAltMobileNumber',
      landLineNumber: 'landLineNumber',
      agnpEmail: 'agnpEmail',
      agnpFullAddress: 'agnapFullAddress',
      agnpLocation: 'agnpLocation'
    },
    geographic: {
      agnpLocationLatitude: 'agnpLocationLatitude',
      agnpLocationLongitude: 'agnpLocationLongitude',
      agnpPinCode: 'agnpPinCode',
      agnpPostOffice: 'agnpPostOffice',
      district: 'district'
    }
  }
};

export const DARK_FIBER_ENQ_FORM = {
  formName: 'darkFiberForm',
  title: 'darkFiberEnquiry',
  sectionTitles: {
    company: 'companyInformation',
    contact: 'contactInformation',
    document: 'documentsCollection'
  },
  fieldLabels: {
    company: {
      name: 'nameOfTheFirm',
      address: 'fullAddress'
    },
    contact: {
      phone: 'firmPhoneNumber',
      email: 'firmEmail',
      contactName: 'contactPersonName',
      contactPhone: 'contactPersonPhoneNumber',
      contactEmail: 'contactPersonEmail',
      purpose: 'purposeOfLeasing'
    },
    document: {
      license: 'uploadInternetServiceLicense',
      provided: 'areaCircleWhereTelecomServiceIsProvided',
      experience: 'uploadCertificateInSupportOfExperience',
      behalfCompanyLease: 'forAndOnBehalfLeaseCompanyMS',
      coverLetter: 'uploadCoveringLetter',
      routeLease: 'uploadDetailsOfTheRouteLease'
    }
  }
};

export const SUBSCRIBER_ENQ_FORM = {
  formName: 'subscriberForm',
  title: 'subscriptionEnquiry',
  sectionTitles: {
    personal: 'personalInformation'
  },
  fieldLabels: {
    personal: {
      name: 'name',
      mobileNumber: 'mobileNumber',
      consumerNo: 'KSEBConsumerNumber',
      search: 'searchInstallationAddress',
      address: 'installationAddress',
      location: 'location',
      postOffice: 'postOffice',
      referralCode: 'referralCode'
    }
  }
};

export const CORPORATE_ENQ_FORM = {
  formName: 'corpForm',
  title: 'corporateEnquiry',
  sectionTitles: {
    company: 'companyInformation',
    service: 'serviceInformation'
  },
  fieldLabels: {
    company: {
      companyName: 'partnerCompanyName',
      contactName: 'contactName',
      contactNumber: 'contactNumber',
      emailId: 'emailId',
      companyAddress: 'companyLocationAddress',
      companyType: 'companyType'
    },
    service: {
      requestedService: 'servicesRequired',
      latitude: 'locationLatitude',
      longitude: 'locationLongitude'
    }
  }
};

export const BPL_ENQ_FORM = {
  formName: 'bplForm',
  title: 'bplSubscriptionEnquiry',
  sectionTitles: {
    personalInformation: 'personalInformation',
    addressInformation: 'addressInformation'
  },
  fieldLabels: {
    personalInformation: {
      rationCardHolderName: 'rationCardHolderName',
      aadhaarLinkedMobileNumber: 'aadhaarLinkedMobileNumber',
      ksebConsumerNumber: 'ksebConsumerNumber',
      aadhaarNumberOfRationCardHolder: 'aadhaarNumberOfRationCardHolder',
      address: 'installationAddress'
    },
    addressInformation: {
      pinCode: 'pinCode',
      postOffice: 'postOffice',
      district: 'district',
      referralCode: 'referralCode'
    }
  }
};

// temp
export const COMPANY_TYPES = [
  { label: 'Private Limited', value: 'private_ltd' },
  { label: 'Public Limited', value: 'public_ltd' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Sole Proprietorship', value: 'sole' },
  { label: 'Government', value: 'government' }
];

export const SERVICES = [
  { label: 'Internet Connection', value: 'internet' },
  { label: 'VPN Service', value: 'vpn' },
  { label: 'Cloud Hosting', value: 'cloud' },
  { label: 'Security Audit', value: 'security' },
  { label: 'IT Consultancy', value: 'consultancy' }
];

export const POST_OFFICES = [
  { label: 'Pattom', value: 'pattom' },
  { label: 'Sasthamangalam', value: 'sasthamangalam' },
  { label: 'Kowdiar', value: 'kowdiar' },
  { label: 'Vellayambalam', value: 'vellayambalam' },
  { label: 'Medical College', value: 'medical_college' },
  { label: 'Palayam', value: 'palayam' },
  { label: 'Thampanoor', value: 'thampanoor' },
  { label: 'Kesavadasapuram', value: 'kesavadasapuram' },
  { label: 'Attakulangara', value: 'attakulangara' },
  { label: 'Peroorkada', value: 'peroorkada' },
  { label: 'Vazhuthacaud', value: 'vazhuthacaud' },
  { label: 'Vattiyoorkavu', value: 'vattiyoorkavu' },
  { label: 'Sreekariyam', value: 'sreekariyam' },
  { label: 'Kazhakkoottam', value: 'kazhakkoottam' },
  { label: 'Technopark', value: 'technopark' }
];

export const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

/** Map instance ID for styled/cloud-managed map styles */
export const MAP_ID = '1121b9d6278db46adcf1b443';

/** Geographic centre of Kerala — used as the default view when no coordinates are provided */
export const MAP_DEFAULT_CENTER = { lat: 10.8505, lng: 76.2711 };

/** Zoom level for a state-wide overview (no coordinates provided) */
export const MAP_OVERVIEW_ZOOM = 8;

/** Zoom level when a specific location is pinned */
export const MAP_LOCATION_ZOOM = 15;

export const CONNECTION_TYPE = {
  CORPORATE: 'Corporate',
  GOVERNMENT: 'Government'
};

export const CUSTOMER_TYPES = [
  { id: 1, name: 'Private', code: 'PRIVATE' },
  { id: 2, name: 'Government', code: 'GOVERNMENT' }
];

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export const MALAYALAM_BPL_FORM_MESSAGES = {
  bplFormClosedMessage:
    'നമസ്കാരം! BPL ഉപഭോക്താക്കൾക്കായുള്ള രജിസ്ട്രേഷൻ ഇപ്പോൾ അവസാനിച്ചിരിക്കുന്നു. കണക്ഷൻ വേണ്ടി ഇപ്പോൾ അപേക്ഷിച്ചിരിക്കുന്നവർക്ക് മുന്നാം ഘട്ടത്തിൽ കണക്ഷൻ ലഭിക്കുന്നതായിരിക്കും.'
};
