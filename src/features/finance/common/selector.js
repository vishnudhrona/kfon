import { flow } from 'lodash-es';

import { STATE_REDUCER_KEY } from './constants';

const financeCommonKey = (state) => state[STATE_REDUCER_KEY];

const paymentResult = (state) => state?.paymentResult || {};

export const getPaymentResult = flow(financeCommonKey, paymentResult);
