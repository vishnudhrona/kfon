import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchOTCApproval } from '../action';
import { getVisibleColumnsOtcApproval } from '../constants';

const OTCApproval = () => {
  const { t } = useTranslation();

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.OTC_APPROVAL_TABLE)}
      fetchAction={fetchOTCApproval}
      columns={getVisibleColumnsOtcApproval(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.OTC_APPROVAL_TABLE}
      pageTitle={t('otcApproval')}
    />
  );
};

export default OTCApproval;
