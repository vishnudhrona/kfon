import * as yup from 'yup';

import { dropdownRequired, isValidCirclePincode, regex, trimString, validation } from '@/utils/validationUtils';

export const homeSubscriberschema = (t, { circleOptional = false } = {}) => {
  const validate = validation(t);

  return yup.object().shape({
    circle: circleOptional ? yup.mixed().nullable() : dropdownRequired(validate.required('circle')),

    firstName: yup
      .string()
      .trim()
      .required(validate.required('firstName'))
      .min(3, validate.invalidMinLength('firstName', 3))
      .max(100, validate.invalidMaxLength('firstName', 100))
      .matches(regex.personNameRegex, t('invalidFirstName')),

    lastName: yup.string().trim().nullable(),

    pinCode: yup
      .string()
      .trim()
      .test('pincode-format', t('invalidPinCode'), function (value) {
        return isValidCirclePincode(value, this.parent.circle);
      })
      .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value))
      .required(validate.required('pinCode')),

    postOffice: yup.mixed().nullable(),

    district: yup.string().nullable(),

    location: yup.object().shape({
      fullAddress: yup
        .string()
        .trim()
        .required(validate.required('installationAddress'))
        .test('location-confirmed', t('locationNotConfirmed'), function () {
          const { lat, lng } = this.parent;
          return !this.parent.fullAddress || (!!lat && !!lng);
        }),
      lat: yup.number().nullable().typeError(validate.mustBeNumber('latitude')),
      lng: yup.number().nullable().typeError(validate.mustBeNumber('longitude'))
    }),

    mobileNumber: yup
      .string()
      .trim()
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('mobileNumber')),

    mailId: yup.string().trim().nullable()
  });
};

export const corporateEnquirySchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    firstName: yup
      .string()
      .trim()
      .required(validate.required('firstName'))
      .min(3, validate.invalidMinLength('firstName', 3))
      .max(100, validate.invalidMaxLength('firstName', 100))
      .matches(regex.personNameRegex, t('invalidFirstName'))
      .test('single-dot', t('invalidFirstName'), (value) => !value || (value.match(/\./g) || []).length <= 1),

    lastName: yup
      .string()
      .trim()
      .required(validate.required('lastName'))
      .min(3, validate.invalidMinLength('lastName', 3))
      .max(100, validate.invalidMaxLength('lastName', 100))
      .matches(regex.personNameRegex, t('invalidLastName'))
      .test('single-dot', t('invalidLastName'), (value) => !value || (value.match(/\./g) || []).length <= 1),

    mobileNumber: yup
      .string()
      .trim()
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('mobileNumber')),

    mailId: yup
      .string()
      .trim()
      .required(validate.required('emailId'))
      .max(254, validate.invalidMaxLength('emailId', 254))
      .matches(regex.email, validate.invalidFormat('emailId')),

    companyName: yup
      .string()
      .trim()
      .required(validate.required('companyName'))
      .min(3, validate.invalidMinLength('companyName', 3))
      .max(150, validate.invalidMaxLength('companyName', 150))
      .matches(regex.orgName, t('invalidCompanyName')),

    industry: yup
      .object({
        value: yup.string().required(),
        name: yup.string().required()
      })
      .nullable()
      .required('Industry is required'),

    service: yup
      .object({
        value: yup.string().required(),
        name: yup.string().required()
      })
      .nullable()
      .required('Service is required'),

    pinCode: yup
      .string()
      .trim()
      .matches(regex.pinCode, { message: t('invalidPinCode'), excludeEmptyString: true })
      .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value))
      .required(validate.required('pinCode'))
  });
};

export const corporateGovernmentEnquirySchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    circle: dropdownRequired(validate.required('circle')),

    customerType: yup
      .mixed()
      .transform((value) => {
        if (typeof value === 'object' && value?.code) return value.code;
        if (typeof value === 'string') return value.trim();
        return '';
      })
      .test('required', validate.required('customerType'), (value) => !!value),

    department: yup.mixed().when('customerType', {
      is: (val) => {
        if (!val) return false;
        if (typeof val === 'string') return val === 'GOVERNMENT';
        if (typeof val === 'object') return val.code === 'GOVERNMENT';
        return false;
      },
      then: () => dropdownRequired(validate.required('department')),
      otherwise: (schema) => schema.nullable()
    }),

    // Sub Department not required for Government enquiry
    subDepartment: yup.mixed().nullable(),

    organizationName: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('organizationName'))
      .min(5, validate.invalidMinLength('organizationName', 5))
      .max(150, validate.invalidMaxLength('organizationName', 150))
      .matches(regex.orgName, t('invalidOrganizationName')),

    contactPerson: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('contactPerson'))
      .min(3, validate.invalidMinLength('contactPerson', 3))
      .max(100, validate.invalidMaxLength('contactPerson', 100))
      .matches(regex.personNameRegex, t('invalidContactPerson'))
      .test('single-dot', t('invalidContactPerson'), (value) => !value || (value.match(/\./g) || []).length <= 1),

    mobileNumber: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('mobileNumber')),

    // altMobileNumber: yup
    //   .string()
    //   .transform((v) => (typeof v === 'string' ? v.trim() : null))
    //   .nullable()
    //   .matches(regex.mobile, t('invalidMobileNumber')),

    email: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('email'))
      .max(254, validate.invalidMaxLength('email', 254))
      .matches(regex.email, validate.invalidFormat('email')),

    pinCode: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .test('pincode-format', t('invalidPinCode'), function (value) {
        return isValidCirclePincode(value, this.parent.circle);
      })
      .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value))
      .required(validate.required('pinCode')),

    // postOffice: yup
    //   .mixed()
    //   .transform((value) => {
    //     if (value?.id) return value.id;
    //     if (typeof value === 'string' && value.trim()) return value.trim();
    //     return '';
    //   })
    //   .test('required', validate.required('postOffice'), (value) => !!value),

    district: yup.string().nullable(),

    location: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('location'))
      .max(200, validate.invalidMaxLength('location', 200)),

    latitude: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .test('valid-latitude', t('invalidLatitude'), (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -90 && num <= 90;
      }),

    longitude: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .test('valid-longitude', t('invalidLongitude'), (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -180 && num <= 180;
      }),

    industry: yup.mixed().nullable(),

    service: yup.mixed().nullable(),

    services: yup.array().min(1, t('pleaseAddAtLeastOneService')).required(t('pleaseAddAtLeastOneService'))
  });
};

export const AGNPSchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    circle: dropdownRequired(validate.required('circle')),

    agnpName: yup
      .string()
      .trim()
      .required(validate.required('agnpName'))
      .min(2, validate.invalidMinLength('agnpName', 2))
      .max(50, validate.invalidMaxLength('agnpName', 50))
      .matches(regex.orgName, t('invalidAgnpName'))
      .test('not-numeric-only', t('invalidAgnpName'), (value) => !value || !/^\d+$/.test(value)),

    associatedIsp: yup.string().oneOf(['yes', 'no']).required(validate.required('associatedIsp')),

    contactName: yup
      .string()
      .trim()
      .required(validate.required('contactName'))
      .min(3, validate.invalidMinLength('contactName', 3))
      .max(50, validate.invalidMaxLength('contactName', 50))
      .matches(regex.personNameRegex, t('invalidContactName'))
      .test('single-dot', t('invalidContactName'), (value) => !value || (value.match(/\./g) || []).length <= 1),

    mobileNumber: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('mobileNumber')),

    altMobileNumber: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .matches(regex.mobile, { message: t('invalidMobileNumber'), excludeEmptyString: true })
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .test('not-same-as-mobile', t('altNumberSameAsMobile'), function (value) {
        if (!value) return true;
        return value !== this.parent.mobileNumber;
      }),

    landline: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .matches(regex.landline, { message: t('invalidLandline'), excludeEmptyString: true })
      .test('no-all-repeated-digits', t('invalidLandline'), (value) => {
        if (!value) return true;
        const digits = value.replace(/-/g, '');
        return !/^(.)\1+$/.test(digits);
      }),

    email: yup
      .string()
      .trim()
      .required(validate.required('email'))
      .max(254, validate.invalidMaxLength('email', 254))
      .matches(regex.email, validate.invalidFormat('email')),

    fullAddress: yup
      .string()
      .trim()
      .required(validate.required('fullAddress'))
      .min(5, validate.invalidMinLength('fullAddress', 5))
      .max(300, validate.invalidMaxLength('fullAddress', 300))
      .test('no-leading-special-char', t('addressLeadingCharError'), (value) => !value || /^[a-zA-Z0-9]/.test(value)),

    location: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .max(150, validate.invalidMaxLength('location', 150))
      .required(validate.required('location'))
      .test('location-confirmed', t('locationNotConfirmed'), function () {
        const { latitude, longitude } = this.parent;
        return !!latitude && !!longitude;
      }),

    latitude: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .test('valid-latitude', t('invalidLatitude'), (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -90 && num <= 90;
      }),

    longitude: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .test('valid-longitude', t('invalidLongitude'), (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -180 && num <= 180;
      }),

    pincode: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .test('pincode-format', t('invalidPinCode'), function (value) {
        return isValidCirclePincode(value, this.parent.circle);
      })
      .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value))
      .required(validate.required('Pincode')),

    postOffice: dropdownRequired(validate.required('postOffice')),

    district: dropdownRequired(validate.required('district'))
  });
};

