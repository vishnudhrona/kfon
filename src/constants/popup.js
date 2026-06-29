import { t } from "i18next";

export const POPUP_TEMPLATES = {
  COMMON: 'COMMON',
  COMMON_WITH_STATUS: 'COMMON_WITH_STATUS',
  DIGITAL_SIGNATURE: 'DIGITAL_SIGNATURE',
  PROGRESS_COMPLETION: 'PROGRESS_COMPLETION'
};

export const GLOBAL_POPUP = 'global_popup';

export const DEFAULT_POPUP_DATA = {
  template: POPUP_TEMPLATES.COMMON,
  heading: '',
  confirmButton: true,
  confirmButtonLabel: t('ok'),
  size: 'xl'
};