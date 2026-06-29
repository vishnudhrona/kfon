import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchGSTINStatusLNP } from '../action';
import { getGSTINStatusLNP } from '../selector';

const GSTINStatusLNP = () => {
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
        pageTitle='GSTIN Status LNP'
        dataSelector={getGSTINStatusLNP}
        fetchAction={fetchGSTINStatusLNP}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.GSTIN_STATUS_LNP_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default GSTINStatusLNP;
