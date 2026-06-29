import dayjs from 'dayjs';
import * as yup from 'yup';

import { dropdownRequired, regex, validation } from '@/utils/validationUtils';

import { CONNECTION_TYPES } from './components/common/constants';
import { TAXPAYER_TYPE } from './constants';

export const ekycValidationSchema = (otpSent, isBasic, t) => {
  const validate = validation(t);

  const ekycFields = yup.object({
    aadhaarNumber: yup
      .string()
      .required(validate.required('aadhaarNumber'))
      .matches(regex.aadhaar, validate.invalidDigits('aadhaarNumber', 12)),
    otp: otpSent ? yup.string().required(validate.required('otp')) : yup.string().notRequired()
  });

  return yup.object({
    ekyc: isBasic ? yup.object().notRequired() : ekycFields.required(),
    connectionType: yup.mixed().required(validate.required('connectionType')),
    subscriptionType: yup.mixed().required(validate.required('subscriptionType'))
  });
};

// Basic Details Form Validation
export const basicDetailsValidationSchema = (t, connectionType = CONNECTION_TYPES.HOME_CONNECTION, hasPartners = false) => {
  const validate = validation(t);
  const isSme = connectionType === CONNECTION_TYPES.SME_CONNECTION;

  return yup.object({
    lnpPartnerId: hasPartners ? dropdownRequired(validate.required('partner')) : yup.mixed().notRequired(),
    applicationFormNumber: yup
      .string()
      .required(validate.required('applicationFormNo'))
      .max(25, validate.invalidMaxLength('applicationFormNo', 25))
      .matches(/^[A-Z0-9/]+$/, validate.invalidFormat('applicationFormNo')),
    applicantName: !isSme ? yup.string().required(validate.required('applicantName')) : yup.string().notRequired(),
    companyName: isSme ? yup.string().required(validate.required('companyName')) : yup.string().notRequired(),
    dateOfBirth: yup
      .string()
      .required(validate.required('dateOfBirth'))
      .test('min-age-18', validate.minAge('dateOfBirth', 18), (value) => {
        if (!value) return true;
        const dob = dayjs(value);
        if (!dob.isValid()) return true;
        return dayjs().diff(dob, 'year') >= 18;
      }),
    mobileNumber: yup
      .string()
      .required(validate.required('mobileNo'))
      .matches(regex.mobile, validate.invalidDigits('mobileNo', 10)),
    alternateContactNumber: isSme
      ? yup
          .string()
          .required(validate.required('alternateContactNumber'))
          .matches(regex.mobile, validate.invalidDigits('alternateContactNumber', 10))
      : yup.string().notRequired(),
    contactPerson: isSme ? yup.string().required(validate.required('contactPerson')) : yup.string().notRequired(),
    emailAddress: yup
      .string()
      .email(validate.invalidFormat('emailAddress'))
      .required(validate.required('emailAddress')),
    gender: yup.string().required(validate.required('gender'))
  });
};

// Device Details Form Validation
export const deviceDetailsValidationSchema = (t) => {
  const validate = validation(t);

  return yup.object({
    DeviceProvider: dropdownRequired(validate.required('deviceProvider')),
    selectDevice: dropdownRequired(validate.required('selectDevice')),
    DeviceType: dropdownRequired(validate.required('deviceType')),
    VLANID: yup
      .number()
      .transform((value, originalValue) => (String(originalValue).trim() === '' ? undefined : value))
      .typeError(validate.mustBeNumber('vlanID'))
      .required(validate.required('vlanID'))
      .integer(validate.mustBeNumber('vlanID'))
      .min(2, validate.minValue('vlanID', 2))
      .max(4094, validate.maxValue('vlanID', 4094)),
    DeviceMake: yup.string().required(validate.required('deviceMake')),
    DeviceModel: yup.string().required(validate.required('deviceModel')),
    MacAddress: yup.string().required(validate.required('deviceMacAddress')),
    OLTType: dropdownRequired(validate.required('oltType')),
    deviceList: yup.object().nullable().optional(),
    PONPortNumber: yup.object().nullable().optional(),
    ONTPosition: yup
      .number()
      .transform((value, originalValue) => (String(originalValue).trim() === '' ? undefined : value))
      .integer(validate.mustBeNumber('ontPosition'))
      .min(1, validate.minValue('ontPosition', 1))
      .max(128, validate.maxValue('ontPosition', 128))
      .nullable()
      .optional()
  });
};

