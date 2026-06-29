import { flow } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { STATE_REDUCER_KEY } from './constants';

const ticketKey = (state) => state[STATE_REDUCER_KEY];

const ticketList = (state) => {
    const data = state?.[SERVER_SIDE_TABLE_KEYS.TICKET_LIST_TABLE]?.data || [];
    return { data };
};
export const getTicketList = flow(ticketKey, ticketList);
