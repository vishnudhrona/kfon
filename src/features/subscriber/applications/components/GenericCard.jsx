import { Badge, Box, HStack, Icons, Stack, Text, VStack } from '@kfonbss/bss-ui-components';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { HoverPopover, LocationViewPopup } from '@/components/custom';
import ExpandableCard from '@/components/custom/ExpandableCard';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { successToast } from '@/components/custom/Toast';
import { PERMISSIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';

import { fetchDispositionHistoryList, fetchMeetingList } from '../actions';
import { STATUS_DISPLAY_MAP } from '../constants';
import useEnquiryActionItems, { ENQUIRY_STAGE } from '../hooks/useEnquiryActionItems';
import { getLatestDispositionByEnquiryId, getMeetingHistoryByEnquiryId } from '../selectors';
import DispositionDetails from './pop-up/DispositionDetails';
import MeetingList from './pop-up/MeetingList';

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
      gap={2}
    >
      <Box w='6px' h='6px' borderRadius='full' bg='text.pink' />
      {status}
    </Box>
  );
};

const DispositionBadge = ({ disposition, onClick }) => {
  if (!disposition || disposition.toLowerCase() === 'open') return null;
  const { ArrowRightCircle } = Icons;
  const label = STATUS_DISPLAY_MAP[disposition.toUpperCase()] || disposition;
  const isFeasible = disposition.toLowerCase() === 'feasible';
  return (
    <Badge
      bg={isFeasible ? '#E8F5E9' : 'gray.100'}
      color={isFeasible ? '#2E7D32' : 'gray.700'}
      px={3}
      py={1}
      borderRadius='full'
      fontSize='md'
      textTransform='none'
      display='flex'
      alignItems='center'
      gap={1}
      cursor='pointer'
      onClick={onClick}
    >
      {label}
      <ArrowRightCircle boxSize={4} />
    </Badge>
  );
};

const CafBadge = ({ status, clickable, onClick }) => {
  const { t } = useTranslation();
  if (!status || status === 'NONE') return null;
  const statusKey = status === 'PENDING' ? 'pending' : status === 'PARTIAL' ? 'partial' : 'completed';
  const isComplete = status === 'COMPLETED';
  return (
    <Badge
      bg={isComplete ? '#FFF5CF' : 'gray.100'}
      color='#232F50'
      px={3}
      py={1}
      borderRadius='full'
      fontSize='md'
      textTransform='none'
      display='flex'
      alignItems='center'
      gap={1}
      cursor={clickable ? 'pointer' : 'default'}
      onClick={onClick}
    >
      {t('caf')}-
      <Text as='span' color={isComplete ? '#008232' : 'primary.500'} fontWeight='bold'>
        {t(statusKey)}
      </Text>
      <Icons.ArrowRightCircle boxSize={4} color='#232F50' />
    </Badge>
  );
};

