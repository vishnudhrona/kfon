import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

export const getEnquiryList = (state) => {
  const data = selectorWithKey(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.DARK_FIBER_ENQUIRY_LIST);
  return { data };
};

export const getProposalList = (state) => {
  const data = selectorWithKey(getServerSideData(state), SERVER_SIDE_TABLE_KEYS.DARK_FIBER_PROPOSAL_LIST);
  return { data };
};

export const getEnquiryDetails = (state) => state.darkFiber.enquiryDetails.data || {};
