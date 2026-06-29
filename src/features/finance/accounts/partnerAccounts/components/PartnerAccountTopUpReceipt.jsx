import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchPartnerAccountTopupReceipt } from '../action';
import { getPartnerAccountTopupReceipt } from '../selector';

const PartnerAccountTopUpReceipt = () => {
  const columns = [
    { header: 'receiptNo', accessor: 'receiptNo' },
    { header: 'partnerId', accessor: 'partnerId' },
    { header: 'partnerName', accessor: 'partnerName' },
    { header: 'amount', accessor: 'amount' },
    { header: 'topupDate', accessor: 'topupDate' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Partner Account Top-Up Receipt'
        dataSelector={getPartnerAccountTopupReceipt}
        fetchAction={fetchPartnerAccountTopupReceipt}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.PARTNER_ACCOUNT_TOPUP_RECEIPT_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default PartnerAccountTopUpReceipt;