const GenericCard = memo(({ data, index, onAction, expandAll, isOutbox }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (expandAll !== undefined) setIsExpanded(expandAll);
  }, [expandAll]);

  const [meetingListOpen, setMeetingListOpen] = useState(false);
  const [dispositionDetailsOpen, setDispositionDetailsOpen] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const { hasPermission } = usePageActions();
  const {
    MobileNewIcon,
    NewEmailIcon,
    UpArrowIcon,
    DownArrowIcon,
    LocationRoundedIcon,
    UserProfileIcon,
    ClockOutline,
    TickIcon
  } = Icons;

  const latestDispositionRecord = useSelector((state) => getLatestDispositionByEnquiryId(state, data.enquiryId));
  const latestDisposition = latestDispositionRecord?.disposition;
  const meetingHistory = useSelector((state) => getMeetingHistoryByEnquiryId(state, data.enquiryId));
  const hasMeetings = meetingHistory.length > 0;

  const enquiryStatus = data.enquiryStatus?.toUpperCase();
  const showCafBadge = latestDisposition?.toLowerCase() === 'feasible';
  const isFeasible = showCafBadge;
  const isEnquiryStage = ENQUIRY_STAGE.has(enquiryStatus);
  const isRejected = enquiryStatus === 'REJECTED';
  const cafClickable =
    hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_ONBOARD_SUBSCRIBER) &&
    ((isEnquiryStage && isFeasible) || isRejected);

  const dispositionFetched = useRef(false);
  const meetingFetched = useRef(false);

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  useEffect(() => {
    if (!isExpanded || !data.enquiryId) return;
    if (!dispositionFetched.current) {
      dispatch(
        fetchDispositionHistoryList({
          customerEnquiryId: data.enquiryId,
          onSuccess: () => {
            dispositionFetched.current = true;
          }
        })
      );
    }
    if (!meetingFetched.current) {
      dispatch(
        fetchMeetingList({
          customerEnquiryId: data.enquiryId,
          onSuccess: () => {
            meetingFetched.current = true;
          }
        })
      );
    }
  }, [isExpanded, data.enquiryId, dispatch]);

  const actionItems = useEnquiryActionItems({ data, onAction, latestDisposition });

  const displayStatus = STATUS_DISPLAY_MAP[data.status?.toUpperCase()] || data.status;

  const handleCopyId = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (!data.id) return;
      navigator.clipboard
        .writeText(String(data.id))
        .then(() => successToast({ description: t('copied') }))
        .catch((err) => console.error('Failed to copy!', err));
    },
    [data.id, t]
  );

  return (
    <ExpandableCard
      index={index}
      isExpanded={isExpanded}
      onToggle={toggleExpand}
      toggleIcon={isExpanded ? <UpArrowIcon boxSize={4} /> : <DownArrowIcon boxSize={4} />}
      borderColor={{ collapsed: 'gray.200', expanded: '#EFDD9D' }}
      actionMenu={<TableActionMenu actionItems={actionItems} row={data} />}
      hideActionMenu={isOutbox}
      collapsedContent={
        <HStack spacing={4}>
          {/* ID badge */}
          <Badge
            bg='#FFE587'
            color='#5B1434'
            borderRadius='md'
            px={3}
            py={1}
            fontSize='md'
            fontWeight='bold'
            cursor='pointer'
            title={t('clickToCopyId')}
            onClick={handleCopyId}
          >
            {t('id')} : {data.id}
          </Badge>

          {/* Name */}
          <HStack spacing={2}>
            <UserProfileIcon boxSize={4} color='#999' />
            <Text fontWeight='600' fontSize='lg' color='text.primary' textTransform='capitalize'>
              {data.customerName}
            </Text>
          </HStack>

          {/* Pincode */}
          <Text fontWeight='bold' fontSize='md' color='primary.500'>
            {data.pincode}
          </Text>

          {/* Date + days + status — right-aligned within the grows area */}
          <HStack spacing={4} ml='auto' flexShrink={0}>
            <Text fontSize='md' color='gray.500'>
              {t('enquiryDate')}:{' '}
              <Text as='span' color='black' fontWeight='500'>
                {data.enquiryDate}
              </Text>
            </Text>

            {data.daysPassed !== 'N/A' && (
              <HStack spacing={1}>
                <ClockOutline boxSize='5' color='primary.500' />
                <Text fontWeight='700' color='#515151' fontSize='sm'>
                  {data.daysPassed} {t('days')}
                </Text>
              </HStack>
            )}

            <StatusBadge status={displayStatus} />
          </HStack>
        </HStack>
      }
      expandedContent={
        <Stack
          direction={{ base: 'column', md: 'row' }}
          w='full'
          justify='space-between'
          align={{ base: 'start', md: 'center' }}
          spacing={4}
          pl={{ base: 0, md: '36px' }}
        >
          {/* Contact info */}
          <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} spacing={4}>
            <HStack spacing={1}>
              <MobileNewIcon boxSize={5} color='gray.500' />
              <Text fontWeight='lg' fontSize='md' color='#5F5F5F'>
                {data.mobile}
              </Text>
            </HStack>

            {data.email && (
              <HStack spacing={1}>
                <NewEmailIcon boxSize={4} color='gray.500' />
                <Text fontSize='md' color='#232F50' fontWeight='medium'>
                  {data.email}
                </Text>
              </HStack>
            )}

            <HoverPopover
              trigger={
                <HStack
                  spacing={1}
                  cursor={data.latitude && data.longitude ? 'pointer' : 'default'}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (data.latitude && data.longitude) setTimeout(() => setShowLocationMap(true), 0);
                  }}
                >
                  <LocationRoundedIcon
                    boxSize={4}
                    color={data.latitude && data.longitude ? 'primary.500' : 'gray.500'}
                  />
                  <Text
                    fontSize='md'
                    color={data.latitude && data.longitude ? 'primary.500' : '#232F50'}
                    fontWeight='medium'
                  >
                    {t('address')}
                  </Text>
                </HStack>
              }
              content={
                <VStack align='stretch' spacing={0} p={4} minW='280px'>
                  <Text
                    fontSize='md'
                    fontWeight='semibold'
                    color={data.latitude && data.longitude ? 'primary.500' : 'secondary.800'}
                    cursor={data.latitude && data.longitude ? 'pointer' : 'default'}
                    textDecoration={data.latitude && data.longitude ? 'underline' : 'none'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (data.latitude && data.longitude) setTimeout(() => setShowLocationMap(true), 0);
                    }}
                  >
                    {data.addressLine1}
                  </Text>
                </VStack>
              }
            />
          </Stack>

          {/* Badges */}
          <HStack spacing={2} flexWrap='wrap'>
            {data.createdByName && (
              <HStack spacing={1}>
                <Text fontWeight='medium' fontSize='md' color='gray.500'>
                  {t('createdBy')} :
                </Text>
                <Text fontSize='md' color='#232F50' fontWeight='medium'>
                  {data.createdByName}
                </Text>
              </HStack>
            )}
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
              <HStack spacing={1} cursor='pointer' onClick={() => setMeetingListOpen(true)}>
                <TickIcon boxSize='14px' />
                <Text fontSize='md' color='#515151' fontWeight='600'>
                  {t('meetings')}
                </Text>
              </HStack>
            )}
            {showCafBadge && (
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
      <LocationViewPopup
        isOpen={showLocationMap}
        onClose={() => setShowLocationMap(false)}
        latitude={data.latitude}
        longitude={data.longitude}
        address={data.addressLine1}
        title={t('subscriber')}
        titleMain={t('address')}
      />
      <MeetingList open={meetingListOpen} setOpen={setMeetingListOpen} enquiryId={data.enquiryId} />
      <DispositionDetails
        open={dispositionDetailsOpen}
        setOpen={setDispositionDetailsOpen}
        enquiryId={data.enquiryId}
      />
    </ExpandableCard>
  );
});

export default GenericCard;
