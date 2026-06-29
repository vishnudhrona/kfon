import * as yup from 'yup';

import { dropdownRequired, validation } from '@/utils/validationUtils';

import { BOD, FIELD_LABELS, UNLIMITED_CODE } from './constants';

export const planPackageSchema = (t) => {
  const validate = validation(t);
  return yup.object({
    packageName: yup.string().required(validate.required(FIELD_LABELS.packageName)),
    packageType: dropdownRequired(validate.required(FIELD_LABELS.packageType)),
    planType: dropdownRequired(validate.required(FIELD_LABELS.planType)),
    createCorrespondingTermPlan: yup.boolean(),
    freeValidity: yup.number().nullable().notRequired(),
    initialFreeValidity: yup.number().nullable().notRequired(),
    bonusValidity: yup.number().nullable().notRequired(),
    threeMonthFreeValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.freeValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    threeMonthInitialFreeValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.initialFreeValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    threeMonthBonusValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.bonusValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    sixMonthFreeValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.freeValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    sixMonthInitialFreeValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.initialFreeValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    sixMonthBonusValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.bonusValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    twelveMonthFreeValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.freeValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    twelveMonthInitialFreeValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.initialFreeValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    twelveMonthBonusValidity: yup.number().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.bonusValidity)),
      otherwise: (schema) => schema.nullable()
    }),
    disbursementType: yup.mixed().when('createCorrespondingTermPlan', {
      is: (val) => !!val,
      then: (schema) =>
        schema
          .nullable()
          .test(
            'disbursementType-required',
            validate.required(FIELD_LABELS.disbursementType),
            (val) => val != null && val !== ''
          ),
      otherwise: (schema) => schema.nullable()
    }),
    status: yup.string().required(t('required')),
    packageFee: yup.number().required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.packageFee)),
    speedProfile: dropdownRequired(validate.required(FIELD_LABELS.speedProfile)),
    serviceType: dropdownRequired(validate.required(FIELD_LABELS.serviceType)),
    bodMin: yup.number().when('serviceType', {
      is: (val) => val?.name === BOD,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.bodMin)),
      otherwise: (schema) => schema.nullable()
    }),
    bodMax: yup.number().when('serviceType', {
      is: (val) => val?.name === BOD,
      then: (schema) =>
        schema
          .required(t('required'))
          .typeError(validate.mustBeNumber(FIELD_LABELS.bodMax))
          .when('bodMin', (bodMin, schema) =>
            schema.test(
              'bodMax-gt-bodMin',
              t('validations.mustBeGreaterThan', { 0: t(FIELD_LABELS.bodMax), 1: t(FIELD_LABELS.bodMin) }),
              (bodMax) => {
                const min = Array.isArray(bodMin) ? bodMin[0] : bodMin;
                if (bodMax == null || min == null || isNaN(min)) return true;
                return bodMax > min;
              }
            )
          ),
      otherwise: (schema) => schema.nullable()
    }),
    allocatedVolume: yup.number().when(['packageType', 'serviceType'], {
      is: (packageType, serviceType) => packageType?.code !== UNLIMITED_CODE && serviceType?.name !== BOD,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.allocatedVolume)),
      otherwise: (schema) => schema.nullable()
    }),
    fallbackSpeed: yup.object().when('packageType', {
      is: (val) => val?.code !== UNLIMITED_CODE,
      then: () => dropdownRequired(validate.required(FIELD_LABELS.fallbackSpeed)),
      otherwise: (schema) => schema.nullable()
    }),
    categoryType: yup.object().when('packageType', {
      is: (val) => val?.code !== UNLIMITED_CODE,
      then: () => dropdownRequired(validate.required(FIELD_LABELS.categoryType)),
      otherwise: (schema) => schema.nullable()
    }),
    packagePlanType: yup.object().when('packageType', {
      is: (val) => val?.code !== UNLIMITED_CODE,
      then: () => dropdownRequired(validate.required(FIELD_LABELS.packagePlanType)),
      otherwise: (schema) => schema.nullable()
    }),
    noOfSubPackages: yup
      .number()
      .required(t('required'))
      .typeError(validate.mustBeNumber(FIELD_LABELS.noOfSubPackages)),
    subscriptionType: dropdownRequired(validate.required(FIELD_LABELS.subscriptionType)),
    remarks: yup.string().required(t('required'))
  });
};

