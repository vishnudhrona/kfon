import { Box, Button, Flex, HStack, Icons, Text } from '@kfonbss/bss-ui-components';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CustomCheckbox } from '@/components/custom';
import GenericCardPage from '@/components/custom/GenericCardPage';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { PERMISSIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';
import { formatDisplayDate } from '@/utils/dateUtils';

import { fetchTransferredStockList, submitMyStockTransfer, submitRecallDevice, submitStockReceive } from '../actions';
import { INVENTORY_KEYS, STOCK_STATUS_OPTIONS } from '../constants';
import { getTableData } from '../selectors';
import { mapTransferredItemToCard } from '../utils';
import StockReceiveModal from './StockReceiveModal';
import StockTransferModal from './StockTransferModal';
import TrackDevicePopup from './TrackDevicePopup';

const TRANSFERRED_STOCK_COLUMNS = [
  { header: 'deviceType', accessor: 'deviceType' },
  { header: 'deviceCategory', accessor: 'deviceCategory' },
  { header: 'deviceModel', accessor: 'deviceModel' },
  { header: 'deviceMake', accessor: 'deviceMake' },
  { header: 'deviceStatus', accessor: 'deviceStatus' },
  { header: 'gponSerialNumber', accessor: 'gponSerialNumber' },
  { header: 'serialNumber', accessor: 'deviceSerialNumber' },
  { header: 'deviceMac', accessor: 'macAddress' }
];

const isTransferEligible = (item) => item.viewType === 'RECEIVED' && item.status !== 'TRANSIT';
const isReceiveEligible = (item) => item.status === 'TRANSIT' && item.viewType === 'SENT';

const TransferredStock = ({ searchQuery, filters }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { hasPermission } = usePageActions();

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceToTransfer, setDeviceToTransfer] = useState(null);
  const [isBulkTransfer, setIsBulkTransfer] = useState(false);
  const [isBulkReceive, setIsBulkReceive] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedReceiveItems, setSelectedReceiveItems] = useState([]);

  const listData = useSelector(getTableData(INVENTORY_KEYS.TRANSFERRED_STOCK_LIST));
  const allItems = useMemo(() => listData?.data ?? [], [listData]);
  const eligibleItems = useMemo(() => allItems.filter(isTransferEligible), [allItems]);
  const receiveEligibleItems = useMemo(() => allItems.filter(isReceiveEligible), [allItems]);
  const allSelected = eligibleItems.length > 0 && selectedItems.length === eligibleItems.length;
  const allReceiveSelected =
    receiveEligibleItems.length > 0 && selectedReceiveItems.length === receiveEligibleItems.length;

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        eligibleItems.map((item) => ({
          slNo: item.deviceId,
          transferId: item.id,
          serialNumber: item.deviceSerialNumber
        }))
      );
    }
  }, [allSelected, eligibleItems]);

  const handleSelectAllReceive = useCallback(() => {
    if (allReceiveSelected) {
      setSelectedReceiveItems([]);
    } else {
      setSelectedReceiveItems(
        receiveEligibleItems.map((item) => ({
          deviceId: item.deviceId,
          transferId: item.id,
          deviceTypeName: item.deviceType,
          serialNumber: item.deviceSerialNumber,
          gponSerialNumber: item.gponSerialNumber
        }))
      );
    }
  }, [allReceiveSelected, receiveEligibleItems]);

  const handleSelect = useCallback((item) => {
    setSelectedItems((prev) => {
      const exists = prev.some((i) => i.slNo === item.deviceId);
      if (exists) return prev.filter((i) => i.slNo !== item.deviceId);
      return [...prev, { slNo: item.deviceId, transferId: item.id, serialNumber: item.deviceSerialNumber }];
    });
  }, []);

  const handleSelectReceive = useCallback((item) => {
    setSelectedReceiveItems((prev) => {
      const exists = prev.some((i) => i.deviceId === item.deviceId);
      if (exists) return prev.filter((i) => i.deviceId !== item.deviceId);
      return [
        ...prev,
        {
          deviceId: item.deviceId,
          transferId: item.id,
          deviceTypeName: item.deviceType,
          serialNumber: item.deviceSerialNumber,
          gponSerialNumber: item.gponSerialNumber
        }
      ];
    });
  }, []);

  const handleRecallOrReject = useCallback(
    (item, type) => {
      dispatch(submitRecallDevice({ transferId: item.id, deviceId: item.deviceId, type }));
    },
    [dispatch]
  );

  const handleBulkReceiveSubmit = (data) => {
    dispatch(
      submitStockReceive({
        receivedDate: new Date(data.date).toISOString(),
        devices: selectedReceiveItems.map((i) => ({
          deviceId: i.deviceId,
          transferId: i.transferId,
          deviceCondition: data.condition,
          deviceTypeName: i.deviceTypeName
        }))
      })
    );
    setSelectedReceiveItems([]);
    setIsBulkReceive(false);
    setIsReceiveModalOpen(false);
  };

  const handleOpenBulkReceive = useCallback(() => {
    setSelectedDevice(null);
    setIsBulkReceive(true);
    setIsReceiveModalOpen(true);
  }, []);

  const handleTransferSubmit = (data) => {
    if (isBulkTransfer) {
      dispatch(
        submitMyStockTransfer({
          deviceIds: selectedItems.map((i) => i.slNo),
          transferIds: selectedItems.map((i) => i.transferId),
          serialNumbers: selectedItems.map((i) => i.serialNumber),
          name: data.handedOverName,
          mobileNumber: data.handedOverMobile,
          remarks: data.remark2,
          isSameDevice: true
        })
      );
      setSelectedItems([]);
    } else {
      dispatch(
        submitMyStockTransfer({
          deviceIds: [data.device.slNo],
          transferIds: [data.device.transferId],
          serialNumbers: [data.device.serialNumber],
          name: data.handedOverName,
          mobileNumber: data.handedOverMobile,
          remarks: data.remark2,
          isSameDevice: data.isSameDevice
        })
      );
    }
    setIsTransferModalOpen(false);
    setIsBulkTransfer(false);
  };

  const handleOpenBulkTransfer = useCallback(() => {
    setDeviceToTransfer(null);
    setIsBulkTransfer(true);
    setIsTransferModalOpen(true);
  }, []);

  const canTransfer = hasPermission(PERMISSIONS.STOCK_MANAGEMENT.DEVICE_TRANSFER);

  const canReceive = hasPermission(PERMISSIONS.STOCK_MANAGEMENT.DEVICE_REQUEST);

  const TransferredStockCard = useCallback(
    ({ data: item }) => {
      const isSelected = selectedItems.some((i) => i.slNo === item.deviceId);
      const isReceiveSelected = selectedReceiveItems.some((i) => i.deviceId === item.deviceId);
      const eligible = isTransferEligible(item);
      const receiveEligible = isReceiveEligible(item);

      const actionItems = [
        {
          label: 'receive',
          onClick: () => {
            setSelectedDevice(item);
            setIsReceiveModalOpen(true);
          },
          hidden: !(
            item.status === 'TRANSIT' &&
            item.viewType === 'SENT' &&
            hasPermission(PERMISSIONS.STOCK_MANAGEMENT.DEVICE_REQUEST)
          )
        },
        {
          label: 'transfer',
          onClick: () => {
            setDeviceToTransfer(mapTransferredItemToCard(item));
            setIsBulkTransfer(false);
            setIsTransferModalOpen(true);
          },
          hidden: !(eligible && canTransfer)
        },
        {
          label: 'reject',
          onClick: () => handleRecallOrReject(item, 'REJECTED'),
          hidden: !(eligible && canTransfer)
        },
        {
          label: 'recall',
          onClick: () => handleRecallOrReject(item, 'RECALL'),
          hidden: !(item.status === 'TRANSFER_REQUEST' && item.viewType === 'SENT')
        }
      ];

      const statusConfig = STOCK_STATUS_OPTIONS[item.deviceStatus || item.status] || {
        label: item.deviceStatus || item.status,
        color: '#2E7D32',
        bg: 'rgba(46, 125, 50, 0.1)'
      };

      return (
        <Flex align='flex-start' gap='17px' pb='10px'>
          {canReceive && receiveEligible && (
            <CustomCheckbox mt='20px' checked={isReceiveSelected} onCheckedChange={() => handleSelectReceive(item)} />
          )}
          {canTransfer && eligible && !receiveEligible && (
            <CustomCheckbox mt='20px' checked={isSelected} onCheckedChange={() => handleSelect(item)} />
          )}
          {!receiveEligible && !eligible && <Box w='22px' flexShrink={0} />}
          <Box flex='1' bg='white' border='1px solid #E5E7EB' borderRadius='12px' overflow='hidden'>
            <Flex justify='space-between' align='flex-start'>
              {(() => {
                const topItems = [
                  <Box display='flex' alignItems='center' gap='8px'>
                    <Icons.DirectionalArrowIcon
                      boxSize='20px'
                      color={item.viewType === 'SENT' ? '#2E7D32' : '#8D0247'}
                      transform={item.viewType === 'SENT' ? 'rotate(180deg)' : undefined}
                    />
                    <Text fontWeight='700' color='#232F50' fontSize='16px'>
                      {item.deviceType}
                    </Text>
                  </Box>,
                  item.deviceMake && (
                    <Text fontSize='16px' color='#6B7280'>
                      {t('deviceMake')}:{' '}
                      <Text as='span' fontWeight='700' color='#232F50'>
                        {item.deviceMake}
                      </Text>
                    </Text>
                  ),
                  item.deviceCategory && (
                    <Text fontSize='16px' color='#6B7280'>
                      {t('category')}:{' '}
                      <Text as='span' fontWeight='700' color='#232F50'>
                        {item.deviceCategory}
                      </Text>
                    </Text>
                  ),
                  item.deviceModel && (
                    <Text fontSize='16px' color='#6B7280'>
                      {t('modelName')}:{' '}
                      <Text as='span' fontWeight='700' color='#232F50'>
                        {item.deviceModel}
                      </Text>
                    </Text>
                  ),
                  item.vendorName && (
                    <Text fontSize='16px' color='#6B7280'>
                      {t('vendor')}:{' '}
                      <Text as='span' fontWeight='700' color='#232F50'>
                        {item.vendorName}
                      </Text>
                    </Text>
                  ),
                  <Text fontSize='16px' color='#6B7280'>
                    {t('custodian')}:{' '}
                    <Text as='span' fontWeight='700' color='primary.500'>
                      {item.custodian?.username || item.custodianName || '-'}
                    </Text>
                  </Text>,
                  <Text fontSize='16px' color='#6B7280'>
                    {t('requestedBy')}:{' '}
                    <Text as='span' fontWeight='700' color='primary.500'>
                      {item.requestedBy?.username || '-'}
                    </Text>
                  </Text>,
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
                  </Box>
                ].filter(Boolean);
                return (
                  <Flex px='20px' py='14px' wrap='wrap' align='center' gap='8px'>
                    {topItems.map((node, i) => (
                      <Box
                        key={i}
                        display='flex'
                        alignItems='center'
                        borderRight={i < topItems.length - 1 ? '1px solid #E5E7EB' : 'none'}
                        pr={i < topItems.length - 1 ? '8px' : '0'}
                      >
                        {node}
                      </Box>
                    ))}
                  </Flex>
                );
              })()}

              <HStack mr={4} spacing={1} flexShrink={0} alignSelf='flex-start' pt='10px'>
                <TrackDevicePopup deviceId={item.deviceId} />
                <TableActionMenu actionItems={actionItems} disabled={selectedItems.length > 0 || selectedReceiveItems.length > 0} />
              </HStack>
            </Flex>

            <Box bg='#F9FAFB' px='20px' py='10px' mx='14px' mb='14px' borderRadius='8px'>
              {(() => {
                const bottomItems = [
                  <Text fontSize='14px' color='#6B7280'>
                    {t('serialNumber')}:{' '}
                    <Text as='span' fontWeight='600' color='#232F50'>
                      {item.deviceSerialNumber}
                    </Text>
                  </Text>,
                  <Text fontSize='14px' color='#6B7280'>
                    {t('gponSerialNumber')}:{' '}
                    <Text as='span' fontWeight='600' color='#232F50'>
                      {item.gponSerialNumber}
                    </Text>
                  </Text>,
                  item.distanceInKm && (
                    <Text fontSize='14px' color='#6B7280'>
                      {t('distanceInKm')}:{' '}
                      <Text as='span' fontWeight='600' color='#232F50'>
                        {item.distanceInKm}
                      </Text>
                    </Text>
                  ),
                  item.warrantyStartDate && (
                    <Text fontSize='14px' color='#6B7280'>
                      {t('warrantySDate')}:{' '}
                      <Text as='span' fontWeight='600' color='#232F50'>
                        {formatDisplayDate(item.warrantyStartDate)}
                      </Text>
                    </Text>
                  ),
                  item.warrantyEndDate && (
                    <Text fontSize='14px' color='#6B7280'>
                      {t('warrantyEDate')}:{' '}
                      <Text as='span' fontWeight='600' color='#232F50'>
                        {formatDisplayDate(item.warrantyEndDate)}
                      </Text>
                    </Text>
                  )
                ].filter(Boolean);
                return (
                  <Flex wrap='wrap' align='center' gap='8px'>
                    {bottomItems.map((node, i) => (
                      <Box
                        key={i}
                        display='flex'
                        alignItems='center'
                        borderRight={i < bottomItems.length - 1 ? '1px solid #D1D5DB' : 'none'}
                        pr={i < bottomItems.length - 1 ? '8px' : '0'}
                      >
                        {node}
                      </Box>
                    ))}
                  </Flex>
                );
              })()}
            </Box>
          </Box>
        </Flex>
      );
    },
    [
      t,
      selectedItems,
      selectedReceiveItems,
      canTransfer,
      canReceive,
      handleSelect,
      handleSelectReceive,
      setSelectedDevice,
      setIsReceiveModalOpen,
      setDeviceToTransfer,
      setIsTransferModalOpen,
      hasPermission,
      handleRecallOrReject
    ]
  );

  return (
    <>
      <GenericCardPage
        dataSelector={getTableData(INVENTORY_KEYS.TRANSFERRED_STOCK_LIST)}
        fetchAction={fetchTransferredStockList}
        tableKey={INVENTORY_KEYS.TRANSFERRED_STOCK_LIST}
        columns={TRANSFERRED_STOCK_COLUMNS}
        CardComponent={TransferredStockCard}
        isSearchEnabled={false}
        externalSearch={searchQuery}
        externalFilters={filters}
        actions={
          <HStack spacing={2}>
            {canReceive && receiveEligibleItems.length > 0 && (
              <Button borderRadius='8px' variant='outline' h='36px' px='16px' onClick={handleSelectAllReceive}>
                {allReceiveSelected ? t('unselectAll') : t('selectAll')}
                {selectedReceiveItems.length > 0 && ` · ${selectedReceiveItems.length} ${t('selected')}`}
              </Button>
            )}
            {canReceive && selectedReceiveItems.length > 0 && (
              <Button borderRadius='8px' variant='outline' h='36px' px='16px' onClick={handleOpenBulkReceive}>
                {t('receive')} ({selectedReceiveItems.length})
              </Button>
            )}
            {canTransfer && eligibleItems.length > 0 && (
              <Button borderRadius='8px' variant='outline' h='36px' px='16px' onClick={handleSelectAll}>
                {allSelected ? t('unselectAll') : t('selectAll')}
                {selectedItems.length > 0 && ` · ${selectedItems.length} ${t('selected')}`}
              </Button>
            )}
            {canTransfer && selectedItems.length > 0 && (
              <Button borderRadius='8px' variant='outline' h='36px' px='16px' onClick={handleOpenBulkTransfer}>
                {t('transfer')} ({selectedItems.length})
              </Button>
            )}
          </HStack>
        }
      />

      <StockReceiveModal
        isOpen={isReceiveModalOpen}
        device={selectedDevice}
        bulkDevices={isBulkReceive ? selectedReceiveItems : null}
        onClose={() => {
          setIsReceiveModalOpen(false);
          setSelectedDevice(null);
          setIsBulkReceive(false);
        }}
        onSubmit={(data) => {
          if (isBulkReceive) {
            handleBulkReceiveSubmit(data);
          } else {
            dispatch(
              submitStockReceive({
                receivedDate: new Date(data.date).toISOString(),
                devices: [
                  {
                    deviceId: data.device?.deviceId,
                    transferId: data.device?.id,
                    deviceCondition: data.condition,
                    deviceTypeName: data.device?.deviceType
                  }
                ]
              })
            );
          }
        }}
      />

      <StockTransferModal
        isOpen={isTransferModalOpen}
        device={deviceToTransfer}
        isTransferredStock={true}
        bulkDeviceCount={isBulkTransfer ? selectedItems.length : 0}
        onClose={() => {
          setIsTransferModalOpen(false);
          setDeviceToTransfer(null);
          setIsBulkTransfer(false);
        }}
        onSubmit={handleTransferSubmit}
      />
    </>
  );
};

export default TransferredStock;
