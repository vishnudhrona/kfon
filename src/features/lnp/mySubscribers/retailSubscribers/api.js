import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fecthRetailSubcListApi = () => ({
  url: API_URL.LNP.FETCH_RETAIL_SUB_LIST,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_LNP_RETAIL_SUBC_LIST],
    progressKey: ACTION_TYPES.FETCH_LNP_RETAIL_SUBC_LIST
  },
  guestAccess: true
});
