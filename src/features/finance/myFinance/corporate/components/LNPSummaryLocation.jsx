import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchLNPSummaryLocation } from '../action';
import { getVisibleColumnsLnpSummaryLocation } from '../constants';

const LNPSummaryLocation = () => {
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
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.LNP_SUMMARY_LOCATION_TABLE)}
      fetchAction={fetchLNPSummaryLocation}
      columns={getVisibleColumnsLnpSummaryLocation(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.LNP_SUMMARY_LOCATION_TABLE}
      pageTitle={t('lnpSummaryLocation')}
      actions={actions}
    />
  );
};

export default LNPSummaryLocation;
