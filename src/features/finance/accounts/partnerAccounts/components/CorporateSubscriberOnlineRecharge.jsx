import { Box } from '@kfonbss/bss-ui-components';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchCorporateSubscriberOnlineRecharge } from '../action';
import { getCorporateSubscriberOnlineRecharge } from '../selector';

const CorporateSubscriberOnlineRecharge = () => {
  const columns = [
    { header: 'rechargeId', accessor: 'rechargeId' },
    { header: 'corporateId', accessor: 'corporateId' },
    { header: 'corporateName', accessor: 'corporateName' },
    { header: 'amount', accessor: 'amount' },
    { header: 'rechargeDate', accessor: 'rechargeDate' }
  ];

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='Corporate Subscriber Online Recharge'
        dataSelector={getCorporateSubscriberOnlineRecharge}
        fetchAction={fetchCorporateSubscriberOnlineRecharge}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.CORPORATE_SUBSCRIBER_ONLINE_RECHARGE_TABLE}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default CorporateSubscriberOnlineRecharge;
