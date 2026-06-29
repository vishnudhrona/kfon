import * as yup from 'yup';

import { regex, validation } from '@/utils/validationUtils';

export const circuitProvisioningSchema = (t) =>
  yup.object().shape({
    serviceProvider: yup
      .mixed()
      .required(t('validations.required', { 0: t('serviceProvider', 'Service Provider') }))
      .test('has-id', t('validations.required', { 0: t('serviceProvider', 'Service Provider') }), (v) => !!v?.id),
    popName: yup
      .mixed()
      .required(t('validations.required', { 0: t('popName', 'POP Name') }))
      .test('has-id', t('validations.required', { 0: t('popName', 'POP Name') }), (v) => !!v?.id),
    portDetails: yup.string().required(t('validations.required', { 0: t('portDetails', 'Port Details') })),
    circuitDetails: yup.string().nullable(),
    multicastType: yup.mixed().nullable(),
    multicastSourceAddress: yup.string().nullable()
  });

export const serviceProvisioningSchema = (t) =>
  yup.object().shape({
    commissionDate: yup.string().required(t('validations.required', { 0: t('commissionDate', 'Commission Date') })),
    commissionDoc: yup.mixed().nullable()
  });

export const proposalCardSchema = (t) => {
  const { required, mustBeNumber, minValue } = validation(t);
  return yup.object().shape({
    lockingPeriod: yup
      .string()
      .required(required('lockingPeriod'))
      .test('is-number', mustBeNumber('lockingPeriod'), (v) => !isNaN(Number(v)) && v !== '')
      .test('min-value', minValue('lockingPeriod', 1), (v) => Number(v) >= 1),
    billingFrequency: yup
      .mixed()
      .required(required('billingFrequency'))
      .test('has-id', required('billingFrequency'), (value) => !!value?.id),
    arc: yup
      .string()
      .required(required('arc'))
      .test('is-number', mustBeNumber('arc'), (v) => !isNaN(Number(v)) && v !== ''),
    discount: yup
      .string()
      .test('is-number', mustBeNumber('discount'), (v) => !v || !isNaN(Number(v)))
      .test('max-100', t('validations.maxValue', { 0: t('discount'), 1: 100 }), (v) => !v || Number(v) <= 100),
    finalArc: yup
      .string()
      .required(required('finalArc'))
      .test('is-number', mustBeNumber('finalArc'), (v) => !isNaN(Number(v)) && v !== ''),
    otc: yup
      .string()
      .required(required('otc'))
      .test('is-number', mustBeNumber('otc'), (v) => !isNaN(Number(v)) && v !== '')
  });
};

export const tiketFormSchema = (t) => {
  const validate = validation(t);
  return yup.object().shape({
    selectSubject: yup.string().required(validate.required('selectSubject')),
    attatchment: yup.string().required(validate.required('attatchment')),
    description: yup.string().required(validate.required('description'))
  });
};

export const CreateCorporateCustomerSchema = (t) => {
  const { required, invalidFormat, invalidDigits } = validation(t);

  return yup.object().shape({
    enquiryId: yup
      .mixed()
      .required(required('selectEnquiry'))
      .test('has-id', required('selectEnquiry'), (value) => {
        return value?.id ? true : false;
      }),

    companyName: yup.string().required(required('companyName')),

    contactPerson: yup.string().required(required('contactPerson')),

    mobile: yup.string().required(required('mobile')).matches(regex.mobile, invalidDigits('mobile', 10)),

    email: yup.string().required(required('email')).matches(regex.email, invalidFormat('email')),

    address: yup.string().required(required('address')),

    companyType: yup
      .mixed()
      .required(required('companyType'))
      .test('has-id', required('companyType'), (value) => {
        return value?.id ? true : false;
      }),

    pincode: yup.string().required(required('pincode')).matches(regex.pinCode, invalidDigits('pincode', 6)),

    description: yup.string().nullable()
  });
};

