import { Box, Button, Card, Headline, HStack, Input, InputGroup, Pagination, Table } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { DownloadCsv, SearchIcon } from '@/components/custom';

const DeviceList = () => {
  const { t } = useTranslation();
  return (
    <>
      <Headline headName={t('deviceList')} />

      <Box>
        <Card />
      </Box>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <InputGroup endElement={<SearchIcon />} width='280px'>
          <Input height='40px' placeholder='Search' borderRadius='md' />
        </InputGroup>
        <HStack>
          <Button variant='outline' borderRadius='md' height='40px'>
            <DownloadCsv />
            {t('downloadCSV')}
          </Button>
        </HStack>
      </Box>
      <Box overflow='hidden'>
        <Table />
      </Box>
      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>
    </>
  );
};

export default DeviceList;
