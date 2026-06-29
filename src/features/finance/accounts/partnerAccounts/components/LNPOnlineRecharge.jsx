import { Box } from '@kfonbss/bss-ui-components';
import { useMemo } from 'react';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchLNPOnlineRecharge } from '../action';
import { getLnpOnlineRecharge } from '../selector';

const GATEWAY_OPTIONS = [
  { id: 'HDFC', name: 'HDFC' },
  { id: 'IKM', name: 'IKM' },
  { id: 'ANP', name: 'ANP' },
  { id: 'IKON', name: 'IKON' },
  { id: 'BBPS', name: 'BBPS' }
];

const FILTER_TYPE_OPTIONS = [
  { id: 'ORDERED', name: 'Ordered' },
  { id: 'BILLED', name: 'Billed' }
];

const KERALA_DISTRICTS = [
  { id: 'Thiruvananthapuram', name: 'Thiruvananthapuram' },
  { id: 'Kollam', name: 'Kollam' },
  { id: 'Pathanamthitta', name: 'Pathanamthitta' },
  { id: 'Alappuzha', name: 'Alappuzha' },
  { id: 'Kottayam', name: 'Kottayam' },
  { id: 'Idukki', name: 'Idukki' },
  { id: 'Ernakulam', name: 'Ernakulam' },
  { id: 'Thrissur', name: 'Thrissur' },
  { id: 'Palakkad', name: 'Palakkad' },
  { id: 'Malappuram', name: 'Malappuram' },
  { id: 'Kozhikode', name: 'Kozhikode' },
  { id: 'Wayanad', name: 'Wayanad' },
  { id: 'Kannur', name: 'Kannur' },
  { id: 'Kasargod', name: 'Kasargod' }
];

const generateMonthOptions = () => {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const opts = [];
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${names[d.getMonth()]}-${d.getFullYear()}`;
    opts.push({ id: key, name: key });
  }
  return opts;
};

const MONTH_OPTIONS = generateMonthOptions();

const LNPOnlineRecharge = () => {
  const columns = [
    { header: 'Order Time', accessor: 'orderTime' },
    { header: 'Partner Id', accessor: 'partnerId' },
    { header: 'Partner Name', accessor: 'partnerName' },
    { header: 'Subscriber Id', accessor: 'subscriberId' },
    { header: 'Username', accessor: 'username' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Billing Reference', accessor: 'billingReference' },
    { header: 'Billing Status', accessor: 'billingStatus' },
    { header: 'Txn Date', accessor: 'txnDate' },
    { header: 'Txn Reference', accessor: 'txnReference' },
    { header: 'District', accessor: 'district' },
    { header: 'Gateway', accessor: 'gateway' },
    { header: 'Billing Response', accessor: 'billingResponse' }
  ];

  const filterConfig = useMemo(
    () => [
      { name: 'partnerUuid', label: 'partnerUuid', type: 'text' },
      { name: 'month', label: 'month', type: 'select', items: MONTH_OPTIONS },
      { name: 'filterType', label: 'filterType', type: 'select', items: FILTER_TYPE_OPTIONS },
      { name: 'gateway', label: 'gateway', type: 'select', items: GATEWAY_OPTIONS },
      { name: 'district', label: 'district', type: 'select', items: KERALA_DISTRICTS },
      { name: 'partnerType', label: 'partnerType', type: 'text' }
    ],
    []
  );

  return (
    <Box p='4'>
      <GenericPageTable
        pageTitle='LNP Online Recharge'
        dataSelector={getLnpOnlineRecharge}
        fetchAction={fetchLNPOnlineRecharge}
        columns={columns}
        tableKey={SERVER_SIDE_TABLE_KEYS.LNP_ONLINE_RECHARGE_TABLE}
        filterConfig={filterConfig}
        actions={<CsvDownloadBtn />}
      />
    </Box>
  );
};

export default LNPOnlineRecharge;
