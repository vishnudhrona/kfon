import { Box, Headline, Input, InputGroup, Pagination, Table } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NewSubscriber, SearchIcon } from '@/components/custom';

import NewApplication from '../../../subscriber/applications/components/pop-up/NewApplication';

const PendingAction = () => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const onRowClick = () => {
    navigate({ to: '/lnp/tablepreview' });
  };

  const handleSubmit = () => {
    setOpen(true);
  };

  return (
    <>
      <Headline
        headName={t('subscriberApplicationWorkList')}
        bgColor='gray.100'
        buttons={[
          {
            label: t('submitNewSubscriberApplication'),
            icon: <NewSubscriber />,
            onClick: handleSubmit
          }
        ]}
      />
      <Box>
        <InputGroup endElement={<SearchIcon />} width='351px'>
          <Input height='40px' placeholder='Search' borderRadius='md' />
        </InputGroup>
      </Box>
      <Box>
        <Table onRowClick={onRowClick} />
      </Box>
      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>
      {open && <NewApplication open={open} setOpen={setOpen} />}
    </>
  );
};

export default PendingAction;