// GST Information Form Validation
export const gstInformationValidationSchema = (t) => {
  const validate = validation(t);

  return yup.object({
    gstRegistration: yup.string().required(validate.required('gstInformation')),
    panNumber: yup.string().when('gstRegistration', {
      is: 'yes',
      then: (schema) =>
        schema.required(validate.required('panNumber')).matches(regex.panNumber, validate.invalidFormat('panNumber')),
      otherwise: (schema) => schema.notRequired()
    }),
    gstin: yup.string().when('gstRegistration', {
      is: 'yes',
      then: (schema) =>
        schema.required(validate.required('gstNumber')).matches(regex.gstNumber, validate.invalidFormat('gstNumber')),
      otherwise: (schema) => schema.notRequired()
    }),
    taxPayerType: yup.string().when('gstRegistration', {
      is: 'yes',
      then: (schema) => schema.required(validate.required('taxPayerType')),
      otherwise: (schema) => schema.notRequired()
    }),
    legalName: yup.string().when('gstRegistration', {
      is: 'yes',
      then: (schema) => schema.required(validate.required('legalName')),
      otherwise: (schema) => schema.notRequired()
    }),
    tradeName: yup.string().when('gstRegistration', {
      is: 'yes',
      then: (schema) => schema.required(validate.required('tradeName')),
      otherwise: (schema) => schema.notRequired()
    }),
    gstInProofCopy: yup.mixed().when('gstRegistration', {
      is: 'yes',
      then: (schema) => schema.required(validate.required('gstInProofCopy')),
      otherwise: (schema) => schema.notRequired()
    }),
    applicationFormCopy: yup.mixed().when('gstRegistration', {
      is: 'yes',
      then: (schema) => schema.required(validate.required('applicationFormCopy')),
      otherwise: (schema) => schema.notRequired()
    }),
    lut: yup.mixed().when(['gstRegistration', 'taxPayerType'], {
      is: (gstRegistration, taxPayerType) => gstRegistration === 'yes' && taxPayerType === TAXPAYER_TYPE,
      then: (schema) => schema.required(validate.required('lut'))
    })
  });
};

// Address Details Form Validation (Permanent & Installation)
export const addressDetailsValidationSchema = (t, isInstallation = false) => {
  const validate = validation(t);

  const schema = {
    apartment: isInstallation
      ? yup.string().when('sameAsPermanent', {
          is: true,
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required(validate.required('doorNoApartment'))
        })
      : yup.string().required(validate.required('doorNoApartment')),
    street: isInstallation
      ? yup.string().when('sameAsPermanent', {
          is: true,
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required(validate.required('streetLocalityName'))
        })
      : yup.string().required(validate.required('streetLocalityName')),
    city: isInstallation
      ? yup.string().when('sameAsPermanent', {
          is: true,
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required(validate.required('city'))
        })
      : yup.string().required(validate.required('city')),
    pincode: isInstallation
      ? yup.string().when('sameAsPermanent', {
          is: true,
          then: (schema) => schema.notRequired(),
          otherwise: (schema) =>
            schema.required(validate.required('pinCode')).matches(regex.pinCode, validate.invalidDigits('pinCode', 6))
        })
      : yup
          .string()
          .required(validate.required('pinCode'))
          .matches(regex.pinCode, validate.invalidDigits('pinCode', 6)),
    post: isInstallation
      ? yup.mixed().when('sameAsPermanent', {
          is: true,
          then: (schema) => schema.notRequired(),
          otherwise: () => dropdownRequired(validate.required('postOfficeName'))
        })
      : dropdownRequired(validate.required('postOfficeName')),
    district: isInstallation
      ? yup.mixed().when('sameAsPermanent', {
          is: true,
          then: (schema) => schema.notRequired(),
          otherwise: () => dropdownRequired(validate.required('district'))
        })
      : dropdownRequired(validate.required('district')),
    locationType: isInstallation
      ? yup.string().when('sameAsPermanent', {
          is: true,
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required(validate.required('locationType'))
        })
      : yup.string().required(validate.required('locationType')),
    localBodyType: isInstallation
      ? yup.mixed().when(['locationType', 'sameAsPermanent'], {
          is: (locationType, sameAsPermanent) => !sameAsPermanent && locationType === 'Urban',
          then: () => dropdownRequired(validate.required('localBodyType')),
          otherwise: (schema) => schema.notRequired()
        })
      : yup.mixed().when('locationType', {
          is: 'Urban',
          then: () => dropdownRequired(validate.required('localBodyType')),
          otherwise: (schema) => schema.notRequired()
        }),
    panchayatName: isInstallation
      ? yup.mixed().when(['locationType', 'sameAsPermanent'], {
          is: (locationType, sameAsPermanent) => !sameAsPermanent && locationType === 'Rural',
          then: () => dropdownRequired(validate.required('panchayatName')),
          otherwise: (schema) => schema.notRequired()
        })
      : yup.mixed().when('locationType', {
          is: 'Rural',
          then: () => dropdownRequired(validate.required('panchayatName')),
          otherwise: (schema) => schema.notRequired()
        }),
    blockName: isInstallation
      ? yup.mixed().when(['locationType', 'sameAsPermanent'], {
          is: (locationType, sameAsPermanent) => !sameAsPermanent && locationType === 'Rural',
          then: () => dropdownRequired(validate.required('blockName')),
          otherwise: (schema) => schema.notRequired()
        })
      : yup.mixed().when('locationType', {
          is: 'Rural',
          then: () => dropdownRequired(validate.required('blockName')),
          otherwise: (schema) => schema.notRequired()
        }),
    corporation: isInstallation
      ? yup.mixed().when(['locationType', 'sameAsPermanent'], {
          is: (locationType, sameAsPermanent) => !sameAsPermanent && locationType === 'Urban',
          then: () => dropdownRequired(validate.required('corporationMunicipalityName')),
          otherwise: (schema) => schema.notRequired()
        })
      : yup.mixed().when('locationType', {
          is: 'Urban',
          then: () => dropdownRequired(validate.required('corporationMunicipalityName')),
          otherwise: (schema) => schema.notRequired()
        })
  };

  if (isInstallation) {
    schema.sameAsPermanent = yup.boolean();
  }

  return yup.object(schema);
};

