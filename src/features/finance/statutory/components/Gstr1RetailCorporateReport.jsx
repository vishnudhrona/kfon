import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchGstr1RetailCorporate } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getGstr1RetailCorporate } from '../selector';

const Gstr1RetailCorporateReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getGstr1RetailCorporate}
        fetchAction={fetchGstr1RetailCorporate}
        columns={STATUTORY_TABLE_CONFIG.GSTR1_RETAIL_CORPORATE.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.GSTR1_RETAIL_CORPORATE_TABLE}
        pageTitle='GSTR1 Retail & Corporate Report'
      />
    </Box>
  );
};

export default Gstr1RetailCorporateReport;
