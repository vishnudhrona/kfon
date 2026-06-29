import { Box, Flex, Headline, Pagination, Select, Table } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const CorpEnqLocationList = () => {
  const { t } = useTranslation();

  const tableColumns = [
    { header: t('slNo'), accessor: 'slNo' },
    { header: t('status'), accessor: 'status' },
    { header: t('feName'), accessor: 'feName' },
    { header: t('partnerId'), accessor: 'partnerId' },
    { header: t('partnerName'), accessor: 'partnerName' },
    { header: t('customerName'), accessor: 'customerName' },
    { header: t('contactName'), accessor: 'contactName' },
    { header: t('contactNumber'), accessor: 'contactNumber' },
    { header: t('contactEmail'), accessor: 'contactEmail' }
  ];

  const tableData = [
    {
      slNo: 1,
      status: 'Open',
      feName: 'kfon.demosub',
      partnerId: '6096977243',
      partnerName: 'ITMPS',
      customerName: 'SRIHARSHA MISHRA Cor.PVT',
      contactName: 'Sriharsha Mishra CPVT',
      contactNumber: '8512027132',
      contactEmail: 'sriharshamishra.eee@gmail.com'
    }
  ];

  return (
    <>
      <Headline headName={t('corporateEnquiresLocationList')} bgColor='background.text_bg' />

      <Flex justifyContent={'flex-end'} my={'20px'}>
        <Box w={'300px'}>
          <Select />
        </Box>
      </Flex>

      <Box>
        <Table
          headerColor='table_header.primary'
          onRowClick={(e) => console.log(e)}
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

export default CorpEnqLocationList;
