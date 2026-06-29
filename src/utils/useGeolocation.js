import { useCallback, useRef, useState } from 'react';

import { errorToast } from '@/components/custom/Toast';

import { reverseGeocode } from './geocodeUtils';

/**
 * Handles geolocation with race-condition protection via a monotonic request ID.
 *
 * Every call to `performGeolocation` stamps a new `requestId`. Any in-flight
 * callback from a previous call carries a stale ID and silently drops its result.
 * Call `cancelPending()` from outside (e.g. on map click) to achieve the same effect.
 *
 * @param {(locationData: object) => void} onSuccess - Called with full location data on success.
 */
export default function useGeolocation(onSuccess) {
  const requestIdRef = useRef(0);
  const [isLocating, setIsLocating] = useState(false);

  /** Discards any pending geolocation callback and clears the loading state. */
  const cancelPending = useCallback(() => {
    requestIdRef.current++;
    setIsLocating(false);
  }, []);

  /**
   * @param {{ silent?: boolean }} options
   *   silent=true  → no spinner, no error toast (used for auto-locate on open)
   *   silent=false → shows spinner and error toast (used for My Location button)
   */
  const performGeolocation = useCallback(
    (options = {}) => {
      const { silent = false } = options;
      const requestId = ++requestIdRef.current;
      if (!silent) setIsLocating(true);

      const succeed = async (lat, lng) => {
        if (requestId !== requestIdRef.current) return;
        try {
          const data = await reverseGeocode(lat, lng);
          if (requestId !== requestIdRef.current) return;
          if (!silent) setIsLocating(false);
          onSuccess(data);
        } catch {
          if (requestId !== requestIdRef.current) return;
          if (!silent) {
            setIsLocating(false);
            errorToast({ description: 'Could not resolve your location to an address.' });
          }
        }
      };

      const ipFallback = async () => {
        try {
          const res = await fetch('https://ipinfo.io/json');
          const json = await res.json();
          if (!json.loc) throw new Error('No loc field');
          const [lat, lng] = json.loc.split(',').map(parseFloat);
          await succeed(lat, lng);
        } catch {
          if (requestId !== requestIdRef.current) return;
          if (!silent) {
            setIsLocating(false);
            errorToast({ description: 'Unable to detect your location. Please search manually.' });
          }
        }
      };

      if (!navigator.geolocation) {
        ipFallback();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => succeed(pos.coords.latitude, pos.coords.longitude),
        ipFallback,
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
      );
    },
    [onSuccess]
  );

  return { isLocating, performGeolocation, cancelPending };
}
