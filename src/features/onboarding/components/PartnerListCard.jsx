import { Box, HStack, Icons, Stack, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PartnerCardBg from '@/assets/onboarding/PartnerCardBg.png';
import { HoverPopover, LocationViewPopup } from '@/components/custom';
import ExpandableCard from '@/components/custom/ExpandableCard';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { successToast } from '@/components/custom/Toast';
import { DATE_FORMAT } from '@/constants/date';
import { formatDisplayDate, getTimeAgoParts } from '@/utils/dateUtils';

import { DEFAULT_CATEGORY_STYLE, PARTNER_CATEGORY_STYLES } from '../constants';

const Divider = () => <Box h='20px' w='1px' bg='gray.200' display={{ base: 'none', md: 'block' }} />;

const PartnerListCard = ({ data, index, onClick, expandAll }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLocationMap, setShowLocationMap] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { MobileNewIcon, NewEmailIcon, UpArrowIcon, DownArrowIcon, ClockHistoryIcon } = Icons;

  useEffect(() => {
    setIsExpanded(expandAll);
  }, [expandAll]);

  const mainTitle = data.companyName || '-';
  const trackingId = data.partnerId || '-';
  const onboardedDateTime = formatDisplayDate(data.onboardedDate, DATE_FORMAT.DATE_TIME_SEC) || '-';
  const address = data.address || '-';
  const latitude = data.latitude;
  const longitude = data.longitude;
  const mobile = data.contactNumber || '-';
  const email = data.email || '-';
  const gstin = data.gstin ?? data.gstIn ?? '-';
  const agreementNo = data.agreementNo || '-';
  const frcReceived = data.frcReceived || '-';
  const frcPaymentDate = formatDisplayDate(data.frcPaymentDate) || '-';
  const contactPersonName = data.contactPersonName || '-';
  const linkEstablishmentStatus = data.linkEstablishmentStatus || '-';
  const feName = data.feEmployeeName
    ? (data.feUserName ? `${data.feEmployeeName} (${data.feUserName})` : data.feEmployeeName)
    : data.feUserName || '-';
  const serviceAreaNames =
    (data.serviceAreas || [])
      .map((sa) => sa.postOfficeName)
      .filter(Boolean)
      .join(', ') || '-';

  const category = data.category || null;
  const categoryStyle = (category && PARTNER_CATEGORY_STYLES[category.toUpperCase()]) || DEFAULT_CATEGORY_STYLE;
  const type = (data.partnerType || '').trim().toLowerCase();
  const routeType = type === 'agnp' ? 'agnp' : 'lnp';

  const ago = getTimeAgoParts(data.onboardedDate);
  const agoText = ago ? (ago.count ? `${ago.count} ${t(ago.unit)} ${t('ago')}` : t('justNow')) : '';

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
    if (onClick) onClick(data);
  }, [onClick, data]);

  const handleCopyId = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      if (!data.partnerId) return;
      navigator.clipboard
        .writeText(String(data.partnerId))
        .then(() => successToast({ description: t('copied') }))
        .catch((err) => console.error('Failed to copy!', err));
    },
    [data.partnerId, t]
  );

  const actionItems = useMemo(
    () => [
      {
        label: 'preview',
        onClick: () => navigate({ to: `/app/partners/list/${routeType}/${data.id}` })
      }
    ],
    [data.id, navigate, routeType]
  );

  const collapsedContent = (
    <HStack w='full' justify='space-between' align='center' spacing={4}>
      <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} spacing={3}>
        <Box
          bg='#FFEDB2'
          px={2}
          py={2}
          borderRadius='4px'
          flexShrink={0}
          cursor='pointer'
          title={t('clickToCopyId')}
          onClick={handleCopyId}
        >
          <Text fontSize='md' fontWeight='semibold' color='black' whiteSpace='nowrap'>
            {t('id')} : {trackingId}
          </Text>
        </Box>
        <Text fontWeight='bold' fontSize='md' color='black' whiteSpace='nowrap'>
          {mainTitle}
        </Text>
      </Stack>

      <HStack spacing={2} flexShrink={0} onClick={(e) => e.stopPropagation()}>
        <Text fontWeight='normal' fontSize='md' color='#232F50' whiteSpace='nowrap'>
          {t('onboardedOn')} :
        </Text>
        <Text fontWeight='semibold' fontSize='md' color='#232F50' whiteSpace='nowrap'>
          {onboardedDateTime}
        </Text>
        {agoText && (
          <HStack spacing={1} flexShrink={0}>
            <ClockHistoryIcon boxSize={5} color='primary.500' />
            <Text fontSize='md' fontWeight='bold' color='#232F50' whiteSpace='nowrap'>
              {agoText}
            </Text>
          </HStack>
        )}
        {category && (
          <Text
            fontSize='sm'
            fontWeight='medium'
            px={4}
            py={1}
            borderRadius='31px'
            bg={categoryStyle.bg}
            color={categoryStyle.color}
            textTransform='uppercase'
            whiteSpace='nowrap'
          >
            {category}
          </Text>
        )}
      </HStack>
    </HStack>
  );

  const expandedContent = (
    <VStack align='stretch' spacing={3}>
      {/* Row A: contact + mobile (left), agreement no (right) */}
      <Stack
        direction={{ base: 'column', md: 'row' }}
        w='full'
        justify='space-between'
        align={{ base: 'start', md: 'center' }}
        spacing={3}
        pl={{ base: 0, md: '36px' }}
        pr={{ base: 0, md: '46px' }}
      >
        <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} spacing={3}>
          <HStack spacing={1}>
            <Icons.UserProfileIcon boxSize={5} color='gray.500' />
            <Text fontWeight='semibold' fontSize='md' color='gray.500'>
              {contactPersonName}
            </Text>
          </HStack>
          <Divider />
          <HStack spacing={1}>
            <MobileNewIcon boxSize={5} color='gray.500' />
            <Text fontWeight='semibold' fontSize='md' color='gray.500'>
              {mobile}
            </Text>
          </HStack>
        </Stack>

        <HStack spacing={1} flexShrink={0}>
          <Text fontSize='md' color='gray.500' fontWeight='medium' whiteSpace='nowrap'>
            {t('agreementNo')} :
          </Text>
          <Text fontSize='md' color='font_color.primary' fontWeight='bold' whiteSpace='nowrap'>
            {agreementNo}
          </Text>
        </HStack>
      </Stack>

      {/* Row B: email + address + gstin (left), link establishment status (right) */}
      <Stack
        direction={{ base: 'column', md: 'row' }}
        w='full'
        justify='space-between'
        align={{ base: 'start', md: 'center' }}
        spacing={3}
        pl={{ base: 0, md: '36px' }}
        pr={{ base: 0, md: '46px' }}
      >
        <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'start', md: 'center' }} spacing={3}>
          <HStack spacing={1}>
            <NewEmailIcon boxSize={5} color='gray.500' />
            <Text fontSize='md' color='gray.500' fontWeight={600}>
              {email}
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
                <Icons.LocationRoundedIcon boxSize={5} color={latitude && longitude ? 'primary.500' : 'gray.500'} />
                <Text fontSize='md' color={latitude && longitude ? 'primary.500' : 'gray.500'} fontWeight={600}>
                  {t('address')}
                </Text>
              </HStack>
            }
            content={
              <VStack align='stretch' spacing={0} p={4} minW='280px'>
                <Text fontSize='md' fontWeight='semibold' color='secondary.800' pb={3}>
                  {address}
                </Text>
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

          <Divider />
          <HStack spacing={1}>
            <Text fontSize='md' color='gray.500' fontWeight={600}>
              {t('gstin')} :
            </Text>
            <Text fontSize='md' color='font_color.primary' fontWeight={600}>
              {gstin}
            </Text>
          </HStack>
        </Stack>

        {type === 'lnp' && (
          <HStack spacing={1} flexShrink={0}>
            <Text fontSize='md' color='gray.500' fontWeight='medium' whiteSpace='nowrap'>
              {t('linkEstablishmentStatus')} :
            </Text>
            <Text fontSize='md' color='font_color.primary' fontWeight='bold' whiteSpace='nowrap'>
              {linkEstablishmentStatus}
            </Text>
          </HStack>
        )}
      </Stack>

      {/* Footer band: FRC dates (left) + service area + more details (right) */}
      <Box mx={-4} mb={-3} mt={1} px={4} py={3} bg='white'>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          w='full'
          justify='space-between'
          align={{ base: 'start', md: 'center' }}
          spacing={3}
          pl={{ base: 0, md: '36px' }}
          pr={{ base: 0, md: '46px' }}
        >
          <Stack
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'start', md: 'center' }}
            spacing={{ base: 3, md: 6 }}
          >
            {type === 'lnp' && (
              <HStack spacing={1}>
                <Text fontSize='md' color='gray.500' fontWeight='medium' whiteSpace='nowrap'>
                  {t('frcReceivedDate')} :
                </Text>
                <Text fontSize='md' color='font_color.primary' fontWeight='bold' whiteSpace='nowrap'>
                  {frcReceived}
                </Text>
              </HStack>
            )}
            {type === 'lnp' && <Divider />}
            {type === 'lnp' && (
              <HStack spacing={1}>
                <Text fontSize='md' color='gray.500' fontWeight='medium' whiteSpace='nowrap'>
                  {t('frcPaymentDate')} :
                </Text>
                <Text fontSize='md' color='font_color.primary' fontWeight='bold' whiteSpace='nowrap'>
                  {frcPaymentDate}
                </Text>
              </HStack>
            )}
            {type === 'lnp' && <Divider />}
            <HStack spacing={1}>
              <Text fontSize='md' color='gray.500' fontWeight='medium' whiteSpace='nowrap'>
                {t('feName')} :
              </Text>
              <Text fontSize='md' color='font_color.primary' fontWeight='bold' whiteSpace='nowrap'>
                {feName}
              </Text>
            </HStack>
          </Stack>

          <HStack spacing={3} flexShrink={0}>
            <HStack spacing={1}>
              <Text fontSize='md' color='gray.500' fontWeight='medium' whiteSpace='nowrap'>
                {t('serviceArea')} :
              </Text>
              <Text fontSize='md' color='font_color.primary' fontWeight='bold'>
                {serviceAreaNames}
              </Text>
            </HStack>
            <Text
              as='button'
              type='button'
              fontSize='sm'
              color='gray.500'
              whiteSpace='nowrap'
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate({ to: `/app/partners/list/${routeType}/${data.id}` });
              }}
            >
              {t('moreDetails')}...
            </Text>
          </HStack>
        </Stack>
      </Box>
    </VStack>
  );

  return (
    <ExpandableCard
      index={index}
      isExpanded={isExpanded}
      onToggle={toggleExpand}
      toggleIcon={isExpanded ? <UpArrowIcon boxSize={5} /> : <DownArrowIcon boxSize={5} />}
      borderColor={{ collapsed: '#E1E1E1', expanded: '#FCD76E' }}
      backgroundImage={PartnerCardBg}
      backgroundSize='100% 100%'
      backgroundPosition='center'
      overlayOpacity={0}
      watermarkFullCard
      expandedBg='transparent'
      centerSideItemsOnExpand
      collapsedContent={collapsedContent}
      expandedContent={expandedContent}
      actionMenu={<TableActionMenu actionItems={actionItems} row={data} />}
    >
      <LocationViewPopup
        isOpen={showLocationMap}
        onClose={() => setShowLocationMap(false)}
        latitude={latitude}
        longitude={longitude}
        address={address}
        title={t('partner')}
        titleMain={t('location')}
      />
    </ExpandableCard>
  );
};

export default PartnerListCard;
