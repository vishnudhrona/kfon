import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubscriberInvoiceReports } from '../action';
import { getSubscriberInvoiceReports } from '../selector';

const SubscriberInvoiceReports = () => {
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
        pageTitle='Subscriber Invoice Reports'
        dataSelector={getSubscriberInvoiceReports}
        fetchAction={fetchSubscriberInvoiceReports}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_INVOICE_REPORTS_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default SubscriberInvoiceReports;
