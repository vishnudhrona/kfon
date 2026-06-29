import { Box, Card, Flex, Headline, Icons, Pagination, Select, Table } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { SUBSCRIBER_FILTER_OPTIONS } from '../constants';
const { UploadDataIcon, BoardNewIcon, DownloadDataIcon, DataBaseIcon } = Icons;

const OnlineSubscribers = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tableColumns = [
    { header: t('slNo'), accessor: 'slNo' },
    { header: t('sessionId'), accessor: 'sessionId' },
    { header: t('username'), accessor: 'username' },
    { header: t('mac'), accessor: 'mac' },
    { header: t('framedIp'), accessor: 'framedIp' },
    { header: t('startTime'), accessor: 'startTime' },
    { header: t('totalTime'), accessor: 'totalTime' },
    { header: t('uploadMb'), accessor: 'uploadMb' },
    { header: t('downloadMb'), accessor: 'downloadMb' },
    { header: t('nasPortId'), accessor: 'nasPortId' }
  ];

  const tableData = [
    {
      slNo: 1,
      sessionId: '1078',
      username: 'kfon.demosub',
      mac: '00:1A:2B:3C:4D:5E',
      framedIp: '192.168.1.10',
      startTime: '29-Jul-2025',
      totalTime: '29-Jul-2025',
      uploadMb: '120 Mb',
      downloadMb: '450Mb',
      nasPortId: 'NASP01'
    }
  ];

  const dashboardCardData = [
    {
      heading: 'Online Users Count',
      count: 547,
      cardIcon: <BoardNewIcon width='32px' height='32px' />,
      iconBg: '#23BACD'
    },
    {
      heading: 'Total Upload',
      count: '1520 GB',
      cardIcon: <UploadDataIcon width='32px' height='32px' />,
      iconBg: '#C0CC08'
    },
    {
      heading: 'Total Download',
      count: '1520 GB',
      cardIcon: <DownloadDataIcon width='32px' height='32px' />,
      iconBg: '#DE3B7A'
    },
    {
      heading: 'Total Usage',
      count: '1446 GB',
      cardIcon: <DataBaseIcon width='32px' height='32px' />,
      iconBg: '#CD9723'
    }
  ];

  return (
    <>
      <Headline headName={t('onlineSubscribers')} bgColor='background.text_bg' />
      <Box>
        <Card data={dashboardCardData} />
      </Box>
      <Flex justifyContent='flex-end' my='20px'>
        <Box w='250px' ml='auto'>
          <Select options={SUBSCRIBER_FILTER_OPTIONS} isMulti placeholder='Filter Columns' />
        </Box>
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

export default OnlineSubscribers;
