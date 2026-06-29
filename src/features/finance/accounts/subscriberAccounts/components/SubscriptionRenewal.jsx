import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubscriptionRenewal } from '../action';
import { getSubscriptionRenewal } from '../selector';

const SubscriptionRenewal = () => {
  const columns = [
    { header: 'renewalId', accessor: 'renewalId' },
    { header: 'subId', accessor: 'subId' },
    { header: 'username', accessor: 'username' },
    { header: 'package', accessor: 'package' },
    { header: 'renewalDate', accessor: 'renewalDate' },
    { header: 'expiryDate', accessor: 'expiryDate' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Subscription Renewal'
        dataSelector={getSubscriptionRenewal}
        fetchAction={fetchSubscriptionRenewal}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIPTION_RENEWAL_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default SubscriptionRenewal;
