import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchInvoicePaymentReport } from '../action';
import { getInvoicePaymentReport } from '../selector';

const InvoicePaymentReport = () => {
  const columns = [
    { header: 'reportId', accessor: 'reportId' },
    { header: 'date', accessor: 'date' },
    { header: 'description', accessor: 'description' },
    { header: 'amount', accessor: 'amount' },
    { header: 'status', accessor: 'status' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Invoice Payment Report'
        dataSelector={getInvoicePaymentReport}
        fetchAction={fetchInvoicePaymentReport}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.INVOICE_PAYMENT_REPORT_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default InvoicePaymentReport;
