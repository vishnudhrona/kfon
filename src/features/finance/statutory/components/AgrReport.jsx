import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchAgrReport } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getAgrReport } from '../selector';

const AgrReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getAgrReport}
        fetchAction={fetchAgrReport}
        columns={STATUTORY_TABLE_CONFIG.SUB_INVOICE_B2B.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.AGR_REPORT_TABLE}
        pageTitle='AGR Report'
      />
    </Box>
  );
};

export default AgrReport;
