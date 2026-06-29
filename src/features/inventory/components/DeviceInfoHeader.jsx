import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchInventoryDetailsById } from '../actions';
import { STOCK_STATUS_OPTIONS } from '../constants';
import { getInventoryDetailsById } from '../selectors';
import { actions as sliceActions } from '../slice';

/**
 * DeviceInfoHeader
 *
 * Two usage modes:
 *  - Pass `device` directly (card context) — renders immediately, no fetch
 *  - Pass `deviceId` only (notification context) — fetches from API and maps response
 */
const DeviceInfoHeader = ({ device: deviceProp, deviceId, mb = '24px' }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fetchedDetails = useSelector(getInventoryDetailsById);

  useEffect(() => {
    if (deviceId && !deviceProp) {
      dispatch(fetchInventoryDetailsById({ detailsId: deviceId }));
    }
    return () => {
      if (deviceId && !deviceProp) {
        dispatch(sliceActions.clearInventoryDetailsById());
      }
    };
  }, [deviceId, deviceProp, dispatch]);

  const device =
    deviceProp ??
    (fetchedDetails
      ? {
          deviceType: fetchedDetails.type?.name,
          make: fetchedDetails.make?.name,
          category: fetchedDetails.category?.name,
          modelNo: fetchedDetails.model?.name,
          vendor: fetchedDetails.vendor?.name ?? fetchedDetails.vendorName,
          custodian: fetchedDetails.custodian?.empName,
          serialNumber: fetchedDetails.deviceSlNo,
          gponSerialNumber: fetchedDetails.gponSerialNumber,
          distanceInKm: fetchedDetails.distanceInKm ?? fetchedDetails.sfpDistance,
          warrantyStartDate: fetchedDetails.warrantyStartDate,
          warrantyEndDate:
            fetchedDetails.warrantyEndDate ?? fetchedDetails.warrantyExpiryDate ?? fetchedDetails.warrantyExpiry,
          status: fetchedDetails.status,
          condition: fetchedDetails.deviceCondition
        }
      : null);

  const statusConfig = STOCK_STATUS_OPTIONS[device?.status] || {
    label: device?.status,
    color: '#2E7D32',
    bg: 'rgba(46, 125, 50, 0.1)'
  };

  const topItems = [
    device?.deviceType && (
      <Text fontWeight='700' color='#232F50' fontSize='16px'>
        {device.deviceType}
      </Text>
    ),
    device?.make && (
      <Text fontSize='16px' color='#6B7280'>
        {t('deviceMake')}:{' '}
        <Text as='span' fontWeight='700' color='#232F50'>
          {device.make}
        </Text>
      </Text>
    ),
    device?.category && (
      <Text fontSize='16px' color='#6B7280'>
        {t('category')}:{' '}
        <Text as='span' fontWeight='700' color='#232F50'>
          {device.category}
        </Text>
      </Text>
    ),
    device?.modelNo && (
      <Text fontSize='16px' color='#6B7280'>
        {t('modelName')}:{' '}
        <Text as='span' fontWeight='700' color='#232F50'>
          {device.modelNo}
        </Text>
      </Text>
    ),
    device?.vendor && (
      <Text fontSize='16px' color='#6B7280'>
        {t('vendor')}:{' '}
        <Text as='span' fontWeight='700' color='#232F50'>
          {device.vendor}
        </Text>
      </Text>
    ),
    device?.custodian && (
      <Text fontSize='16px' color='#6B7280'>
        {t('custodian')}:{' '}
        <Text as='span' fontWeight='700' color='primary.500'>
          {device.custodian}
        </Text>
      </Text>
    ),
    <Box
      px='12px'
      py='3px'
      borderRadius='6px'
      border='1px solid'
      borderColor={statusConfig.color}
      bg={statusConfig.bg}
    >
      <Text fontSize='16px' fontWeight='600' color={statusConfig.color}>
        {statusConfig.label}
      </Text>
    </Box>,
    device?.condition && (
      <Text fontSize='16px' color='#6B7280'>
        {t('condition')}:{' '}
        <Text as='span' fontWeight='700' color={device.condition === 'FAULTY' ? 'red.500' : 'primary.500'}>
          {device.condition === 'FAULTY' ? t('faulty') : device.condition}
        </Text>
      </Text>
    )
  ].filter(Boolean);

  const bottomItems = [
    <Text fontSize='14px' color='#6B7280'>
      {t('serialNumber')}:{' '}
      <Text as='span' fontWeight='600' color='#232F50'>
        {device?.serialNumber || '-'}
      </Text>
    </Text>,
    <Text fontSize='14px' color='#6B7280'>
      {t('gponSerialNumber')}:{' '}
      <Text as='span' fontWeight='600' color='#232F50'>
        {device?.gponSerialNumber || '-'}
      </Text>
    </Text>,
    device?.distanceInKm && (
      <Text fontSize='14px' color='#6B7280'>
        {t('distanceInKm')}:{' '}
        <Text as='span' fontWeight='600' color='#232F50'>
          {device.distanceInKm}
        </Text>
      </Text>
    ),
    device?.warrantyStartDate && (
      <Text fontSize='14px' color='#6B7280'>
        {t('warrantySDate')}:{' '}
        <Text as='span' fontWeight='600' color='#232F50'>
          {device.warrantyStartDate}
        </Text>
      </Text>
    ),
    device?.warrantyEndDate && (
      <Text fontSize='14px' color='#6B7280'>
        {t('warrantyEDate')}:{' '}
        <Text as='span' fontWeight='600' color='#232F50'>
          {device.warrantyEndDate}
        </Text>
      </Text>
    )
  ].filter(Boolean);

  return (
    <Box border='1px solid #E5E7EB' borderRadius='12px' overflow='hidden' mb={mb}>
      <Flex px='20px' py='14px' wrap='wrap' align='center' gap='8px'>
        {topItems.map((item, i) => (
          <Box
            key={i}
            display='flex'
            alignItems='center'
            borderRight={i < topItems.length - 1 ? '1px solid #E5E7EB' : 'none'}
            pr={i < topItems.length - 1 ? '8px' : '0'}
          >
            {item}
          </Box>
        ))}
      </Flex>

      <Box bg='#F9FAFB' px='20px' py='10px' mx='14px' mb='14px' borderRadius='8px'>
        <Flex wrap='wrap' align='center' gap='8px'>
          {bottomItems.map((item, i) => (
            <Box
              key={i}
              display='flex'
              alignItems='center'
              borderRight={i < bottomItems.length - 1 ? '1px solid #D1D5DB' : 'none'}
              pr={i < bottomItems.length - 1 ? '8px' : '0'}
            >
              {item}
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default DeviceInfoHeader;