export const CreateCorporateEnquirySchema = (t) => {
  const { required, invalidFormat, invalidDigits } = validation(t);

  return yup.object().shape({
    companyName: yup.string().required(required('companyName')),

    contactName: yup.string().required(required('contactName')),

    contactNumber: yup
      .string()
      .required(required('contactNumber'))
      .matches(regex.mobile, invalidDigits('contactNumber', 10)),

    email: yup.string().required(required('emailId')).matches(regex.email, invalidFormat('emailId')),

    companyLocation: yup.string().required(required('companyLocation')),

    document: yup.mixed().required(required('document')),

    companyType: yup
      .mixed()
      .required(required('companyType'))
      .test('has-id', required('companyType'), (value) => {
        return value?.id ? true : false;
      }),

    connectionType: yup.string().required(required('connectionType')),

    servicesRequired: yup.array().when('connectionType', {
      is: 'single',
      then: (schema) => schema.min(1, required('servicesRequired')),
      otherwise: (schema) => schema.notRequired()
    }),

    remarks: yup.string(),

    uploadCsv: yup.mixed().when('connectionType', {
      is: 'multiple',
      then: (schema) => schema.required(required('uploadCsv')),
      otherwise: (schema) => schema.notRequired()
    }),

    latitude: yup.string().notRequired(),
    longitude: yup.string().notRequired()
  });
};

export const LocationFormSchema = (t) => {
  const { required } = validation(t);
  return yup.object().shape({
    deviceDetailsFile: yup
      .mixed()
      .required(required('deviceDetailsCsvFile'))
      .test('fileSize', t('fileSizeMustBeLessThan2MB'), (value) => {
        if (!value) return true;
        return value.size <= 2 * 1024 * 1024;
      })
      .test('fileType', t('onlyExcelFilesAreAllowed'), (value) => {
        if (!value) return true;
        return [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ].includes(value.type);
      })
  });
};

export const CreatePackageFormSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    serviceType: yup
      .mixed()
      .required(required('serviceType'))
      .test('has-id', required('serviceType'), (value) => {
        return value?.id ? true : false;
      }),

    subServiceType: yup
      .mixed()
      .required(required('subServiceType'))
      .test('has-id', required('subServiceType'), (value) => {
        return value?.id ? true : false;
      }),

    renewalFee: yup
      .number()
      .required(required('renewalFee'))
      .positive(t('mustBePositive'))
      .typeError(t('mustBeANumber')),

    speed: yup.number().required(required('speed')).positive(t('mustBePositive')).typeError(t('mustBeANumber')),

    packageValidity: yup
      .number()
      .required(required('packageValidity'))
      .positive(t('mustBePositive'))
      .integer(t('mustBeAnInteger'))
      .typeError(t('mustBeANumber')),

    planVolume: yup
      .number()
      .required(required('planVolume'))
      .positive(t('mustBePositive'))
      .typeError(t('mustBeANumber')),

    planType: yup
      .mixed()
      .required(required('planType'))
      .test('has-id', required('planType'), (value) => {
        return value?.id ? true : false;
      }),

    fallbackSpeed: yup
      .number()
      .required(required('fallbackSpeed'))
      .positive(t('mustBePositive'))
      .typeError(t('mustBeANumber')),

    allocatedVol: yup.number().nullable().positive(t('mustBePositive')).typeError(t('mustBeANumber')),

    otcCost: yup.number().required(required('otcCost')).min(0, t('mustBeZeroOrPositive')).typeError(t('mustBeANumber'))
  });
};

export const CreateProposalFormSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    customer: yup.string().required(required('customer')),

    contactPerson: yup.string().required(required('contactPerson')),

    proposalName: yup.string().required(required('proposalName')),

    toAddress: yup.string().required(required('toAddress')),

    remarks: yup.string().nullable(),

    specialTermsConditions: yup.string().nullable()
  });
};
export const CreatePurchaseOrderSchema = (t, { hasPoDoc = false, hasAdditionalDoc = false } = {}) => {
  const { required } = validation(t);

  return yup.object().shape({
    poDate: yup.date().nullable().required(required('poDate')).typeError(t('invalidDate')).max(new Date(), t('futureDateNotAllowed', 'Future date not allowed')),
    poNumber: yup.string().required(required('poNumber')),
    poDocument: hasPoDoc ? yup.mixed().nullable() : yup.mixed().required(required('poDocument')),
    // autoRenewal: yup.boolean(),
    // serviceStartDate: yup.date().nullable().typeError(t('invalidDate')).when('autoRenewal', {
    //   is: false,
    //   then: (s) => s.required(t('required', { 0: t('serviceStartDate') }))
    // }),
    // serviceEndDate: yup.date().nullable().typeError(t('invalidDate')).when('autoRenewal', {
    //   is: false,
    //   then: (s) => s.required(t('required', { 0: t('serviceEndDate') }))
    // }),
    // serviceMonths: yup.string().nullable().when('autoRenewal', {
    //   is: false,
    //   then: (s) => s.required(t('required', { 0: t('serviceMonths') }))
    // }),
    poStartDate: yup.date().nullable().required(required('poStartDate')).typeError(t('invalidDate')),
    poEndDate: yup.date().nullable().required(required('poEndDate')).typeError(t('invalidDate')),
    additionalDocument: hasAdditionalDoc ? yup.mixed().nullable() : yup.mixed().required(required('additionalDocument')),
    remarks: yup.string().required(required('remarks'))
  });
};

