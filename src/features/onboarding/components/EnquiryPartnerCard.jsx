import { Box, Button, HStack, Icons, Popup, Stack, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { HoverPopover, LocationViewPopup } from '@/components/custom';
import ConfirmPopup from '@/components/custom/ConfirmPopup';
import ExpandableCard from '@/components/custom/ExpandableCard';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { errorToast } from '@/components/custom/Toast';
import { PERMISSIONS } from '@/constants/permissions';
import TrackEnquiryPopup from '@/features/public/pages/enquiryForms/components/TrackEnquiryPopup';
import { usePageActions } from '@/hooks/usePageActions';
import { dayjs } from '@/utils/dateUtils';

import { assignEnquiryToPreviousUser } from '../action';

const Divider = () => <Box h='20px' w='1px' bg='gray.200' display={{ base: 'none', md: 'block' }} />;

const StatusPill = ({ label, dotBg, border = '1px solid #D7D7D7' }) => (
  <Box
    bg='#F4F4F4'
    color='#FD1C7A'
    px={3}
    py={1}
    borderRadius='4xl'
    fontSize='sm'
    fontWeight='semibold'
    border={border}
    display='flex'
    alignItems='center'
    gap={2}
  >
    <Box w='8px' h='8px' borderRadius='full' bg={dotBg} />
    {label}
  </Box>
);

const EnquiryPartnerCard = ({
  data,
  index,
  onClick,
  expandAll,
  mainTitle,
  trackingId,
  status,
  contactName,
  address,
  location,
  latitude,
  longitude,
  mobile,
  altMobile,
  landline,
  email,
  source,
  onboardStatusCode,
  previewPath,
  onboardPath,
  onboardState,
  FeasibilityPopup,
  ApprovePopup,
  ForwardPlusPopup,
  partnerType,
  forwardType,
  moreDetails,
  showOnboardPending,
  statusDotBg = '#FD1C7A',
  assignedFromSeatName,
  assignedFromUsername,
  assignedToSeatName,
  assignedToUsername
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showFeasibilityPopup, setShowFeasibilityPopup] = useState(false);
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [showForwardPlusPopup, setShowForwardPlusPopup] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const [showTrackPopup, setShowTrackPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { MobileNewIcon, NewEmailIcon, UpArrowIcon, DownArrowIcon, LocationRoundedIcon, CardUserIcon, RouteMapIcon } =
    Icons;
  const { hasPermission } = usePageActions();

  useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
    onClick && onClick(data);
  }, [onClick, data]);

  const assignedFromLabel =
    [...new Set([assignedFromSeatName, assignedFromUsername].filter(Boolean))].join(' / ') || t('thePreviousUser');

  const handleReturnConfirm = useCallback(() => {
    if (!data?.enquiryId) {
      setShowReturnConfirm(false);
      errorToast({ description: t('enquiryIdMissing') });
      return;
    }
    dispatch(
      assignEnquiryToPreviousUser({
        enquiryId: data.enquiryId,
        type: (partnerType || '').toUpperCase(),
        forwardType,
        onSuccess: () => setShowReturnConfirm(false)
      })
    );
  }, [data?.enquiryId, partnerType, forwardType, dispatch, t]);

  const actionItems = useMemo(
    () => [
      {
        label: 'onboarding',
        hidden: !(hasPermission(PERMISSIONS.PARTNERS.ONBOARD_PARTNER) && status.code == onboardStatusCode),
        onClick: () => navigate({ to: onboardPath, state: onboardState })
      },
      {
        label: 'preview',
        hidden: !(hasPermission(PERMISSIONS.PARTNERS.ONBOARD_PARTNER) && status.code === 'ONBOARDED'),
        onClick: () => navigate({ to: previewPath })
      },
      {
        label: 'feasibility',
        hidden: !(
          hasPermission(PERMISSIONS.PARTNERS.UPDATE_FEASIBILITY) &&
          status.code !== 'FEASIBLE' &&
          status.code !== 'NOT_FEASIBLE' &&
          status.code !== 'APPROVED' &&
          status.code !== 'ONBOARDED'
        ),
        onClick: () => setShowFeasibilityPopup(true)
      },
      {
        label: 'approve',
        hidden: !(
          hasPermission(PERMISSIONS.PARTNERS.APPROVE_PARTNER) &&
          status.code === 'FEASIBLE' &&
          status.code !== 'ONBOARDED'
        ),
        onClick: () => setShowApprovePopup(true)
      },
      {
        label: 'forwardPlus',
        hidden: !(hasPermission(PERMISSIONS.PARTNERS.PARTNER_ENQ_FORWARD_PLUS) && status.code !== 'ONBOARDED'),
        onClick: () => setShowForwardPlusPopup(true)
      },
      {
        label: 'return',
        hidden: !(
          hasPermission(PERMISSIONS.PARTNERS.PARTNER_ENQ_FORWARD_PLUS) &&
          status.code !== 'ONBOARDED' &&
          Boolean(assignedFromSeatName || assignedFromUsername)
        ),
        onClick: () => setShowReturnConfirm(true)
      }
    ],
    [
      hasPermission,
      status.code,
      onboardStatusCode,
      onboardPath,
      onboardState,
      previewPath,
      navigate,
      assignedFromSeatName,
      assignedFromUsername
    ]
  );

  const collapsedContent = (
    <HStack spacing={4} w='full'>
      {/* Left: tracking ID + title */}
      <HStack spacing={4} align='center'>
        <Text fontWeight='bold' fontSize='md' color='primary.500'>
          {t('trackingId')} : {trackingId}
        </Text>
        <Divider />
        <Text fontWeight='bold' fontSize='md' color='black'>
          {mainTitle}
        </Text>
      </HStack>

      {/* Right: track button + receivedOn + status pill */}
      <HStack spacing={4} align='center' ml='auto' flexShrink={0} onClick={(e) => e.stopPropagation()}>
        <Button
          size='sm'
          variant='plain'
          onClick={(e) => {
            e.stopPropagation();
            setShowTrackPopup(true);
          }}
          p={0}
          w='24px'
          minW='auto'
          title={t('trackEnquiry')}
        >
          <RouteMapIcon size={6} color='primary.500' />
        </Button>
        <Text fontSize='md' color='gray.500'>
          {t('receivedOn')}:{' '}
          <Text as='span' color='black'>
            {data.createdDt ? dayjs(data.createdDt).format('DD-MM-YYYY hh:mm:ss A') : '-'}
          </Text>
        </Text>
        {showOnboardPending && <StatusPill label={t('onboardPending')} dotBg='#FD1C7A' />}
        <StatusPill label={status.name} dotBg={statusDotBg} />
      </HStack>
    </HStack>
  );

  const expandedContent = (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      w='full'
      justify='space-between'
      align={{ base: 'start', md: 'start' }}
      spacing={4}
    >
      {/* Left: contact + phone + email + location */}
      <VStack align='stretch' spacing={3} flex={1}>
        {/* Contact + location */}
        <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} spacing={3}>
          <HStack spacing={1}>
            <CardUserIcon boxSize={5} color='gray.500' />
            <Text fontWeight='semibold' fontSize='md' color='gray.500'>
              {contactName}
            </Text>
          </HStack>
          <Divider />
          <HoverPopover
            trigger={
              <HStack
                spacing={1}
                cursor={latitude && longitude ? 'pointer' : 'default'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (latitude && longitude) setTimeout(() => setShowLocationMap(true), 0);
                }}
              >
                <LocationRoundedIcon boxSize={5} color={latitude && longitude ? 'primary.500' : 'gray.500'} />
                <Text fontSize='md' color={latitude && longitude ? 'primary.500' : 'gray.500'} fontWeight={600}>
                  {t('partnerLocation')}
                </Text>
              </HStack>
            }
            content={
              <VStack align='stretch' spacing={0} p={4} minW='280px'>
                {address && (
                  <Box pb={3}>
                    <Text fontSize='xs' color='gray.400' fontWeight='medium' textTransform='uppercase' mb={1}>
                      {t('address')}
                    </Text>
                    <Text fontSize='sm' fontWeight='semibold' color='secondary.800'>
                      {address}
                    </Text>
                  </Box>
                )}
                {location && (
                  <Box pb={3} borderTop={address ? '1px solid' : 'none'} borderColor='gray.100' pt={address ? 3 : 0}>
                    <Text fontSize='xs' color='gray.400' fontWeight='medium' textTransform='uppercase' mb={1}>
                      {t('location')}
                    </Text>
                    <Text fontSize='sm' fontWeight='semibold' color='secondary.800'>
                      {location}
                    </Text>
                  </Box>
                )}
                <Box borderTop='1px solid' borderColor='gray.100' pt={3}>
                  <HStack spacing={4}>
                    <Text fontSize='sm' color='gray.500'>
                      {t('latitude')}:{' '}
                      <Text as='span' fontWeight='bold' color='secondary.800'>
                        {latitude || '-'}
                      </Text>
                    </Text>
                    <Box h='14px' w='1px' bg='gray.200' />
                    <Text fontSize='sm' color='gray.500'>
                      {t('longitude')}:{' '}
                      <Text as='span' fontWeight='bold' color='secondary.800'>
                        {longitude || '-'}
                      </Text>
                    </Text>
                  </HStack>
                </Box>
              </VStack>
            }
          />
        </Stack>

        {/* Phone + email */}
        <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} spacing={3}>
          <HStack spacing={1}>
            <MobileNewIcon boxSize={5} color='gray.500' />
            <Text fontWeight='semibold' fontSize='md' color='gray.500'>
              {mobile}
              {altMobile && (
                <Text as='span' fontWeight='normal' fontSize='sm' ml={1}>
                  / {altMobile}
                </Text>
              )}
            </Text>
          </HStack>
          {landline && (
            <>
              <Divider />
              <HStack spacing={1}>
                <MobileNewIcon boxSize={5} color='gray.500' />
                <Text fontWeight='semibold' fontSize='md' color='gray.500'>
                  {landline}
                </Text>
              </HStack>
            </>
          )}
          <Divider />
          <HStack spacing={1}>
            <NewEmailIcon boxSize={5} color='gray.500' />
            <Text fontSize='md' color='gray.500' fontWeight={600}>
              {email}
            </Text>
          </HStack>
          {moreDetails && (
            <>
              <Divider />
              <HoverPopover
                trigger={
                  <Text fontSize='md' color='black' cursor='pointer' onClick={(e) => e.stopPropagation()}>
                    {t('moreDetails')}...
                  </Text>
                }
                content={
                  <VStack align='stretch' spacing={2} p={4} minW='300px'>
                    <Text fontSize='md' color='gray.600'>
                      {t('totalNoOfExistingCableTVSubscriber')} :{' '}
                      <Text as='span' fontSize='md' fontWeight='bold' color='secondary.800'>
                        {moreDetails.cableTvSubCount || '0'}
                      </Text>
                    </Text>
                    <Text fontSize='md' color='gray.600'>
                      {t('totalNoOExistingInternetSubscriber')} :{' '}
                      <Text as='span' fontSize='md' fontWeight='bold' color='secondary.800'>
                        {moreDetails.internetSubCount || '0'}
                      </Text>
                    </Text>
                    <Text fontSize='md' color='gray.600'>
                      {t('totalQuantityOfFibreAvailableinKM')} :{' '}
                      <Text as='span' fontSize='md' fontWeight='bold' color='secondary.800'>
                        {moreDetails.networkQty || '0'}
                      </Text>
                    </Text>
                  </VStack>
                }
              />
            </>
          )}
        </Stack>
      </VStack>

      {/* Right: source + assigned + status */}
      <VStack align='flex-end' spacing={2} flexShrink={0}>
        <Text fontSize='sm' color='gray.500'>
          {t('source')}:{' '}
          <Text as='span' fontWeight='bold' color='black'>
            {source}
          </Text>
        </Text>
        {(assignedFromSeatName || assignedFromUsername) && (
          <Text fontSize='md' color='gray.500'>
            {t('assignedFrom')}:{' '}
            <Text as='span' fontWeight='semibold' color='gray.700'>
              {[assignedFromSeatName, assignedFromUsername].filter(Boolean).join(' / ')}
            </Text>
          </Text>
        )}
        {(assignedToSeatName || assignedToUsername) && (
          <Text fontSize='md' color='gray.500'>
            {t('assignedTo')}:{' '}
            <Text as='span' fontWeight='semibold' color='gray.700'>
              {[assignedToSeatName, assignedToUsername].filter(Boolean).join(' / ')}
            </Text>
          </Text>
        )}
      </VStack>
    </Stack>
  );

  return (
    <ExpandableCard
      index={index}
      isExpanded={isExpanded}
      onToggle={toggleExpand}
      toggleIcon={isExpanded ? <UpArrowIcon boxSize={5} /> : <DownArrowIcon boxSize={5} />}
      collapsedContent={collapsedContent}
      expandedContent={expandedContent}
      actionMenu={
        status.code !== 'ONBOARDED' && forwardType !== 'outbox' ? (
          <TableActionMenu actionItems={actionItems} row={data} />
        ) : null
      }
      hideActionMenu={status.code === 'ONBOARDED' || forwardType === 'outbox'}
    >
      {FeasibilityPopup && (
        <Popup
          title={t('update')}
          titleMain={t('feasibility')}
          isOpen={showFeasibilityPopup}
          onClose={() => setShowFeasibilityPopup(false)}
          size='md'
        >
          <FeasibilityPopup
            data={data}
            onClose={() => setShowFeasibilityPopup(false)}
            partnerType={partnerType}
            mode='feasibility'
            isOpen={showFeasibilityPopup}
          />
        </Popup>
      )}

      {ApprovePopup && (
        <Popup
          title={t('approve')}
          titleMain={t('partner')}
          isOpen={showApprovePopup}
          onClose={() => setShowApprovePopup(false)}
          size='md'
        >
          <ApprovePopup
            data={data}
            onClose={() => setShowApprovePopup(false)}
            partnerType={partnerType}
            mode='approve'
            isOpen={showApprovePopup}
          />
        </Popup>
      )}

      {ForwardPlusPopup && (
        <Popup
          title={t('forwardPlus')}
          titleMain={t('partner')}
          isOpen={showForwardPlusPopup}
          onClose={() => setShowForwardPlusPopup(false)}
          size='md'
        >
          <ForwardPlusPopup
            data={data}
            onClose={() => setShowForwardPlusPopup(false)}
            partnerType={partnerType}
            forwardType={forwardType}
          />
        </Popup>
      )}

      <LocationViewPopup
        isOpen={showLocationMap}
        onClose={() => setShowLocationMap(false)}
        latitude={latitude}
        longitude={longitude}
        address={address}
        location={location}
        title={t('partner')}
        titleMain={t('address')}
      />

      <TrackEnquiryPopup
        isOpen={showTrackPopup}
        onClose={() => setShowTrackPopup(false)}
        defaultTrackingId={trackingId}
      />

      <ConfirmPopup
        isConfirmOpen={showReturnConfirm}
        handleClose={() => setShowReturnConfirm(false)}
        handleConfirm={handleReturnConfirm}
        title='return'
        content={
          <>
            {t('returnPartnerEnquiryConfirm')}
            <Text
              as='span'
              display='block'
              mt={2}
              fontWeight='bold'
              color='secondary.800'
              wordBreak='break-word'
            >
              {assignedFromLabel}
            </Text>
          </>
        }
      />
    </ExpandableCard>
  );
};

export default EnquiryPartnerCard;
