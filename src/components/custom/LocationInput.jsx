import { Box, Button, Input, InputGroup, Label } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { NavigationIcon } from '@/components/custom';
import MapPopup from '@/features/public/pages/enquiryForms/components/MapPopup';
import { geocodePlaceAndValidate, matchesSelectedCircle } from '@/utils/geocodeUtils';

/** Matches "lat, lng" typed directly in the location text field */
const COORD_RE = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

const parseCoords = (str) => {
  const m = COORD_RE.exec(str || '');
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
};

const LocationInput = ({
  name,
  label,
  value,
  error,
  required,
  placeholder,
  predictions = [],
  onChange,
  onPredictionClick,
  onSelect,
  onClearPredictions,
  initialLat,
  initialLng,
  mapTitle,
  hideMapAddon = false,
  setError,
  clearErrors,
  errorField
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const containerRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!predictions.length) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClearPredictions?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [predictions.length, onClearPredictions]);

  // When the text field contains a raw "lat, lng" pair, use those as the map
  // starting position instead of the (cleared) form lat/lng fields.
  const coordsFromValue = parseCoords(value);
  const mapInitialLat = coordsFromValue ? String(coordsFromValue.lat) : initialLat;
  const mapInitialLng = coordsFromValue ? String(coordsFromValue.lng) : initialLng;

  const setKeralaError = () =>
    setError?.(errorField ?? name, { type: 'manual', message: t('locationOutsideKerala') });

  const clearKeralaError = () => clearErrors?.(errorField ?? name);

  const setUnconfirmedLocationError = () =>
    setError?.(errorField ?? name, { type: 'manual', message: t('locationNotConfirmed') });

  const handlePredictionClick = async (item) => {
    clearKeralaError();
    if (!window.google) {
      onPredictionClick(item);
      return;
    }
    try {
      const loc = await geocodePlaceAndValidate(item.place_id);
      onClearPredictions?.();
      onSelect(loc);
    } catch (err) {
      if (err?.outsideCircle) {
        setKeralaError();
        onClearPredictions?.();
      } else {
        onPredictionClick(item);
      }
    }
  };

  const handleSelect = (loc) => {
    if (!matchesSelectedCircle(loc.state)) {
      setKeralaError();
      return;
    }
    clearKeralaError();
    onClearPredictions?.();
    onSelect(loc);
  };

  return (
    <Box w='100%' position='relative' ref={containerRef}>
      <Label name={name} label={label} required={required} error={error} />
      <InputGroup
        borderRadius='6px'
        border='1px solid'
        borderColor={error ? 'toast.error' : 'border.primary'}
        endAddon={
          hideMapAddon ? undefined : (
            <Button variant='unstyled' onClick={() => setPopupOpen(true)} aria-label={label}>
              {t('selectOnMap')}
              <NavigationIcon />
            </Button>
          )
        }
      >
        <Input
          id={name}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          border={0}
          autoComplete='off'
          _placeholder={{ color: error ? 'font_color.errorPlaceholder' : 'font_color.placeholder' }}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          onChange={(e) => {
            clearKeralaError();
            onChange(e);
          }}
          onBlur={() => {
            if (value && (!initialLat || !initialLng)) {
              setUnconfirmedLocationError();
            }
          }}
        />
      </InputGroup>
      {predictions.length > 0 && (
        <Box
          position='absolute'
          top='100%'
          left='0'
          right='0'
          mt='6px'
          bg='white'
          boxShadow='0px 4px 12px rgba(0,0,0,0.15)'
          borderRadius='8px'
          zIndex='10'
          maxH='300px'
          overflowY='auto'
          role='listbox'
          aria-label={label}
        >
          {predictions.map((item, index) => (
            <Box
              key={index}
              p='12px 16px'
              cursor='pointer'
              _hover={{ bg: 'gray.50' }}
              borderBottom={index < predictions.length - 1 ? '1px solid #E6E6E6' : 'none'}
              role='option'
              aria-selected={false}
              onMouseDown={(e) => {
                e.preventDefault();
                handlePredictionClick(item);
              }}
            >
              <Box fontSize='14px' fontWeight='500' color='gray.800'>
                {item.structured_formatting.main_text}
              </Box>
              <Box fontSize='12px' color='gray.600' mt='4px'>
                {item.structured_formatting.secondary_text}
              </Box>
            </Box>
          ))}
        </Box>
      )}
      {error && (
        <Box id={`${name}-error`} color='toast.error' fontSize='12px' mt='4px' textAlign='right'>
          {error}
        </Box>
      )}
      {!hideMapAddon && (
        <MapPopup
          isOpen={popupOpen}
          setIsOpen={setPopupOpen}
          handleSelect={handleSelect}
          title={mapTitle}
          initialLat={mapInitialLat}
          initialLng={mapInitialLng}
        />
      )}
    </Box>
  );
};

export default LocationInput;
