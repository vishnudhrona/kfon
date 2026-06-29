import { Box, Popup, Text } from '@kfonbss/bss-ui-components';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';
import { useTranslation } from 'react-i18next';

const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const MAP_ID = '1121b9d6278db46adcf1b443';
const DEFAULT_CENTER = { lat: 10.8505, lng: 76.2711 };

const LocationViewPopup = ({ isOpen, onClose, latitude, longitude, address, location, title, titleMain }) => {
  const { t } = useTranslation();

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const hasCoords = isFinite(lat) && isFinite(lng);
  const center = hasCoords ? { lat, lng } : DEFAULT_CENTER;

  return (
    <Popup
      isOpen={isOpen}
      placement='center'
      onOpenChange={(open) => { if (!open) onClose(); }}
      title={title || t('location')}
      titleMain={titleMain}
      size='xl'
      closeButton
      closeOnInteractOutside={false}
    >
      {isOpen && (
        <Box p='4'>
          <APIProvider apiKey={GOOGLE_MAP_KEY} libraries={['marker']}>
            {(address || location) && (
              <Box mb={3} display='flex' flexDirection='column' gap={3}>
                {address && (
                  <Box>
                    <Text fontSize='xs' color='gray.400' fontWeight='medium' textTransform='uppercase' mb={1}>
                      {t('address')}
                    </Text>
                    <Text fontSize='sm' fontWeight='semibold'>
                      {address}
                    </Text>
                  </Box>
                )}
                {location && (
                  <Box borderTop={address ? '1px solid' : 'none'} borderColor='gray.100' pt={address ? 3 : 0}>
                    <Text fontSize='xs' color='gray.400' fontWeight='medium' textTransform='uppercase' mb={1}>
                      {t('location')}
                    </Text>
                    <Text fontSize='sm' fontWeight='semibold'>
                      {location}
                    </Text>
                  </Box>
                )}
              </Box>
            )}
            <Box height='460px'>
              <Map
                mapId={MAP_ID}
                defaultCenter={center}
                defaultZoom={hasCoords ? 15 : 8}
                style={{ width: '100%', height: '100%' }}
                streetViewControl={false}
                gestureHandling='cooperative'
              >
                {hasCoords && <AdvancedMarker position={{ lat, lng }} />}
              </Map>
            </Box>
          </APIProvider>
        </Box>
      )}
    </Popup>
  );
};

export default LocationViewPopup;
