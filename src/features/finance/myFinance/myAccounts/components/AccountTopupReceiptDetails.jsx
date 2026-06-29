import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchAccountTopupReceiptDetails } from '../action';
import { getVisibleColumnsAccountTopupReceiptDetails } from '../constants';

const AccountTopupReceiptDetails = () => {
  const { t } = useTranslation();

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.ACCOUNT_TOPUP_RECEIPT_DETAILS_TABLE)}
      fetchAction={fetchAccountTopupReceiptDetails}
      columns={getVisibleColumnsAccountTopupReceiptDetails(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.ACCOUNT_TOPUP_RECEIPT_DETAILS_TABLE}
      pageTitle={t('accountTopupReceiptDetails')}
    />
  );
};

export default AccountTopupReceiptDetails;