export const subscriptionDetailsValidationSchema = (t) => {
  const validate = validation(t);

  return yup.object({
    planType: dropdownRequired(validate.required('planType')),
    distributorId: dropdownRequired(validate.required('distributor')),
    desiredUserName: yup
      .string()
      .required(validate.required('desiredUserName'))
      .min(3, validate.invalidMinLength('desiredUserName', 3))
      .max(25, validate.invalidMaxLength('desiredUserName', 25))
      .matches(regex.username, validate.invalidUsernameFormat()),
    selectedPackage: yup.string().required(validate.required('selectedPackage'))
  });
};

export const ewsSupportingDocumentsValidationSchema = (t) => {
  const validate = validation(t);

  return yup.object({
    applicationFormCopy: yup.string().required(validate.required('applicationFormCopy')),
    rationCardType: dropdownRequired(validate.required('rationCardType')),
    rationCardNo: yup
      .string()
      .required(validate.required('rationCardNumber'))
      .matches(regex.rationCard, validate.invalidDigits('rationCardNumber', 10)),
    rationCardDoc: yup.string().required(validate.required('rationCardDoc'))
  });
};

export const ewsSubscriptionDetailsValidationSchema = (t) => {
  const validate = validation(t);

  return yup.object({
    desiredUserName: yup
      .string()
      .required(validate.required('desiredUserName'))
      .min(3, validate.invalidMinLength('desiredUserName', 3))
      .max(25, validate.invalidMaxLength('desiredUserName', 25))
      .matches(regex.username, validate.invalidUsernameFormat())
  });
};

// Disposition Form Validation
export const dispositionValidationSchema = (t) => {
  const validate = validation(t);

  return yup.object().shape({
    disposition: yup
      .mixed()
      .nullable()
      .test('disposition-required', validate.required('disposition'), (value) => {
        if (!value) return false;
        if (typeof value === 'object') return !!value.code;
        return String(value).length > 0;
      }),
    reason: yup
      .mixed()
      .nullable()
      .test('reason-required', validate.required('reason'), (value) => {
        if (!value) return false;
        if (typeof value === 'object') return !!value.code;
        return String(value).length > 0;
      }),
    followUpCount: yup.string(),
    followUpUnit: dropdownRequired(validate.required('followUpUnit')),
    remarks: yup.string().required(validate.required('remarks'))
  });
};

export const rejectSubscriberValidationSchema = (t) => {
  const validate = validation(t);
  return yup.object({
    rejectionReason: yup.string().trim().required(validate.required('reason'))
  });
};

export const assignEnquiryValidationSchema = (t, fieldName = 'feId') => {
  const validate = validation(t);

  return yup.object().shape({
    pincode: yup
      .string()
      .required(validate.required('pinCode'))
      .matches(regex.pinCode, validate.invalidDigits('pinCode', 6)),
    [fieldName]: dropdownRequired(validate.required('assigningPerson'))
  });
};

export const supportingDocumentsValidationSchema = (t, isEkyc = false) => {
  const validate = validation(t);

  return yup.object({
    applicationFormCopy: yup.string().required(validate.required('applicationFormCopy')),
    residenceProofType: dropdownRequired(validate.required('residenceProofType')),
    addressProofNumber: yup
      .string()
      .required(validate.required('addressProofNumber'))
      .max(50, validate.invalidMaxLength('addressProofNumber', 50)),
    addressProofCopy: yup.string().required(validate.required('addressProofCopy')),
    idProofType: isEkyc ? yup.mixed().optional() : dropdownRequired(validate.required('idProofType')),
    idProofNumber: isEkyc
      ? yup.string().optional()
      : yup
          .string()
          .required(validate.required('idProofNumber'))
          .max(50, validate.invalidMaxLength('idProofNumber', 50)),
    idProofCopy: isEkyc ? yup.string().optional() : yup.string().required(validate.required('idProofCopy'))
  });
};

// Subscriber details — inline edit form (name, email, mobile, address)
export const subscriberDetailEditSchema = (t) => {
  const validate = validation(t);
  return yup.object({
    name: yup.string().required(validate.required('name')),
    address: yup.string().required(validate.required('address')),
    email: yup
      .string()
      .required(validate.required('emailAddress'))
      .matches(regex.email, validate.invalidFormat('emailAddress')),
    mobile: yup
      .string()
      .required(validate.required('mobileNo'))
      .matches(regex.mobile, validate.invalidFormat('mobileNo'))
  });
};

// Change username popup
export const changeUsernameSchema = (t) => {
  const validate = validation(t);
  return yup.object({
    username: yup
      .string()
      .required(validate.required('username'))
      .matches(regex.username, validate.invalidUsernameFormat())
  });
};
