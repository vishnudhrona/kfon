import { Box } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';

import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchTicketList } from '../action';
import { TICKET_LIST_COLUMNS } from '../constants';
import { getTicketList } from '../selector';

const TicketList = () => {
  const navigate = useNavigate();

  const handleRowClick = (row) => {
    navigate({
      to: `/app/tickets/${row.ticketId}`,
      state: row
    });
  };

  return (
    <Box p='4'>
      <GenericPageTable
        dataSelector={getTicketList}
        fetchAction={fetchTicketList}
        columns={TICKET_LIST_COLUMNS}
        tableKey={SERVER_SIDE_TABLE_KEYS.TICKET_LIST_TABLE}
        pageTitle='Tickets'
        onRowClick={handleRowClick}
      />
    </Box>
  );
};

export default TicketList;
