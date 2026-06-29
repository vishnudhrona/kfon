import { Box } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchAGNPPartnerFinanceCorporate } from '../action';
import { getAgnpPartnerFinanceCorporate } from '../selector';

const AGNPPartnerFinanceCorporate = () => {
  const navigate = useNavigate();

  const columns = [
    { header: 'partnerId', accessor: 'partnerId' },
    { header: 'partnerName', accessor: 'partnerName' },
    { header: 'workorderNo', accessor: 'workorderNo' },
    { header: 'amount', accessor: 'amount' },
    { header: 'cause', accessor: 'cause' },
    { header: 'type', accessor: 'type' },
    { header: 'updatedOn', accessor: 'updatedOn' }
  ];

  const handleRowClick = (row) => {
    navigate({
      to: '/agnp/partner-finance-corporate/$id',
      params: { id: row.partnerId }
    });
  };

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='AGNP Partner Finance Corporate'
        dataSelector={getAgnpPartnerFinanceCorporate}
        fetchAction={fetchAGNPPartnerFinanceCorporate}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.AGNP_PARTNER_FINANCE_CORPORATE_TABLE}
        actions={<CsvDownloadBtn />}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default AGNPPartnerFinanceCorporate;
