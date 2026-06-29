import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchMonthlyLNPInvoice } from '../action';
import { getVisibleColumnsMonthlyLnpInvoice } from '../constants';

const MonthlyLNPInvoice = () => {
  const { t } = useTranslation();

  const actions = (
    <>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('downloadCSV')}
      </Button>
      <Button variant='outline' borderRadius='md' height='40px'>
        Filter for Month
      </Button>
    </>
  );

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.MONTHLY_LNP_INVOICE_TABLE)}
      fetchAction={fetchMonthlyLNPInvoice}
      columns={getVisibleColumnsMonthlyLnpInvoice(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.MONTHLY_LNP_INVOICE_TABLE}
      pageTitle={t('monthlyLnpInvoice')}
      actions={actions}
    />
  );
};

export default MonthlyLNPInvoice;
