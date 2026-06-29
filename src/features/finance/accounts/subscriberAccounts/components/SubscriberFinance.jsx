import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubscriberFinance } from '../action';
import { getSubscriberFinance } from '../selector';

const SubscriberFinance = () => {
  const columns = [
    { header: 'subId', accessor: 'subId' },
    { header: 'username', accessor: 'username' },
    { header: 'transactionType', accessor: 'transactionType' },
    { header: 'amount', accessor: 'amount' },
    { header: 'transactionDate', accessor: 'transactionDate' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Subscriber Finance'
        dataSelector={getSubscriberFinance}
        fetchAction={fetchSubscriberFinance}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_FINANCE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default SubscriberFinance;
