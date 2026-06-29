import { useNavigate } from '@tanstack/react-router';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchAgnpPartnersList } from '../action';
import { VISIBLE_COLUMNS_AGNP_PARTNERS_LIST } from '../constants';
import { getAgnpPartnersList } from '../selector';

const AGNPPartners = () => {
  const navigate = useNavigate();

  const handleRowClick = (row) => {
    navigate({
      to: `/app/partners/list/agnp/${row.agnpId}`,
      state: row
    });
  };

  return (
    <GenericPageTable
      dataSelector={getAgnpPartnersList}
      fetchAction={fetchAgnpPartnersList}
      columns={VISIBLE_COLUMNS_AGNP_PARTNERS_LIST}
      tableKey={SERVER_SIDE_TABLE_KEYS.AGNP_PARTNERS_LIST_TABLE}
      pageTitle='Applied online - AGNP'
      onRowClick={handleRowClick}
      params={{ type: 'agnp' }}
    />
  );
};

export default AGNPPartners;
