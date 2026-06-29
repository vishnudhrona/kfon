import { Box, Button, Flex, HStack, Icons, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import { Component, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { checkFeasibility } from '../../actions';
import { getFeasibilityData, getFeasibilityLoading } from '../../selectors';

const { BsXCircle, BsArrowRightCircle } = Icons;

class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <Box height='100%' display='flex' alignItems='center' justifyContent='center' bg='gray.50' borderRadius='md'>
          <Text fontSize='sm' color='gray.400'>{this.props.fallback}</Text>
        </Box>
      );
    }
    return this.props.children;
  }
}

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const MAP_ID = '1121b9d6278db46adcf1b443';
const DEFAULT_CENTER = { lat: 10.8505, lng: 76.2711 };

const SectionHeader = ({ children }) => (
  <Box bg='gray.50' borderBottom='1px solid' borderColor='gray.200' px={4} py={2}>
    <Text fontWeight='semibold' fontSize='sm' color='secondary.800'>
      {children}
    </Text>
  </Box>
);

const InfoRow = ({ label, value }) => (
  <HStack w='full' borderBottom='1px solid' borderColor='gray.100' px={4} py={2} spacing={4} align='start'>
    <Text fontSize='sm' fontWeight='medium' color='gray.600' minW='160px' flexShrink={0}>
      {label}:
    </Text>
    <Text fontSize='sm' fontWeight='semibold' color='secondary.800'>
      {value ?? '-'}
    </Text>
  </HStack>
);

const InfoTable = ({ children }) => (
  <Box border='1px solid' borderColor='gray.200' borderRadius='md' overflow='hidden' mb={4}>
    <VStack align='stretch' spacing={0}>
      {children}
    </VStack>
  </Box>
);

const TwoColGrid = ({ left, right }) => (
  <Flex gap={4}>
    <Box flex={1}>{left}</Box>
    <Box flex={1}>{right}</Box>
  </Flex>
);

