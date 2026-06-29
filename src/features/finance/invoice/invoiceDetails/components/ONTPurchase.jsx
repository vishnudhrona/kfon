import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchONTPurchaseInvoice } from '../action';
import { getONTPurchaseInvoice } from '../selector';

const ONTPurchase = () => {
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
        pageTitle='ONT Purchase Invoice'
        dataSelector={getONTPurchaseInvoice}
        fetchAction={fetchONTPurchaseInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.ONT_PURCHASE_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default ONTPurchase;
