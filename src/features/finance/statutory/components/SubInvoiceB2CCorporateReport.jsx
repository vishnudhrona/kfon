import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubInvoiceB2CCorporate } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getSubInvoiceB2CCorporate } from '../selector';

const SubInvoiceB2CCorporateReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getSubInvoiceB2CCorporate}
        fetchAction={fetchSubInvoiceB2CCorporate}
        columns={STATUTORY_TABLE_CONFIG.SUB_INVOICE_B2B.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2C_CORPORATE_TABLE}
        pageTitle='Sub Invoice B2C Corporate Report'
      />
    </Box>
  );
};

export default SubInvoiceB2CCorporateReport;