export const LNPSchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    circle: dropdownRequired(validate.required('circle')),

    partnerCompanyName: yup
      .string()
      .trim()
      .required(validate.required('partnercompanyName'))
      .min(2, validate.invalidMinLength('partnercompanyName', 2))
      .max(50, validate.invalidMaxLength('partnercompanyName', 50))
      .matches(regex.orgName, t('invalidPartnerCompanyName'))
      .test('not-numeric-only', t('invalidPartnerCompanyName'), (value) => !value || !/^\d+$/.test(value)),

    associatedIsp: yup.string().trim().required(validate.required('associatedIsp')),

    partnerContactName: yup
      .string()
      .trim()
      .required(validate.required('contactName'))
      .min(3, validate.invalidMinLength('contactName', 3))
      .max(50, validate.invalidMaxLength('contactName', 50))
      .matches(regex.personNameRegex, t('invalidPartnerContactName'))
      .test('single-dot', t('invalidPartnerContactName'), (value) => !value || (value.match(/\./g) || []).length <= 1),

    partnerMobileNumber: yup
      .string()
      .trim()
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('partnerMobileNumber')),

    landline: yup
      .string()
      .trim()
      .nullable()
      .matches(regex.mobile, { message: t('invalidMobileNumber'), excludeEmptyString: true })
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .test('not-same-as-mobile', t('altNumberSameAsMobile'), function (value) {
        if (!value) return true;
        return value !== this.parent.partnerMobileNumber;
      }),

    landlineNumber: yup
      .string()
      .trim()
      .nullable()
      .matches(regex.landline, { message: t('invalidLandline'), excludeEmptyString: true })
      .test('no-all-repeated-digits', t('invalidLandline'), (value) => {
        if (!value) return true;
        const digits = value.replace(/-/g, '');
        return !/^(.)\1+$/.test(digits);
      }),

    partnerEmail: yup
      .string()
      .trim()
      .required(validate.required('partnerEmail'))
      .max(254, validate.invalidMaxLength('partnerEmail', 254))
      .matches(regex.email, validate.invalidFormat('partnerEmail')),

    partnerFullAddress: yup
      .string()
      .trim()
      .required(validate.required('partnerFullAddress'))
      .min(5, validate.invalidMinLength('partnerFullAddress', 5))
      .max(300, validate.invalidMaxLength('partnerFullAddress', 300))
      .test('no-leading-special-char', t('addressLeadingCharError'), (value) => !value || /^[a-zA-Z0-9]/.test(value)),

    partnerLocation: yup
      .string()
      .trim()
      .max(150, validate.invalidMaxLength('partnerLocation', 150))
      .required(validate.required('partnerLocation'))
      .test('location-confirmed', t('locationNotConfirmed'), function () {
        const { latitude, longitude } = this.parent;
        return !!latitude && !!longitude;
      }),

    latitude: yup
      .string()
      .trim()
      .nullable()
      .test('valid-latitude', t('invalidLatitude'), (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -90 && num <= 90;
      }),

    longitude: yup
      .string()
      .trim()
      .nullable()
      .test('valid-longitude', t('invalidLongitude'), (value) => {
        if (!value) return true;
        const num = parseFloat(value);
        return !isNaN(num) && num >= -180 && num <= 180;
      }),

    pincode: yup
      .string()
      .trim()
      .test('pincode-format', t('invalidPinCode'), function (value) {
        return isValidCirclePincode(value, this.parent.circle);
      })
      .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value))
      .required(validate.required('Pincode')),

    postOffice: dropdownRequired(validate.required('postOffice')),

    district: dropdownRequired(validate.required('district')),

    existingInternetSubscribers: yup
      .string()
      .trim()
      .matches(regex.number, validate.invalidDigits('existingInternetSubscribers'))
      .required(validate.required('existingInternetSubscribers')),

    existingCableTVSubscribers: yup
      .string()
      .trim()
      .matches(regex.number, validate.invalidDigits('existingCableTVSubscribers'))
      .required(validate.required('existingCableTVSubscribers')),

    fibreKm: yup
      .string()
      .trim()
      .required(validate.required('fibreKm'))
      .matches(regex.decimal, t('invalidFibreKm'))
      .test('gt-zero', t('invalidFibreKm'), (value) => !value || parseFloat(value) > 0)
      .test('max-value', t('maxFibreKm'), (value) => !value || parseFloat(value) <= 9999.999)
      .test('max-three-decimals', t('invalidFibreKm'), (value) => {
        if (!value) return true;
        const parts = value.split('.');
        return parts.length === 1 || parts[1].length <= 3;
      }),

    createdBy: yup
      .mixed()
      .transform((value) => (value?.id ? value.id : ''))
      .required(validate.required('createdBy'))
  });
};

