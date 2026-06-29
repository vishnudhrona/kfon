import { STORAGE_KEYS } from '@/constants';

import { getDataFromStorage } from './encryptionUtils';

/** Extracts structured address components from a Google Geocoder result. */
export const parseComponents = (components) => {
  const get = (type) => components.find((c) => c.types.includes(type))?.long_name || '';

  return {
    streetNumber: get('street_number'),
    streetName: get('route'),
    state: get('administrative_area_level_1'),
    city: get('locality') || get('sublocality') || get('sublocality_level_1') || get('administrative_area_level_2'),
    location: get('sublocality_level_2') || get('sublocality_level_1') || get('locality'),
    postOffice: get('postal_code') || '',
    postalCode: get('postal_code') || ''
  };
};

/** Returns true if the given state string is Kerala (case-insensitive). */
export const isKerala = (state) => !!state && state.toLowerCase() === 'kerala';

/** Name of the circle/state the user selected (at login or on an enquiry form). */
export const getSelectedCircleName = () => {
  try {
    const tenant = getDataFromStorage(STORAGE_KEYS.SELECTED_TENANT, true, null);
    return tenant?.name || tenant?.stateName || '';
  } catch {
    return '';
  }
};

/**
 * True if the geocoded state matches the selected circle (case-insensitive).
 * When no circle is selected we don't block — the `circle` field is validated
 * separately, so this only guards the geo match once a circle exists.
 */
export const matchesSelectedCircle = (state) => {
  const circle = getSelectedCircleName();
  if (!circle) return true;
  return !!state && state.toLowerCase() === circle.toLowerCase();
};

/**
 * Geocodes a Google place prediction and validates it is within the selected
 * circle. Resolves with the full location object on success.
 * Rejects with { outsideCircle: true } when the place is outside the circle.
 * Requires Google Maps to be loaded.
 */
export const geocodePlaceAndValidate = (placeId) =>
  new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ placeId }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) {
        reject(new Error(`Geocode failed: ${status}`));
        return;
      }
      const result = results[0];
      const loc = result.geometry.location;
      const parsed = parseComponents(result.address_components);
      if (!matchesSelectedCircle(parsed.state)) {
        reject({ outsideCircle: true });
        return;
      }
      resolve({
        lat: loc.lat(),
        lng: loc.lng(),
        fullAddress: result.formatted_address,
        ...parsed
      });
    });
  });

/**
 * Reverse-geocodes a lat/lng to a full location data object.
 * Requires Google Maps to be loaded (called inside <APIProvider>).
 */
export const reverseGeocode = (lat, lng) =>
  new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        resolve({
          lat,
          lng,
          fullAddress: results[0].formatted_address,
          ...parseComponents(results[0].address_components)
        });
      } else {
        reject(new Error(`Geocode failed: ${status}`));
      }
    });
  });
