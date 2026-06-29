import { Box, Button, Flex, HStack, Icons, Popup, Text } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { API_ACTION_TYPES, fetchStockTrack } from '../actions';
import { STOCK_STATUS_OPTIONS } from '../constants';
import { getStockTrack } from '../selectors';
import { actions as inventoryActions } from '../slice';
import DeviceInfoHeader from './DeviceInfoHeader';


const {
  CalendarNewIcon,
  NoteIcon,
  RouteMapIcon,
  DeviceCondition,
  DeviceRequest,
  DeviceConditionChanged,
  TickTrueIcon,
  TransferRequestLoadingIcon
} = Icons;

// Uses color values from STOCK_STATUS_OPTIONS (constants.js) — no duplication needed there.
// These are only for the timeline dot (icon circle background), which is separate from badge colors.
const STATUS_DOT_COLOR = {
  IN_STOCK: 'toast.success',
  STOCK_ENTERED: 'toast.success',
  STOCK_APPROVED: 'toast.success',
  STOCK_REJECTED: 'toast.error',
  TRANSIT: 'toast.success',
  TRANSFER_REQUEST: 'toast.warning',
  TRANSFER_APPROVED: 'toast.success',
  TRANSFER_REJECTED: 'toast.error',
  OEM: 'secondary.500',
  CONDITION_CHANGE: 'toast.error',
  NOT_WORKING: 'toast.warning',
  RETURN_TO_OEM: 'primary.400',
  UNMAPPED: 'font_color.secondary',
  MAPPED_TO_LOCATION: 'secondary.600',
  RECEIVED: 'toast.success',
  MAPPED_TO_SUBSCRIBER: 'primary.500',
  UPDATED: 'secondary.500'
};

const STATUS_ICON = {
  IN_STOCK: { type: 'inStock', Icon: TickTrueIcon },
  STOCK_ENTERED: { type: 'loading', Icon: TransferRequestLoadingIcon },
  STOCK_APPROVED: { type: 'received', Icon: TickTrueIcon },
  STOCK_REJECTED: { type: 'request', Icon: DeviceRequest },
  TRANSIT: { type: 'transit', Icon: RouteMapIcon },
  TRANSFER_REQUEST: { type: 'loading', Icon: TransferRequestLoadingIcon },
  TRANSFER_APPROVED: { type: 'received', Icon: TickTrueIcon },
  TRANSFER_REJECTED: { type: 'request', Icon: DeviceRequest },
  OEM: { type: 'oem', Icon: DeviceCondition },
  CONDITION_CHANGE: { type: 'conditionChanged', Icon: DeviceConditionChanged },
  NOT_WORKING: { type: 'conditionChanged', Icon: DeviceConditionChanged },
  RETURN_TO_OEM: { type: 'returnOem', Icon: DeviceConditionChanged },
  UNMAPPED: { type: 'request', Icon: DeviceRequest },
  MAPPED_TO_LOCATION: { type: 'received', Icon: TickTrueIcon },
  RECEIVED: { type: 'received', Icon: TickTrueIcon },
  MAPPED_TO_SUBSCRIBER: { type: 'received', Icon: TickTrueIcon },
  UPDATED: { type: 'conditionChanged', Icon: DeviceConditionChanged }
};

const ICON_HAS_CIRCLE = new Set(['oem', 'returnOem', 'conditionChanged', 'request', 'transfer', 'transit']);

const STATUS_MESSAGE = {
  IN_STOCK: 'stockMessage.inStock',
  STOCK_ENTERED: 'stockMessage.stockEntered',
  STOCK_APPROVED: 'stockMessage.stockApproved',
  STOCK_REJECTED: 'stockMessage.stockRejected',
  TRANSIT: 'stockMessage.transit',
  TRANSFER_REQUEST: 'stockMessage.transferRequest',
  TRANSFER_APPROVED: 'stockMessage.transferApproved',
  TRANSFER_REJECTED: 'stockMessage.transferRejected',
  OEM: 'stockMessage.oem',
  NOT_WORKING: 'stockMessage.notWorking',
  RETURN_TO_OEM: 'stockMessage.returnToOem',
  UNMAPPED: 'stockMessage.unmapped',
  MAPPED_TO_LOCATION: 'stockMessage.mappedToLocation',
  CONDITION_CHANGE: 'stockMessage.conditionChange',
  RECEIVED: 'stockMessage.received',
  MAPPED_TO_SUBSCRIBER: 'stockMessage.mappedToSubscriber',
  UPDATED: 'stockMessage.updated'
};

const DEFAULT_STATUS_CFG = { label: '-', color: 'font_color.placeholder', bg: 'background.light_gray_alt' };

const getStatusCfg = (status) => STOCK_STATUS_OPTIONS[status] || DEFAULT_STATUS_CFG;

const cleanQuotes = (val) => (val ? String(val).replace(/^"|"$/g, '') : '-');

