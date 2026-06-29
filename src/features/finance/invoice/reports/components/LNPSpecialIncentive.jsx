import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchLNPSpecialIncentive } from '../action';
import { getLNPSpecialIncentive } from '../selector';

const LNPSpecialIncentive = () => {
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
        pageTitle='LNP Special Incentive'
        dataSelector={getLNPSpecialIncentive}
        fetchAction={fetchLNPSpecialIncentive}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.LNP_SPECIAL_INCENTIVE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default LNPSpecialIncentive;
