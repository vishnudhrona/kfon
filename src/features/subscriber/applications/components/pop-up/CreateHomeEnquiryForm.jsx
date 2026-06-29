import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { TickIcon } from '@/assets/svg';
import { Close, LocationInput } from '@/components/custom';
import { sendOtpForForms } from '@/features/public/common/actions';
import { STATE_REDUCER_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import { fetchHomeEnquiryByMobile } from '@/features/public/pages/enquiryForms/action';
import { formatHomeEnquiryRequest, parseAddressComponents } from '@/features/public/pages/enquiryForms/helpers';
import { getHomeEnquiryData } from '@/features/public/pages/enquiryForms/selector';
import { actions as enquirySliceActions } from '@/features/public/pages/enquiryForms/slice';
import { homeSubscriberschema } from '@/features/public/pages/enquiryForms/validations';
import { isKerala } from '@/utils/geocodeUtils';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';
import { allowOnlyDigits } from '@/utils/validationUtils';

import OtpView from './OtpView';

const CreateHomeEnquiryForm = ({ onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { predictions, search, setPredictions } = usePlacesAutocomplete();

  const otpPopupOpen = useSelector((state) => state[STATE_REDUCER_KEY].otpPopupOpen);
  const homeEnquiryData = useSelector(getHomeEnquiryData);

  const [continueWithNumber, setContinueWithNumber] = useState(null);
  const [otpStarted, setOtpStarted] = useState(false);

  // otpStarted stays true after OTP send until user goes back — needed because
  // the saga clears otpPopupOpen immediately after verify, before success renders
  const showOtp = otpPopupOpen || otpStarted;

  useEffect(() => {
    if (otpPopupOpen) setOtpStarted(true);
  }, [otpPopupOpen]);

  const DEFAULT_VALUES = {
    firstName: '',
    mobileNumber: '',
    pinCode: '',
    district: '',
    location: {
      fullAddress: '',
      lat: null,
      lng: null
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    clearErrors
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(homeSubscriberschema(t, { circleOptional: true }))
  });

  const mobileNumber = watch('mobileNumber');

  useEffect(() => {
    if (mobileNumber && mobileNumber.length === 10) {
      dispatch(fetchHomeEnquiryByMobile({ mobileNumber }));
    }
  }, [mobileNumber, dispatch]);

  const handleSelect = (loc) => {
    setValue(
      'location',
      {
        fullAddress: loc.fullAddress || '',
        lat: loc.lat,
        lng: loc.lng,
        state: loc.state || '',
        city: loc.city || '',
        area: loc.location || '',
        postOffice: loc.postOffice || '',
        postalCode: loc.postalCode || ''
      },
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const handlePlaceClick = async (item) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    const { results } = await geocoder.geocode({ placeId: item.place_id });

    if (!results?.length) return;

    const result = results[0];
    const loc = result.geometry.location;
    const parsed = parseAddressComponents(result.address_components);

    setPredictions([]);

    if (!isKerala(parsed.state)) {
      setError('location.fullAddress', { type: 'manual', message: t('locationOutsideKerala') });
      return;
    }

    clearErrors('location.fullAddress');
    setValue(
      'location',
      {
        fullAddress: result.formatted_address,
        lat: loc.lat(),
        lng: loc.lng(),
        city: parsed.city,
        state: parsed.state,
        postOffice: parsed.postOffice,
        area: parsed.area
      },
      { shouldValidate: true, shouldDirty: true }
    );
    if (parsed.district) {
      setValue('district', parsed.district, { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = (formValues) => {
    if (homeEnquiryData && continueWithNumber !== true) return;
    dispatch(enquirySliceActions.clearHomeEnquiryData());
    dispatch(sendOtpForForms(formatHomeEnquiryRequest(formValues)));
  };

  if (showOtp) {
    return (
      <OtpView
        onCancel={onCancel}
        onBack={() => {
          setOtpStarted(false);
          dispatch(commonSliceActions.setOtpPopupOpen(false));
          dispatch(enquirySliceActions.clearHomeEnquiryData());
        }}
      />
    );
  }

  return (
    <Box px={4}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={6} gap={6}>
          <FormController
            labelName={t('fullName')}
            name='firstName'
            placeholder={t('enter', { 0: t('fullName') })}
            control={control}
            errors={errors}
            required
            maxLength={100}
            width='100%'
          />

          <Box w='100%'>
            <FormController
              labelName={t('mobileNumber')}
              name='mobileNumber'
              placeholder={t('enter', { 0: t('mobileNumber') })}
              control={control}
              errors={errors}
              required
              maxLength={10}
              onKeyDown={allowOnlyDigits}
              inputMode='numeric'
              pattern='[0-9]*'
              onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
              width='100%'
            />
            {homeEnquiryData && mobileNumber?.length === 10 && (
              <HStack mt={2} gap={3} justifyContent='flex-end' flexWrap='wrap'>
                <Text fontSize='13px' color='red.500'>
                  {t('numberAlreadyRegisteredContinue', { trackingId: homeEnquiryData?.trackingId })}
                </Text>
                <HStack gap={3}>
                  <HStack gap={1} cursor='pointer' onClick={() => setContinueWithNumber(true)}>
                    <Box
                      w='16px'
                      h='16px'
                      borderRadius='full'
                      border='2px solid'
                      borderColor={continueWithNumber === true ? 'primary.500' : 'gray.400'}
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      {continueWithNumber === true && <Box w='8px' h='8px' borderRadius='full' bg='primary.500' />}
                    </Box>
                    <Text fontSize='13px'>{t('yes')}</Text>
                  </HStack>
                  <HStack
                    gap={1}
                    cursor='pointer'
                    onClick={() => {
                      setValue('mobileNumber', '', { shouldValidate: false });
                      dispatch(enquirySliceActions.clearHomeEnquiryData());
                      setContinueWithNumber(null);
                    }}
                  >
                    <Box
                      w='16px'
                      h='16px'
                      borderRadius='full'
                      border='2px solid'
                      borderColor={continueWithNumber === false ? 'primary.500' : 'gray.400'}
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      {continueWithNumber === false && <Box w='8px' h='8px' borderRadius='full' bg='primary.500' />}
                    </Box>
                    <Text fontSize='13px'>{t('no')}</Text>
                  </HStack>
                </HStack>
              </HStack>
            )}
          </Box>

          <FormController
            labelName={t('pinCode')}
            name='pinCode'
            placeholder={t('enter', { 0: t('pinCode') })}
            control={control}
            errors={errors}
            required
            minLength={6}
            maxLength={6}
            inputMode='numeric'
            onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
            width='100%'
          />

          <LocationInput
            name='location.fullAddress'
            label={t('installationAddress')}
            required
            placeholder={t('enter', { 0: t('installationAddress') })}
            value={watch('location.fullAddress')}
            error={errors.location?.fullAddress?.message}
            predictions={predictions}
            hideMapAddon
            onChange={(e) => {
              const value = e.target.value;
              setValue('location.fullAddress', value, { shouldDirty: true });
              search(value);
              setValue('location.lat', '');
              setValue('location.lng', '');
              if (value) {
                setError('location.fullAddress', { type: 'manual', message: t('locationNotConfirmed') });
              } else {
                clearErrors('location.fullAddress');
              }
            }}
            onPredictionClick={handlePlaceClick}
            onClearPredictions={() => setPredictions([])}
            onSelect={handleSelect}
            setError={setError}
            clearErrors={clearErrors}
            initialLat={watch('location.lat')}
            initialLng={watch('location.lng')}
          />

          <HStack justifyContent='flex-end' gap={3} mt={2} w='100%'>
            <Button
              type='button'
              variant='outline'
              borderColor='primary.500'
              color='primary.500'
              borderRadius='48px'
              h='47px'
              px='18px'
              fontSize='16px'
              fontWeight='500'
              _hover={{ bg: 'primary.50' }}
              onClick={onCancel}
            >
              <Close />
              {t('cancel')}
            </Button>
            <Button
              type='submit'
              borderRadius='48px'
              bg='#8D0247'
              color='white'
              h='47px'
              px='18px'
              fontSize='16px'
              fontWeight='500'
              _hover={{ bg: '#700138' }}
              isLoading={isSubmitting}
            >
              {t('submit')}
              <Box as='span' ml='6px' display='inline-flex' alignItems='center'>
                <TickIcon />
              </Box>
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateHomeEnquiryForm;
