import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchNldReport } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getNldReport } from '../selector';

const NldReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getNldReport}
        fetchAction={fetchNldReport}
        columns={STATUTORY_TABLE_CONFIG.SUB_INVOICE_B2B.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.NLD_REPORT_TABLE}
        pageTitle='NLD Report'
      />
    </Box>
  );
};

export default NldReport;
