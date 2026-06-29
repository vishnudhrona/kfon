import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchLNPPartnerFinance } from '../action';
import { getVisibleColumnsLnpPartnerFinance } from '../constants';

const LNPPartnerFinance = () => {
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
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.LNP_PARTNER_FINANCE_TABLE)}
      fetchAction={fetchLNPPartnerFinance}
      columns={getVisibleColumnsLnpPartnerFinance(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.LNP_PARTNER_FINANCE_TABLE}
      pageTitle={t('lnpPartnerFinance')}
      actions={actions}
    />
  );
};

export default LNPPartnerFinance;
