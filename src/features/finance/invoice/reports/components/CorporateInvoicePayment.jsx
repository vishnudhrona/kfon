import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchCorporateInvoicePayment } from '../action';
import { getCorporateInvoicePayment } from '../selector';

const CorporateInvoicePayment = () => {
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
        pageTitle='Corporate Invoice Payment'
        dataSelector={getCorporateInvoicePayment}
        fetchAction={fetchCorporateInvoicePayment}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.CORPORATE_INVOICE_PAYMENT_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default CorporateInvoicePayment;
