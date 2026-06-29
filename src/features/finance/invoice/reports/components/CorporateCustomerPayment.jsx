import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchCorporateCustomerPayment } from '../action';
import { getCorporateCustomerPayment } from '../selector';

const CorporateCustomerPayment = () => {
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
        pageTitle='Corporate Customer Payment'
        dataSelector={getCorporateCustomerPayment}
        fetchAction={fetchCorporateCustomerPayment}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.CORPORATE_CUSTOMER_PAYMENT_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default CorporateCustomerPayment;