export const subPackageSchema = (t) => {
  const { required } = validation(t);
  const validate = validation(t);
  return yup.object({
    subServiceType: dropdownRequired(validate.required('subServiceType')),
    packageFee: yup
      .number()
      .required(required('packageFee'))
      .positive(t('mustBePositive'))
      .typeError(t('mustBeANumber')),

    revenueShare: yup.mixed().when('subServiceType', {
      is: (val) => !!val?.partnerMapping,
      then: () => dropdownRequired(validate.required('revenueShare')),
      otherwise: (schema) => schema.strip()
    }),
    partnerType: yup.mixed().when('subServiceType', {
      is: (val) => !!val?.partnerMapping,
      then: () => dropdownRequired(validate.required('partnerType')),
      otherwise: (schema) => schema.strip()
    }),
    provider: yup.mixed().when('subServiceType', {
      is: (val) => !!val?.partnerMapping,
      then: () => dropdownRequired(validate.required('provider')),
      otherwise: (schema) => schema.strip()
    }),
    discountType: yup.mixed().when('subServiceType', {
      is: (val) => !!val?.discountable,
      then: () => yup.mixed().required(validate.required('discountType')),
      otherwise: (schema) => schema.strip()
    }),
    discount: yup.mixed().when('subServiceType', {
      is: (val) => !!val?.discountable,
      then: () =>
        yup
          .number()
          .required(required('discount'))
          .typeError(t('mustBeANumber'))
          .transform((v) => (v === '' || isNaN(v) ? null : v))
          .test('max-discount', t('validations.maxValue', { 0: t('discount'), 1: 100 }), function (value) {
            if (value === null || value === undefined) return true;
            const discountTypeVal = this.parent.discountType?.value || this.parent.discountType;
            if (discountTypeVal === 'PERCENTAGE' && value > 100) {
              return false;
            }
            return true;
          }),
      otherwise: (schema) => schema.strip()
    })
  });
};

export const corporatePackageSchema = (t) => {
  const validate = validation(t);
  return yup.object({
    serviceType: dropdownRequired(validate.required('serviceType')),
    renewalFee: yup.number().required(t('required')).typeError(validate.mustBeNumber('renewalFee')),
    speedInMbps: yup.number().required(t('required')).typeError(validate.mustBeNumber('speedInMbps')),
    packageType: dropdownRequired(validate.required(FIELD_LABELS.packageType)),
    volume: yup.number().when('packageType', {
      is: (val) => val?.code !== UNLIMITED_CODE,
      then: (schema) => schema.required(t('required')).typeError(validate.mustBeNumber(FIELD_LABELS.allocatedVolume)),
      otherwise: (schema) => schema.nullable()
    }),
    fallbackSpeed: yup
      .mixed()
      .when('packageType', {
        is: (val) => val?.code !== UNLIMITED_CODE,
        then: () =>
          yup
            .number()
            .transform((v, raw) => (raw === '' || raw == null ? undefined : v))
            .required(t('required'))
            .typeError(validate.mustBeNumber(FIELD_LABELS.fallbackSpeed)),
        otherwise: () => yup.mixed().nullable()
      }),
    otcCost: yup
      .number()
      .nullable()
      .transform((v) => (v === '' || isNaN(v) ? null : v))
      .typeError(validate.mustBeNumber('otcCost'))
  });
};

export const mainServiceSchema = (t) => {
  const validate = validation(t);
  return yup.object({
    serviceCategory: dropdownRequired(validate.required('serviceCategory')),
    serviceName: yup.string().required(validate.required('serviceName')),
    labelName: yup.string().required(validate.required('labelName')),
    subPackageCount: yup.number().required(t('required')).typeError(validate.mustBeNumber('subPackageCount')),
    bundleType: dropdownRequired(validate.required('bundleType')),
    defaultPackageType: yup
      .array()
      .min(1, validate.required('defaultPackageType'))
      .required(validate.required('defaultPackageType'))
      .nullable(),
    isBod: yup.boolean().nullable().notRequired(),
    isAddOnPackage: yup.boolean().nullable().notRequired(),
    active: yup.string().required(validate.required('status'))
  });
};

export const subServiceSchema = (t) => {
  const validate = validation(t);
  return yup.object({
    name: yup.string().required(validate.required('subServiceName')),
    label: yup.string().required(validate.required('labelName')),
    sequence: yup.number().typeError(validate.mustBeNumber('sequence')).nullable().notRequired(),
    serviceTypes: dropdownRequired(validate.required('serviceTypes')),
    subPackageTypeId: yup.mixed().when('serviceTypes', {
      is: (val) => val?.requiresRCode === true,
      then: () => dropdownRequired(validate.required('rCode')),
      otherwise: (schema) => schema.nullable().notRequired()
    }),
    discountable: yup.string().required(t('required')),
    partnerMapping: yup.string().required(t('required')),
    isActive: yup.string().required(t('required'))
  });
};
