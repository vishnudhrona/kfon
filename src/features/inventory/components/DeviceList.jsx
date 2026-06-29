import { Box, Button, CommonCard, HStack, Icons } from '@kfonbss/bss-ui-components';
import { Link } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { ROLES } from '@/constants/common';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { hasRole } from '@/utils/encryptionUtils';

import { downloadDeviceListCsv, fetchDeviceList, fetchDeviceListDashboard } from '../actions';
import { VISIBLE_COLUMNS_DEVICE_LIST } from '../constants';
import { useDeviceDropdowns } from '../hooks';
import { getDeviceListDashboard, getTableData } from '../selectors';

const { TransferIcon } = Icons;

const CARD_CONFIG = {
  'Total Devices': {
    iconBg: '#3cc',
    bgIconColor: '#EFF9F9'
  },
  'Devices Available At KFON-Admins': {
    iconBg: '#FF5356',
    bgIconColor: '#FEF3F9'
  },
  'Devices Available At DGM': {
    iconBg: '#3369CC',
    bgIconColor: '#EEF3FC'
  },
  'Devices Available At KFON-NOC-MGR': {
    iconBg: '#F27649',
    bgIconColor: '#FDF7F4'
  },
  'Devices Available At KFON-DC': {
    iconBg: '#3cc',
    bgIconColor: '#ECFCFC'
  },
  'Mapped At Field': {
    iconBg: '#FF5356',
    bgIconColor: '#FEF3F9'
  },
  'Mapped at Field': {
    iconBg: '#3369CC',
    bgIconColor: '#EEF3FC'
  },
  'Blocked For Allocation To KFON-DC': {
    iconBg: '#F27649',
    bgIconColor: '#FDF7F4'
  },
  'Devices Block for allocation to KFON-DC': {
    iconBg: '#3cc',
    bgIconColor: '#ECFCFC'
  },
  'Devices Available At MSP-DC': {
    iconBg: '#FF5356',
    bgIconColor: '#FEF3F9'
  },
  'Devices Available At Partner': {
    iconBg: '#3369CC',
    bgIconColor: '#EEF3FC'
  },
  'Devices Available At Subscribers': {
    iconBg: '#F27649',
    bgIconColor: '#FDF7F4'
  },
  'ONTs Available At Churned Subscribers': {
    iconBg: '#3cc',
    bgIconColor: '#ECFCFC'
  }
};

