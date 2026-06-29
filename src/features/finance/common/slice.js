import { createSlice } from '@reduxjs/toolkit';

import { STATE_REDUCER_KEY } from './constants';

const initialState = {
    paymentResult: {}
};

const slice = createSlice({
    name: STATE_REDUCER_KEY,
    initialState,
    reducers: {
        setPaymentResult: (state, { payload }) => {
            state.paymentResult = payload;
        }
    }
});

export const { reducer, actions } = slice;
