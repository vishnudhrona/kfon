import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubInvoiceB2BCorporate } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getSubInvoiceB2BCorporate } from '../selector';

const SubInvoiceB2BCorporateReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getSubInvoiceB2BCorporate}
        fetchAction={fetchSubInvoiceB2BCorporate}
        columns={STATUTORY_TABLE_CONFIG.SUB_INVOICE_B2B.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2B_CORPORATE_TABLE}
        pageTitle='Sub Invoice B2B Corporate Report'
      />
    </Box>
  );
};

export default SubInvoiceB2BCorporateReport;
