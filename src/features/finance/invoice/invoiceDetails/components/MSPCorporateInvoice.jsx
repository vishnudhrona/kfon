import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchMSPCorporateInvoice } from '../action';
import { getMSPCorporateInvoice } from '../selector';

const MSPCorporateInvoice = () => {
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
        pageTitle='MSP Corporate Invoice'
        dataSelector={getMSPCorporateInvoice}
        fetchAction={fetchMSPCorporateInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.MSP_CORPORATE_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default MSPCorporateInvoice;
