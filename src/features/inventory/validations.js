import * as Yup from 'yup';

import { MAX_FILE_SIZE } from '@/features/common/constants';
import { CSV_FILE, DOCUMENT_FILES, dropdownRequired, PDF_FILES, regex, validation } from '@/utils/validationUtils';

import { DEVICE_CONFIG_FIELDS } from './constants';

export const getValidationSchema = (formName, t) => {
  const fields = DEVICE_CONFIG_FIELDS[formName] || [];
  const validate = validation(t);
  const shape = {};

  fields.forEach((field) => {
    if (field.type === 'select') return;
    shape[field.name] = Yup.string()
      .trim()
      .required(validate.required(field.label))
      .min(3, validate.invalidMinLength(field.label, 3));
  });

  if (formName === 'deviceCategoryList') {
    shape['deviceType'] = dropdownRequired(validate.required('deviceType'));
    shape['numberOfPorts'] = Yup.string().when('isPonPort', {
      is: true,
      then: () =>
        Yup.string()
          .required(validate.required('numberOfPorts'))
          .matches(/^[1-9][0-9]?$/, t('invalidPortNumber')),
      otherwise: () => Yup.string().notRequired()
    });
  }

  return Yup.object().shape(shape);
};

export const vendorSchema = (t) => {
  const validate = validation(t);
  return Yup.object().shape({
    vendor: Yup.object().shape({
      name: Yup.string()
        .trim()
        .required(validate.required('vendorName'))
        .min(3, validate.invalidMinLength('vendorName', 3)),
      description: Yup.string()
        .trim()
        .required(validate.required('description'))
        .min(3, validate.invalidMinLength('description', 3)),
      mobileNumber: Yup.string()
        .matches(regex.mobile, t('invalidMobileNumber'))
        .required(validate.required('mobileNumber')),
      address: Yup.string().trim().required(validate.required('address'))
    }),
    vendorMap: Yup.array().min(1, validate.required('models')).required(validate.required('models'))
  });
};

export const AddDeviceSchema = (t) => {
  const { required } = validation(t);

  return Yup.object().shape({
    deviceVendor: dropdownRequired(required('deviceVendor')),
    deviceModel: dropdownRequired(required('deviceModel')),
    assetType: Yup.mixed().test('assetType', required('assetType'), (value) => value?.name),
    invoiceDate: Yup.string().required(required('invoiceDate')),
    poNumber: Yup.string().trim().required(required('poNumber')),
    deviceDetailsFile: Yup.mixed()
      .test('fileType', t('onlyExcelAllowed'), (value) => {
        if (!value || value.length === 0) return true; // Optional now
        return CSV_FILE.includes(value.type);
      })
      .test('fileSize', t('fileSizeTooLarge'), (value) => {
        if (!value || value.length === 0) return true; // Optional now
        return value.size <= MAX_FILE_SIZE;
      })
  });
};

export const deviceModelSchema = (t) => {
  const { required, invalidMinLength } = validation(t);

  return Yup.object().shape({
    modelName: Yup.string().trim().required(required('deviceModelName')).min(3, invalidMinLength('deviceModelName', 3)),
    deviceType: dropdownRequired(required('deviceType')),
    deviceMake: dropdownRequired(required('deviceMake')),
    deviceCategory: dropdownRequired(required('deviceCategory')),
    modelDescription: Yup.string().trim().required(required('description')).min(3, invalidMinLength('description', 3))
  });
};

export const getReceiveSchema = (t) => {
  const { required } = validation(t);
  return Yup.object().shape({
    date: Yup.string().required(required('date')),
    condition: dropdownRequired(required('condition')),
    remarks: Yup.string().trim().required(required('remarks'))
  });
};

export const getConditionSchema = (t) => {
  const { required } = validation(t);
  return Yup.object().shape({
    date: Yup.string().required(required('date')),
    condition: dropdownRequired(required('condition')),
    remark: Yup.string().trim().required(required('remark'))
  });
};

