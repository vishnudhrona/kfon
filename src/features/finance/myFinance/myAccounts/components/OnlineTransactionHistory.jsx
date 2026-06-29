import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchOnlineTransactionHistory } from '../action';
import { getVisibleColumnsOnlineTransactionHistory } from '../constants';

const OnlineTransactionHistory = () => {
  const { t } = useTranslation();

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.ONLINE_TRANSACTION_HISTORY_TABLE)}
      fetchAction={fetchOnlineTransactionHistory}
      columns={getVisibleColumnsOnlineTransactionHistory(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.ONLINE_TRANSACTION_HISTORY_TABLE}
      pageTitle={t('previousTransactions')}
    />
  );
};

export default OnlineTransactionHistory;
