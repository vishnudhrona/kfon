import * as yup from 'yup';

import { MAX_FILE_SIZE } from '@/features/common/constants';
import {
  DOCUMENT_FILES,
  hasNoLeadingOrTrailingSpaces,
  isAllowedVlanType,
  isDigitsOnly,
  isValidVlanShortName,
  isVlanIdInRange,
  regex,
  validation,
  VLAN_ALLOWED_TYPES,
  VLAN_ID_MAX,
  VLAN_ID_MIN,
  VLAN_SHORT_NAME_MAX,
  VLAN_SHORT_NAME_MIN
} from '@/utils/validationUtils';

export const partnerBasicDetailsSchema = (t) => {
  const msg = validation(t);
  return yup.object({
    companyName: yup
      .string()
      .trim()
      .required(msg.required('companyName'))
      .min(3, msg.invalidMinLength('companyName', 3))
      .max(150, msg.invalidMaxLength('companyName', 150))
      .matches(regex.orgName, t('invalidCompanyName')),
    keyContactName: yup
      .string()
      .trim()
      .required(msg.required('managerName'))
      .min(3, msg.invalidMinLength('managerName', 3))
      .max(100, msg.invalidMaxLength('managerName', 100))
      .matches(regex.personNameRegex, t('invalidManagerName'))
      .test('single-dot', t('invalidManagerName'), (value) => !value || (value.match(/\./g) || []).length <= 1),
    email: yup.string().trim().email(t('invalidEmail')).required(msg.required('email')),
    keyContactNumber: yup
      .string()
      .trim()
      .required(msg.required('mobileNumber'))
      .matches(regex.mobile, t('invalidMobileNumber')),
    alternatePhone: yup
      .string()
      .trim()
      .nullable()
      .matches(regex.mobile, { message: t('invalidAlternateContactNumber'), excludeEmptyString: true })
      .test('not-same-as-key-contact', t('altNumberSameAsMobile'), function (value) {
        if (!value) return true;
        return value !== this.parent.keyContactNumber;
      }),
    addressLine1: yup.string().trim().required(msg.required('addressLine1')),
    addressLine2: yup.string().trim().required(msg.required('addressLine2')),
    pinCode: yup.string().required(msg.required('pincode')).matches(regex.keralaPinCode, t('invalidPinCode')),
    postOffice: yup
      .mixed()
      .required(msg.required('postOffice'))
      .test('has-name', msg.required('postOffice'), (value) => {
        return value?.name ? true : false;
      }),
    city: yup.string().trim().required(msg.required('city')),
    district: yup.string().trim().required(msg.required('district')),
    locationType: yup.string().required(msg.required('locationType')),
    agreementType: yup.string().required(msg.required('agreementType'))
  });
};

export const agreementDetails = (t, agreementType) => {
  const msg = validation(t);
  return yup.object({
    distributor: yup.mixed().test('distributor-required', msg.required('distributor'), function (value) {
      if (agreementType === 'LNP') {
        const sharePlan = this.parent?.sharePlan;
        if (sharePlan?.name === 'KFON_Share') return true;
        return value?.name ? true : false;
      }
      return true;
    }),
    companyRegistrationNo: yup
      .string()
      .trim()
      .required(msg.required('companyRegistrationNo'))
      .max(30, msg.invalidMaxLength('companyRegistrationNo', 30))
      .matches(/^\S+$/, msg.noSpacesAllowed('companyRegistrationNo')),
    oltProvider:
      agreementType === 'LNP' ? yup.string().trim().required(msg.required('oltProvider')) : yup.string().optional(),
    companyNature: yup
      .mixed()
      .required(msg.required('natureOfCompany'))
      .test('has-name', msg.required('natureOfCompany'), (value) => {
        return value?.name ? true : false;
      }),
    sharePlan:
      agreementType === 'LNP'
        ? yup
            .mixed()
            .required(msg.required('sharePlan'))
            .test('has-name', msg.required('sharePlan'), (value) => {
              return value?.name ? true : false;
            })
        : yup.mixed().optional(),
    agreementNumber: yup
      .string()
      .trim()
      .required(msg.required('agreementNumber'))
      .max(30, msg.invalidMaxLength('agreementNumber', 30))
      .matches(/^\S+$/, msg.noSpacesAllowed('agreementNumber')),
    agreementDate: yup.string().trim().required(msg.required('agreementDate')),
    popName: yup
      .mixed()
      .required(msg.required('popName'))
      .test('has-name', msg.required('popName'), (value) => (value?.name ? true : false))
  });
};

