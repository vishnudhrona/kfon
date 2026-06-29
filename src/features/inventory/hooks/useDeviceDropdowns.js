import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchAssetTypes,
  fetchDeviceCategoryDropdown,
  fetchDeviceMakeDropdown,
  fetchDeviceModelDropdown,
  fetchDeviceTypeDropdown,
  fetchDeviceVendorDropdown
} from '../actions';
import { INVENTORY_KEYS } from '../constants';
import { getAssetTypesDropdown, getDropdownData } from '../selectors';

/**
 * Custom hook to fetch and manage all device-related dropdown data
 * Reduces code duplication across form components
 */
export const useDeviceDropdowns = (enabled = true) => {
  const dispatch = useDispatch();

  const deviceTypes = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_TYPE_LIST));
  const deviceMakes = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_MAKE_LIST));
  const deviceCategories = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_CATEGORY_LIST));
  const deviceModels = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_MODEL_LIST));
  const deviceVendors = useSelector(getDropdownData(INVENTORY_KEYS.DEVICE_VENDOR_LIST));
  const assetTypes = useSelector(getAssetTypesDropdown);

  useEffect(() => {
    if (!enabled) return;
    dispatch(fetchDeviceTypeDropdown());
    dispatch(fetchDeviceMakeDropdown());
    dispatch(fetchDeviceCategoryDropdown());
    dispatch(fetchDeviceModelDropdown());
    dispatch(fetchDeviceVendorDropdown());
    dispatch(fetchAssetTypes());
  }, [dispatch, enabled]);

  return {
    deviceTypes,
    deviceMakes,
    deviceCategories,
    deviceModels,
    deviceVendors,
    assetTypes
  };
};

export const useDeviceDropdown = (dropdownType) => {
  const dispatch = useDispatch();

  const selectorMap = {
    deviceType: INVENTORY_KEYS.DEVICE_TYPE_LIST,
    deviceMake: INVENTORY_KEYS.DEVICE_MAKE_LIST,
    deviceCategory: INVENTORY_KEYS.DEVICE_CATEGORY_LIST,
    deviceModel: INVENTORY_KEYS.DEVICE_MODEL_LIST,
    deviceVendor: INVENTORY_KEYS.DEVICE_VENDOR_LIST
  };

  const data = useSelector(
    dropdownType === 'assetType' ? getAssetTypesDropdown : getDropdownData(selectorMap[dropdownType])
  );

  useEffect(() => {
    const actionMap = {
      deviceType: fetchDeviceTypeDropdown,
      deviceMake: fetchDeviceMakeDropdown,
      deviceCategory: fetchDeviceCategoryDropdown,
      deviceModel: fetchDeviceModelDropdown,
      deviceVendor: fetchDeviceVendorDropdown,
      assetType: fetchAssetTypes
    };

    const action = actionMap[dropdownType];
    if (action) {
      dispatch(action());
    }
  }, [dispatch, dropdownType]);

  return data;
};
