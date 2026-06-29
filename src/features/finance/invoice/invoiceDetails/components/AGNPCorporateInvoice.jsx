import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchAGNPCorporateInvoice } from '../action';
import { getAGNPCorporateInvoice } from '../selector';

const AGNPCorporateInvoice = () => {
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
        pageTitle='AGNP Corporate Invoice'
        dataSelector={getAGNPCorporateInvoice}
        fetchAction={fetchAGNPCorporateInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.AGNP_CORPORATE_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default AGNPCorporateInvoice;
