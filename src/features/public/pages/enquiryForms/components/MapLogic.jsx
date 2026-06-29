import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';



/**
 * Renders the marker and wires up map click events.
 * Stays lean — all geolocation / search / geocoding lives in MapPopup.
 */
function MapLogic({ markerPos, onMapClick, mapRef, onMapReady }) {
  const map = useMap();

  // Expose the google.maps.Map instance to the parent so it can call panTo / setZoom.
  useEffect(() => {
    if (!map) return;
    if (mapRef) mapRef.current = map;
    onMapReady?.();
  }, [map, mapRef, onMapReady]);

  // Forward raw lat/lng on map click — parent handles geocoding.
  useEffect(() => {
    if (!map || !window.google) return;
    const listener = map.addListener('click', (e) => {
      onMapClick(e.latLng.lat(), e.latLng.lng());
    });
    return () => window.google.maps.event.removeListener(listener);
  }, [map, onMapClick]);

  return markerPos ? <AdvancedMarker position={markerPos} title='Selected location' /> : null;
}

export default MapLogic;
