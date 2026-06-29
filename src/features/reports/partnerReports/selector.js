import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

export const getPartnerRequestList = (state) => {
  const data = selectorWithKey(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.PARTNER_REQUEST_LIST);
  return { data };
};
