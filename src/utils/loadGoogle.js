let googleLoaded = false;

export function loadGoogleMaps(apiKey) {
  if (googleLoaded) return;

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
  script.async = true;
  script.defer = true;

  document.head.appendChild(script);

  googleLoaded = true;
}
