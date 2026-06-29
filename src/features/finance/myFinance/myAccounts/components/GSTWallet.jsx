import { Button } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchGSTWallet } from '../action';
import { getVisibleColumnsGstWallet } from '../constants';

const GSTWallet = () => {
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
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.GST_WALLET_TABLE)}
      fetchAction={fetchGSTWallet}
      columns={getVisibleColumnsGstWallet(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.GST_WALLET_TABLE}
      pageTitle={t('gstWallet')}
      actions={actions}
    />
  );
};

export default GSTWallet;