const CheckFeasibility = ({ open, setOpen, enquiryId, latitude, longitude, address, onConfirm }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const feasibilityData = useSelector(getFeasibilityData);
  const isLoading = useSelector(getFeasibilityLoading);

  useEffect(() => {
    if (open && enquiryId) {
      dispatch(checkFeasibility({ enquiryId, latitude, longitude }));
    }
  }, [open, enquiryId, latitude, longitude, dispatch]);

  const handleClose = () => setOpen(false);

  const handleConfirm = () => {
    if (onConfirm) onConfirm(feasibilityData);
    handleClose();
  };

  const lat = parseFloat(feasibilityData?.selectedLocation?.latitude ?? latitude);
  const lng = parseFloat(feasibilityData?.selectedLocation?.longitude ?? longitude);
  const hasCoords = isFinite(lat) && isFinite(lng);
  const center = hasCoords ? { lat, lng } : DEFAULT_CENTER;

  const box = feasibilityData?.nearestStreetbox;
  const partner = feasibilityData?.nearestPartner;
  const sub = feasibilityData?.nearestSubscriber;

  return (
    <Popup
      title={t('check')}
      titleMain={t('feasibility')}
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
      size='xl'
      height='80vh'
      closeOnInteractOutside={false}
    >
      <Flex direction='column' h='calc(80vh - 80px)'>
        {/* Scrollable content */}
        <Box flex={1} overflowY='auto' px={4} pt={2}>
          {/* Map */}
          <Box mb={4} height='280px' borderRadius='md' overflow='hidden'>
            {open && (
              <MapErrorBoundary fallback={t('mapUnavailable')}>
              <APIProvider apiKey={GOOGLE_MAP_KEY} libraries={['marker']}>
                <Map
                  mapId={MAP_ID}
                  defaultCenter={center}
                  defaultZoom={hasCoords ? 14 : 8}
                  style={{ width: '100%', height: '100%' }}
                  streetViewControl={false}
                  gestureHandling='cooperative'
                  options={{
                    styles: [
                      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                      { featureType: 'transit', stylers: [{ visibility: 'off' }] }
                    ]
                  }}
                >
                  {hasCoords && (
                    <AdvancedMarker position={{ lat, lng }} title={t('selectedLocationDetails')}>
                      <Pin background={'#EA4335'} glyphColor={'#FFF'} borderColor={'#C5221F'} />
                    </AdvancedMarker>
                  )}
                  {box?.latitude && box?.longitude && (
                    <AdvancedMarker
                      position={{ lat: parseFloat(box.latitude), lng: parseFloat(box.longitude) }}
                      title={t('nearestBoxDetails')}
                    >
                      <Pin background={'#34A853'} glyphColor={'#FFF'} borderColor={'#188038'} />
                    </AdvancedMarker>
                  )}
                  {partner?.latitude && partner?.longitude && (
                    <AdvancedMarker
                      position={{ lat: parseFloat(partner.latitude), lng: parseFloat(partner.longitude) }}
                      title={t('partnerDetails')}
                    >
                      <Pin background={'#4285F4'} glyphColor={'#FFF'} borderColor={'#1155CC'} />
                    </AdvancedMarker>
                  )}
                  {sub?.latitude && sub?.longitude && (
                    <AdvancedMarker
                      position={{ lat: parseFloat(sub.latitude), lng: parseFloat(sub.longitude) }}
                      title={t('subPartnerDetails')}
                    >
                      <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#E37400'} />
                    </AdvancedMarker>
                  )}
                </Map>
              </APIProvider>
              </MapErrorBoundary>
            )}
          </Box>

          {/* Map Legend */}
          <HStack spacing={4} mb={4} px={2} flexWrap='wrap'>
            {hasCoords && (
              <HStack spacing={2}>
                <Box w={3} h={3} borderRadius='full' bg='#EA4335' />
                <Text fontSize='xs' color='gray.600'>
                  {t('selectedLocationDetails')}
                </Text>
              </HStack>
            )}
            {box?.latitude && box?.longitude && (
              <HStack spacing={2}>
                <Box w={3} h={3} borderRadius='full' bg='#34A853' />
                <Text fontSize='xs' color='gray.600'>
                  {t('nearestBoxDetails')}
                </Text>
              </HStack>
            )}
            {partner?.latitude && partner?.longitude && (
              <HStack spacing={2}>
                <Box w={3} h={3} borderRadius='full' bg='#4285F4' />
                <Text fontSize='xs' color='gray.600'>
                  {t('partnerDetails')}
                </Text>
              </HStack>
            )}
            {sub?.latitude && sub?.longitude && (
              <HStack spacing={2}>
                <Box w={3} h={3} borderRadius='full' bg='#FBBC04' />
                <Text fontSize='xs' color='gray.600'>
                  {t('subPartnerDetails')}
                </Text>
              </HStack>
            )}
          </HStack>

          {isLoading ? (
            <Box textAlign='center' py={8}>
              <Text color='gray.400'>{t('loading')}</Text>
            </Box>
          ) : feasibilityData ? (
            <>
              <TwoColGrid
                left={
                  <InfoTable>
                    <SectionHeader>{t('selectedLocationDetails')}</SectionHeader>
                    <InfoRow label={t('address')} value={address} />
                  </InfoTable>
                }
                right={
                  <InfoTable>
                    <SectionHeader>{t('nearestBoxDetails')}</SectionHeader>
                    <InfoRow label={t('boxName')} value={box?.equipmentName} />
                    <InfoRow label={t('boxPop')} value={box?.popName} />
                  </InfoTable>
                }
              />

              <TwoColGrid
                left={
                  <InfoTable>
                    <SectionHeader>{t('partnerDetails')}</SectionHeader>
                    <InfoRow label={t('partnerUsername')} value={partner?.username} />
                    <InfoRow label={t('partnerName')} value={partner?.companyName} />
                    <InfoRow label={t('partnerMobile')} value={partner?.keyContactNumber} />
                  </InfoTable>
                }
                right={
                  <InfoTable>
                    <SectionHeader>{t('subPartnerDetails')}</SectionHeader>
                    <InfoRow label={t('subPartnerId')} value={sub?.subscriberId} />
                    <InfoRow
                      label={t('subPartnerName')}
                      value={sub ? `${sub.firstName || ''} ${sub.lastName || ''}`.trim() : null}
                    />
                    <InfoRow label={t('subPartnerMobile')} value={sub?.mobileNo} />
                  </InfoTable>
                }
              />
            </>
          ) : null}
        </Box>

        {/* TODO: Need to check whether footer buttons needed or not */}
        <Flex
          w='full'
          justify='flex-end'
          gap={3}
          px={4}
          py={4}
          borderTop='1px solid'
          borderColor='gray.200'
          bg='white'
          flexShrink={0}
        >
          <Button
            variant='outline'
            colorScheme='pink'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
            onClick={handleClose}
          >
            <BsXCircle style={{ marginRight: '6px', width: '24px', height: '24px' }} />
            {t('cancel')}
          </Button>
          <Button
            variant='solid'
            px='18px'
            borderRadius='48px'
            fontSize='16px'
            fontWeight='400'
            onClick={handleConfirm}
            disabled={isLoading || !feasibilityData}
          >
            {t('done')}
            <BsArrowRightCircle style={{ marginLeft: '6px', width: '24px', height: '24px' }} />
          </Button>
        </Flex>
      </Flex>
    </Popup>
  );
};

export default CheckFeasibility;
