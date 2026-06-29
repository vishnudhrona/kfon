import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchRetentionIncentiveReport } from '../action';
import { getRetentionIncentiveReport } from '../selector';

const RetentionIncentiveReport = () => {
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
        pageTitle='Retention Incentive Report'
        dataSelector={getRetentionIncentiveReport}
        fetchAction={fetchRetentionIncentiveReport}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.RETENTION_INCENTIVE_REPORT_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default RetentionIncentiveReport;
