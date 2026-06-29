import * as yup from 'yup';

import { regex } from '@/utils/validationUtils';

export const createTicketValidation = (t, userRole) =>
  yup.object().shape({
    ticketCategory: yup
      .object()
      .nullable()
      .required(t('validations.required', { 0: t('ticketCategory') })),
    requestType:
      userRole === 'LNP'
        ? yup.string().required(t('validations.required', { 0: t('ticketCategory') }))
        : yup.string().notRequired(),
    typeOfCustomers: yup
      .object()
      .nullable()
      .when('ticketCategory', {
        is: (ticketCategory) => userRole !== 'LNP' && ticketCategory?.name !== 'Inward',
        then: (schema) => schema.required(t('validations.required', { 0: t('typeOfCustomers') })),
        otherwise: (schema) => schema.notRequired()
      }),
    lnp: yup.object().when('typeOfCustomers', {
      is: (val) => val?.code === 'LNP',
      then: (schema) => schema.nullable().required(t('validations.required', { 0: t('selectLnp') })),
      otherwise: (schema) => schema.nullable().notRequired()
    }),
    subscriber: yup.object().when('typeOfCustomers', {
      is: (val) => val?.code === 'SUBSCRIBERS',
      then: (schema) => schema.nullable().required(t('validations.required', { 0: t('selectSubscriber') })),
      otherwise: (schema) => schema.nullable().notRequired()
    }),
    subTypes: yup.object().when(['typeOfCustomers', 'ticketCategory'], {
      is: (typeOfCustomers, ticketCategory) =>
        typeOfCustomers?.code === 'SUBSCRIBERS' && (ticketCategory?.name || '').toLowerCase().startsWith('complaint'),
      then: (schema) => schema.nullable().required(t('validations.required', { 0: t('subTypes') })),
      otherwise: (schema) => schema.nullable().notRequired()
    }),
    govtOfficers: yup.object().when('typeOfCustomers', {
      is: (val) => val?.code === 'GOVT_OFFICES',
      then: (schema) => schema.nullable().required(t('validations.required', { 0: t('govtOffices') })),
      otherwise: (schema) => schema.nullable().notRequired()
    }),
    keyContactNumber: yup.string().when(['typeOfCustomers', 'ticketCategory'], {
      is: (typeOfCustomers, ticketCategory) =>
        typeOfCustomers?.code === 'GENERAL_PUBLIC' || ticketCategory?.name === 'Inward',
      then: (schema) =>
        schema
          .required(t('validations.required', { 0: t('mobileNumber') }))
          .length(10, t('validations.invalidDigits', { 0: t('mobileNumber'), 1: 10 })),
      otherwise: (schema) => schema.notRequired()
    }),
    hasSubscribers: yup.boolean().notRequired(),
    district: yup
      .object()
      .nullable()
      .when(['ticketCategory', 'typeOfCustomers'], {
        is: (ticketCategory, typeOfCustomers) =>
          (ticketCategory?.name === 'Enquiries' && typeOfCustomers?.code === 'GENERAL_PUBLIC') || ticketCategory?.name === 'Inward',
        then: (schema) => schema.required(t('validations.required', { 0: t('district') })),
        otherwise: (schema) => schema.notRequired()
      }),
    pinCode: yup
      .string()
      .nullable()
      .when(['ticketCategory', 'typeOfCustomers'], {
        is: (ticketCategory, typeOfCustomers) =>
          (ticketCategory?.name === 'Enquiries' && typeOfCustomers?.code === 'GENERAL_PUBLIC') || ticketCategory?.name === 'Inward',
        then: (schema) =>
          schema
            .trim()
            .required(t('validations.required', { 0: t('pinCode') }))
            .matches(regex.pinCode, { message: t('invalidPinCode'), excludeEmptyString: true })
            .test('no-repeated-digits', t('invalidPinCode'), (value) => !value || !/(.)\1{5}/.test(value)),
        otherwise: (schema) => schema.notRequired()
      }),
    subject: yup
      .object()
      .nullable()
      .required(t('validations.required', { 0: t('subject') })),
    priority: yup
      .object()
      .nullable()
      .required(t('validations.required', { 0: t('priority') })),
    remarks: yup.string().nullable().when('subject', {
      is: (val) => val?.name === 'Others',
      then: (schema) =>
        schema
          .required(t('validations.required', { 0: t('remarks') }))
          .min(3, t('validations.invalidMinLength', { 0: t('remarks'), 1: 3 })),
      otherwise: (schema) => schema.nullable().notRequired()
    })
  });

export const ticketForwardValidation = (t) =>
  yup.object().shape({
    status: yup
      .object()
      .nullable()
      .required(t('validations.required', { 0: t('state') })),
    action: yup
      .object()
      .nullable()
      .when('status', {
        is: (val) => val?.label !== 'CLOSED' && val?.label !== 'REOPEN',
        then: (schema) => schema.required(t('validations.required', { 0: t('action') })),
        otherwise: (schema) => schema.notRequired()
      }),
    type: yup
      .object()
      .nullable()
      .when(['action', 'status'], {
        is: (action, status) => status?.label !== 'CLOSED' && status?.label !== 'REOPEN' && action?.code !== 'RETURN',
        then: (schema) => schema.required(t('validations.required', { 0: t('category') })),
        otherwise: (schema) => schema.notRequired()
      }),
    selectedUser: yup
      .object()
      .nullable()
      .when(['action', 'status'], {
        is: (action, status) => status?.label !== 'CLOSED' && status?.label !== 'REOPEN' && action?.code !== 'RETURN',
        then: (schema) =>
          schema.when('type', {
            is: (val) => !!val,
            then: (s) => s.required(t('validations.required', { 0: t('user') })),
            otherwise: (s) => s.notRequired()
          }),
        otherwise: (schema) => schema.notRequired()
      })
  });

export const filterPopupValidation = (t) =>
  yup.object().shape(
    {
      createdDateFrom: yup
        .date()
        .nullable()
        .when('createdDateTo', {
          is: (val) => !!val,
          then: (schema) => schema.required(t('validations.required', { 0: t('createdDate') })),
          otherwise: (schema) => schema.nullable().notRequired()
        }),
      createdDateTo: yup
        .date()
        .nullable()
        .when('createdDateFrom', {
          is: (val) => !!val,
          then: (schema) => schema.required(t('validations.required', { 0: t('dueDate') })),
          otherwise: (schema) => schema.nullable().notRequired()
        })
    },
    [['createdDateFrom', 'createdDateTo']]
  );

export const ticketCommentValidation = (t) =>
  yup.object().shape({
    remarks: yup.string().required(t('validations.required', { 0: t('remarks') }))
  });