export const bankDetails = (t) => {
  const msg = validation(t);
  return yup.object({
    bankIfsc: yup
      .string()
      .trim()
      .transform((value) => (value ? value.toUpperCase() : value))
      .required(msg.required('ifscCode'))
      .matches(regex.ifsc, t('invalidIfscCode'))
      .length(11, t('ifscCodeLength')),
    bankName: yup.string().trim().required(msg.required('bankName')),
    bankBranch: yup.string().trim().required(msg.required('branch')),
    bankAcHolderName: yup
      .string()
      .trim()
      .required(msg.required('accountHolderName'))
      .matches(regex.holderName, t('invalidAccountHolderName')),
    bankAcNo: yup
      .string()
      .trim()
      .required(msg.required('bankAccountNumber'))
      .matches(regex.bankAccount, t('invalidBankAccountNumber')),
    bankAcType: yup
      .mixed()
      .required(msg.required('bankAccountType'))
      .test('has-name', msg.required('bankAccountType'), (value) => {
        return value?.name ? true : false;
      })
  });
};

export const kycGstDetails = (t) => {
  const msg = validation(t);
  return yup.object({
    pan: yup
      .string()
      .trim()
      .transform((v) => (typeof v === 'string' ? v.toUpperCase() : v))
      .required(msg.required('panNumber'))
      .matches(regex.panNumber, msg.invalidFormat('panNumber')),

    aadhaarNumber: yup
      .string()
      .trim()
      .required(msg.required('aadhaarNumber'))
      .matches(regex.aadhaarNumber, msg.mustBeNumber('aadhaarNumber'))
      .length(12, msg.invalidDigits('aadhaarNumber', 12)),

    stateCode: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) =>
        schema
          .trim()
          .required(msg.required('stateCode'))
          .matches(regex.stateCode, t('invalidStateCode'))
          .length(2, t('stateCodeLength')),
      otherwise: (schema) => schema.notRequired()
    }),
    businessCode: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(msg.required('businessCode')).length(1, t('businessCodeLength')),
      otherwise: (schema) => schema.notRequired()
    }),
    gstin: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) =>
        schema
          .trim()
          .required(msg.required('gstNumber'))
          .matches(regex.gstNumber, t('invalidGstNumber'))
          .length(15, t('gstNumberLength')),
      otherwise: (schema) => schema.notRequired()
    }),

    serviceDescription: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) =>
        schema
          .trim()
          .required(msg.required('serviceDescription'))
          .matches(regex.serviceDescription, t('invalidServiceDescription')),
      otherwise: (schema) => schema.notRequired()
    }),

    sac: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) =>
        schema
          .trim()
          .required(msg.required('sacCode'))
          .matches(/^\d{6}$/, t('invalidSacCode')),
      otherwise: (schema) => schema.notRequired()
    }),

    taxPayerType: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(msg.required('taxPayerType')),
      otherwise: (schema) => schema.notRequired()
    }),

    legalName: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(msg.required('legalBusinessName')),
      otherwise: (schema) => schema.notRequired()
    }),

    tradeName: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(msg.required('tradeName')),
      otherwise: (schema) => schema.notRequired()
    }),

    gstInformation: yup.string().trim().required(msg.required('gstInformation'))
  });
};

export const supportingDocumentsValidation = (t, gstInformation) => {
  const msg = validation(t);

  const fileValidation = (requiredMsg) => {
    let base = yup.mixed().nullable();
    if (requiredMsg) {
      base = base.required(requiredMsg);
    }

    return base
      .test('fileType', t('onlyPdfAndImagesAllowed'), (value) => {
        if (!value || value.length === 0 || typeof value === 'string') return true;
        if (value instanceof File) return DOCUMENT_FILES.includes(value.type);
        return true;
      })
      .test('fileSize', t('fileSizeTooLarge'), (value) => {
        if (!value || value.length === 0 || typeof value === 'string') return true;
        if (value instanceof File) return value.size <= MAX_FILE_SIZE;
        return true;
      });
  };

  const isGstRequired = gstInformation === true || gstInformation === 'Yes';

  return yup.object({
    cancelledChequeCopy: fileValidation(msg.required('cancelledBankChequeLeafCopy')),
    panCardSupportingDocument: fileValidation(msg.required('panCardSupportingNumber')),
    gstRegistrationDocument: isGstRequired ? fileValidation(msg.required('gstRegistrationDoc')) : fileValidation(null),
    cableTvLicenseOrCompanyRegCert: fileValidation(msg.required('cableTvLicenseOrCompanyRegistrationCertificate')),
    agreementCopy: fileValidation(msg.required('agreementCopy')),
    aadhaarCopy: fileValidation(msg.required('aadhaarCopy'))
  });
};