export const getTransferSchema = (t, isTransferredStock = false, isLnpMode = false) => {
  const { required } = validation(t);
  const skipRolePersonRemark = isTransferredStock || isLnpMode;
  return Yup.object().shape({
    role: skipRolePersonRemark ? Yup.mixed().nullable().notRequired() : dropdownRequired(required('role')),
    person: skipRolePersonRemark ? Yup.mixed().nullable().notRequired() : dropdownRequired(required('person')),
    remark1: skipRolePersonRemark
      ? Yup.string().nullable().notRequired()
      : Yup.string().trim().required(required('remark')),
    handedOverName: Yup.string()
      .trim()
      .required(required('name'))
      .max(100, t('maxLength', { 0: 100 }))
      .matches(regex.holderName, t('onlyAlphabets')),
    handedOverMobile: Yup.string().required(required('mobileNumber')).matches(regex.mobile, t('invalidMobileNumber')),
    remark2: isTransferredStock
      ? Yup.string().trim().required(required('remarks'))
      : Yup.string().nullable().notRequired()
  });
};

export const getReturnOemSchema = (t) => {
  const { required, invalidMinLength, invalidMaxLength } = validation(t);
  return Yup.object().shape({
    oem: dropdownRequired(required('oem')),
    attachments: Yup.mixed()
      .required(required('attachments'))
      .test('hasFiles', required('attachments'), (value) => {
        if (!value) return false;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      })
      .test('fileType', t('onlyDocumentAllowed'), (value) => {
        if (!value) return true;
        const files = Array.isArray(value) ? value : [value];
        return files.every((f) => {
          if (typeof f === 'string') return true;
          return DOCUMENT_FILES.includes(f.type) || PDF_FILES.includes(f.type);
        });
      })
      .test('fileSize', t('fileSizeTooLarge'), (value) => {
        if (!value) return true;
        const files = Array.isArray(value) ? value : [value];
        return files.every((f) => {
          if (typeof f === 'string') return true;
          return f.size <= MAX_FILE_SIZE;
        });
      }),
    handedOverName: Yup.string()
      .trim()
      .required(required('name'))
      .min(3, invalidMinLength('name', 3))
      .max(100, invalidMaxLength('name', 100))
      .matches(regex.holderName, t('onlyAlphabets')),
    handedOverMobile: Yup.string().required(required('mobileNumber')).matches(regex.mobile, t('invalidMobileNumber')),
    remark: Yup.string()
      .trim()
      .required(required('remark'))
      .min(3, invalidMinLength('remark', 3))
      .max(250, invalidMaxLength('remark', 250))
  });
};

export const getMapDeviceSchema = (t) => {
  const { required } = validation(t);
  return Yup.object().shape({
    deviceMappedTo: dropdownRequired(required('deviceMappedTo')),
    popName: Yup.mixed().when('deviceMappedTo', {
      is: (val) => val?.value === 'POP' || val?.id === 'POP' || val?.name === 'POP',
      then: () => dropdownRequired(required('popName')),
      otherwise: () => Yup.mixed().nullable().notRequired()
    }),
    location: Yup.string().when('deviceMappedTo', {
      is: (val) => val?.value === 'FIELD' || val?.id === 'FIELD' || val?.name === 'FIELD',
      then: () => Yup.string().trim().required(required('location')),
      otherwise: () => Yup.string().nullable().notRequired()
    }),
    deviceIpAddress: Yup.string().trim().matches(regex.ipAddress, t('invalidIpAddress')),
    portNumber: Yup.string()
      .trim()
      .test('port-range', t('invalidPortNumber'), (val) => {
        if (!val) return true;
        return regex.portNumber.test(val) && Number(val) >= 1 && Number(val) <= 65535;
      }),
    remark: Yup.string().trim().required(required('remark'))
  });
};

export const getUnmapDeviceSchema = (t) => {
  const { required } = validation(t);
  return Yup.object().shape({
    deviceUnmappedFrom: dropdownRequired(required('deviceUnmappedFrom')),
    popName: dropdownRequired(required('popName'))
  });
};

export const getReplacementSchema = (t) => {
  const { required, invalidMaxLength } = validation(t);
  return Yup.object().shape({
    serialNumber: Yup.string().trim().required(required('serialNumber')).max(20, invalidMaxLength('serialNumber', 20)),
    macAddress: Yup.string().trim().required(required('macAddress')).matches(regex.macAddress, t('invalidMacAddress')),
    condition: dropdownRequired(required('condition'))
  });
};
