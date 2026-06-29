import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const myFinanceKey = (state) => state[STATE_REDUCER_KEY];

const franchiseeCorporateInvoices = (state) => {
    const data = state?.myFinance?.formData?.[SERVER_SIDE_TABLE_KEYS.FRANCHISEE_CORPORATE_INVOICES_TABLE] || [];
    return { data };
};

export const getFranchiseeCorporateInvoices = flow(myFinanceKey, franchiseeCorporateInvoices);
