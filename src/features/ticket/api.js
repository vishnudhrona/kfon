import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const fetchTicketListApi = (payload) => {
  return {
    url: API_URL.TICKET.LIST,
    method: REQUEST_METHOD.GET,
    payload: {
      types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_LIST],
      progressKey: ACTION_TYPES.FETCH_TICKET_LIST
    },
    params: payload
  };
};
