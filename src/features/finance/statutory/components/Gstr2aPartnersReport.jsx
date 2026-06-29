import { Box } from '@kfonbss/bss-ui-components';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchGstr2aPartners } from '../action';
import { STATUTORY_TABLE_CONFIG } from '../constants';
import { getGstr2aPartners } from '../selector';

const Gstr2aPartnersReport = () => {
  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getGstr2aPartners}
        fetchAction={fetchGstr2aPartners}
        columns={STATUTORY_TABLE_CONFIG.GSTR2A_PARTNERS.columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.GSTR2A_PARTNERS_TABLE}
        pageTitle='GSTR2A Partners Report'
      />
    </Box>
  );
};

export default Gstr2aPartnersReport;
