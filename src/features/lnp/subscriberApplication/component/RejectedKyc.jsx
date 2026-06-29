import { Box, Headline, Input, InputGroup, Pagination, Table } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { SearchIcon } from '@/components/custom';

const RejectedKyc = () => {
  const { t } = useTranslation();
  return (
    <>
      <Headline headName={t('rejectedSubscription')} submitButton={false} editButton={false} />

      <Box>
        <InputGroup endElement={<SearchIcon />} width='351px'>
          <Input height='40px' placeholder='Search' borderRadius='md' />
        </InputGroup>
      </Box>

      <Box>
        <Table />
      </Box>

      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>
    </>
  );
};

export default RejectedKyc;
