import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchTransferredToSubscriber } from '../action';
import { getVisibleColumnsTransferredToSubscriber } from '../constants';

const TransferredToSubscriber = () => {
  const { t } = useTranslation();

  const actions = (
    <>
      <Button variant='outline' borderRadius='md' height='40px'>
        Change Month
      </Button>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('filter')}
      </Button>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('downloadCSV')}
      </Button>
    </>
  );

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.TRANSFERRED_TO_SUBSCRIBER_TABLE)}
      fetchAction={fetchTransferredToSubscriber}
      columns={getVisibleColumnsTransferredToSubscriber(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.TRANSFERRED_TO_SUBSCRIBER_TABLE}
      pageTitle={t('transferredToSubscriber')}
      actions={actions}
    />
  );
};

export default TransferredToSubscriber;
