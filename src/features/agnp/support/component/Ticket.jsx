import { Box, Button, Headline, HStack, Icons, Input, InputGroup, Pagination, Table } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const { Plus, SearchIcon } = Icons;

import { fetchTicketTableData } from '../action';
import { getTicketTableData } from '../selector';
import TicketPopup from './TicketPopup';

const Ticket = ({ tableData }) => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    tableData();
  }, [tableData]);

  return (
    <>
      <Headline headName={t('myTicket')} />
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <InputGroup endElement={<SearchIcon />} width='280px'>
          <Input height='40px' placeholder='Search' borderRadius='md' />
        </InputGroup>
        <HStack>
          {/* <Select /> */}
          <Button
            fontWeight={'semibold'}
            padding={0}
            width='120px'
            variant='outline'
            borderRadius='md'
            height='40px'
            onClick={() => setIsOpen(true)}
          >
            <Plus />
            {t('ticket')}
          </Button>
        </HStack>
      </Box>

      <Box overflow={'hidden'}>
        <Table />
      </Box>
      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>

      <Box>
        <TicketPopup isOpen={isOpen} setIsOpen={setIsOpen} />
      </Box>
    </>
  );
};

const mapStateToProps = (state) => ({
  ticketTableData: getTicketTableData(state)
});

const mapDispatchToProps = {
  tableData: fetchTicketTableData
};

export default connect(mapStateToProps, mapDispatchToProps)(Ticket);
