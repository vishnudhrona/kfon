import {
  Box,
  Button,
  Headline,
  HStack,
  Input,
  InputGroup,
  Pagination,
  Span,
  Status,
  Table
} from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { DownloadCsv, SearchIcon } from '@/components/custom';

import { fetchSubscriptionTableData } from '../action';
import { getSubscriptionListTableData } from '../selector';

const Subscription = ({ tableData }) => {
  const { t } = useTranslation();

  useEffect(() => {
    tableData()
  }, [tableData])

  return (
    <>
      <Headline headName={t('subscribers')} />

      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Status.Root colorPalette='green'>
          <Status.Indicator />
          <Span color='green' fontWeight='bold' fontSize='18px'>
            115{' '}
            <Span color='black' fontWeight='normal'>
              ({t('activeSubscribers')})
            </Span>
          </Span>
        </Status.Root>

        <HStack>
          <InputGroup endElement={<SearchIcon />} width='280px'>
            <Input height='40px' placeholder='Search' borderRadius='md' />
          </InputGroup>
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
        <Pagination totalPages={10} itemsPerPage={10} totalEntries={30} />
      </Box>
    </>
  );
};

const mapStateToProps = (state) => ({
  manDateTableData: getSubscriptionListTableData(state)
});

const mapDispatchToProps = {
  tableData: fetchSubscriptionTableData
};

export default connect(mapStateToProps, mapDispatchToProps)(Subscription);
