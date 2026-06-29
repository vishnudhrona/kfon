import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchLNPRetailInvoice } from '../action';
import { getLNPRetailInvoice } from '../selector';

const LNPRetailInvoice = () => {
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
        pageTitle='LNP Retail Invoice'
        dataSelector={getLNPRetailInvoice}
        fetchAction={fetchLNPRetailInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.LNP_RETAIL_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default LNPRetailInvoice;
