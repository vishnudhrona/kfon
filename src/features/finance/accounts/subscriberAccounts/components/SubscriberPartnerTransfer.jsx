import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubscriberPartnerTransfer } from '../action';
import { getSubscriberPartnerTransfer } from '../selector';

const SubscriberPartnerTransfer = () => {
  const columns = [
    { header: 'transferId', accessor: 'transferId' },
    { header: 'subId', accessor: 'subId' },
    { header: 'username', accessor: 'username' },
    { header: 'fromPartner', accessor: 'fromPartner' },
    { header: 'toPartner', accessor: 'toPartner' },
    { header: 'transferDate', accessor: 'transferDate' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Subscriber Partner Transfer'
        dataSelector={getSubscriberPartnerTransfer}
        fetchAction={fetchSubscriberPartnerTransfer}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_PARTNER_TRANSFER_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default SubscriberPartnerTransfer;
