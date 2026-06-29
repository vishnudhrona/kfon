import { Box, Flex, Headline, Pagination, Select, Table } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const Location = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const tableColumns = [
    { header: t('slNo'), accessor: 'slNo' },
    { header: t('customerName'), accessor: 'customerName' },
    { header: t('companyType'), accessor: 'companyType' },
    { header: t('woNo'), accessor: 'woNo' },
    { header: t('poNo'), accessor: 'poNo' },
    { header: t('proposalName'), accessor: 'proposalName' },
    { header: t('serviceType'), accessor: 'serviceType' },
    { header: t('serviceProvider'), accessor: 'serviceProvider' },
    { header: t('packages'), accessor: 'packages' }
  ];

  const tableData = [
    {
      slNo: 1,
      customerName: 'Open',
      companyType: 'kfon.demosub',
      woNo: '6096977243',
      poNo: 'ITMPS',
      proposalName: 'SRIHARSHA MISHRA Cor.PVT',
      serviceType: 'Sriharsha Mishra CPVT',
      serviceProvider: '8512027132',
      packages: 'sriharshamishra.eee@gmail.com'
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
          onRowClick={(e) =>
            navigate({
              to: '/lnp/my-subscribers/corporate-subscribers/location/$locationId',
              params: { locationId: e.slNo }
            })
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

export default Location;
