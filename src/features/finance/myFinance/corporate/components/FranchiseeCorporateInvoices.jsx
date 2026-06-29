import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchFranchiseeCorporateInvoices } from '../action';
import { getVisibleColumnsFranchiseeCorporateInvoices } from '../constants';

const FranchiseeCorporateInvoices = () => {
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
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.FRANCHISEE_CORPORATE_INVOICES_TABLE)}
      fetchAction={fetchFranchiseeCorporateInvoices}
      columns={getVisibleColumnsFranchiseeCorporateInvoices(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.FRANCHISEE_CORPORATE_INVOICES_TABLE}
      pageTitle={t('franchiseeCorporateInvoices')}
      actions={actions}
    />
  );
};

export default FranchiseeCorporateInvoices;
