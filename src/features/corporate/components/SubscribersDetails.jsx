import { Box, Button, Grid, Headline, HStack, Preview, Table, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SUBSCRIBER_DEVICE_DETAILS, SUBSCRIBER_PACKAGE_DETAILS } from '../constants';
import DocViewerPopup from './DocViewer';
import MappingPopup from './popUps/MappingPopup';

const SUBSCRIBER_DETAILS = ({ setIsDocOpen }) => {
  return [
    { key: 'Company Name', value: 'Rahim1' },
    { key: 'Company Address', value: 'Rahim1Rahim1Rahim1' },
    { key: 'Billing Account Number', value: '8926664769' },
    { key: 'Circuit Details', value: '' },
    { key: 'Username', value: 'kfoncor.rahimpo05' },
    { key: 'Loc Name', value: 'Test' },
    { key: 'Loc Code', value: 'RAHIM/PO/01/007' },
    { key: 'Loc Address', value: '106,check Post,Tholpetty' },
    { key: 'PO No', value: 'RAHIM/PO/01' },
    { key: 'Package', value: '4-FUP19Mbps-1Mbps-1GB-FTTH' },
    { key: 'Commission Date', value: '2025-07-28' },
    {
      key: 'Commission Document',
      value: (
        <Button variant={'outline'} onClick={() => setIsDocOpen(true)}>
          View Doc
        </Button>
      )
    },
    { key: 'Expiry Date', value: '2025-08-26' },
    { key: 'LNP ID', value: '6096977243' },
    { key: 'LNP Name', value: 'ITMSP' },
    { key: 'District', value: 'Kottayam' }
  ];
};

const SubscribersDetails = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [isDocOpen, setIsDocOpen] = useState(false);
  const [isMapping, setIsMapping] = useState(true);

  const deviceListTableColumn = [
    { header: t('deviceType'), accessor: 'deviceType' },
    { header: t('deviceMake'), accessor: 'deviceMake' },
    { header: t('deviceCategory'), accessor: 'deviceCategory' },
    { header: t('deviceModel'), accessor: 'deviceModel' },
    { header: t('gphonSerialNumber'), accessor: 'gphonSerialNumber' },
    { header: t('deviceSerialNumber'), accessor: 'deviceSerialNumber' },
    { header: t('macAddress'), accessor: 'macAddress' },
    { header: t('action'), accessor: 'action' }
  ];

  const deviceListTableData = [
    {
      deviceType: 1,
      deviceMake: 'Open',
      deviceCategory: 'kfon.demosub',
      deviceModel: '6096977243',
      gphonSerialNumber: 'ITMPS',
      deviceSerialNumber: 'SRIHARSHA MISHRA Cor.PVT',
      macAddress: 'Sriharsha Mishra CPVT',
      action: (
        <Button
          variant={'outline'}
          onClick={() => {
            setIsMapping(false);
            setIsOpen(true);
          }}
        >
          {t('unMapDevice')}
        </Button>
      )
    }
  ];

  const dataTableColumn = [
    { header: t('startTime'), accessor: 'startTime' },
    { header: t('endTime'), accessor: 'endTime' },
    { header: t('sessionTime'), accessor: 'sessionTime' },
    { header: t('upload(MB)'), accessor: 'upload(MB)' },
    { header: t('download(MB)'), accessor: 'download(MB)' },
    { header: t('total(MB)'), accessor: 'total(MB)' },
    { header: t('macAddress'), accessor: 'macAddress' },
    { header: t('framedIp'), accessor: 'framedIp' }
  ];

  const dataTableData = [
    {
      startTime: 1,
      endTime: 'Open',
      sessionTime: 'kfon.demosub',
      'upload(MB)': '6096977243',
      'download(MB)': 'ITMPS',
      'total(MB)': 'SRIHARSHA MISHRA Cor.PVT',
      macAddress: 'Sriharsha Mishra CPVT',
      framedIp: '192.168.0.1'
    }
  ];

  return (
    <>
      <Headline headName={t('corporateSubscriberDetails')} bgColor='background.text_bg' />

      <Text color={'272727'} fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
        {t('subscriberDetails')}
      </Text>

      <Box>
        <Preview data={SUBSCRIBER_DETAILS(setIsDocOpen)} />
      </Box>

      <HStack justifyContent={'space-between'}>
        <Text color={'272727'} fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
          {t('subscriberDetails')}
        </Text>
        <Button
          borderRadius={'8px'}
          onClick={() => {
            setIsMapping(true);
            setIsOpen(true);
          }}
        >
          {t('mapDevice')}
        </Button>
      </HStack>

      <Box>
        <Table
          headerColor='table_header.primary'
          onRowClick={(e) => console.log(e)}
          columns={deviceListTableColumn}
          data={deviceListTableData}
        />
      </Box>

      <Text color={'272727'} fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
        {t('ticketDetails')}
      </Text>

      <Box>
        <Preview data={SUBSCRIBER_DEVICE_DETAILS} />
      </Box>

      <Box borderRadius={'12px'} border={'1px solid #CDCDCD'} bg={'#F5F6FA'} padding={'36px'}>
        <Grid templateColumns={'repeat(5, 1fr)'} templateRows={'repeat(2, 1fr)'} rowGap={'36px'}>
          {SUBSCRIBER_PACKAGE_DETAILS.map(({ label, data }) => {
            return (
              <VStack alignItems={'start'}>
                <Text color={'272727'} mb={'8px'} fontSize={'14px'} lineHeight={'14px'}>
                  {t(label)}
                </Text>
                <Text fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
                  {data}
                </Text>
              </VStack>
            );
          })}
        </Grid>
      </Box>

      <Box>
        <Table
          headerColor='table_header.primary'
          onRowClick={(e) => console.log(e)}
          columns={dataTableColumn}
          data={dataTableData}
        />
      </Box>

      <MappingPopup isOpen={isOpen} setIsOpen={setIsOpen} isMap={isMapping} />
      <DocViewerPopup isOpen={isDocOpen} setIsOpen={1} />
    </>
  );
};

export default SubscribersDetails;
