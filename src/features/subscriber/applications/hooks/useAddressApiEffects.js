import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LOCATION_TYPES } from '@/constants/common';
import {
  fetchBlock,
  fetchCorporation,
  fetchLocalBody,
  fetchPanchayath,
  fetchPostOfice
} from '@/features/common/actions';
import { getPostOffice } from '@/features/common/selectors';

/**
 * Custom hook to track previous value of a variable
 * @param {*} value - Current value to track
 * @returns {*} Previous value
 */
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

/**
 * Custom hook to handle all API-related side effects for the address form
 * Uses optimized approach with fewer useEffect hooks by combining related logic
 * and using previous value tracking for change detection
 *
 * @param {Object} params
 * @param {string} params.locationType - Selected location type (urban/rural)
 * @param {Object} params.district - Selected district object
 * @param {Object} params.localBodyType - Selected local body type object
 * @param {Object} params.selectedPincode - Selected pincode object
 * @param {Object} params.selectedPost - Selected post office object (also guards against clearing post on pincode re-fetch)
 * @param {Function} params.setValue - React Hook Form setValue function
 */
export const useAddressApiEffects = ({
  locationType,
  district,
  localBodyType,
  selectedPincode,
  selectedPost,
  setValue,
  previousStepCompleted,
  isSameAsPermanent
}) => {
  const dispatch = useDispatch();

  const postOfficeList = useSelector(getPostOffice);
  // Use a ref so postOfficeList updates don't re-trigger the combined effect
  // (prevents cross-contamination when the other Address instance fetches post offices)
  const postOfficeListRef = useRef(postOfficeList);
  useEffect(() => {
    postOfficeListRef.current = postOfficeList;
  }, [postOfficeList]);

  // Track previous values for change detection (non-pincode fields)
  const prevLocationType = usePrevious(locationType);
  const prevPost = usePrevious(selectedPost);
  const prevDistrictId = usePrevious(district?.id);
  const prevLocalBodyTypeId = usePrevious(localBodyType?.villageTypeId);

  // Dedicated ref for pincode — updated synchronously inside the effect to avoid stale closure issues
  const prevPincodeRef = useRef(null);

  // Dedicated effect for pincode → post office (matches onboarding pattern)
  useEffect(() => {
    if (isSameAsPermanent) return;
    const pincode = selectedPincode;
    if (pincode?.length === 6 && pincode !== prevPincodeRef.current) {
      dispatch(fetchPostOfice({ pincode }));
      if (!selectedPost) {
        setValue('post', '');
        setValue('district', '');
      }
      prevPincodeRef.current = pincode;
    } else if (pincode?.length === 6 && !postOfficeListRef.current?.length) {
      // Re-fetch if post offices were cleared (e.g. after refresh)
      dispatch(fetchPostOfice({ pincode }));
      if (!prevPincodeRef.current) prevPincodeRef.current = pincode;
    }
  }, [selectedPincode, selectedPost, isSameAsPermanent, previousStepCompleted, dispatch, setValue]);

  // Effect for location type, district/localBodyType, and post office district auto-fill
  useEffect(() => {
    if (!previousStepCompleted) return;

    // 1. Fetch local body types when location type changes
    if (locationType && locationType !== prevLocationType) {
      dispatch(fetchLocalBody({ locationType }));
      if (!isSameAsPermanent) {
        setValue('localBodyType', '');
        setValue('panchayatName', '');
        setValue('blockName', '');
        setValue('corporation', '');
      }
    }

    // 2. Fetch panchayath/block/corporation only when district or local body type actually changes
    const districtId = district?.id;
    const localBodyTypeId = localBodyType?.villageTypeId;

    if (districtId && localBodyTypeId && (districtId !== prevDistrictId || localBodyTypeId !== prevLocalBodyTypeId)) {
      if (locationType === LOCATION_TYPES.RURAL) {
        dispatch(fetchPanchayath({ districtId, villageTypeId: localBodyTypeId }));
        dispatch(fetchBlock({ districtId, villageTypeId: localBodyTypeId }));
      } else if (locationType === LOCATION_TYPES.URBAN) {
        dispatch(fetchCorporation({ districtId, villageTypeId: localBodyTypeId }));
      }
    }

    // 3. Auto-populate district when post office is selected
    if (selectedPost && selectedPost !== prevPost) {
      const list = postOfficeListRef.current;
      if (list?.length > 0) {
        const po = list.find(
          (item) => item.id === selectedPost || item.value === selectedPost || item.id === selectedPost?.id
        );
        if (po?.district) {
          setValue('district', { id: po.districtId, name: po.district });
        }
      }
    }
  }, [
    isSameAsPermanent,
    locationType,
    prevLocationType,
    district,
    localBodyType,
    prevDistrictId,
    prevLocalBodyTypeId,
    selectedPost,
    prevPost,
    dispatch,
    setValue,
    previousStepCompleted
  ]);
};
