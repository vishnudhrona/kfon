import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchRevenueControl } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getRevenueControl } from '../selector';

const RevenueControlReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getRevenueControl}
        fetchAction={fetchRevenueControl}
        columns={STATUTORY_TABLE_CONFIG.REVENUE_CONTROL.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.REVENUE_CONTROL_TABLE}
        pageTitle='Revenue Control Report'
      />
    </Box>
  );
};

export default RevenueControlReport;