export const SummaryNotesSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    notes: yup.string().required(required('remarks'))
  });
};

export const DispositionSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    disposition: yup
      .mixed()
      .required(required('disposition'))
      .test('has-id', required('disposition'), (value) => !!value?.id),
    reason: yup
      .mixed()
      .required(required('reason'))
      .test('has-id', required('reason'), (value) => !!value?.id),
    followUpUnit: yup
      .mixed()
      .required(required('followUpUnit'))
      .test('has-id', required('followUpUnit'), (value) => !!value?.id),
    followUpValue: yup.mixed().required(required('followUpValue')),
    remarks: yup.string().required(required('remarks'))
  });
};

export const CorporateMeetingSchema = (t) => {
  const { required, invalidDigits } = validation(t);

  return yup.object().shape({
    meetingConducted: yup.string(),
    remarks: yup.string().required(required('remarks')),
    meetingDate: yup.string().when('meetingConducted', {
      is: 'yes',
      then: (schema) => schema.required(required('meetingDate'))
    }),
    contactName: yup.string().when('meetingConducted', {
      is: 'yes',
      then: (schema) => schema.required(required('contactName'))
    }),
    contactNumber: yup.string().when('meetingConducted', {
      is: 'yes',
      then: (schema) =>
        schema.required(required('contactNumber')).matches(regex.mobile, invalidDigits('contactNumber', 10))
    })
  });
};

export const CorporateCustomerBasicDetailsSchema = (t) => {
  const { required, invalidFormat, invalidDigits } = validation(t);

  return yup.object().shape({
    companyType: yup
      .mixed()
      .required(required('companyType'))
      .test('has-value', required('companyType'), (value) => {
        if (!value) return false;
        return typeof value === 'string' ? value.length > 0 : !!value?.code;
      }),
    department: yup.mixed().when('companyType', {
      is: (val) => val?.code === 'GOVERNMENT' || val === 'GOVERNMENT',
      then: (schema) => schema.required(required('department')),
      otherwise: (schema) => schema.notRequired()
    }),
    subDepartment: yup.mixed().when('companyType', {
      is: (val) => val?.code === 'GOVERNMENT' || val === 'GOVERNMENT',
      then: (schema) => schema.required(required('subDepartment')),
      otherwise: (schema) => schema.notRequired()
    }),
    customerName: yup.string().required(required('customerName')),
    contactPerson: yup.string().required(required('contactPerson')),
    mobile: yup.string().required(required('mobile')).matches(regex.mobile, invalidDigits('mobile', 10)),
    email: yup.string().required(required('email')).matches(regex.email, invalidFormat('email')),
    pincode: yup.string().required(required('pincode')).matches(regex.pinCode, invalidDigits('pincode', 6)),
    address: yup.string().required(required('address')),
    latitude: yup.string().notRequired(),
    longitude: yup.string().notRequired()
  });
};

export const CorporateCustomerPANDetailsSchema = (t) => {
  const { required, invalidFormat } = validation(t);

  return yup.object().shape({
    panNumber: yup
      .string()
      .required(required('panNumber'))
      .transform((val) => (val ? val.toUpperCase() : val))
      .matches(regex.panNumber, invalidFormat('panNumber')),
    panDocument: yup.mixed().required(required('panDocument'))
  });
};

export const CorporateCustomerGSTDetailsSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    gstInformation: yup.string().trim().required(required('gstInformation')),

    gstin: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) =>
        schema
          .trim()
          .required(required('gstNumber'))
          .matches(regex.gstNumber, t('invalidGstNumber'))
          .length(15, t('gstNumberLength')),
      otherwise: (schema) => schema.notRequired()
    }),

    serviceDescription: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(required('serviceDescription')),
      otherwise: (schema) => schema.notRequired()
    }),

    sac: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(required('sacCode')),
      otherwise: (schema) => schema.notRequired()
    }),

    taxPayerType: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(required('taxPayerType')),
      otherwise: (schema) => schema.notRequired()
    }),

    legalName: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(required('legalBusinessName')),
      otherwise: (schema) => schema.notRequired()
    }),

    tradeName: yup.string().when('gstInformation', {
      is: 'Yes',
      then: (schema) => schema.trim().required(required('tradeName')),
      otherwise: (schema) => schema.notRequired()
    }),

    supportingDocument: yup.mixed().required(required('supportingDocument'))
  });
};

