import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubscriberSummaryDetails } from '../action';
import { getSubscriberSummaryDetails } from '../selector';

const SubscriberSummaryDetails = () => {
  const columns = [
    { header: 'reportId', accessor: 'reportId' },
    { header: 'date', accessor: 'date' },
    { header: 'description', accessor: 'description' },
    { header: 'amount', accessor: 'amount' },
    { header: 'status', accessor: 'status' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Subscriber Summary Details'
        dataSelector={getSubscriberSummaryDetails}
        fetchAction={fetchSubscriberSummaryDetails}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_SUMMARY_DETAILS_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default SubscriberSummaryDetails;
