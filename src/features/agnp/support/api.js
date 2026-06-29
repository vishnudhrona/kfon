import { REQUEST_METHOD } from '@/constants/api';
import { API_URL } from '@/constants/urls';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

export const ticketTableDataApi = () => ({
  url: API_URL.AGNP.FETCH_TICKET_TABLE_DATA,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.FETCH_TICKET_TABLE_DATA],
    progressKey: ACTION_TYPES.FETCH_TICKET_TABLE_DATA
  },
  guestAccess: true
});

export const submitTicketApi = (data={}) => ({
  url: API_URL.AGNP.SUBMIT_TICKET_DATA,
  method: REQUEST_METHOD.POST,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[ACTION_TYPES.SUBMIT_TICKET_DATA],
    data,
    progressKey:ACTION_TYPES.SUBMIT_TICKET_DATA
  },
  guestAccess: true
})
