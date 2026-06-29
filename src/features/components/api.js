import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const mainMenusApi = () => {
  return {
    url: API_URL.MAIN_MENUS.FETCH_MAIN_MENUS,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_MAIN_MENUS],
      progressKey: ACTION_TYPES.FETCH_MAIN_MENUS
    }
  };
};
