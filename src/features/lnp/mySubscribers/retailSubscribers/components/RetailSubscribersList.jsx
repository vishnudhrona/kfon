import { Box, Button, Flex, Headline, HStack, Pagination, Select, Table } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { DownloadCsv } from '@/components/custom';
import SearchInput from '@/components/custom/SearchInput';

import { SUBSCRIBER_FILTER_OPTIONS } from '../constants';

const RetailSubscribersList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tableColumns = [
    { header: t('slNo'), accessor: 'slNo' },
    { header: t('username'), accessor: 'username' },
    { header: t('package'), accessor: 'package' },
    { header: t('fallBackStatus'), accessor: 'fallBackStatus' },
    { header: t('renewalDate'), accessor: 'renewalDate' },
    { header: t('balance'), accessor: 'balance' },
    { header: t('mobileNumber'), accessor: 'mobileNumber' },
    { header: t('emailId'), accessor: 'emailId' },
    { header: t('updatedDate'), accessor: 'updatedDate' }
  ];

  const tableData = [
    {
      slNo: 1,
      customerName: 'Open',
      username: 'kfon.demosub',
      package: 'SME-50/15',
      fallBackStatus: 'no',
      renewalDate: '29-Jul-2025',
      balance: '912547',
      mobileNumber: '8512027132',
      emailId: 'viswa.mohan@railwire.co.in',
      updatedDate: '29-Jul-2025'
    }
  ];

  return (
    <>
      <Headline headName={t('retailMySubList')} bgColor='background.text_bg' />

      <Flex justifyContent='space-between' align='center' my='20px' gap='20px'>
        <Box flex='1' maxW='450px'>
          <SearchInput size='sm' w='100%' />
        </Box>
        <HStack spacing='12px'>
          <Button variant='outline' borderRadius='md' height='40px'>
            <DownloadCsv />
            {t('downloadCSV')}
          </Button>
          <Box w='250px'>
            <Select
              options={SUBSCRIBER_FILTER_OPTIONS}
              isMulti
              // filterSelect
              // value={selected}
              // onChange={(val) => setSelected(val)}
              placeholder='Filter Columns'
            />
          </Box>
        </HStack>
      </Flex>

      <Box>
        <Table
          headerColor='table_header.primary'
          onRowClick={(e) =>
            navigate({ to: '/lnp/my-subscribers/retail-subscribers/subscribers/$id', params: { id: e.slNo } })
          }
          columns={tableColumns}
          data={tableData}
        />
      </Box>

      <Box mt={'auto'}>
        <Pagination totalPages={2} itemsPerPage={5} totalEntries={10} />
      </Box>
    </>
  );
};

export default RetailSubscribersList;
