import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchDisbursement } from '../action';
import { getVisibleColumnsDisbursement } from '../constants';

const Disbursement = () => {
  const { t } = useTranslation();

  const actions = (
    <>
      <Button variant='solid' borderRadius='md' height='40px'>
        {t('submit')}
      </Button>
    </>
  );

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.DISBURSEMENT_TABLE)}
      fetchAction={fetchDisbursement}
      columns={getVisibleColumnsDisbursement(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.DISBURSEMENT_TABLE}
      pageTitle={t('disbursementReport')}
      actions={actions}
    />
  );
};

export default Disbursement;
