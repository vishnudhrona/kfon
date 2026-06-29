import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchDisbursementDetails } from '../action';
import { getVisibleColumnsDisbursementDetails } from '../constants';

const DisbursementDetails = () => {
  const { t } = useTranslation();

  const actions = (
    <>
      <Button variant='outline' borderRadius='md' height='40px'>
        Change Month
      </Button>
      <Button variant='outline' borderRadius='md' height='40px'>
        {t('filter')}
      </Button>
    </>
  );

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.DISBURSEMENT_DETAILS_TABLE)}
      fetchAction={fetchDisbursementDetails}
      columns={getVisibleColumnsDisbursementDetails(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.DISBURSEMENT_DETAILS_TABLE}
      pageTitle={t('disbursementDetails')}
      actions={actions}
    />
  );
};

export default DisbursementDetails;
