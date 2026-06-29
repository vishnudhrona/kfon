import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchInvoiceWiseAgeingReport } from '../action';
import { getInvoiceWiseAgeingReport } from '../selector';

const InvoiceWiseAgeingReport = () => {
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
        pageTitle='Invoice Wise Ageing Report'
        dataSelector={getInvoiceWiseAgeingReport}
        fetchAction={fetchInvoiceWiseAgeingReport}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.INVOICE_WISE_AGEING_REPORT_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default InvoiceWiseAgeingReport;