export const DarkFibreSchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    circle: dropdownRequired(validate.required('circle')),

    nameOfTheFirm: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('nameOfTheFirm'))
      .min(3, validate.invalidMinLength('nameOfTheFirm', 3))
      .max(200, validate.invalidMaxLength('nameOfTheFirm', 200))
      .matches(regex.orgName, t('invalidOrganizationName')),

    fullAddress: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('fullAddress'))
      .max(500, validate.invalidMaxLength('fullAddress', 500)),

    firmPhoneNumber: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('firmPhoneNumber')),

    firmEmail: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('firmEmail'))
      .max(254, validate.invalidMaxLength('firmEmail', 254))
      .matches(regex.email, validate.invalidFormat('firmEmail')),

    contactPersonName: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('contactPersonName'))
      .min(3, validate.invalidMinLength('contactPersonName', 3))
      .max(100, validate.invalidMaxLength('contactPersonName', 100))
      .matches(regex.personNameRegex, t('invalidContactPersonName'))
      .test('single-dot', t('invalidContactPersonName'), (value) => !value || (value.match(/\./g) || []).length <= 1),

    contactPersonPhoneNumber: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('contactPersonPhoneNumber')),

    contactPersonEmail: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : v))
      .required(validate.required('contactPersonEmail'))
      .max(254, validate.invalidMaxLength('contactPersonEmail', 254))
      .matches(regex.email, validate.invalidFormat('contactPersonEmail')),

    purposeOfLeasing: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .max(300, validate.invalidMaxLength('purposeOfLeasing', 300)),

    areaCircleWhereTelecomServiceIs: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .max(200, validate.invalidMaxLength('areaCircleWhereTelecomServiceIs', 200)),

    forAndOnBehalfLeaseCompanyMS: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .max(200, validate.invalidMaxLength('forAndOnBehalfLeaseCompanyMS', 200))
  });
};

export const trackEnquirySchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    trackingId: yup
      .string()
      .trim()
      .matches(/^\d{10}$/, t('validations.invalidTrackingId'))
      .required(validate.required('trackingId'))
  });
};

