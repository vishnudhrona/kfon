import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Flex,
  FormController,
  HStack,
  Image,
  Input,
  InputGroup,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import homeEnquiryImage from '@/assets/landingPage/homeEnquiry.png';
import { TickIcon } from '@/assets/svg';
import { NavigationIcon } from '@/components/custom';
import { sendOtpForForms } from '@/features/public/common/actions';
import OtpPopup from '@/features/public/common/components/OtpPopup';
import SuccessPopup from '@/features/public/common/components/SuccessPopup';
import { STATE_REDUCER_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import { matchesSelectedCircle } from '@/utils/geocodeUtils';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';
import { allowOnlyAlpha, stripExtraSpaces } from '@/utils/validationUtils';

import { fetchHomeEnquiryByMobile } from '../action';
import { formatHomeEnquiryRequest, parseAddressComponents } from '../helpers';
import { getHomeEnquiryData, getHomeSubscriberSubmitDetails } from '../selector';
import { actions as enquirySliceActions } from '../slice';
import { homeSubscriberschema } from '../validations';
import CircleSelect from './CircleSelect';
import MapPopup from './MapPopup';
import TrackEnquiryPopup from './TrackEnquiryPopup';

const HomeEnquiry = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSuccessOpen = useSelector((s) => s[STATE_REDUCER_KEY].successPopupOpen);
  const otpPopupOpen = useSelector((state) => state[STATE_REDUCER_KEY].otpPopupOpen);
  const homeEnquiryData = useSelector(getHomeEnquiryData);
const homeSubmitDetails = useSelector(getHomeSubscriberSubmitDetails);
  const { predictions, search, setPredictions } = usePlacesAutocomplete();
  const [popupOpen, setPopupOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [continueWithNumber, setContinueWithNumber] = useState(null);

  const DEFAULT_VALUES = {
    circle: null,
    firstName: '',
    mobileNumber: '',
    mailId: '',
    pinCode: '',
    postOffice: '',
    district: '',
    districtId: '',
    location: {
      fullAddress: '',
      lat: null,
      lng: null
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    setError,
    clearErrors
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(homeSubscriberschema(t))
  });

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (value && value.length === 10) {
      dispatch(fetchHomeEnquiryByMobile({ mobileNumber: value }));
    }
  };

  const handleSelect = (loc) => {
    if (!matchesSelectedCircle(loc.state)) {
      setError('location.fullAddress', { type: 'manual', message: t('locationOutsideKerala') });
      return;
    }
    clearErrors('location.fullAddress');
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

    if (!matchesSelectedCircle(parsed.state)) {
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

  const mobileNumber = watch('mobileNumber');

  const onSubmit = (formValues) => {
    if (homeEnquiryData && continueWithNumber !== true) return;
    dispatch(enquirySliceActions.clearHomeEnquiryData());
    const payload = {
      ...formValues,
      mailId: formValues.mailId || ''
    };
    dispatch(sendOtpForForms(formatHomeEnquiryRequest(payload)));
  };

  const handleSuccessClose = (val) => {
    dispatch(commonSliceActions.setSuccessPopupOpen(val));
    if (!val) {
      reset(DEFAULT_VALUES);
    }
  };

return (
    <>
      <Box
        w='100%'
        position='relative'
        display='flex'
        alignItems='flex-start'
        justifyContent='center'
        p={{ base: '20px', md: '85px' }}
        zIndex={0}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.02)',
          zIndex: -1
        }}
      >
        <Flex
          w='100%'
          maxW='1600px'
          direction={{ base: 'column', lg: 'row' }}
          alignItems='center'
          justifyContent='space-between'
          gap={{ base: 10, lg: 32 }}
        >
          <Box
            flex='1'
            textAlign='center'
            minW={{ lg: '600px' }}
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <Text
              display={'flex'}
              justifyContent='center'
              alignItems={'center'}
              p={0}
              pb={{ base: '5px', xl: '20px' }}
              m={0}
              gap={'8px'}
              fontSize={{ base: '12px', '2xl': '16px', xl: '14px' }}
              lineHeight={{ '2xl': '16px', xl: '14px' }}
              fontWeight={500}
              textTransform={'uppercase'}
              color='#292929'
            >
              <svg width='25' height='13' viewBox='0 0 25 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect x='5.5' y='0.5' width='19' height='12' rx='6' stroke='#8D0247' />
                <rect width='19' height='13' rx='6.5' fill='#8D0247' />
              </svg>
              {t('bestInternetProvider')}
            </Text>
            <Text
              p={0}
              m={0}
              fontSize={{ base: '24px', md: '36px', '2xl': '48px', xl: '48px' }}
              lineHeight={{ base: '1.2', xl: '1.1' }}
              fontWeight={800}
              letterSpacing='-1px'
              textAlign='center'
            >
              <Box as='span' color='#8D0247'>
                {t('keralaOwn')}
              </Box>
              <Box as='span' color='#292929' textTransform='uppercase' ml={2}>
                {t('internet')}
              </Box>
            </Text>

            <Box display='flex' justifyContent='center' mb={8}>
              <Image
                src={homeEnquiryImage}
                alt="BSS Internet Service"
                objectFit='contain'
                maxW={{ base: '280px', lg: '450px' }}
                w='100%'
                h='auto'
              />
            </Box>

            <Text
              fontSize={{ base: '14px', md: '20px' }}
              color='#292929'
              lineHeight='1.6'
              fontWeight='400'
              textAlign='center'
              maxW='550px'
            >
              {t('homeEnquirySubText')}
            </Text>
          </Box>

          <Box
            flex='1'
            w='100%'
            maxW='800px'
            bg='#FFF'
            borderRadius='20px'
            boxShadow='0 0 23.3px 0 rgba(0, 0, 0, 0.12)'
            p={{ base: '24px', md: '40px', xl: '52px' }}
          >
            <Text fontSize={{ base: '24px', md: '32px' }} fontWeight='600' textAlign='center' mb='9' color='#2D3748'>
              {t('getHomeWifiConnection')}
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} rowGap={7}>
                <FormController
                  labelName={t('fullName')}
                  name='firstName'
                  placeholder={t('enter', { 0: t('fullName') })}
                  control={control}
                  errors={errors}
                  required
                  maxLength={50}
                  width='100%'
                  onKeyDown={allowOnlyAlpha}
                  onInput={stripExtraSpaces}
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
                    inputMode='numeric'
                    pattern='[0-9]*'
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                    handleChange={handleMobileChange}
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

                <CircleSelect control={control} errors={errors} setValue={setValue} />

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

                <Box w='100%' position='relative'>
                  <Box
                    mb='8px'
                    fontSize='14px'
                    fontWeight='normal'
                    color={errors.location?.fullAddress ? '#D72D2E' : '#272727'}
                  >
                    {t('installationAddress')} <Box as='span'>*</Box>
                  </Box>
                  <InputGroup
                    borderRadius='6px'
                    border='1px solid'
                    borderColor={errors.location?.fullAddress ? 'red.500' : '#A0A0A0'}
                    _hover={{ borderColor: '#A0A0A0' }}
                    h='48px'
                    endAddon={
                      <Button
                        variant='unstyled'
                        onClick={() => setPopupOpen(true)}
                        display='flex'
                        alignItems='center'
                        color='#8B1538'
                        fontWeight='600'
                        fontSize='14px'
                        px={3}
                        h='100%'
                      >
                        {t('selectOnTheMap')} <NavigationIcon ml={2} />
                      </Button>
                    }
                  >
                    <Input
                      placeholder={t('enter', { 0: t('installationAddress') })}
                      value={watch('location.fullAddress') || ''}
                      border={0}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue('location.fullAddress', value);
                        search(value);
                        setValue('location.lat', '');
                        setValue('location.lng', '');
                        clearErrors('location.fullAddress');
                      }}
                      _focus={{ boxShadow: 'none', border: 'none' }}
                      focusBorderColor='transparent'
                      _focusVisible={{ outline: 'none' }}
                    />
                  </InputGroup>
                  {predictions.length > 0 && (
                    <Box
                      position='absolute'
                      top='100%'
                      left='0'
                      right='0'
                      mt='6px'
                      bg='white'
                      boxShadow='0px 4px 12px rgba(0,0,0,0.15)'
                      borderRadius='8px'
                      zIndex='9999'
                      maxH='280px'
                      overflowY='auto'
                    >
                      {predictions.map((item) => (
                        <Box
                          key={item.place_id}
                          p='12px'
                          cursor='pointer'
                          borderBottom='1px solid #EEE'
                          _hover={{ bg: '#f7f7f7' }}
                          onClick={() => handlePlaceClick(item)}
                        >
                          {item.description}
                        </Box>
                      ))}
                    </Box>
                  )}
                  {errors.location?.fullAddress && (
                    <Box fontSize='12px' color='#D72D2E' mt='4px' textAlign='right'>
                      {errors.location.fullAddress.message}
                    </Box>
                  )}
                </Box>

                <Button
                  type='submit'
                  w='auto'
                  minW='180px'
                  px='8'
                  py='6'
                  borderRadius='full'
                  bg='#8B1538'
                  color='white'
                  fontSize='16px'
                  _hover={{ bg: '#6D1028' }}
                  mt={2}
                >
                  {t('submit')}
                  <Box as='span' ml={2}>
                    <TickIcon />
                  </Box>
                </Button>

                <Text textTransform={'capitalize'} fontSize='1rem' color='#292929' mt={2}>
                  {t('alreadyHaveABooking')}
                  <Box
                    as='span'
                    color='#8B1538'
                    ml={2}
                    fontWeight={500}
                    fontSize={'18px'}
                    cursor='pointer'
                    onClick={() => setIsTrackOpen(true)}
                  >
                    {t('trackHere')}
                  </Box>
                </Text>
              </VStack>
            </form>
          </Box>
        </Flex>
      </Box>

      <SuccessPopup
        isOpen={isSuccessOpen}
        setIsOpen={handleSuccessClose}
        message={`${t('successMsgOne')} ${homeSubmitDetails?.trackingId} ${t('successMsgTwo')}`}
      />
      <OtpPopup isOpen={otpPopupOpen} setIsOpen={(val) => dispatch(commonSliceActions.setOtpPopupOpen(val))} />
      <TrackEnquiryPopup isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} />
      <MapPopup
        isOpen={popupOpen}
        setIsOpen={setPopupOpen}
        handleSelect={handleSelect}
        initialLat={watch('location.lat')}
        initialLng={watch('location.lng')}
      />
    </>
  );
};

export default HomeEnquiry;
