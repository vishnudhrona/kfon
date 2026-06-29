import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getServerSideData } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchSubscriberInvoice } from '../action';
import { getVisibleColumnsSubscriberInvoice } from '../constants';

const SubscriberInvoice = () => {
  const { t } = useTranslation();
  return (
    <GenericPageTable
      data={selectorWithKey(useSelector(getServerSideData), SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_INVOICE_TABLE)}
      fetchAction={fetchSubscriberInvoice}
      columns={getVisibleColumnsSubscriberInvoice(t)}
      tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_INVOICE_TABLE}
      pageTitle={t('myPaymentsInvoice')}
    />
  );
};

export default SubscriberInvoice;