export const BPLSchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    circle: dropdownRequired(validate.required('circle')),

    rationCardHolderName: yup
      .string()
      .transform(trimString)
      .required(validate.required('rationCardHolderName'))
      .min(3, validate.invalidMinLength('rationCardHolderName', 3))
      .max(100, validate.invalidMaxLength('rationCardHolderName', 100))
      .matches(regex.personNameRegex, t('invalidRationCardHolderName'))
      .test(
        'single-dot',
        t('invalidRationCardHolderName'),
        (value) => !value || (value.match(/\./g) || []).length <= 1
      ),

    rationCardNumber: yup
      .string()
      .transform(trimString)
      .required(validate.required('rationCardNumber'))
      .matches(regex.rationCard, validate.invalidFormat('rationCardNumber')),

    aadhaarLinkedMobileNumber: yup
      .string()
      .transform(trimString)
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('aadhaarLinkedMobileNumber')),

    ksebConsumerNumber: yup
      .string()
      .transform(trimString)
      .required(validate.required('ksebConsumerNumber'))
      .max(13, validate.invalidMaxLength('ksebConsumerNumber', 13)),

    aadhaarNumberOfRationCardHolder: yup
      .string()
      .transform(trimString)
      .matches(regex.aadhaar, validate.invalidDigits('aadhaarNumberOfRationCardHolder', 12))
      .test(
        'no-all-same',
        validate.invalidDigits('aadhaarNumberOfRationCardHolder', 12),
        (value) => !value || !/^(.)\1{11}$/.test(value)
      )
      .required(validate.required('aadhaarNumberOfRationCardHolder')),

    installationAddress: yup
      .string()
      .transform(trimString)
      .required(validate.required('installationAddress'))
      .max(300, validate.invalidMaxLength('installationAddress', 300)),

    pincode: yup
      .string()
      .trim()
      .test('pincode-format', t('invalidPinCode'), function (value) {
        return isValidCirclePincode(value, this.parent.circle);
      })
      .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value))
      .required(validate.required('Pincode')),

    postOffice: yup
      .mixed()
      .transform((value) => (value?.id ? value.id : value))
      .test('required', validate.required('postOffice'), (value) => !!value),

    district: yup
      .mixed()
      .transform((value) => (value?.id ? value.id : value))
      .test('required', validate.required('district'), (value) => !!value),

    referralCode: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : null))
      .nullable()
      .max(20, validate.invalidMaxLength('referralCode', 20))
  });
};
export const complaintRegistrationSchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    circle: dropdownRequired(validate.required('circle')),

    customerName: yup
      .string()
      .transform(trimString)
      .required(validate.required('customerName'))
      .min(3, validate.invalidMinLength('customerName', 3))
      .max(100, validate.invalidMaxLength('customerName', 100))
      .matches(regex.personNameRegex, t('invalidFirstName')),

    keyContactNumber: yup
      .string()
      .transform(trimString)
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/^(.)\1{9}$/.test(value))
      .required(validate.required('mobileNumber')),

    ticketCategory: yup.object().nullable().required(validate.required('ticketCategory')),

    hasSubscribers: yup.boolean(),

    district: yup.object().nullable().when('ticketCategory', {
      is: (val) => val?.name === 'Enquiries',
      then: (schema) => schema.required(validate.required('district')),
      otherwise: (schema) => schema.nullable().notRequired()
    }),

    pinCode: yup.string().when('ticketCategory', {
      is: (val) => val?.name === 'Enquiries',
      then: (schema) =>
        schema
          .trim()
          .required(validate.required('pinCode'))
          .test('pincode-format', t('invalidPinCode'), function (value) {
            return isValidCirclePincode(value, this.parent.circle);
          })
          .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value)),
      otherwise: (schema) => schema.nullable().notRequired()
    }),

    subject: yup.object().nullable().required(validate.required('subject')),

    remarks: yup.string().when('subject', {
      is: (val) => val?.name === 'Others',
      then: (schema) => schema.required(validate.required('remarks')).min(3, validate.invalidMinLength('remarks', 3)),
      otherwise: (schema) => schema.nullable().notRequired()
    })
  });
};
