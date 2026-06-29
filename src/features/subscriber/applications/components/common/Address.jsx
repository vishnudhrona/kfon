import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, Box, Controller, FormController, Text, useForm } from '@kfonbss/bss-ui-components';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import CustomCheckbox from '@/components/custom/CustomCheckbox';
import { LOCATION_TYPES } from '@/constants/common';
import {
  getBlockList,
  getCorporationList,
  getLocalBodyList,
  getPanchayathList,
  getPostOffice
} from '@/features/common/selectors';
import { allowOnlyDigits } from '@/utils/validationUtils';

import { useAddressApiEffects } from '../../hooks/useAddressApiEffects';
import { useAddressFormData } from '../../hooks/useAddressFormData';
import { useAddressFormSubmit } from '../../hooks/useAddressFormSubmit';
import { getSubscriberId } from '../../selectors';
import { addressDetailsValidationSchema } from '../../validation';

// Constants
const LOCATION_TYPE_OPTIONS = [
  { label: 'urban', value: LOCATION_TYPES.URBAN },
  { label: 'rural', value: LOCATION_TYPES.RURAL }
];

/**
 * Address form component for collecting permanent or installation address details
 * Supports pre-population from Aadhaar data or copying from permanent address
 *
 * @param {Object} props
 * @param {boolean} props.isInstallation - Whether this is an installation address (vs permanent)
 * @param {string} props.title - Translation key for the accordion title
 * @param {boolean} props.previousStepCompleted - Whether the previous form step is completed
 */
const Address = ({
  isInstallation = false,
  title = 'permanentAddress',
  value = 'permanentAddress',
  previousStepCompleted = true,
  onBeforeSave,
  onSuccess
}) => {
  const { t } = useTranslation();

  // Redux selectors
  const subscriberId = useSelector(getSubscriberId);
  const postOfficeList = useSelector(getPostOffice);
  const localBodyList = useSelector(getLocalBodyList);
  const panchayathList = useSelector(getPanchayathList);
  const blockList = useSelector(getBlockList);
  const corporationList = useSelector(getCorporationList);

  // Form setup
  const validationSchema = useMemo(() => addressDetailsValidationSchema(t, isInstallation), [t, isInstallation]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  // Watch form fields
  const selectedPincode = watch('pincode');
  const selectedPost = watch('post');
  const locationType = watch('locationType');
  const localBodyType = watch('localBodyType');
  const district = watch('district');
  const isSameAsPermanent = watch('sameAsPermanent');

  // Custom hooks for logic extraction
  const { aadhaarDetails } = useAddressFormData({
    isInstallation,
    isSameAsPermanent,
    setValue
  });

  useAddressApiEffects({
    locationType,
    district,
    localBodyType,
    selectedPincode,
    selectedPost,
    setValue,
    previousStepCompleted,
    isSameAsPermanent
  });

  const submitAddress = useAddressFormSubmit(isInstallation, onSuccess);
  const onSubmit = useCallback(
    (data) => {
      if (onBeforeSave && !onBeforeSave()) return;
      submitAddress({ ...data, sameAsPermanent: isSameAsPermanent });
    },
    [onBeforeSave, submitAddress, isSameAsPermanent]
  );

  // Determine if form should be disabled
  const isDisabled = !subscriberId && !aadhaarDetails && !isInstallation;

  const showSameAsPermanent = isInstallation;

  return (
    <AccordionItem
      title={t(title)}
      name={title}
      value={value}
      isDisabled={isDisabled}
      onSubmit={handleSubmit(onSubmit)}
      saveButton={true}
      buttonValue={t('saveAndContinue')}
      simpleGridProps={{ gap: 6, rowGap: 8 }}
    >
      {/* Installation Address Option */}
      {showSameAsPermanent && (
        <Box gridColumn={{ base: '1', lg: 'span 2', xl: 'span 3' }}>
          <Controller
            name='sameAsPermanent'
            control={control}
            render={({ field }) => (
              <CustomCheckbox checked={field.value} onCheckedChange={({ checked }) => field.onChange(checked)} px={0}>
                <Text color='#0082BE' fontSize='14px' fontWeight='400' cursor='pointer'>
                  {t('sameAsPermanentAddress')}
                </Text>
              </CustomCheckbox>
            )}
          />
        </Box>
      )}

      {/* Basic Address Information */}
      <FormController
        placeholder={t('enter', { 0: t('doorNoApartment') })}
        labelName={t('doorNoApartment')}
        name='apartment'
        control={control}
        errors={errors}
        required
        disabled={isSameAsPermanent}
      />

      <FormController
        placeholder={t('enter', { 0: t('streetLocalityName') })}
        labelName={t('streetLocalityName')}
        name='street'
        control={control}
        errors={errors}
        required
        disabled={isSameAsPermanent}
      />

      <FormController
        placeholder={t('enter', { 0: t('city') })}
        labelName={t('city')}
        name='city'
        control={control}
        errors={errors}
        required
        disabled={isSameAsPermanent}
      />

      {/* Postal Information */}
      <FormController
        placeholder={t('enter', { 0: t('pinCode') })}
        labelName={t('pinCode')}
        name='pincode'
        control={control}
        errors={errors}
        required
        maxLength={6}
        onKeyDown={allowOnlyDigits}
        disabled={isSameAsPermanent}
      />

      <FormController
        placeholder={t('choose', { 0: t('postOfficeName') })}
        labelName={t('postOfficeName')}
        name='post'
        control={control}
        errors={errors}
        type='select'
        items={postOfficeList || []}
        isDisabled={!selectedPincode || isSameAsPermanent}
        required
      />

      <FormController
        placeholder={t('district')}
        labelName={t('district')}
        name='district.name'
        control={control}
        errors={errors}
        disabled={true}
        required
      />

      {/* Location Type Selection */}
      <FormController
        labelName={t('locationType')}
        name='locationType'
        control={control}
        errors={errors}
        type='radio'
        required
        items={LOCATION_TYPE_OPTIONS.map((option) => ({
          label: t(option.label),
          value: option.value
        }))}
        disabled={isSameAsPermanent}
      />

      {/* Local Body Type (shown after location type is selected) */}
      {locationType && (
        <FormController
          placeholder={t('localBodyType')}
          labelName={t('localBodyType')}
          name='localBodyType'
          control={control}
          errors={errors}
          type='select'
          items={localBodyList || []}
          required
          isDisabled={isSameAsPermanent}
        />
      )}

      {/* Rural-specific Fields */}
      {locationType === LOCATION_TYPES.RURAL && (
        <>
          <FormController
            placeholder={t('panchayatName')}
            labelName={t('panchayatName')}
            name='panchayatName'
            control={control}
            errors={errors}
            type='select'
            items={panchayathList || []}
            required
            isDisabled={isSameAsPermanent}
          />

          <FormController
            placeholder={t('blockName')}
            labelName={t('blockName')}
            name='blockName'
            control={control}
            errors={errors}
            type='select'
            items={blockList || []}
            required
            isDisabled={isSameAsPermanent}
          />
        </>
      )}

      {/* Urban-specific Fields */}
      {locationType === LOCATION_TYPES.URBAN && (
        <FormController
          placeholder={t('corporationMunicipalityName')}
          labelName={t('corporationMunicipalityName')}
          name='corporation'
          control={control}
          errors={errors}
          type='select'
          items={corporationList || []}
          required
          isDisabled={isSameAsPermanent}
        />
      )}
    </AccordionItem>
  );
};

export default Address;
