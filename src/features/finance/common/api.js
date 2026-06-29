import { API_URL } from '@/constants/urls';
import { createCommonFetchApi } from '@/utils/apiUtils';

import { ACTION_TYPES, API_ACTION_TYPE_VARIANTS } from './action';

const commonFetchApi = createCommonFetchApi(API_ACTION_TYPE_VARIANTS);

export const fetchTopupPaymentResultApi = (data = {}) =>
    commonFetchApi({
        url: API_URL.FINANCE.COMMON.FETCH_TOPUP_PAYMENT_RESULT,
        data,
        actionType: ACTION_TYPES.FETCH_TOPUP_PAYMENT_RESULT
    });
