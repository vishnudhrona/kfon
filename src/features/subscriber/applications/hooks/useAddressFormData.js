import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { LOCATION_TYPES } from '@/constants/common';
import { getAadhaarOtpDetails } from '@/features/common/selectors';

import { getAddressDetails, getPrepopulatedData } from '../selectors';

/**
 * Custom hook to handle address form data initialization
 * Uses callback-based approach to avoid unnecessary re-renders
 * Manages form pre-population from either:
 * - Installation address: copies from permanent address when "same as permanent" is checked
 * - New address: pre-fills from Aadhaar data
 *
 * @param {Object} params
 * @param {boolean} params.isInstallation - Whether this is an installation address form
 * @param {boolean} params.isSameAsPermanent - Whether to copy from permanent address
 * @param {Function} params.setValue - React Hook Form setValue function
 * @returns {Object} Aadhaar details for reference
 */
export const useAddressFormData = ({ isInstallation, isSameAsPermanent, setValue }) => {
  const aadhaarDetailsRedux = useSelector(getAadhaarOtpDetails);
  const addressDetails = useSelector(getAddressDetails);
  const prepopulatedData = useSelector(getPrepopulatedData);
  const isInitialized = useRef(false);
  const prepopulatedAddressApplied = useRef(false);

  const aadhaarDetails = aadhaarDetailsRedux?.data || aadhaarDetailsRedux;

  // Memoized function to populate installation address from permanent address
  const populateFromPermanentAddress = useCallback(
    (detailsData) => {
      // Use details.data if it exists (API response wrapper), otherwise try details directly
      // Fallback to empty object to prevent errors
      const details = detailsData?.data || detailsData || {};

      // Basic address fields
      setValue('apartment', details.doorNo || '');
      setValue('street', details.streetName || '');
      setValue('city', details.city || '');

      // Pincode - store as plain 6-digit string
      if (details.pincode) {
        const pin = typeof details.pincode === 'object' ? details.pincode.pincode : details.pincode;
        setValue('pincode', pin || '');
      }

      // Post Office
      if (details.postOfficeName || details.postOfficeId) {
        setValue('post', {
          id: details.postOfficeId,
          name: details.postOfficeName,
          label: details.postOfficeName
        });
      }

      // District
      if (details.districtId && details.districtName) {
        setValue('district', { id: details.districtId, name: details.districtName });
      }

      // Location Type
      if (details.locationType) {
        setValue('locationType', details.locationType);
      }

      // Defer location-dependent fields so they run after useAddressApiEffects
      // clears them in response to the locationType change above
      setTimeout(() => {
        if (details.locationType === LOCATION_TYPES.URBAN) {
          if (details.localBodyTypeId && details.localBodyTypeName) {
            setValue('localBodyType', {
              id: details.localBodyTypeId,
              name: details.localBodyTypeName,
              villageTypeId: details.localBodyTypeId
            });
          }
          if (details.corporationMunicipalityId && details.corporationMunicipalityName) {
            setValue('corporation', {
              id: details.corporationMunicipalityId,
              name: details.corporationMunicipalityName
            });
          }
        } else if (details.locationType === LOCATION_TYPES.RURAL) {
          if (details.panchayatId && details.panchayatName) {
            setValue('panchayatName', {
              id: details.panchayatId,
              name: details.panchayatName
            });
          }
          if (details.blockId && details.blockName) {
            setValue('blockName', {
              id: details.blockId,
              name: details.blockName
            });
          }
        }
      }, 0);
    },
    [setValue]
  );

  // Memoized function to populate from Aadhaar data
  const populateFromAadhaar = useCallback(
    (details) => {
      setValue('apartment', details.address?.house || '');
      setValue('street', details.address?.street || '');
      setValue('city', details.address?.vtc || '');
      setValue('pincode', details.zip || '');
    },
    [setValue]
  );

  // Helper function to populate from prepopulatedData (existing CAF)
  const populateFromPrepopulatedData = useCallback(
    (data) => {
      const address = isInstallation ? data?.installationAddress : data?.permanentAddress;
      if (!address) return;

      setValue('apartment', address.doorNo || '');
      setValue('street', address.streetName || '');
      setValue('city', address.city || '');

      if (address.pincode) {
        setValue('pincode', address.pincode || '');
      }

      if (address.postOfficeName) {
        setValue('post', {
          id: address.postOfficeId,
          name: address.postOfficeName,
          label: address.postOfficeName
        });
      }

      if (address.districtId && address.districtName) {
        setValue('district', { id: address.districtId, name: address.districtName });
      }

      if (address.locationType) {
        setValue('locationType', address.addressType || address.locationType);
      }

      // Defer location-dependent fields so they run after useAddressApiEffects
      // clears them in response to the locationType change above
      setTimeout(() => {
        if (address.localBodyTypeId) {
          setValue('localBodyType', {
            id: address.localBodyTypeId,
            name: address.localBodyTypeName || '',
            villageTypeId: address.localBodyTypeId
          });
        }

        if (address.panchayatId) {
          setValue('panchayatName', {
            id: address.panchayatId,
            name: address.panchayatName || ''
          });
        }

        if (address.blockId) {
          setValue('blockName', {
            id: address.blockId,
            name: address.blockName || ''
          });
        }

        if (address.corporationMunicipalityId) {
          setValue('corporation', {
            id: address.corporationMunicipalityId,
            name: address.corporationMunicipalityName || ''
          });
        }
      }, 0);
    },
    [isInstallation, setValue]
  );

  // Single effect to handle all form initialization
  useEffect(() => {
    const relevantAddress = isInstallation ? prepopulatedData?.installationAddress : prepopulatedData?.permanentAddress;
    // 1. For installation address with "same as permanent" checked — takes priority over prepopulated data
    if (isInstallation && isSameAsPermanent && (addressDetails || prepopulatedData?.permanentAddress)) {
      populateFromPermanentAddress(addressDetails || prepopulatedData.permanentAddress);
    }
    // 2. If prepopulatedData has the relevant address, populate once
    else if (relevantAddress && !prepopulatedAddressApplied.current) {
      populateFromPrepopulatedData(prepopulatedData);
      prepopulatedAddressApplied.current = true;
      isInitialized.current = true;
    }
    // 3. For new permanent address with no saved data, populate from Aadhaar only once
    else if (!isInstallation && aadhaarDetails && !isInitialized.current && !relevantAddress) {
      populateFromAadhaar(aadhaarDetails);
      isInitialized.current = true;
    }
  }, [
    isInstallation,
    isSameAsPermanent,
    addressDetails,
    aadhaarDetails,
    prepopulatedData,
    populateFromPermanentAddress,
    populateFromAadhaar,
    populateFromPrepopulatedData
  ]);

  return { aadhaarDetails };
};
