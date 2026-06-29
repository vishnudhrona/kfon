import { Box, Button, Flex, HStack, IconButton, Popup, Text } from '@kfonbss/bss-ui-components';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CrossCircleIcon } from '@/components/custom';
import { reverseGeocode } from '@/utils/geocodeUtils';

import { GOOGLE_MAP_KEY, MAP_DEFAULT_CENTER, MAP_ID, MAP_LOCATION_ZOOM, MAP_OVERVIEW_ZOOM } from '../constants';
import MapLogic from './MapLogic';
import MapSearchBar from './MapSearchBar';

// ─── MapPopup ─────────────────────────────────────────────────────────────────

const MapPopup = ({ isOpen, setIsOpen, handleSelect, initialLat, initialLng, title, subtitle }) => {
  const { t } = useTranslation();

  const [tempLocation, setTempLocation] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);
  // isLocating and locError live here (not in SearchBar) so handleMapReady can
  // set them too — both auto-location and My Location share these states.
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState('');

  const isOutsideKerala =
    tempLocation?.state && tempLocation.state.toLowerCase() !== 'kerala';

  const mapRef = useRef(null);
  const clearSearchInputRef = useRef(null);
  const hasAutoLocatedRef = useRef(false);
  // Stores a {lat,lng} to pan to once the map instance becomes available.
  // Needed when a prediction is selected or coordinates resolved before the
  // map has mounted and mapRef.current is still null.
  const pendingPanRef = useRef(null);
  // Incrementing this ref on every new geolocation request means any in-flight
  // callback that carries an older ID silently drops its result.  This is the
  // fix for "My Location reverts to default": when the user taps My Location, the
  // counter advances and the still-pending auto-location callback becomes stale.
  const geoRequestIdRef = useRef(0);

  const initialCenter =
    initialLat && initialLng ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) } : MAP_DEFAULT_CENTER;
  const initialZoom = initialLat && initialLng ? MAP_LOCATION_ZOOM : MAP_OVERVIEW_ZOOM;

  // Reset on open — also increments geoRequestIdRef to cancel anything still
  // in flight from the previous popup session.
  useEffect(() => {
    if (!isOpen) return;
    const requestId = ++geoRequestIdRef.current;
    pendingPanRef.current = null;
    setTempLocation(null);
    setIsLocating(false);
    setLocError('');
    hasAutoLocatedRef.current = false;

    if (initialLat && initialLng) {
      const lat = parseFloat(initialLat);
      const lng = parseFloat(initialLng);
      setMarkerPos({ lat, lng });
      reverseGeocode(lat, lng)
        .then((data) => {
          if (requestId !== geoRequestIdRef.current) return;
          setTempLocation(data);
        })
        .catch(() => {
          if (requestId !== geoRequestIdRef.current) return;
          // Coords are valid but geocode failed — still enable Confirm with bare coords
          setTempLocation({ lat, lng, fullAddress: `${lat}, ${lng}`, state: 'Kerala' });
        });
    } else {
      setMarkerPos(null);
    }
  }, [isOpen, initialLat, initialLng]);

  const popupTitle = title ?? t('selectInstallationAddress');
  const popupSubtitle = subtitle ?? t('accurateDetailsWillEnsureFasterActivation');

  /**
   * The single place where a confirmed location lands.
   * Also advances geoRequestIdRef to discard any concurrent in-flight request
   * (e.g. user selects a search prediction while My Location is still loading).
   */
  const handleLocationFound = useCallback((locationData) => {
    geoRequestIdRef.current++; // Cancel any concurrent geolocation
    setIsLocating(false);
    setLocError('');
    setMarkerPos({ lat: locationData.lat, lng: locationData.lng });
    setTempLocation(locationData);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: locationData.lat, lng: locationData.lng });
      mapRef.current.setZoom(MAP_LOCATION_ZOOM);
    } else {
      // Map not mounted yet — store so handleMapReady can drain it
      pendingPanRef.current = { lat: locationData.lat, lng: locationData.lng };
    }
  }, []); // mapRef / pendingPanRef / geoRequestIdRef are refs (stable); state setters are stable

  /**
   * Unified geolocation entry point.
   *
   * silent=true  → used by handleMapReady (no spinner, no error toast)
   * silent=false → used by the My Location button (shows spinner and errors)
   *
   * Both paths share geoRequestIdRef, so whichever resolves last is ignored
   * when a newer request has already been started.
   */
  const performGeolocation = useCallback(
    (options = {}) => {
      const { silent = false, showError = true } = options;
      const requestId = ++geoRequestIdRef.current;
      if (!silent) {
        setIsLocating(true);
        setLocError('');
      }

      const onSuccess = async (lat, lng) => {
        if (requestId !== geoRequestIdRef.current) return; // Stale — a newer request won
        try {
          const data = await reverseGeocode(lat, lng);
          if (requestId !== geoRequestIdRef.current) return; // Check again after the async geocode
          handleLocationFound(data);
          clearSearchInputRef.current?.();
        } catch {
          if (requestId !== geoRequestIdRef.current) return;
          // Always clear the spinner regardless of silent mode — otherwise it gets stuck
          // when a non-silent request fails after the silent one already resolved.
          setIsLocating(false);
          if (!silent && showError) setLocError('Could not resolve your location to an address.');
        }
      };

      const onIPFallback = async () => {
        try {
          const res = await fetch('https://ipinfo.io/json');
          const json = await res.json();
          if (!json.loc) throw new Error('No loc field');
          const [lat, lng] = json.loc.split(',').map(parseFloat);
          await onSuccess(lat, lng);
        } catch {
          if (requestId !== geoRequestIdRef.current) return;
          if (!silent) {
            setIsLocating(false);
            if (showError) setLocError('Unable to detect your location. Please search manually.');
          }
        }
      };

      if (!navigator.geolocation) {
        onIPFallback();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => onSuccess(pos.coords.latitude, pos.coords.longitude),
        onIPFallback,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    },
    [handleLocationFound]
  );

  /**
   * Fired once by MapLogic when the Map instance is ready.
   * Drains any pending pan stored before the map mounted, then silently tries
   * to centre the map on the user's location when no initial coordinates are provided.
   */
  const handleMapReady = useCallback(() => {
    // Drain a pan that was queued before the map was ready
    if (pendingPanRef.current) {
      mapRef.current?.panTo(pendingPanRef.current);
      mapRef.current?.setZoom(MAP_LOCATION_ZOOM);
      pendingPanRef.current = null;
      return; // A location was already resolved — skip auto-locate
    }
    if ((initialLat && initialLng) || hasAutoLocatedRef.current) return;
    hasAutoLocatedRef.current = true;
    performGeolocation({ silent: true });
  }, [initialLat, initialLng, performGeolocation]);

  /** Geocodes a map tap and updates the marker/tempLocation. */
  const handleMapClick = useCallback(async (lat, lng) => {
    // Cancel any in-flight geolocation (My Location or auto-location)
    geoRequestIdRef.current++;
    setIsLocating(false);
    setLocError('');
    setMarkerPos({ lat, lng }); // Immediate visual feedback
    try {
      const data = await reverseGeocode(lat, lng);
      setTempLocation(data);
    } catch {
      setTempLocation({ lat, lng, fullAddress: '' });
    }
  }, []); // geoRequestIdRef is a ref (stable); state setters are stable

  const handleConfirm = () => {
    if (isOutsideKerala) return;
    if (tempLocation) handleSelect(tempLocation);
    setIsOpen(false);
  };

  return (
    <Popup isOpen={isOpen} placement='center' onOpenChange={setIsOpen} p={0} width='1500px' maxWidth='90vw'>
      {/* ── Header ── */}
      <HStack p='20px 30px' justifyContent='space-between' borderBottom='1px solid' borderColor='border.primary'>
        <Box>
          <Text fontSize='24px' lineHeight='24px' mb='8px' p={0} color='font_color.primary' fontWeight={600}>
            {popupTitle}
          </Text>
          <Text fontSize='14px' p={0} color='font_color.secondary'>
            {popupSubtitle}
          </Text>
        </Box>
        <IconButton variant='unstyled' w='fit-content' h='fit-content' onClick={() => setIsOpen(false)}>
          <CrossCircleIcon width='24px' size='lg' />
        </IconButton>
      </HStack>

      {isOpen && (
        <APIProvider apiKey={GOOGLE_MAP_KEY} libraries={['places', 'marker']}>
          {/* ── Search + My Location (above the map, no MapControl conflicts) ── */}
          <MapSearchBar
            onLocationFound={handleLocationFound}
            isLocating={isLocating}
            locError={locError}
            onMyLocationClick={() => performGeolocation({ showError: true })}
            onCoordError={(msg) => setLocError(msg)}
            clearInputRef={clearSearchInputRef}
          />

          {/* ── Map ── */}
          <Box height='480px'>
            <Map
              mapId={MAP_ID}
              defaultCenter={initialCenter}
              defaultZoom={initialZoom}
              style={{ width: '100%', height: '100%' }}
              streetViewControl={false}
            >
              <MapLogic markerPos={markerPos} onMapClick={handleMapClick} mapRef={mapRef} onMapReady={handleMapReady} />
            </Map>
          </Box>

          {/* ── Selected location strip ── */}
          <Box
            px={4}
            py='10px'
            minH='40px'
            bg={isOutsideKerala ? 'red.50' : tempLocation?.fullAddress ? 'green.50' : 'background.secondary'}
            borderTop='1px solid'
            borderColor='border.primary'
            display='flex'
            alignItems='center'
          >
            <Text
              fontSize='13px'
              color={isOutsideKerala ? 'red.700' : tempLocation?.fullAddress ? 'green.800' : 'font_color.secondary'}
              fontWeight={tempLocation?.fullAddress ? 500 : 400}
            >
              {isOutsideKerala
                ? `⚠️ ${t('locationOutsideKerala')}`
                : tempLocation?.fullAddress
                  ? `📍 ${tempLocation.fullAddress}`
                  : t('mapPinInstruction')}
            </Text>
          </Box>

          {/* ── Footer ── */}
          <Flex p='16px 24px' justifyContent='flex-end' gap={3} borderTop='1px solid' borderColor='border.primary'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              {t('cancel')}
            </Button>
            <Button
              bg='#8B1538'
              color='white'
              _hover={{ bg: '#6D1028' }}
              onClick={handleConfirm}
              disabled={!tempLocation || isOutsideKerala}
            >
              {t('confirmLocation')}
            </Button>
          </Flex>
        </APIProvider>
      )}
    </Popup>
  );
};

export default MapPopup;
