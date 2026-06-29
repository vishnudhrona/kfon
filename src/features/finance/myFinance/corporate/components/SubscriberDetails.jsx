import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchSubscriberDetails } from '../action';
import { getVisibleColumnsSubscriberDetails } from '../constants';

const SubscriberDetails = () => {
  const { t } = useTranslation();

  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_DETAILS_TABLE)}
      fetchAction={fetchSubscriberDetails}
      columns={getVisibleColumnsSubscriberDetails(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_DETAILS_TABLE}
      pageTitle={t('subscriberDetails')}
    />
  );
};

export default SubscriberDetails;
