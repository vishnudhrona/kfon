import { REQUEST_METHOD } from '@/constants/api';

import { API_ACTION_TYPE_VARIANTS, API_ACTION_TYPES } from './actions';

const NOTIFICATIONS_API_URL = 'bss-file-storage-services/api/notes/my-notes';

export const fetchNotificationsApi = () => ({
  url: NOTIFICATIONS_API_URL,
  method: REQUEST_METHOD.GET,
  payload: {
    types: API_ACTION_TYPE_VARIANTS[API_ACTION_TYPES.FETCH_NOTIFICATIONS],
    progressKey: API_ACTION_TYPES.FETCH_NOTIFICATIONS
  }
});