const formatMovementDate = (dateStr) => {
  if (!dateStr) return { date: '-', time: '-' };
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const TimelineDot = ({ status }) => {
  const { type, Icon } = STATUS_ICON[status] || { type: 'received', Icon: TickTrueIcon };
  const color = STATUS_DOT_COLOR[status] || '#2E7D32';

  if (ICON_HAS_CIRCLE.has(type)) return <Icon boxSize='30px' flexShrink={0} />;

  return (
    <Box
      w='30px'
      h='30px'
      borderRadius='full'
      bg={color}
      display='flex'
      alignItems='center'
      justifyContent='center'
      flexShrink={0}
    >
      <Icon boxSize='4' color='white' />
    </Box>
  );
};

const StatusBadge = ({ status, boxShadow }) => {
  const cfg = getStatusCfg(status);
  return (
    <Box
      px='16px'
      py='6px'
      borderRadius='8px'
      bg={cfg.bg}
      border='1px solid'
      borderColor={cfg.color}
      flexShrink={0}
      boxShadow={boxShadow}
    >
      <Text fontSize='12px' fontWeight='500' color={cfg.color}>
        {cfg.label}
      </Text>
    </Box>
  );
};
const DeviceHistoryTable = ({ history, t }) => {
  const rows = [
    { label: t('serialNumber'), old: history.oldSerialNumber, new: history.newSerialNumber },
    { label: t('macAddress'), old: history.oldMac, new: history.newMac },
    { label: t('warrantySDate'), old: history.oldWarrantySDate, new: history.newWarrantySDate },
    { label: t('warrantyEDate'), old: history.oldWarrantyEDate, new: history.newWarrantyEDate }
  ].filter((r) => r.old || r.new);

  return (
    <Box mt='10px' borderRadius='8px' border='1px solid #E2E8F0' overflow='hidden'>
      <Box bg='#F1F5F9' px='12px' py='6px'>
        <Text fontSize='11px' fontWeight='700' color='#475569' textTransform='uppercase' letterSpacing='0.5px'>
          {t('deviceChanges')}
        </Text>
      </Box>

      <Flex bg='#F8FAFC' px='12px' py='6px' borderBottom='1px solid #E2E8F0'>
        {[t('field'), t('previous'), t('updated')].map((col, i) => (
          <Box key={col} flex={i === 0 ? '1' : '1.5'}>
            <Text fontSize='11px' fontWeight='600' color={i === 1 ? '#DC2626' : i === 2 ? '#16A34A' : '#64748B'}>
              {col}
            </Text>
          </Box>
        ))}
      </Flex>

      {rows.map((row, i) => (
        <Flex
          key={i}
          px='12px'
          py='7px'
          borderBottom={i < rows.length - 1 ? '1px solid #F1F5F9' : 'none'}
          align='center'
        >
          <Box flex='1'>
            <Text fontSize='12px' color='#64748B'>
              {row.label}
            </Text>
          </Box>
          <Box flex='1.5'>
            <Text
              fontSize='12px'
              fontWeight='500'
              color='#DC2626'
              bg='#FEF2F2'
              px='6px'
              py='2px'
              borderRadius='4px'
              display='inline-block'
            >
              {cleanQuotes(row.old)}
            </Text>
          </Box>
          <Box flex='1.5'>
            <Text
              fontSize='12px'
              fontWeight='500'
              color='#16A34A'
              bg='#F0FDF4'
              px='6px'
              py='2px'
              borderRadius='4px'
              display='inline-block'
            >
              {cleanQuotes(row.new)}
            </Text>
          </Box>
        </Flex>
      ))}

      {history.replaceDate && (
        <Flex bg='background.text_bg' px='12px' py='6px' align='center' gap='6px'>
          <CalendarNewIcon boxSize='12px' color='#B45309' />
          <Text fontSize='11px' color='#B45309' fontWeight='500'>
            {t('replacedOn')}: {history.replaceDate} • {t('by')}: {history.changedByUsername}
          </Text>
        </Flex>
      )}
    </Box>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const TrackDevicePopup = ({ deviceId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const trackData = useSelector(getStockTrack);
  const apiProgress = useSelector(getApiProgress);
  const isLoading = apiProgress[API_ACTION_TYPES.FETCH_STOCK_TRACK] || false;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && deviceId) {
      dispatch(inventoryActions.clearStockTrack());
      dispatch(fetchStockTrack({ deviceId }));
    }
  }, [isOpen, deviceId, dispatch]);

  const device = trackData || {};
  const movements = device.movements || [];

  return (
    <>
      <Box
        as='button'
        ml='8px'
        cursor='pointer'
        display='inline-flex'
        alignItems='center'
        onClick={() => setIsOpen(true)}
      >
        <RouteMapIcon color='#8D0247' />
      </Box>

      <Popup
        title={t('device')}
        titleMain={t('details')}
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        size='xl'
        closeButton={false}
      >
        <CustomLoaderProvider isLoading={isLoading}>
          <Box px='24px'>
            <DeviceInfoHeader
              mb='16px'
              device={{
                deviceType: device.type?.name,
                make: device.make?.name,
                category: device.category?.name,
                modelNo: device.model?.name,
                custodian: device.custodianName,
                status: device.status,
                condition: device.condition,
                serialNumber: device.serialNumber,
                gponSerialNumber: device.gponSerialNumber,
                distanceInKm: device.distanceInKm ?? device.sfpDistance,
                warrantyStartDate: device.warrantyStartDate,
                warrantyEndDate: device.warrantyEndDate ?? device.warrantyExpiryDate
              }}
            />

            <Text fontSize='16px' fontWeight='600' color='primary.500' mb='16px'>
              {t('trackDetails')}
            </Text>

            <Box overflowY='auto' maxH='452px' pb='4px'>
              {movements.length === 0 ? (
                <Text fontSize='14px' color='#6B7280'>
                  {t('noDataFound')}
                </Text>
              ) : (
                movements.map((movement, index) => {
                  const { date, time } = formatMovementDate(movement.createdDate);
                  const isLast = index === movements.length - 1;
                  const description = movement.remarks || t(STATUS_MESSAGE[movement.status] || 'stockMessage.inStock');

                  return (
                    <Flex key={movement.movementId} gap='0' align='flex-start'>
                      <Flex w='100px' flexShrink={0} flexDirection='column' alignItems='center' pt='4px'>
                        <TimelineDot status={movement.status} />
                        <Text fontSize='10px' color='#6B7280' mt='6px' textAlign='center' lineHeight='1.5'>
                          {date}
                          <br />
                          {time}
                        </Text>
                        {!isLast && <Box flex='1' minH='20px' mt='8px' borderLeft='2px dashed #CBD5E1' />}
                      </Flex>

                      <Box
                        flex={1}
                        bg='white'
                        border='1px solid #E8EFF4'
                        borderRadius='12px'
                        p='14px 16px'
                        mb={!isLast ? '16px' : '0'}
                        ml='12px'
                      >
                        <Flex justify='space-between' align='center' mb='10px'>
                          <HStack gap='8px'>
                            <CalendarNewIcon boxSize='16px' color='#6B7280' />
                            <Text fontSize='14px' fontWeight='semibold' color='#232F50'>
                              {date}, {time}
                            </Text>
                          </HStack>
                          <StatusBadge status={movement.status} />
                        </Flex>

                        <HStack gap='8px' align='flex-start'>
                          <NoteIcon boxSize='16px' color='#6B7280' mt='2px' flexShrink={0} />
                          <Box flex='1'>
                            <Text fontSize='14px' color='#232F50' lineHeight='1.6'>
                              {movement.popName && (
                                <Text as='span' fontWeight='700' color='primary.500'>
                                  {movement.popName}{' '}
                                </Text>
                              )}
                              {movement.createdBy && (
                                <Text as='span' color='primary.500' fontWeight='semibold' mr={2}>
                                  {movement.createdBy}
                                </Text>
                              )}
                              {description}
                              {movement.description && (
                                <>
                                  <br />
                                  <Text as='span' fontWeight='semibold' mr={2}>
                                    {movement.description.replaceAll(';', ',')}
                                  </Text>
                                </>
                              )}
                            </Text>

                            {movement.handover && (
                              <Box mt='8px' p='12px' bg='#F8FAFC' borderRadius='8px' border='1px solid #E2E8F0'>
                                <Text
                                  fontSize='12px'
                                  fontWeight='600'
                                  color='#64748B'
                                  textTransform='uppercase'
                                  mb='6px'
                                >
                                  {t('handoverDetails')}
                                </Text>
                                <Text fontSize='13px' color='#475569'>
                                  <Text as='span' fontWeight='600' color='#334155'>
                                    {movement.handover.name || '-'}
                                  </Text>
                                  {' • '}
                                  {movement.handover.mobileNumber || '-'}
                                </Text>
                                {movement.handover.remarks && (
                                  <Text fontSize='13px' color='#475569' mt='4px'>
                                    <Text as='span' fontWeight='500'>
                                      {t('remarks')}:
                                    </Text>{' '}
                                    {movement.handover.remarks}
                                  </Text>
                                )}
                              </Box>
                            )}

                            {movement.deviceHistory && <DeviceHistoryTable history={movement.deviceHistory} t={t} />}
                          </Box>
                        </HStack>
                      </Box>
                    </Flex>
                  );
                })
              )}
            </Box>
          </Box>

          <Flex justify='flex-end' px='24px' py='16px' mt='4px'>
            <Button variant='outline' h='10' px='6' borderRadius='full' onClick={() => setIsOpen(false)}>
              {t('close')}
            </Button>
          </Flex>
        </CustomLoaderProvider>
      </Popup>
    </>
  );
};

export default TrackDevicePopup;
