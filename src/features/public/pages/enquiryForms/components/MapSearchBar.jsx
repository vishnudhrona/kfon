import { Box, Button, HStack, Input, Text } from '@kfonbss/bss-ui-components';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { parseComponents, reverseGeocode } from '@/utils/geocodeUtils';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';

/** Matches "lat,lng" with optional whitespace — e.g. "8.520898, 76.944898" */
const COORD_RE = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

/**
 * Search input + My Location button.
 * Uses usePlacesAutocomplete hook and UI components with theme tokens.
 */
const MapSearchBar = ({ onLocationFound, isLocating, locError, onMyLocationClick, onCoordError, clearInputRef }) => {
  const { t } = useTranslation();
  const { predictions, search, setPredictions } = usePlacesAutocomplete();
  const [inputValue, setInputValue] = useState('');
  const [coordLoading, setCoordLoading] = useState(false);

  if (clearInputRef) clearInputRef.current = () => { setInputValue(''); setPredictions([]); };

  const handleInput = (e) => {
    const val = e.target.value;
    setInputValue(val);
    // If the user typed a coordinate pair, skip autocomplete entirely
    if (COORD_RE.test(val)) {
      setPredictions([]);
      return;
    }
    search(val);
  };

  const handleKeyDown = useCallback(
    async (e) => {
      if (e.key !== 'Enter') return;
      const match = COORD_RE.exec(inputValue);
      if (!match) return;
      e.preventDefault();
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        onCoordError?.(t('invalidCoordinates'));
        return;
      }
      setCoordLoading(true);
      try {
        const data = await reverseGeocode(lat, lng);
        onLocationFound(data);
        setInputValue(data.fullAddress || `${lat}, ${lng}`);
      } catch {
        onCoordError?.(t('coordinateNotFound'));
      } finally {
        setCoordLoading(false);
      }
    },
    [inputValue, onLocationFound, onCoordError, t]
  );

  const selectPrediction = useCallback(
    async (p) => {
      setPredictions([]);
      setInputValue(p.description);
      try {
        const geocoder = new window.google.maps.Geocoder();
        const { results } = await geocoder.geocode({ placeId: p.place_id });
        if (!results?.length) return;
        const r = results[0];
        onLocationFound({
          lat: r.geometry.location.lat(),
          lng: r.geometry.location.lng(),
          fullAddress: r.formatted_address,
          ...parseComponents(r.address_components)
        });
      } catch (err) {
        console.error('Place geocode error:', err);
      }
    },
    [onLocationFound, setPredictions]
  );

  return (
    <Box px={4} py={3} borderBottom='1px solid' borderColor='border.primary' bg='white'>
      <HStack gap={3} alignItems='center'>
        {/* Search input */}
        <Box position='relative' flex={1}>
          <Input
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={t('searchAreaStreetLandmark')}
            disabled={coordLoading}
            w='100%'
          />

          {predictions.length > 0 && (
            <Box
              position='absolute'
              top='calc(100% + 4px)'
              left={0}
              right={0}
              bg='white'
              borderRadius='8px'
              boxShadow='0 8px 24px rgba(0,0,0,0.15)'
              border='1px solid'
              borderColor='border.primary'
              zIndex={10000}
              maxH='220px'
              overflowY='auto'
            >
              {predictions.map((p, i) => (
                <Box
                  key={p.place_id}
                  px={4}
                  py='10px'
                  cursor='pointer'
                  borderBottom={i < predictions.length - 1 ? '1px solid #F2F2F2' : 'none'}
                  fontSize='14px'
                  color='font_color.primary'
                  _hover={{ bg: 'background.secondary' }}
                  onClick={() => selectPrediction(p)}
                >
                  {p.description}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* My Location button */}
        <Button
          onClick={onMyLocationClick}
          isDisabled={isLocating || coordLoading}
          variant='solid'
          bg={isLocating || coordLoading ? 'gray.400' : 'primary.500'}
          color='white'
          _hover={{ bg: isLocating || coordLoading ? 'gray.400' : 'primary.600' }}
          _active={{ bg: 'primary.700' }}
          flexShrink={0}
          whiteSpace='nowrap'
        >
          {coordLoading ? t('locating') : isLocating ? t('locating') : t('myLocation')}
        </Button>
      </HStack>

      {locError && (
        <Text fontSize='12px' color='error.500' mt={2}>
          {locError}
        </Text>
      )}
    </Box>
  );
};

export default MapSearchBar;
