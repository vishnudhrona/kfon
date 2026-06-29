import { Box, Button, Flex, Headline, HStack, Pagination, Table } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { DownloadCsv } from '@/components/custom';
import SearchInput from '@/components/custom/SearchInput';

const StaticIpRenewal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tableColumns = [
    { header: t('slNo'), accessor: 'slNo' },
    { header: t('id'), accessor: 'id' },
    { header: t('username'), accessor: 'username' },
    { header: t('framedIp'), accessor: 'framedIp' },
    { header: t('createdDate'), accessor: 'createdDate' },
    { header: t('expiryDate'), accessor: 'expiryDate' },
    { header: t('renewal'), accessor: 'renewal' }
  ];

  const tableData = [
    {
      slNo: 1,
      id: '1078',
      username: 'kfon.demosub',
      framedIp: '192.168.1.10',
      createdDate: '29-Jul-2025',
      expiryDate: '29-Jul-2025',
      renewal: '29-Jul-2025'
    }
  ];

  return (
    <>
      <Headline headName={t('framedIpRenewal')} bgColor='background.text_bg' />

      <Flex justifyContent='space-between' align='center' my='20px' gap='20px'>
        <Box flex='1' maxW='450px'>
          <SearchInput size='sm' w='100%' />
        </Box>
        <HStack spacing='12px'>
          <Button variant='outline' borderRadius='md' height='40px'>
            <DownloadCsv />
            {t('downloadCSV')}
          </Button>
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

export default StaticIpRenewal;