export const CorporateFeasibilitySchema = (t) => {
  return yup.object().shape({
    nearestLnp: yup.object().required(t('validations.required', { 0: t('nearestLnp') })),
    nearestSubscriberId: yup.string().required(t('validations.required', { 0: t('nearestSubscriberId') })),
    connectedBy: yup
      .mixed()
      .required(t('validations.required', { 0: t('scope', 'Scope') }))
      .test('has-id', t('validations.required', { 0: t('scope', 'Scope') }), (value) => {
        return value?.id ? true : false;
      }),
    distance: yup
      .string()
      .required(t('validations.required', { 0: t('distanceFromNearestLnp', 'Distance from the Nearest LNP') })),
    nearestClosureId: yup.string().required(t('validations.required', { 0: t('nearestClosureId') })),
    nearestPop: yup.object().required(t('validations.required', { 0: t('nearestPop', 'Nearest POP') })),
    otc: yup.string().required(t('validations.required', { 0: t('estimatedOtc', 'Estimated OTC') })),
    fiberQuantity: yup
      .string()
      .required(t('validations.required', { 0: t('estimatedFiberQuantity', 'Estimated Fiber Quantity') })),
    remarks: yup.string().required(t('validations.required', { 0: t('remarks') }))
  });
};

export const AddCorporateLocationSchema = (t) => {
  const { required, invalidFormat } = validation(t);

  return yup.object().shape({
    locName: yup.string().required(required('locationName')),
    contactPerson: yup.string().required(required('contactPerson')),
    mobile: yup
      .string()
      .required(required('mobile'))
      .matches(regex.mobile, t('invalidMobileNumber'))
      .test('no-repeated-digits', t('invalidMobileNumber'), (value) => !value || !/(.)\1{4,}/.test(value)),
    email: yup.string().required(required('email')).matches(regex.email, invalidFormat('email')),
    pincode: yup
      .string()
      .required(required('pincode'))
      .matches(regex.pinCode, t('invalidPinCode'))
      .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value)),
    address: yup.string().required(required('address')),
    latitude: yup.string().notRequired(),
    longitude: yup.string().notRequired(),
    serviceId: yup
      .mixed()
      .required(required('serviceType'))
      .test('has-id', required('serviceType'), (value) => (value?.id ? true : false)),
    packageType: yup
      .mixed()
      .required(required('packageType'))
      .test('has-id', required('packageType'), (value) => (value?.id ? true : false)),
    packageId: yup
      .mixed()
      .required(required('package'))
      .test('has-id', required('package'), (value) => (value?.id ? true : false)),
    additionalServices: yup.mixed().nullable().notRequired(),
    remarks: yup.string().notRequired()
  });
};

export const AssignToSchema = (t) => {
  const { required } = validation(t);
  return yup.object().shape({
    userId: yup.string().required(required('user'))
  });
};

export const RemarksSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    remarks: yup.string().required(required('remarks'))
  });
};

export const ProposalDispatchEmailSchema = (t) => {
  const { required } = validation(t);
  return yup.object().shape({
    emailId: yup.string().email().required(required('emailId')),
    additionalMailId: yup.string().email().nullable().optional()
  });
};

export const ProposalDispatchDirectSchema = (t) => {
  const { required } = validation(t);
  return yup.object().shape({
    dispatchMode: yup.string().required(required('dispatchMode')),
    dispatchDate: yup.string().required(required('dispatchDate')),
    consigneeName: yup.string().required(required('consigneeName'))
  });
};

const MAX_CSV_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const csvUploadSchema = (t) =>
  yup.object().shape({
    csvFile: yup
      .mixed()
      .required(t('pleaseSelectFile', 'Please select a CSV file'))
      .test('fileSize', t('fileSizeExceeds2MB', 'File size cannot exceed 2MB'), (v) => !v || v.size <= MAX_CSV_FILE_SIZE)
      .test('fileType', t('onlyCSVAllowed', 'Only CSV files are allowed'), (v) => !v || v.name?.toLowerCase().endsWith('.csv'))
  });
