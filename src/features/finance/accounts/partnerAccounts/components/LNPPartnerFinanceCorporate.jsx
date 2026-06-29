import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchLNPPartnerFinanceCorporate } from '../action';
import { getLnpPartnerFinanceCorporate } from '../selector';

const LNPPartnerFinanceCorporate = () => {
  const columns = [
    { header: 'partnerId', accessor: 'partnerId' },
    { header: 'partnerName', accessor: 'partnerName' },
    { header: 'workorderNo', accessor: 'workorderNo' },
    { header: 'amount', accessor: 'amount' },
    { header: 'cause', accessor: 'cause' },
    { header: 'type', accessor: 'type' },
    { header: 'updatedOn', accessor: 'updatedOn' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='LNP Partner Finance Corporate'
        dataSelector={getLnpPartnerFinanceCorporate}
        fetchAction={fetchLNPPartnerFinanceCorporate}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.LNP_PARTNER_FINANCE_CORPORATE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default LNPPartnerFinanceCorporate;
