import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubInvoiceB2CRetails } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getSubInvoiceB2CRetails } from '../selector';

const SubInvoiceB2CRetailsReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getSubInvoiceB2CRetails}
        fetchAction={fetchSubInvoiceB2CRetails}
        columns={STATUTORY_TABLE_CONFIG.SUB_INVOICE_B2B.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUB_INVOICE_B2C_RETAILS_TABLE}
        pageTitle='Sub Invoice B2C Retails Report'
      />
    </Box>
  );
};

export default SubInvoiceB2CRetailsReport;
