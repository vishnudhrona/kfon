import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchFinanceTransactions } from '../action';
import { getVisibleColumnsFinanceTransactions } from '../constants';

const FinanceTransactions = () => {
  const { t } = useTranslation();

  const actions = (
    <>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('downloadCSV')}
      </Button>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('filter')}
      </Button>
    </>
  );

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.FINANCE_TRANSACTIONS_TABLE)}
      fetchAction={fetchFinanceTransactions}
      columns={getVisibleColumnsFinanceTransactions(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.FINANCE_TRANSACTIONS_TABLE}
      pageTitle={t('financeTransactions')}
      actions={actions}
    />
  );
};

export default FinanceTransactions;
