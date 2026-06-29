import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LOCATION_TYPES } from '@/constants/common';

import { updateAddressDetails } from '../actions';
import { getPermanentAddressDetails, getPrepopulatedData } from '../selectors';

/**
 * Custom hook to handle address form submission
 * Builds the payload from form data and dispatches the update action
 *
 * @param {boolean} isInstallation - Whether this is an installation address form
 * @param {Function} clearFormStorage - Optional callback to clear form data from localStorage
 * @param {Function} onSuccess - Callback when submit is successful
 * @returns {Function} Submit handler function
 */
const ADDRESS_COMPARE_FIELDS = ['pincode', 'doorNo', 'streetName', 'city'];

const isDifferentFromPermanent = (installationData, permanentAddress) => {
  if (!permanentAddress) return true;
  const perm = permanentAddress?.data || permanentAddress;
  return ADDRESS_COMPARE_FIELDS.some((field) => {
    const permVal = field === 'pincode' && typeof perm[field] === 'object' ? perm[field]?.pincode : perm[field];
    const instVal = installationData[field];
    return String(permVal || '') !== String(instVal || '');
  });
};

export const useAddressFormSubmit = (isInstallation, onSuccess) => {
  const dispatch = useDispatch();
  const permanentAddressDetails = useSelector(getPermanentAddressDetails);
  const prepopulatedData = useSelector(getPrepopulatedData);

  const handleSubmit = useCallback(
    (data) => {
      const {
        apartment,
        street,
        city,
        pincode,
        post,
        district,
        locationType,
        localBodyType,
        corporation,
        panchayatName,
        blockName,
        sameAsPermanent
      } = data;

      const instAddressData = { doorNo: apartment, streetName: street, city, pincode };

      const payload = {
        ...instAddressData,
        postOfficeId: post?.id,
        postOfficeName: post?.label || post?.name || post,
        districtId: district?.id,
        districtName: district?.name || district,
        locationType,
        isPermanent: !isInstallation,
        ...(isInstallation && {
          sameAsPermanent: !!sameAsPermanent,
          isDifferentInstallationAddress: isDifferentFromPermanent(
            instAddressData,
            permanentAddressDetails || prepopulatedData?.permanentAddress
          )
        })
      };

      // Add location-specific fields
      if (locationType === LOCATION_TYPES.URBAN) {
        payload.localBodyTypeId = localBodyType?.id;
        payload.localBodyTypeName = localBodyType?.name;
        payload.corporationMunicipalityId = corporation?.id;
        payload.corporationMunicipalityName = corporation?.name;
      } else if (locationType === LOCATION_TYPES.RURAL) {
        payload.panchayatId = panchayatName?.id;
        payload.panchayatName = panchayatName?.name;
        payload.blockId = blockName?.id;
        payload.blockName = blockName?.name;
      }

      if (onSuccess) {
        payload.onSuccess = onSuccess;
      }

      dispatch(updateAddressDetails(payload));
    },
    [dispatch, isInstallation, onSuccess, permanentAddressDetails, prepopulatedData]
  );

  return handleSubmit;
};
