import { Badge, Box, HStack, Icons, Stack, Text } from '@kfonbss/bss-ui-components';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import ExpandableCard from '@/components/custom/ExpandableCard';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { DATE_FORMAT } from '@/constants/date';
import { PERMISSIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';

import { fetchDispositionHistoryList, fetchMeetingList } from '../actions';
import { STATUS_DISPLAY_MAP } from '../constants';
import useEnquiryActionItems, { isNoActionStatus } from '../hooks/useEnquiryActionItems';
import { getLatestDispositionByEnquiryId, getMeetingHistoryByEnquiryId } from '../selectors';
import DispositionDetails from './pop-up/DispositionDetails';
import MeetingList from './pop-up/MeetingList';

const Divider = () => <Box h='20px' w='1px' bg='gray.200' display={{ base: 'none', md: 'block' }} />;

const StatusBadge = ({ status }) => {
  if (!status) return null;
  return (
    <Box
      border='1px solid'
      borderColor='background.light_gray_bg'
      bg='white'
      color='text.pink'
      p={4}
      height='28px'
      display='flex'
      alignItems='center'
      justifyContent='center'
      borderRadius='31px'
      fontSize='md'
      fontWeight='semibold'
      boxShadow='0 4px 3.8px 0 rgba(0, 0, 0, 0.05)'
    >
      {status}
    </Box>
  );
};

const pillBadge = {
  border: 'none',
  bg: 'gray.100',
  color: 'secondary.800',
  p: 3,
  borderRadius: 'full',
  fontSize: 'md',
  fontWeight: 'medium',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 2
};

const DispositionBadge = ({ disposition, onClick }) => {
  if (!disposition || disposition.toLowerCase() === 'open') return null;
  const { ArrowRightCircle } = Icons;
  const label = STATUS_DISPLAY_MAP[disposition.toUpperCase()] || disposition;
  return (
    <Badge {...pillBadge} cursor='pointer' onClick={onClick}>
      {label}
      <ArrowRightCircle boxSize={6} />
    </Badge>
  );
};

const CafBadge = ({ status, clickable, onClick }) => {
  const { t } = useTranslation();
  if (!status || status === 'NONE') return null;
  const statusKey = status === 'PENDING' ? 'pending' : status === 'PARTIAL' ? 'partial' : 'completed';
  const isComplete = status === 'COMPLETED';
  return (
    <Badge {...pillBadge} gap='0' cursor={clickable ? 'pointer' : 'default'} onClick={clickable ? onClick : undefined}>
      {t('caf')}-
      <Text as='span' color={isComplete ? 'font_color.success' : 'primary.500'} fontWeight='medium' fontSize='md'>
        {t(statusKey)}
      </Text>
    </Badge>
  );
};

const EwsEnquiryCard = memo(({ data, index, onAction, expandAll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [meetingListOpen, setMeetingListOpen] = useState(false);
  const [dispositionDetailsOpen, setDispositionDetailsOpen] = useState(false);
  const { MobileNewIcon, UpArrowIcon, DownArrowIcon, LocationRoundedIcon, ArrowRightCircle, ClockOutline } = Icons;

  useEffect(() => {
    if (expandAll !== undefined) setIsExpanded(expandAll);
  }, [expandAll]);

  const enquiryId = data.id || data.enquiryId;
  const latestDispositionRecord = useSelector((state) => getLatestDispositionByEnquiryId(state, enquiryId));
  const latestDisposition = latestDispositionRecord?.disposition;
  const meetingHistory = useSelector((state) => getMeetingHistoryByEnquiryId(state, enquiryId));
  const hasMeetings = meetingHistory.length > 0;

  const dispositionFetched = useRef(false);
  const meetingFetched = useRef(false);

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  useEffect(() => {
    if (!isExpanded || !enquiryId) return;
    if (!dispositionFetched.current) {
      dispatch(
        fetchDispositionHistoryList({
          customerEnquiryId: enquiryId,
          onSuccess: () => {
            dispositionFetched.current = true;
          }
        })
      );
    }
    if (!meetingFetched.current) {
      dispatch(
        fetchMeetingList({
          customerEnquiryId: enquiryId,
          onSuccess: () => {
            meetingFetched.current = true;
          }
        })
      );
    }
  }, [isExpanded, enquiryId, dispatch]);

  const { hasPermission } = usePageActions();
  const actionItems = useEnquiryActionItems({ data, onAction, latestDisposition });

  const enquiryStatus = data.enquiryStatus?.toUpperCase();
  const isFeasible = latestDisposition?.toLowerCase() === 'feasible';
  const cafClickable =
    isFeasible &&
    !isNoActionStatus(enquiryStatus) &&
    hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_ONBOARD_SUBSCRIBER);

  const displayStatus = STATUS_DISPLAY_MAP[data.status?.toUpperCase()] || data.status;
  const enquiryDate =
    data.createdDt || data.createdAt ? dayjs(data.createdDt || data.createdAt).format(DATE_FORMAT.DATE_TIME) : '-';
  const daysPassed = data.days ?? null;

  return (
    <ExpandableCard
      index={index}
      isExpanded={isExpanded}
      onToggle={toggleExpand}
      toggleIcon={isExpanded ? <UpArrowIcon boxSize={5} /> : <DownArrowIcon boxSize={5} />}
      borderColor={{ collapsed: 'gray.200', expanded: 'gray.200' }}
      actionMenu={<TableActionMenu actionItems={actionItems} row={data} />}
      collapsedContent={
        <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} spacing={2}>
          {/* Row 1: Tracking ID | Pincode | District | (collapsed extras) */}
          <HStack spacing={2} align='center' flexWrap='wrap'>
            <HStack spacing={1}>
              <Text fontWeight='medium' fontSize='md' color='font_color.primary'>
                {t('trackingId')} :
              </Text>
              <Text fontWeight='bold' fontSize='md' color='font_color.primary'>
                {data.trackingId}
              </Text>
            </HStack>
            <Divider />
            <Text fontWeight='bold' fontSize='md' color='primary.500'>
              {data.pincode}
            </Text>
            <Divider />
            <Text fontWeight='bold' fontSize='md' color='font_color.primary'>
              {data.district}
            </Text>
            <>
              <Divider />
              <HStack spacing={1}>
                <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                  {t('rationCardHolderName')} :
                </Text>
                <Text fontWeight='bold' fontSize='md' color='#232F50'>
                  {data.rationCardHolderName}
                </Text>
              </HStack>
              <Divider />
              <HStack spacing={1}>
                <MobileNewIcon boxSize={5} color='primary.700' />
                <Text fontWeight='bold' fontSize='md' color='#232F50'>
                  {data.mobileNumber}
                </Text>
              </HStack>
            </>
          </HStack>

          {/* Date + days + status — always visible */}
          <HStack spacing={4} ml='auto' flexShrink={0}>
            <Text fontSize='md' color='font_color.secondary'>
              {t('enquiryDate')}:{' '}
              <Text as='span' fontWeight='bold' color='black'>
                {enquiryDate}
              </Text>
            </Text>
            {daysPassed !== null && (
              <HStack spacing={1}>
                <ClockOutline boxSize={5} color='primary.500' />
                <Text fontWeight='700' color='#515151' fontSize='sm'>
                  {daysPassed} {t('days')}
                </Text>
              </HStack>
            )}
            <StatusBadge status={displayStatus} />
          </HStack>
        </Stack>
      }
      expandedContent={
        <Stack
          direction={{ base: 'column', md: 'row' }}
          w='full'
          justify='space-between'
          align={{ base: 'start', md: 'start' }}
          spacing={4}
        >
          {/* Left: detail fields */}
          <Box flex={1}>
            <HStack spacing={3} align='center' flexWrap='wrap' rowGap={2}>
              <HStack spacing={1}>
                <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                  {t('rationCardNumber')} :
                </Text>
                <Text fontWeight='bold' fontSize='md' color='secondary.800'>
                  {data.rationCardNumber}
                </Text>
              </HStack>
              {data.aadharNumber && (
                <>
                  <Divider />
                  <HStack spacing={1}>
                    <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                      {t('aadharNumber')} :
                    </Text>
                    <Text fontWeight='bold' fontSize='md' color='secondary.800'>
                      {data.aadharNumber}
                    </Text>
                  </HStack>
                </>
              )}
              {data.ksebConsumerNumber && (
                <>
                  <Divider />
                  <HStack spacing={1}>
                    <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                      {t('ksebConsumerNumber')} :
                    </Text>
                    <Text fontWeight='bold' fontSize='md' color='secondary.800'>
                      {data.ksebConsumerNumber}
                    </Text>
                  </HStack>
                </>
              )}
              {data.cusConnType && (
                <>
                  <Divider />
                  <HStack spacing={1}>
                    <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                      {t('connectionType')} :
                    </Text>
                    <Text fontWeight='bold' fontSize='md' color='secondary.800'>
                      {data.cusConnType}
                    </Text>
                  </HStack>
                </>
              )}
              {data.referralCode && (
                <>
                  <Divider />
                  <HStack spacing={1}>
                    <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                      {t('referralCode')} :
                    </Text>
                    <Text fontWeight='bold' fontSize='md' color='secondary.800'>
                      {data.referralCode}
                    </Text>
                  </HStack>
                </>
              )}
              {data.installationAddress && (
                <>
                  <Divider />
                  <HStack spacing={1} cursor='default'>
                    <LocationRoundedIcon boxSize={5} color='primary.500' />
                    <Text fontSize='md' color='#232F50' fontWeight={600}>
                      {data.installationAddress}
                    </Text>
                  </HStack>
                </>
              )}
            </HStack>
          </Box>

          {/* Right: badges */}
          <HStack spacing={2} flexWrap='wrap' flexShrink={0} align='center'>
            {data.assignedFromUsername && (
              <HStack spacing={1}>
                <Text fontWeight='medium' fontSize='md' color='gray.500'>
                  {t('assignedFrom')} :
                </Text>
                <Text fontSize='md' color='#232F50' fontWeight='medium'>
                  {data.assignedFromUsername}
                </Text>
              </HStack>
            )}
            {data.assignedToUsername && (
              <HStack spacing={1}>
                <Text fontWeight='medium' fontSize='md' color='gray.500'>
                  {t('assignedTo')} :
                </Text>
                <Text fontSize='md' color='#232F50' fontWeight='medium'>
                  {data.assignedToUsername}
                </Text>
              </HStack>
            )}
            <DispositionBadge disposition={latestDisposition} onClick={() => setDispositionDetailsOpen(true)} />
            {hasMeetings && (
              <Badge {...pillBadge} cursor='pointer' onClick={() => setMeetingListOpen(true)}>
                {t('meetings')}
                <ArrowRightCircle boxSize={6} />
              </Badge>
            )}
            {isFeasible && (
              <CafBadge
                status={!data.enquiryCafStatus || data.enquiryCafStatus === 'NONE' ? 'PENDING' : data.enquiryCafStatus}
                clickable={cafClickable}
                onClick={cafClickable ? () => onAction?.(data, 'CAF') : undefined}
              />
            )}
          </HStack>
        </Stack>
      }
    >
      {/* Portal siblings */}
      <MeetingList open={meetingListOpen} setOpen={setMeetingListOpen} enquiryId={enquiryId} />
      <DispositionDetails open={dispositionDetailsOpen} setOpen={setDispositionDetailsOpen} enquiryId={enquiryId} />
    </ExpandableCard>
  );
});

export default EwsEnquiryCard;
