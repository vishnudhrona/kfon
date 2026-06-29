import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchEOSubscriberInvoice } from '../action';
import { getEOSubscriberInvoice } from '../selector';

const EOSubscriberInvoice = () => {
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
        pageTitle='EO Subscriber Invoice'
        dataSelector={getEOSubscriberInvoice}
        fetchAction={fetchEOSubscriberInvoice}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.EO_SUBSCRIBER_INVOICE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default EOSubscriberInvoice;
