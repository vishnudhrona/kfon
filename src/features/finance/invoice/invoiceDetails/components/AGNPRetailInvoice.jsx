import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchAGNPRetailInvoice } from '../action';
import { getAGNPRetailInvoice } from '../selector';

const AGNPRetailInvoice = () => {
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
        pageTitle='AGNP Retail Invoice'
        dataSelector={getAGNPRetailInvoice}
        fetchAction={fetchAGNPRetailInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.AGNP_RETAIL_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default AGNPRetailInvoice;
