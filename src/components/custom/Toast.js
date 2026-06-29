import { toaster } from '@kfonbss/bss-ui-components';

export const TOAST_TYPE = {
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

const TOAST_DEFAULT = {
  duration: 6000,
  closable: true,
  description: 'Successfully completed',
  title: 'Success',
  type: TOAST_TYPE.SUCCESS
};

const createToast = (data = {}) => {
  toaster.create(data);
};

export const showToast = (data = {}) => createToast({ ...TOAST_DEFAULT, ...data });
export const successToast = (data = {}) =>
  createToast({ ...TOAST_DEFAULT, title: '', ...data, type: TOAST_TYPE.SUCCESS });
export const errorToast = (data = {}) => createToast({ ...TOAST_DEFAULT, title: '', ...data, type: TOAST_TYPE.ERROR });
export const warningToast = (data = {}) =>
  createToast({ ...TOAST_DEFAULT, title: '', ...data, type: TOAST_TYPE.WARNING });
