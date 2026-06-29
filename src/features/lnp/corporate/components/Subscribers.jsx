import {
  Box,
  Button,
  Flex,
  Headline,
  HStack,
  Input,
  InputGroup,
  Pagination,
  Select,
  Table
} from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { DownloadCsv, SearchIcon } from '@/components/custom';

const Subscribers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tableColumns = [
    { header: t('slNo'), accessor: 'slNo' },
    { header: t('customerName'), accessor: 'customerName' },
    { header: t('username'), accessor: 'username' },
    { header: t('locCode'), accessor: 'locCode' },
    { header: t('poNo'), accessor: 'poNo' },
    { header: t('package'), accessor: 'package' },
    { header: t('activationDate'), accessor: 'activationDate' },
    { header: t('expiryDateInBss'), accessor: 'expiryDateInBss' }
  ];

  const tableData = [
    {
      slNo: 1,
      customerName: 'Open',
      username: 'kfon.demosub',
      locCode: '6096977243',
      poNo: 'ITMPS',
      package: 'SRIHARSHA MISHRA Cor.PVT',
      activationDate: 'Sriharsha Mishra CPVT',
      expiryDateInBss: '8512027132'
    }
  ];

  return (
    <>
      <Headline headName={t('corporateEnquiresLocationList')} bgColor='background.text_bg' />

      <Flex justifyContent={'space-between'} my={'20px'}>
        <InputGroup endElement={<SearchIcon />} width='280px'>
          <Input height='40px' placeholder='Search' borderRadius='md' />
        </InputGroup>
        <HStack>
          <Button variant='outline' borderRadius='md' height='40px'>
            <DownloadCsv />
            {t('downloadCSV')}
          </Button>
          <Box w={'300px'}>
            <Select />
          </Box>
        </HStack>
      </Flex>

      <Box>
        <Table
          headerColor='table_header.primary'
          onRowClick={(e) =>
            navigate({ to: '/lnp/my-subscribers/corporate-subscribers/subscribers/$id', params: { id: e.slNo } })
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

export default Subscribers;
