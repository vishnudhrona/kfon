import { Box, Button, Card, Headline, HStack, Input, InputGroup, Pagination, Table } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { DownloadCsv, SearchIcon } from '@/components/custom';

import { fetchDevicelistTableData } from '../action';
import { getTableData } from '../selector';

const Inventory = ({ tableData }) => {
  const { t } = useTranslation();

  useEffect(() => {
    tableData();
  }, [tableData]);

  return (
    <>
      <Headline headName={t('deviceList')} />
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
      <Box>
        <Card />
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

const mapStateToProps = (state) => ({
  deviceListTableData: getTableData(state)
});

const mapDispatchToProps = {
  tableData: fetchDevicelistTableData
};

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