export const partnerPreviewUpdate = (t) => {
  const msg = validation(t);
  return yup.object({
    status: yup.mixed().required(msg.required('status')),
    remarks: yup
      .string()
      .trim()
      .required(msg.required('remarks'))
      .min(5, msg.invalidMinLength('remarks', 5))
      .max(500, msg.invalidMaxLength('remarks', 500))
  });
};
export const vlanMappingValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    partnerId: yup.mixed().required(msg.required('selectPartner')),
    vlanId: yup
      .string()
      .required(msg.required('vlanId'))
      .test('vlan-id-no-edge-spaces', msg.noSpacesAllowed('vlanId'), (value) => hasNoLeadingOrTrailingSpaces(value))
      .test('vlan-id-digits-only', msg.mustBeNumber('vlanId'), (value) => !value || isDigitsOnly(value))
      .test(
        'vlan-id-min',
        msg.minValue('vlanId', VLAN_ID_MIN),
        (value) => !value || !isDigitsOnly(value) || Number(value) >= VLAN_ID_MIN
      )
      .test(
        'vlan-id-max',
        msg.maxValue('vlanId', VLAN_ID_MAX),
        (value) => !value || !isDigitsOnly(value) || Number(value) <= VLAN_ID_MAX
      )
      .test('vlan-id-range', t('invalidVlanId'), (value) => !value || isVlanIdInRange(value)),
    vlanShortName: yup
      .string()
      .required(msg.required('vlanShortName'))
      .test('vlan-short-name-no-edge-spaces', msg.noSpacesAllowed('vlanShortName'), (value) =>
        hasNoLeadingOrTrailingSpaces(value)
      )
      .test(
        'vlan-short-name-min',
        msg.invalidMinLength('vlanShortName', VLAN_SHORT_NAME_MIN),
        (value) => !value || value.trim().length >= VLAN_SHORT_NAME_MIN
      )
      .test(
        'vlan-short-name-max',
        msg.invalidMaxLength('vlanShortName', VLAN_SHORT_NAME_MAX),
        (value) => !value || value.trim().length <= VLAN_SHORT_NAME_MAX
      )
      .test('vlan-short-name-format', t('invalidVlanShortName'), (value) => !value || isValidVlanShortName(value)),
    vlanType: yup
      .mixed()
      .required(msg.required('vlanType'))
      .test(
        'vlan-type-allowed',
        t('invalidVlanType', { 0: VLAN_ALLOWED_TYPES.join(', ') }),
        (value) => !value || isAllowedVlanType(value)
      )
  });
};
export const vlanRequestValidation = (t) => {
  const msg = validation(t);
  return yup.object({
    partnerId: yup.mixed().required(msg.required('partner')),
    popName: yup.mixed().required(msg.required('pop')),
    portNumber: yup.string().trim().required(msg.required('portNumber')),
    vlanRange: yup.string().trim().required(msg.required('vlanRange')),
    switchType: yup.string().trim().required(msg.required('switchType')),
    switchIp: yup.string().trim().required(msg.required('switchIp')),
    sfp: yup.string().trim().required(msg.required('sfp')),
    remarks: yup.string().trim().required(msg.required('remarks'))
  });
};

export const addServiceAreaSchema = (t) => {
  const msg = validation(t);
  return yup.object({
    pinCode: yup
      .mixed()
      .required(msg.required('pinCode'))
      .test('has-name', msg.required('pinCode'), (value) => {
        return value?.pincode ? true : false;
      }),
    postOfficeName: yup
      .mixed()
      .required(msg.required('postOffice'))
      .test('has-name', msg.required('postOffice'), (value) => {
        return value?.name ? true : false;
      })
  });
};
