import { createAction } from '@reduxjs/toolkit';

import { generateActionTypeVariants } from '@/utils/actionUtils';

import { STATE_REDUCER_KEY } from './constants';

const API_ACTION_TYPES = {
    FETCH_TOPUP_PAYMENT_RESULT: `${STATE_REDUCER_KEY}/FETCH_TOPUP_PAYMENT_RESULT`
};

export const ACTION_TYPES = {
    ...API_ACTION_TYPES
};

export const API_ACTION_TYPE_VARIANTS = generateActionTypeVariants(API_ACTION_TYPES);

export const fetchTopupPaymentResult = createAction(ACTION_TYPES.FETCH_TOPUP_PAYMENT_RESULT);
