import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchLNPCumulativeSummary } from '../action';
import { getVisibleColumnsLnpCumulativeSummary } from '../constants';

const LNPCumulativeSummary = () => {
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
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.LNP_CUMULATIVE_SUMMARY_TABLE)}
      fetchAction={fetchLNPCumulativeSummary}
      columns={getVisibleColumnsLnpCumulativeSummary(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.LNP_CUMULATIVE_SUMMARY_TABLE}
      pageTitle={t('lnpCumulativeSummary')}
      actions={actions}
    />
  );
};

export default LNPCumulativeSummary;
