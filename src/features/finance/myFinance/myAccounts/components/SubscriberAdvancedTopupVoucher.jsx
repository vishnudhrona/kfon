import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchSubscriberAdvancedTopupVoucher } from '../action';
import { getVisibleColumnsSubscriberAdvancedTopupVoucher } from '../constants';

const SubscriberAdvancedTopupVoucher = () => {
  const { t } = useTranslation();

  return (
    <GenericPageTable
      data={selectorWithKey(
        useSelector(getServerSideData),
        SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ADVANCED_TOPUP_VOUCHER_TABLE
      )}
      fetchAction={fetchSubscriberAdvancedTopupVoucher}
      columns={getVisibleColumnsSubscriberAdvancedTopupVoucher(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ADVANCED_TOPUP_VOUCHER_TABLE}
      pageTitle={t('subscriberAdvancedTopupVoucher')}
    />
  );
};

export default SubscriberAdvancedTopupVoucher;
