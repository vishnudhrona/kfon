import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchAGNPSummary } from '../action';
import { getAGNPSummary } from '../selector';

const AGNPSummary = () => {
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
        pageTitle='AGNP Summary'
        dataSelector={getAGNPSummary}
        fetchAction={fetchAGNPSummary}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.AGNP_SUMMARY_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default AGNPSummary;
