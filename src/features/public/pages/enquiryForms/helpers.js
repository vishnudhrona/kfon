export function parseAddressComponents(components) {
  const get = (type) => components.find((c) => c.types.includes(type))?.long_name || '';

  return {
    city: get('locality'),
    state: get('administrative_area_level_1'),
    district: get('administrative_area_level_3'),
    postOffice: get('sublocality_level_1') || get('sublocality'),
    area: get('neighborhood') || get('route')
  };
}

export const formatHomeEnquiryRequest = (data) => {
  const { firstName, lastName, mailId, mobileNumber, location, pinCode, postOffice, district, districtId } = data;
  return {
    firstName: firstName,
    lastName: lastName,
    cusMobile: mobileNumber,
    cusEmail: mailId,
    cusAddress: location?.fullAddress,
    houseNo: '',
    cusState: location?.state,
    cusCity: location?.city,
    cusLocation: location?.fullAddress,
    cusPincode: pinCode,
    postOffice: postOffice,
    district: district,
    districtId: districtId,
    location: location?.area,
    latitude: location?.lat,
    longitude: location?.lng
  };
};

export const formatCorpGovEnquiryRequest = (data) => {
  const {
    customerType,
    organizationName,
    contactPerson,
    mobileNumber,
    email,
    pinCode,
    district,
    districtId,
    department,
    subDepartment,
    location,
    latitude,
    longitude,
    // Legacy fields for backward compatibility
    firstName,
    lastName,
    mailId,
    companyName,
    services
  } = data;

  const formattedServices = (services || []).map((serviceData) => ({
    serviceId: serviceData.serviceId || serviceData.id || serviceData,
    noOfConnections: serviceData.noOfConnections || serviceData.val || 1
  }));

  return {
    companyType: customerType,
    companyName: organizationName || companyName,
    contactPerson: contactPerson || (firstName && lastName ? `${firstName} ${lastName}` : ''),
    contactNumber: mobileNumber,
    emailId: email || mailId,
    pinCode: pinCode,
    district: districtId || district,
    address: location,
    department: department?.departmentId || department?.id || department || '',
    subDepartment: subDepartment?.subDepartmentId || subDepartment?.id || subDepartment || '',
    latitude: latitude,
    longitude: longitude,
    services: formattedServices
  };
};

export const formatAGNPEnquiryRequest = (data) => {
  return {
    enquiryType: 'AGNP',
    cusMobile: data?.mobileNumber || '',
    agnpName: data?.agnpName || '',
    agnpAssocAnyOtherIsp: data?.associatedIsp || '',
    agnpContactName: data?.contactName || '',
    agnpMobileNumber: data?.mobileNumber || '',
    agnpAltrContactNumber: data?.altMobileNumber || '',
    agnpLandlineNumber: data?.landline || '',
    agnpEmail: data?.email || '',
    agnpAddress: data?.fullAddress || '',
    agnpLocation: data?.location || '',
    agnpLatitude: data?.latitude || '',
    agnpLongitude: data?.longitude || '',
    agnpPincode: data?.pincode || '',
    agnpPostoffice: data?.postOffice?.name || '',
    agnpPostofficeId: data?.postOffice?.id || '',
    agnpDistrict: data?.district || '',
    districtId: data?.districtId || ''
  };
};

export const formatLNPEnquiryRequest = (data = {}) => {
  const {
    partnerCompanyName = '',
    partnerContactName = '',
    partnerMobileNumber = '',
    landline = '',
    landlineNumber = '',
    partnerEmail = '',
    partnerFullAddress = '',
    partnerLocation = '',
    latitude = '',
    longitude = '',
    pincode = '',
    associatedIsp = '',
    existingCableTVSubscribers = '',
    existingInternetSubscribers = '',
    fibreKm = '',
    postOffice = '',
    district = '',
    createdBy = 'LNP',
    districtId = ''
  } = data;

  return {
    enquiryType: 'LNP',
    cusMobile: partnerMobileNumber,
    partnerName: partnerContactName,
    partnerMobile: partnerMobileNumber,
    partnerPhone: landline,
    partnerLandline: landlineNumber,
    partnerEmail: partnerEmail,
    partnerAddress: partnerFullAddress,
    partnerLocation: partnerLocation,
    partnerPincode: pincode,
    partnerAssocAnyOtherIsp: associatedIsp,
    partnerLatitude: latitude,
    partnerLongitude: longitude,
    partnerCableTvSubCount: existingCableTVSubscribers,
    partnerInternetSubCount: existingInternetSubscribers,
    partnerNetworkQty: fibreKm,
    partnerCompanyName: partnerCompanyName,
    partnerPostOffice: postOffice?.name || '',
    postOfficeId: postOffice?.id || '',
    district: district,
    districtId,
    createdBy: createdBy
  };
};

export const formatDarkFibreEnquiryRequest = (data) => {
  return {
    enquiryType: 'DARK_FIBRE',
    cusMobile: data?.firmPhoneNumber || '',
    firmName: data?.nameOfTheFirm || '',
    address: data?.fullAddress || '',
    firmContactNo: data?.firmPhoneNumber || '',
    firmEmail: data?.firmEmail || '',
    contactPersonName: data?.contactPersonName || '',
    contactMobileNo: data?.contactPersonPhoneNumber || '',
    contactEmail: data?.contactPersonEmail || '',
    leasePurpose: data?.purposeOfLeasing || '',
    telecomAreaCircle: data?.areaCircleWhereTelecomServiceIs || '',
    behalfCompanyLease: data?.forAndOnBehalfLeaseCompanyMS || ''
  };
};

export const formatBPLEnquiryRequest = (data) => {
  return {
    enquiryType: 'BPL',
    cusMobile: data?.aadhaarLinkedMobileNumber || '',
    rationCardHolderName: data?.rationCardHolderName || '',
    rationCardNumber: data?.rationCardNumber || '',
    mobileNumber: data?.aadhaarLinkedMobileNumber || '',
    ksebConsumerNumber: data?.ksebConsumerNumber || '',
    aadharNumber: data?.aadhaarNumberOfRationCardHolder || '',
    installationAddress: data?.installationAddress || '',
    pincode: data?.pincode || '',
    postOffice: data?.postOffice || '',
    districtId: data?.districtId || '',
    district: data?.district || '',
    referralCode: data?.referralCode || ''
  };
};

export const formatLNPEnquiryResponse = (data) => {
  if (!data) return null;

  return {
    message: data?.message || '',
    partnerCompanyName: data?.partnerCompanyName || '',
    partnerName: data?.partnerName || '',
    partnerMobile: data?.partnerMobile || '',
    partnerEmail: data?.partnerEmail || '',
    trackingId: data?.trackingId || ''
  };
};

export const formatAGNPEnquiryResponse = (data) => {
  if (!data) return null;

  return {
    message: data?.message || '',
    agnpName: data?.agnpName || '',
    agnpContactName: data?.agnpContactName || '',
    agnpMobileNumber: data?.agnpMobileNumber || '',
    agnpAltrContactNumber: data?.agnpAltrContactNumber || '',
    agnpEmail: data?.agnpEmail || '',
    agnpAssocAnyOtherIsp: data?.agnpAssocAnyOtherIsp || '',
    agnpAddress: data?.agnpAddress || '',
    agnpLocation: data?.agnpLocation || '',
    trackingId: data?.trackingId || ''
  };
};
