import * as yup from 'yup';

import { validation } from '@/utils/validationUtils';

export const userRolePermissionValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    roleName: yup
      .string()
      .required(msg.required('roleName'))
      .test('no-leading-space', t('validations.noLeadingSpace'), (val) => !val || !val.startsWith(' '))
      .test('no-trailing-space', t('validations.noTrailingSpace'), (val) => !val || !val.endsWith(' '))
      .matches(/[a-zA-Z]/, t('validations.mustContainAlphabet'))
      .matches(/^[a-zA-Z0-9._&() -]+$/, t('validations.invalidCharacters')),

    description: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : ''))
      .required(msg.required('description'))
  });
};

export const createUserValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    employeeName: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : ''))
      .required(msg.required('employeeName'))
      .matches(/^[a-zA-Z .]*$/, t('validations.employeeNameFormat'))
      .test('at-most-one-dot', t('validations.atMostOneDot'), (val) => (val?.match(/\./g) || []).length <= 1)
      .test('no-consecutive-spaces', t('validations.noConsecutiveSpaces'), (val) => !/\s\s/.test(val))
      .test(
        'no-start-end-dot',
        t('validations.noStartEndDot'),
        (val) => val && !val.startsWith('.') && !val.endsWith('.')
      ),

    title: yup.object().nullable().required(msg.required('title')),

    emailId: yup.string().email(msg.invalidFormat('emailId')).required(msg.required('emailId')),

    mobileNumber: yup
      .string()
      .matches(/^[6-9]\d{9}$/, t('validations.invalidMobileFormat'))
      .test('not-same', t('validations.invalidMobileDigits'), (val) => !/^(.)\1{9}$/.test(val))
      .required(msg.required('mobileNumber')),

    designation: yup.object().nullable().required(msg.required('designation')),

    userName: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : ''))
      .required(msg.required('userName')),

    remarks: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : ''))
      .matches(/^[a-zA-Z0-9]/, t('validations.firstCharAlphaNumeric'))
      .required(msg.required('remarks')),

    active: yup
      .string()
      .oneOf(['active', 'inactive'], t('validations.pleaseSelect', { 0: t('status') }))
      .required(t('validations.pleaseSelect', { 0: t('status') }))
  });
};

export const userRoleMappingValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    seatName: yup
      .string()
      .required(msg.required('seatName'))
      .matches(/^[a-zA-Z0-9_()&./ -]*$/, t('validations.seatNameFormat'))
      .test('no-leading-space', t('validations.noLeadingSpace'), (val) => !val || !val.startsWith(' '))
      .test('no-trailing-space', t('validations.noTrailingSpace'), (val) => !val || !val.endsWith(' '))
      .test('no-consecutive-spaces', t('validations.noConsecutiveSpaces'), (val) => !/\s\s/.test(val)),

    role: yup
      .array()
      .min(1, t('choose', { 0: t('role') }))
      .required(msg.required('role'))
  });
};

export const createSeatValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    name: yup
      .string()
      .required(msg.required('seatName'))
      .matches(/^[a-zA-Z0-9_()&./ -]*$/, t('validations.seatNameFormat'))
      .test('no-leading-space', t('validations.noLeadingSpace'), (val) => !val || !val.startsWith(' '))
      .test('no-trailing-space', t('validations.noTrailingSpace'), (val) => !val || !val.endsWith(' '))
      .test('no-consecutive-spaces', t('validations.noConsecutiveSpaces'), (val) => !/\s\s/.test(val)),

    active: yup.string().oneOf(['active', 'inactive'], msg.required('status')).required(msg.required('status')),

    organization: yup.object().nullable().required(msg.required('organization')),

    remarks: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : ''))
      .matches(/^[a-zA-Z0-9]/, t('validations.firstCharAlphaNumeric'))
      .required(msg.required('remarks'))
  });
};

export const pincodeMappingValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    district: yup
      .array()
      .min(1, t('choose', { 0: t('district') }))
      .required(msg.required('district')),

    pincode: yup
      .array()
      .min(1, t('choose', { 0: t('pincode') }))
      .required(msg.required('pincode'))
  });
};

export const createTemplateValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    name: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : ''))
      .required(msg.required('templateName')),

    label: yup
      .string()
      .transform((v) => (typeof v === 'string' ? v.trim() : ''))
      .required(msg.required('label')),

    roleName: yup.object().nullable().required(msg.required('roleName')),

    active: yup.string().oneOf(['active', 'inactive'], msg.required('status')).required(msg.required('status'))
  });
};

export const moduleWorkflowValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    module: yup.object().nullable().required(msg.pleaseSelect('module')),

    roles: yup
      .array()
      .of(yup.object())
      .min(1, msg.pleaseSelect('role'))
      .required(msg.pleaseSelect('role')),

    seats: yup
      .array()
      .of(yup.object())
      .min(1, msg.pleaseSelect('seat'))
      .required(msg.pleaseSelect('seat')),

    status: yup.object().nullable().required(msg.pleaseSelect('status'))
  });
};

export const createDivisionValidation = (t) => {
  const msg = validation(t);

  return yup.object({
    name: yup
      .string()
      .required(msg.required('divisionName'))
      .matches(/^[a-zA-Z0-9_()&./ -]*$/, t('validations.seatNameFormat'))
      .test('no-leading-space', t('validations.noLeadingSpace'), (val) => !val || !val.startsWith(' '))
      .test('no-trailing-space', t('validations.noTrailingSpace'), (val) => !val || !val.endsWith(' '))
      .test('no-consecutive-spaces', t('validations.noConsecutiveSpaces'), (val) => !/\s\s/.test(val)),

    organization: yup.object().nullable().required(msg.required('organization')),

    active: yup.string().oneOf(['active', 'inactive'], msg.required('status')).required(msg.required('status'))
  });
};
