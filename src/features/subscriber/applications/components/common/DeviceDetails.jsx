import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, FormController, FormGroup, useForm } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { allowOnlyDigits } from '@/utils/validationUtils';

import {
  fetchAvailablePonPorts,
  fetchDeviceDetailsById,
  fetchDeviceProvider,
  fetchDeviceType,
  fetchOltDeviceList,
  fetchOltType,
  fetchOntDevices,
  fetchOntNextPosition,
  updateDeviceDetails
} from '../../actions';
import { clearAllFormStorage } from '../../hooks/useFormPersistence';
import {
  getDeviceDetailsCompleted,
  getDeviceList,
  getDeviceProviderList,
  getDeviceTypeList,
  getOltDeviceList,
  getOltTypeList,
  getPonPortNumberList,
  getPrepopulatedData,
  getSubscriberId
} from '../../selectors';
import { deviceDetailsValidationSchema } from '../../validation';

const DeviceDetails = ({ isLastStep = false, isEws = false, onBeforeSave, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const subscriberId = useSelector(getSubscriberId);
  const isCompleted = useSelector(getDeviceDetailsCompleted);
  const deviceProviderList = useSelector(getDeviceProviderList);
  const deviceList = useSelector(getDeviceList);
  const deviceTypeList = useSelector(getDeviceTypeList);
  const oltTypeList = useSelector(getOltTypeList);
  const oltDeviceList = useSelector(getOltDeviceList);
  const ponPortNumberList = useSelector(getPonPortNumberList);
  const prepopulatedData = useSelector(getPrepopulatedData);

  const validationSchema = useMemo(() => deviceDetailsValidationSchema(t), [t]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    if (prepopulatedData?.deviceDetail) {
      const {
        deviceProviderId,
        deviceProviderName,
        deviceId,
        deviceName,
        vlanId,
        oltType,
        deviceType,
        ssid24Ghz,
        ssid50Ghz,
        ontPosition,
        ponportNumberId,
        ponportNumberName,
        oltDeviceId,
        oltDeviceName,
        freeToUse
      } = prepopulatedData.deviceDetail;

      if (deviceProviderId) {
        setValue('DeviceProvider', { id: deviceProviderId, name: deviceProviderName, label: deviceProviderName });
      }
      if (deviceId) {
        setValue('selectDevice', { id: deviceId, name: deviceName, label: deviceName });
      }
      if (deviceType) {
        const type = deviceTypeList?.find(
          (t) => t.value === deviceType || t.name === deviceType || t.id === deviceType
        ) || { id: deviceType, name: deviceType, label: deviceType };
        setValue('DeviceType', type);
      }
      if (vlanId) setValue('VLANID', vlanId);
      if (oltType) {
        const type = oltTypeList?.find((t) => t.value === oltType || t.name === oltType || t.id === oltType) || {
          id: oltType,
          name: oltType,
          label: oltType
        };
        setValue('OLTType', type);
      }
      if (ssid24Ghz) {
        setValue('ConfigureSSID', true);
        setValue('SSID_24GHz', ssid24Ghz);
      }
      if (ssid50Ghz) {
        setValue('SSID_5GHz', ssid50Ghz);
      }
      if (oltDeviceId) {
        setValue('deviceList', { id: oltDeviceId, name: oltDeviceName, label: oltDeviceName });
      }
      if (ontPosition) setValue('ONTPosition', ontPosition);
      if (ponportNumberId) {
        setValue('PONPortNumber', { id: ponportNumberId, name: ponportNumberName, label: ponportNumberName });
      }
      if (freeToUse) setValue('FreeToUseDevice', true);
    }
  }, [prepopulatedData, deviceTypeList, oltTypeList, setValue]);

  const selectedDeviceType = watch('DeviceType');
  const configureSSID = watch('ConfigureSSID');
  const selectedOltDevice = watch('deviceList');

  useEffect(() => {
    dispatch(fetchDeviceProvider());
    dispatch(fetchDeviceType());
    dispatch(fetchOltType());
    dispatch(fetchOltDeviceList());
  }, [dispatch]);

  useEffect(() => {
    if (isEws) {
      dispatch(fetchOntDevices({ type: 'EWS' }));
      return;
    }
    const packageId = prepopulatedData?.subscriberDetail?.packageId;
    if (packageId) {
      dispatch(fetchOntDevices({ packageId, lnpId: '' }));
    }
  }, [isEws, prepopulatedData?.subscriberDetail?.packageId, dispatch]);

  // Fetch PON ports based on selected OLT device
  useEffect(() => {
    if (selectedOltDevice) {
      const oltId = selectedOltDevice?.id || selectedOltDevice;
      dispatch(fetchAvailablePonPorts(oltId));
    }
  }, [selectedOltDevice, dispatch]);

  // Fetch device details when selectedDevice changes
  const handleDeviceChange = useCallback(
    (val) => {
      const deviceId = val?.id || val?.target?.value || val?.value || (typeof val === 'string' ? val : '');
      if (deviceId) {
        dispatch(
          fetchDeviceDetailsById({
            id: deviceId,
            onSuccess: (response) => {
              const data = response?.data || response;
              if (data) {
                const getMakeModelValue = (v) => {
                  if (!v) return '';
                  if (typeof v === 'object') return v.makeName || v.name || v.label || '';
                  return v;
                };
                setValue('DeviceType', data.category?.name || data.category || '');
                setValue('DeviceMake', getMakeModelValue(data.make) || '');
                setValue('DeviceModel', getMakeModelValue(data.model) || '');
                setValue('MacAddress', data.deviceMac || '');
              }
            }
          })
        );
      } else {
        setValue('DeviceType', '');
        setValue('DeviceMake', '');
        setValue('DeviceModel', '');
        setValue('MacAddress', '');
      }
    },
    [dispatch, setValue]
  );

  const handlePonPortChange = (val) => {
    const ponportMappingLnpId = val?.id || val?.target?.value || val?.value || (typeof val === 'string' ? val : '');

    if (ponportMappingLnpId) {
      dispatch(
        fetchOntNextPosition({
          ponportMappingLnpId,
          onSuccess: (data) => {
            if (data !== null && data !== undefined) {
              const ontPositionValue = typeof data === 'object' ? data.name : data.code;
              setValue('ONTPosition', String(ontPositionValue), { shouldValidate: true });
            }
          }
        })
      );
    }
  };

  const onSubmit = useCallback(
    (data) => {
      if (onBeforeSave && !onBeforeSave()) return;
      const getValue = (val) => (val?.id ? val.id : val);
      const getName = (list, val) => {
        const id = getValue(val);
        const item = list?.find((i) => i.id === id);
        return item?.name || item?.label || '';
      };

      const payload = {
        id: subscriberId,
        deviceProviderId: getValue(data.DeviceProvider),
        deviceProviderName: getName(deviceProviderList, data.DeviceProvider),
        deviceId: getValue(data.selectDevice),
        deviceName: getName(deviceList, data.selectDevice),
        deviceType: data.DeviceType,
        deviceMake: data.DeviceMake,
        deviceModel: data.DeviceModel,
        deviceMacAddress: data.MacAddress,
        vlanId: String(data.VLANID),
        oltType: data.OLTType?.name,
        freeToUse: data.FreeToUseDevice ?? false,
        configureSsid: data.ConfigureSSID,
        ssid24Ghz: data.ConfigureSSID ? data.SSID_24GHz : '',
        preShared24Ghz: data.ConfigureSSID ? data.Password_24GHz : '',
        ssid50Ghz: data.ConfigureSSID ? data.SSID_5GHz : '',
        preShared50Ghz: data.ConfigureSSID ? data.Password_5GHz : '',
        ponportNumberId: getValue(data.PONPortNumber),
        ponportNumberName: getName(ponPortNumberList, data.PONPortNumber),
        ontPosition: Number(data.ONTPosition),
        oltDeviceId: getValue(data.deviceList),
        oltDeviceName: getName(oltDeviceList, data.deviceList),
        oltdeviceDetail: true,
        onSuccess
      };

      dispatch(updateDeviceDetails(payload));

      // Clear all form storage if this is the last step
      if (isLastStep) {
        clearAllFormStorage();
      }
    },
    [
      onBeforeSave,
      subscriberId,
      deviceProviderList,
      deviceList,
      ponPortNumberList,
      oltDeviceList,
      dispatch,
      isLastStep,
      onSuccess
    ]
  );

  const isDisabled = !subscriberId;
  const isReadOnly = isCompleted || prepopulatedData?.deviceDetail?.vlanId != null;

  return (
    <AccordionItem
      title={t('deviceDetails')}
      name={'DeviceDetails'}
      value={'DeviceDetails'}
      isDisabled={isDisabled}
      onSubmit={handleSubmit(onSubmit)}
      saveButton={!isReadOnly}
      buttonValue={t('saveAndContinue')}
    >
      <FormGroup title={t('ontDeviceDetails')} gridColumn={'span 3'}>
        <FormController
          placeholder={t('choose', { 0: t('deviceProvider') })}
          labelName={t('deviceProvider')}
          name='DeviceProvider'
          control={control}
          errors={errors}
          type='select'
          items={deviceProviderList || []}
          isDisabled={isReadOnly}
          required
        />
        <FormController
          placeholder={t('vlanID')}
          labelName={t('vlanID')}
          name='VLANID'
          control={control}
          errors={errors}
          required
          maxLength={4}
          handleKeyDown={allowOnlyDigits}
          disabled={isReadOnly}
        />
        <FormController
          placeholder={t('freeToUseDevice')}
          labelName={t('freeToUseDevice')}
          name='FreeToUseDevice'
          control={control}
          errors={errors}
          type='checkbox'
          disabled={isReadOnly}
        />

        <FormController
          placeholder={t('choose', { 0: t('selectDevice') })}
          labelName={t('selectDevice')}
          name='selectDevice'
          control={control}
          errors={errors}
          type='select'
          items={deviceList || []}
          formatOptionLabel={(d) => {
            const cat = d.category?.name || d.category || '';
            const make = d.make?.name || d.make || '';
            const dName = d.model?.name || d.name || '';
            const parts = [cat, make, dName].filter(Boolean);
            return parts.length > 0 ? parts.join(' - ') : dName;
          }}
          isDisabled={isReadOnly}
          onOptionSelect={handleDeviceChange}
          required
        />

        <FormController
          placeholder={t('choose', { 0: t('deviceType') })}
          labelName={t('deviceType')}
          name='DeviceType'
          control={control}
          errors={errors}
          disabled={true}
          required
        />

        <FormController
          placeholder={t('deviceMake')}
          labelName={t('deviceMake')}
          name='DeviceMake'
          control={control}
          errors={errors}
          disabled={true}
          required
        />

        <FormController
          placeholder={t('deviceModel')}
          labelName={t('deviceModel')}
          name='DeviceModel'
          control={control}
          errors={errors}
          disabled={true}
          required
        />

        <FormController
          placeholder={t('macAddress')}
          labelName={t('macAddress')}
          name='MacAddress'
          control={control}
          errors={errors}
          disabled={true}
          required
        />

        <FormController
          placeholder={t('choose', { 0: t('oltType') })}
          labelName={t('oltType')}
          name='OLTType'
          control={control}
          errors={errors}
          type='select'
          items={oltTypeList || []}
          isDisabled={isReadOnly}
          required
        />

        {selectedDeviceType && (
          <FormController
            placeholder={t('configureSSID')}
            labelName={t('configureSSID')}
            name='ConfigureSSID'
            control={control}
            errors={errors}
            type='checkbox'
            disabled={isReadOnly}
          />
        )}

        {/* SSID Configuration for 2.4GHz (shown for both singleband and dualband when configureSSID is checked) */}
        {configureSSID && (
          <>
            <FormController
              placeholder={t('enter', { 0: t('ssid24GHz') })}
              labelName={t('ssid24GHz')}
              name='SSID_24GHz'
              control={control}
              errors={errors}
              disabled={isReadOnly}
              required
            />

            <FormController
              placeholder={t('enter', { 0: t('password24GHz') })}
              labelName={t('password24GHz')}
              name='Password_24GHz'
              control={control}
              errors={errors}
              type='password'
              disabled={isReadOnly}
              required
            />
          </>
        )}

        {/* SSID Configuration for 5GHz (shown only for dualband when configureSSID is checked) */}
        {configureSSID && selectedDeviceType.value === 'dualband' && (
          <>
            <FormController
              placeholder={t('enter', { 0: t('ssid5GHz') })}
              labelName={t('ssid5GHz')}
              name='SSID_5GHz'
              control={control}
              errors={errors}
              disabled={isReadOnly}
              required
            />

            <FormController
              placeholder={t('enter', { 0: t('password5GHz') })}
              labelName={t('password5GHz')}
              name='Password_5GHz'
              control={control}
              errors={errors}
              type='password'
              disabled={isReadOnly}
              required
            />
          </>
        )}
      </FormGroup>
      <FormGroup title={t('oltDeviceDetails')} gridColumn={'span 3'}>
        <FormController
          placeholder={t('choose', { 0: t('deviceList') })}
          labelName={`Choose ${t('deviceList')}`}
          name='deviceList'
          control={control}
          errors={errors}
          type='select'
          items={oltDeviceList || []}
          isDisabled={isReadOnly}
        />

        {(selectedOltDevice || prepopulatedData?.deviceDetail?.ponportNumberId) && (
          <FormController
            placeholder={t('choose', { 0: t('ponPortNumber') })}
            labelName={`Choose ${t('ponPortNumber')}`}
            name='PONPortNumber'
            control={control}
            errors={errors}
            type='select'
            items={ponPortNumberList || []}
            onOptionSelect={handlePonPortChange}
            isDisabled={isReadOnly}
          />
        )}

        <FormController
          placeholder={t('ontPosition')}
          labelName={t('ontPosition')}
          name='ONTPosition'
          control={control}
          errors={errors}
          maxLength={3}
          handleKeyDown={allowOnlyDigits}
          disabled={isReadOnly}
        />
      </FormGroup>
    </AccordionItem>
  );
};

export default DeviceDetails;
