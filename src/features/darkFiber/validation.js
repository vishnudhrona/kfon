import * as yup from 'yup';

import { validation } from '@/utils/validationUtils';

export const CreateProposalFormSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    companyName: yup.string().required(required('companyName')),
    contactPerson: yup.string().required(required('contactPerson')),
    proposalName: yup.string().required(required('proposalName')),
    toAddress: yup.string().required(required('toAddress')),
    remarks: yup.string().nullable(),
    specialTermsConditions: yup.string().nullable()
  });
};

export const DarkFiberDetailsSchema = (t) => {
  const { required } = validation(t);

  return yup.object().shape({
    startPop: yup
      .mixed()
      .required(required('startPop'))
      .test('has-id', required('startPop'), (value) => {
        return value?.id ? true : false;
      }),
    endPop: yup
      .mixed()
      .required(required('endPop'))
      .test('has-id', required('endPop'), (value) => {
        return value?.id ? true : false;
      }),
    commissionDoc: yup.mixed().required(required('commissionDoc')),
    otcCharge: yup.number().required(required('otcCharge')).typeError(t('mustBeANumber'))
  });
};

export const CompanyProfileSchema = (t, hasPanDetails = false) => {
  const { required } = validation(t);

  return yup.object().shape({
    panNumber: yup.string().required(required('panNumber')),
    panDoc: yup.mixed().when([], {
      is: () => !hasPanDetails,
      then: (schema) => schema.required(required('panDoc')),
      otherwise: (schema) => schema.nullable()
    }),
    gstinRequired: yup.string().required(required('gstin')),
    gstin: yup.string().when('gstinRequired', {
      is: 'yes',
      then: (schema) => schema.required(required('gstin'))
    }),
    taxPayerType: yup.string().when('gstinRequired', {
      is: 'yes',
      then: (schema) => schema.required(required('taxPayerType'))
    }),
    legalName: yup.string().when('gstinRequired', {
      is: 'yes',
      then: (schema) => schema.required(required('legalName'))
    }),
    tradeName: yup.string().when('gstinRequired', {
      is: 'yes',
      then: (schema) => schema.required(required('tradeName'))
    }),
    serviceDescription: yup.string().when('gstinRequired', {
      is: 'yes',
      then: (schema) => schema.required(required('serviceDescription'))
    }),
    sac: yup.string().when('gstinRequired', {
      is: 'yes',
      then: (schema) => schema.required(required('sac'))
    }),
    gstDoc: yup.mixed().when('gstinRequired', {
      is: 'yes',
      then: (schema) => schema.required(required('gstinDocument'))
    }),
    supportingDoc: yup.mixed().required(required('supportingDocument')),
    lutDoc: yup.mixed()
  });
};
