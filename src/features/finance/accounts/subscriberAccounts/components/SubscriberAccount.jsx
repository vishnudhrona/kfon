import { Box } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchSubscriberAccount } from '../action';
import { getSubscriberAccount } from '../selector';

const SubscriberAccount = () => {
  const navigate = useNavigate();

  const columns = [
    { header: 'subId', accessor: 'subId' },
    { header: 'username', accessor: 'username' },
    { header: 'package', accessor: 'package' },
    { header: 'acExpiry', accessor: 'acExpiry' },
    { header: 'acBalance', accessor: 'acBalance' }
  ];

  const handleRowClick = (row) => {
    navigate({
      to: '/lnp/subscriber-account/$id',
      params: { id: row.subId }
    });
  };

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Subscriber Account'
        dataSelector={getSubscriberAccount}
        fetchAction={fetchSubscriberAccount}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.SUBSCRIBER_ACCOUNT_TABLE}
        actions={<CsvDownloadBtn />}
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default SubscriberAccount;
