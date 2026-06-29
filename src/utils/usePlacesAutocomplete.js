import { useState } from 'react';

export default function usePlacesAutocomplete() {
  const [predictions, setPredictions] = useState([]);

  const searchLegacy = (query) => {
    const AutocompleteService = window.google?.maps?.places?.AutocompleteService;
    if (!AutocompleteService) {
      setPredictions([]);
      return;
    }
    const service = new AutocompleteService();
    service.getPlacePredictions(
      { input: query, componentRestrictions: { country: 'in' } },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(
            results.map((p) => ({
              place_id: p.place_id,
              description: p.description,
              structured_formatting: {
                main_text: p.structured_formatting?.main_text ?? '',
                secondary_text: p.structured_formatting?.secondary_text ?? ''
              }
            }))
          );
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const search = async (query) => {
    if (!query) {
      setPredictions([]);
      return;
    }

    const AutocompleteSuggestion = window.google?.maps?.places?.AutocompleteSuggestion;
    if (!AutocompleteSuggestion) {
      searchLegacy(query);
      return;
    }

    try {
      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input: query,
        includedRegionCodes: ['in']
      });

      setPredictions(
        suggestions
          .filter((s) => s.placePrediction)
          .map((s) => ({
            place_id: s.placePrediction.placeId,
            description: s.placePrediction.text?.text ?? '',
            structured_formatting: {
              main_text: s.placePrediction.mainText?.text ?? '',
              secondary_text: s.placePrediction.secondaryText?.text ?? ''
            }
          }))
      );
    } catch {
      searchLegacy(query);
    }
  };

  return { predictions, search, setPredictions };
}