const DeviceList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const deviceListDashboard = useSelector(getDeviceListDashboard);
  const isAdmin = hasRole(ROLES.ADMIN);

  const { deviceTypes, deviceMakes, deviceCategories, deviceModels, deviceVendors, assetTypes } = useDeviceDropdowns();

  useEffect(() => {
    dispatch(fetchDeviceListDashboard());
  }, [dispatch]);

  const cardData = useMemo(() => {
    if (!deviceListDashboard || !Array.isArray(deviceListDashboard) || deviceListDashboard.length === 0) return [];
    return deviceListDashboard.map((item) => {
      const config = CARD_CONFIG[item.title] || {
        iconBg: 'gray.400',
        bgIconColor: '#F0F0F0'
      };
      return {
        ...item,
        ...config
      };
    });
  }, [deviceListDashboard]);

  // Filter configuration based on the provided image
  const filterConfig = useMemo(
    () => [
      {
        name: 'deviceType',
        label: 'deviceType',
        type: 'select',
        placeholder: 'selectDeviceType',
        items: deviceTypes
      },
      {
        name: 'deviceMake',
        label: 'deviceMake',
        type: 'select',
        placeholder: 'selectDeviceMake',
        items: deviceMakes
      },
      {
        name: 'deviceCategory',
        label: 'deviceCategory',
        type: 'select',
        placeholder: 'selectDeviceCategory',
        items: deviceCategories
      },
      {
        name: 'deviceModel',
        label: 'deviceModel',
        type: 'select',
        placeholder: 'selectDeviceModel',
        items: deviceModels
      },
      {
        name: 'vendorName',
        label: 'deviceVendor',
        type: 'select',
        placeholder: 'selectDeviceVendor',
        items: deviceVendors
      },
      {
        name: 'discoveredInAcs',
        label: 'discoveredInAcs',
        type: 'select',
        placeholder: 'selectDiscoveredStatus',
        items: [
          { id: 'true', name: 'Yes' },
          { id: 'false', name: 'No' }
        ]
      },
      {
        name: 'kfonDc',
        label: 'kfonDc',
        type: 'select',
        placeholder: 'selectKfonDc',
        items: [] // Will be populated from API if needed
      },
      {
        name: 'mspDc',
        label: 'mspDc',
        type: 'select',
        placeholder: 'selectMspDc',
        items: [] // Will be populated from API if needed
      },
      {
        name: 'deviceStatus',
        label: 'deviceStatus',
        type: 'select',
        placeholder: 'selectStatus',
        items: [
          { id: 'WORKING', name: 'Working' },
          { id: 'FAULTY', name: 'Faulty' },
          { id: 'IN_TRANSIT', name: 'In Transit' }
        ]
      },
      {
        name: 'subscriberType',
        label: 'subscriberType',
        type: 'select',
        placeholder: 'selectSubscriberType',
        items: [
          { id: 'HOME', name: 'Home' },
          { id: 'CORPORATE', name: 'Corporate' },
          { id: 'GOVERNMENT', name: 'Government' }
        ]
      },
      {
        name: 'subscriberStatus',
        label: 'subscriberStatus',
        type: 'select',
        placeholder: 'selectSubscriberStatus',
        items: [
          { id: 'ACTIVE', name: 'Active' },
          { id: 'INACTIVE', name: 'Inactive' },
          { id: 'SUSPENDED', name: 'Suspended' }
        ]
      },
      {
        name: 'deviceStatusInAcs',
        label: 'deviceStatusInAcs',
        type: 'select',
        placeholder: 'selectDeviceStatusInAcs',
        items: [
          { id: 'ONLINE', name: 'Online' },
          { id: 'OFFLINE', name: 'Offline' }
        ]
      },
      {
        name: 'assetType',
        label: 'assetType',
        type: 'select',
        placeholder: 'selectAssetType',
        items: assetTypes
      },
      {
        name: 'deviceRepairStatus',
        label: 'deviceRepairStatus',
        type: 'select',
        placeholder: 'selectRepairStatus',
        items: [
          { id: 'NOT_REQUIRED', name: 'Not Required' },
          { id: 'PENDING', name: 'Pending' },
          { id: 'COMPLETED', name: 'Completed' }
        ]
      }
    ],
    [deviceTypes, deviceMakes, deviceCategories, deviceModels, deviceVendors, assetTypes]
  );

  const dashboardContent = (
    <HStack gap='4' w='max-content' minW='100%' alignItems='stretch' wrap='nowrap'>
      {cardData.map((data, index) => (
        <Box key={index} minW='320px' maxW='268px'>
          <CommonCard
            title={t(data.title)}
            icon={data.icon}
            iconBg={data.iconBg}
            totalCount={data.count}
            values={data.values || {}}
            bgIconColor={data.bgIconColor}
          />
        </Box>
      ))}
    </HStack>
  );

  const actions = (
    <>
      {isAdmin && (
        <Link to='/app/inventory/stock-management'>
          <Button variant='outline' borderRadius='md' height='40px'>
            <TransferIcon size={'md'} />
            {t('transfer')}
          </Button>
        </Link>
      )}
      <CsvDownloadBtn onClick={() => dispatch(downloadDeviceListCsv())} />
    </>
  );

  return (
    <GenericPageTable
      dataSelector={getTableData(SERVER_SIDE_TABLE_KEYS.DEVICE_LIST_TABLE)}
      fetchAction={fetchDeviceList}
      columns={VISIBLE_COLUMNS_DEVICE_LIST}
      filterConfig={filterConfig}
      actions={actions}
      dashboard={dashboardContent}
      tableKey={SERVER_SIDE_TABLE_KEYS.DEVICE_LIST_TABLE}
    />
  );
};

export default DeviceList;
