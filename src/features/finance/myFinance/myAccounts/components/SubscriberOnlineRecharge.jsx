import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchSubscriberOnlineRecharge } from '../action';
import { getVisibleColumnsSubscriberOnlineRecharge } from '../constants';

const SubscriberOnlineRecharge = () => {
  const { t } = useTranslation();

  const actions = (
    <>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('downloadCSV')}
      </Button>
      <Button variant='outline' borderRadius='md' height='40px'>
        Filter Details
      </Button>
    </>
  );

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ONLINE_RECHARGE_TABLE)}
      fetchAction={fetchSubscriberOnlineRecharge}
      columns={getVisibleColumnsSubscriberOnlineRecharge(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ONLINE_RECHARGE_TABLE}
      pageTitle={t('subscriberOnlineTransactions')}
      actions={actions}
    />
  );
};

export default SubscriberOnlineRecharge;
