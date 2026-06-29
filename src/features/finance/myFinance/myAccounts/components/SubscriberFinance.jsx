import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchSubscriberFinance } from '../action';
import { getVisibleColumnsSubscriberFinance } from '../constants';

const SubscriberFinance = () => {
  const { t } = useTranslation();

  const actions = (
    <>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('downloadCSV')}
      </Button>
    </>
  );

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_FINANCE_TABLE)}
      fetchAction={fetchSubscriberFinance}
      columns={getVisibleColumnsSubscriberFinance(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_FINANCE_TABLE}
      pageTitle={t('mySubscriberFinanceTransactions')}
      actions={actions}
    />
  );
};

export default SubscriberFinance;
