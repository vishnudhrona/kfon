import { createSlice } from '@reduxjs/toolkit';
import { get, set } from 'lodash-es';

import { DEFAULT_POPUP_DATA, GLOBAL_POPUP, POPUP_TEMPLATES } from '@/constants/popup';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {
  navigate: {
    active: false,
    isSameModule: true,
    to: ''
  },
  layout: {
    formTitle: '',
    columns: { hideSidebar: false }
  },
  commonConfig: {
    locale: 'en'
  },
  otp:{},
  commonModal: {
    [GLOBAL_POPUP]: {
      isActive: false,
      data: DEFAULT_POPUP_DATA
    }
  }
};

const slice = createSlice({
  initialState,
  name: STATE_REDUCER_KEY,
  reducers: {
    setLocale: (state, { payload }) => {
      set(state, 'commonConfig.locale', payload);
    },
    navigateTo: (state, { payload }) => {
      set(state, 'navigate', { active: true, ...payload });
    },
    disableNavigate: (state) => {
      set(state, 'navigate', initialState.navigate);
    },
    setLayoutColumns: (state, { payload = {} }) => {
      set(state, 'layout.columns', { ...state.layout.columns, ...payload });
    },
    setFormTitle: (state, { payload }) => {
      set(state, 'layout.formTitle', payload.title);
    },
    setOtpDetails: (state, { payload: { number, ...rest } }) => {
      set(state, `otp.${number}`, {
        ...state.otp[number] || {},
        ...rest
      });
    },
    changeCommonPopupStatus: (state, { payload: { isActive = true, name = GLOBAL_POPUP } = {} }) => {
      set(state, `commonModal.${name}.isActive`, isActive);
    },
    changeCommonPopupData: (state, { payload: { data: { template = POPUP_TEMPLATES.COMMON, ...rest } = {}, name = GLOBAL_POPUP } = {} }) => {
      set(state, `commonModal.${name}.data`, {
        ...get(state, `commonModal.${name}.data`, {}),
        template,
        ...rest
      });
    }
  }
});

export const { actions, reducer } = slice;
