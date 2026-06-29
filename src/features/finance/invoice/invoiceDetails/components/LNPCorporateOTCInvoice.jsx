import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchLNPCorporateOTCInvoice } from '../action';
import { getLNPCorporateOTCInvoice } from '../selector';

const LNPCorporateOTCInvoice = () => {
  const columns = [
    { header: 'invoiceNo', accessor: 'invoiceNo' },
    { header: 'invoiceDate', accessor: 'invoiceDate' },
    { header: 'partnerId', accessor: 'partnerId' },
    { header: 'partnerName', accessor: 'partnerName' },
    { header: 'invoiceValue', accessor: 'invoiceValue' },
    { header: 'status', accessor: 'status' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='LNP Corporate OTC Invoice'
        dataSelector={getLNPCorporateOTCInvoice}
        fetchAction={fetchLNPCorporateOTCInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.LNP_CORPORATE_OTC_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default LNPCorporateOTCInvoice;
