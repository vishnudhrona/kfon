import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchMSPBuOeInvoice } from '../action';
import { getMSPBuOeInvoice } from '../selector';

const MSPBuOeInvoice = () => {
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
        pageTitle='MSP BU OE Invoice'
        dataSelector={getMSPBuOeInvoice}
        fetchAction={fetchMSPBuOeInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.MSP_BU_OE_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default MSPBuOeInvoice;
