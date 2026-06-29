import { flow, get } from 'lodash-es';

import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { STATE_REDUCER_KEY } from './constants';

const revenueShareKey = (state) => state[STATE_REDUCER_KEY];

export const getTableData = (key) => flow(revenueShareKey, (state) => get(state, key, {}));

export const getRevenueShareList = (state) => {
  const data = selectorWithKey(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.REVENUE_SHARE_TABLE);
  return { data };
};

const revenueShareList = (state) => get(state, 'revenueShare.revenueShareList', {});
export const getRevenueShareListFromSlice = flow(revenueShareKey, revenueShareList);

const partnerList = (state) => {
  const data = get(state, 'revenueShare.partnerList', []);
  return data.map((item) => ({
    ...item,
    name: item.displayName
  }));
};

const partnerLnpList = (state) => {
  const data = get(state, 'revenueShare.partnerLnpList', []);
  return data.map((item) => ({
    ...item,
    name: item.displayName
  }));
};

export const getPartnerList = flow(revenueShareKey, partnerList);
export const getPartnerLnpList = flow(revenueShareKey, partnerLnpList);
