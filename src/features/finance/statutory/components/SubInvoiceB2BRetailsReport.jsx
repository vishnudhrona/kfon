import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubInvoiceB2B } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getSubInvoiceB2B } from '../selector';

const SubInvoiceB2BRetailsReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getSubInvoiceB2B}
        fetchAction={fetchSubInvoiceB2B}
        columns={STATUTORY_TABLE_CONFIG.SUB_INVOICE_B2B.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2B_TABLE}
        pageTitle='Sub Invoice B2B Retail Report'
      />
    </Box>
  );
};

export default SubInvoiceB2BRetailsReport;
