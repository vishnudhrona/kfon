// HomeEnquiry.jsx
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Controller,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  ArrowRightCircle,
  BsCheckCircle,
  ContactIcon,
  LocationIcon,
  MessageIcon,
  NavigationIcon,
  PenIcon,
  SquareEditIcon
} from '@/components/custom';
import { STATE_REDUCER_KEY } from '@/features/public/common';
import { sendOtpForForms } from '@/features/public/common/actions';
import OtpPopup from '@/features/public/common/components/OtpPopup';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';

import { fetchHomeEnquiryByMobile } from '../action';
import { formatHomeEnquiryRequest, parseAddressComponents } from '../helpers';
import { getHomeEnquiryData, getHomeEnquiryDataPopupOpen } from '../selector';
import { actions as enquirySliceActions } from '../slice';
import { homeSubscriberschema } from '../validations';
import HomeEnquiryDataPopup from './HomeEnquiryDataPopup';
import MapPopup from './MapPopup';

const MotionBox = motion.create(Box);

export default function HomeEnquiry({ onSuccess }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { predictions, search, setPredictions } = usePlacesAutocomplete();

  const [open, setOpen] = useState('name'); // name | location | contact | null
  const [popupOpen, setPopupOpen] = useState(false);
  const schema = homeSubscriberschema(t);
  const otpPopupOpen = useSelector((state) => state[STATE_REDUCER_KEY].otpPopupOpen);
  const isSuccessOpen = useSelector((s) => s[STATE_REDUCER_KEY].successPopupOpen);
  const homeEnquiryData = useSelector(getHomeEnquiryData);
  const homeEnquiryDataPopupOpen = useSelector(getHomeEnquiryDataPopupOpen);
  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      pinCode: '',
      location: { fullAddress: '', lat: null, lng: null },
      mobileNumber: '',
      mailId: ''
    },
    mode: 'onTouched'
  });

  const mobileNumber = watch('mobileNumber');

  // Fetch enquiry data when mobile number reaches 10 digits
  useEffect(() => {
    if (mobileNumber && mobileNumber.length === 10) {
      dispatch(fetchHomeEnquiryByMobile({ mobileNumber }));
    }
  }, [mobileNumber, dispatch]);

  useEffect(() => {
    if (!isSuccessOpen) {
      reset({
        firstName: '',
        lastName: '',
        pinCode: '',
        location: { fullAddress: '', lat: null, lng: null },
        mobileNumber: '',
        mailId: ''
      });
      setOpen('name');
    }
    if (isSuccessOpen) {
      onSuccess && onSuccess();
    }
  }, [isSuccessOpen, reset, onSuccess]);

  const toggle = (card) => {
    setOpen((prev) => (prev === card ? null : card));
  };

  const transition = {
    duration: 0.25,
    ease: [0.25, 0.1, 0.25, 1]
  };

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

    //   setValue('pinCode', loc.postalCode, { shouldValidate: true, shouldDirty: true });
    // }
  };

  const handleNameNext = async () => {
    const valid = await trigger(['firstName', 'lastName']);
    if (valid) setOpen('location');
  };

  const handleLocationConfirm = async () => {
    const valid = await trigger(['pinCode', 'location.fullAddress', 'location.lat', 'location.lng']);
    if (valid) setOpen('contact');
  };

  const onSubmit = async (data) => {
    dispatch(sendOtpForForms(formatHomeEnquiryRequest(data)));
  };

  const ErrorText = ({ field }) =>
    field && (
      <Text fontSize='14px' lineHeight='14px' color='toast.error'>
        {field}
      </Text>
    );

  const safeGet = (path, fallback = '') => {
    try {
      const val = path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), getValues());
      return val ?? fallback;
    } catch {
      return fallback;
    }
  };

  const handlePlaceClick = async (item) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    const { results } = await geocoder.geocode({ placeId: item.place_id });

    if (!results?.length) return;

    const result = results[0];
    const loc = result.geometry.location;
    const parsed = parseAddressComponents(result.address_components);

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

    setPredictions([]);
  };

  const handleEnquiryPopupClose = (val) => {
    dispatch(enquirySliceActions.setHomeEnquiryDataPopupOpen(val));

    if (!val) {
      // Clear the form and reset to first section
      reset({
        firstName: '',
        lastName: '',
        pinCode: '',
        location: { fullAddress: '', lat: null, lng: null },
        mobileNumber: '',
        mailId: ''
      });
      setOpen('name');
    }
  };

  return (
    <Flex direction='column' gap={6} p={6} maxW='full' mx='auto'>
      <Box
        name='nameSection'
        bg='white'
        p={open === 'name' ? { base: '0 16px 24px', md: '0 32px 40px', xl: '0 60px 60px' } : '0'}
        rounded='2xl'
        shadow='md'
        borderWidth='1px'
        transition={'padding 350ms ease-in-out'}
      >
        <Button
          variant={'unstyled'}
          w={'full'}
          fontSize={{ base: '18px', md: '20px', xl: '24px' }}
          fontWeight={600}
          lineHeight={'24px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          onClick={() => toggle('name')}
          color={'black'}
          p={
            open === 'name'
              ? { base: '20px 0 0', md: '24px 0 0', xl: '30px 0 0' }
              : { base: '20px 16px', md: '24px 32px', xl: '30px 60px' }
          }
          transition={'padding 350ms ease-in-out'}
        >
          <HStack flexWrap={{ base: 'wrap', md: 'nowrap' }} gap={{ base: '12px', md: '24px' }}>
            <Icon as={ContactIcon} w={'42px'} h={'42px'} />
            <VStack alignItems={'start'} justifyContent={'start'} gap={'12px'}>
              <Text>{t('letGetToKnowYou')}</Text>
              {(safeGet('firstName') || safeGet('lastName')) && (
                <Text
                  fontSize='18px'
                  lineHeight='18px'
                  fontWeight={500}
                  color='#6e6e6e'
                  maxW='560px'
                  whiteSpace='normal'
                  overflowWrap='break-word'
                  textAlign='left'
                  w='100%'
                  alignSelf='flex-start'
                >
                  {`${safeGet('firstName', '')} ${safeGet('lastName', '')}`.trim()}
                </Text>
              )}
            </VStack>
          </HStack>
          {!errors.firstName &&
            !errors.lastName &&
            (safeGet('firstName') || safeGet('lastName')) &&
            open !== 'name' && <SquareEditIcon />}
        </Button>

        <AnimatePresence initial={false}>
          {open === 'name' && (
            <MotionBox
              transition={transition}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              overflow='hidden'
            >
              <Flex flexDir={'column'} gap={'24px'} mt={'24px'} w={'100%'}>
                <Controller
                  name='firstName'
                  control={control}
                  render={({ field }) => (
                    <Box display='flex' flexDirection='column' alignItems={'start'} gap='6px' pos={'relative'}>
                      <Text
                        fontSize='14px'
                        lineHeight={'14px'}
                        color='font_color.primary'
                        maxW='560px'
                        whiteSpace='normal'
                        wordBreak='break-word'
                      >
                        {t('firstName')}
                      </Text>
                      <Input
                        {...field}
                        maxLength={100}
                        placeholder={t('firstName')}
                        borderRadius='6px'
                        border='1px'
                        borderStyle='solid'
                        borderColor={errors.firstName ? 'toast.error' : '#A0A0A0'}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) field.onChange(e.target.value);
                        }}
                      />
                      {errors.firstName && <ErrorText field={errors.firstName.message} />}
                    </Box>
                  )}
                />

                <Controller
                  name='lastName'
                  control={control}
                  render={({ field }) => (
                    <Box display='flex' flexDirection='column' alignItems={'start'} gap='6px' pos={'relative'}>
                      <Text fontSize='14px' lineHeight={'14px'} color='font_color.primary'>
                        {t('lastName')}
                      </Text>
                      <Input
                        {...field}
                        maxLength={100}
                        placeholder={t('lastName')}
                        borderRadius='6px'
                        border='1px'
                        borderStyle='solid'
                        borderColor={errors.lastName ? 'toast.error' : '#A0A0A0'}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) field.onChange(e.target.value);
                        }}
                      />
                      {errors.lastName && <ErrorText field={errors.lastName.message} />}
                    </Box>
                  )}
                />

                <Flex justifyContent={'flex-end'}>
                  <Button variant={'outline'} borderRadius={'99px'} onClick={handleNameNext}>
                    {t('next')}
                    <ArrowRightCircle />
                  </Button>
                </Flex>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Box
        name='locationSection'
        bg='white'
        p={open === 'location' ? { base: '0 16px 24px', md: '0 60px 60px' } : '0'}
        rounded='2xl'
        shadow='md'
        borderWidth='1px'
        transition={'padding 350ms ease-in-out'}
      >
        <Button
          variant={'unstyled'}
          w={'full'}
          fontSize={{ base: '18px', md: '20px', xl: '24px' }}
          fontWeight={600}
          lineHeight={'24px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          onClick={() => {
            const nameOk = !errors.firstName && !errors.lastName && (safeGet('firstName') || safeGet('lastName'));
            if (nameOk) toggle('location');
          }}
          color={'black'}
          p={
            open === 'location'
              ? { base: '20px 0 0', md: '24px 0 0', xl: '30px 0 0' }
              : { base: '20px 16px', md: '24px 32px', xl: '30px 60px' }
          }
          transition={'padding 350ms ease-in-out'}
        >
          <HStack>
            <Icon as={LocationIcon} w={'42px'} h={'42px'} />
            <VStack alignItems={'start'} justifyContent={'start'} gap={'12px'}>
              <Text>{t('whereShouldWeBringTheInternet')}</Text>
              {safeGet('location.fullAddress') ? (
                <Text
                  fontSize={'18px'}
                  lineHeight={'18px'}
                  fontWeight={500}
                  color={'#6e6e6e'}
                  maxW='560px'
                  whiteSpace='normal'
                  wordBreak='break-word'
                >
                  {safeGet('location.fullAddress')}
                </Text>
              ) : null}
            </VStack>
          </HStack>
          {!errors.pinCode && !errors.location && safeGet('location.fullAddress') && open !== 'location' && (
            <SquareEditIcon />
          )}
        </Button>

        <AnimatePresence initial={false}>
          {open === 'location' && (
            <MotionBox
              transition={transition}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              overflow='hidden'
            >
              <Flex flexDir={'column'} gap={'24px'} mt={'24px'} w={'100%'}>
                <Controller
                  name='pinCode'
                  control={control}
                  render={({ field }) => (
                    <Box display='flex' flexDirection='column' alignItems={'start'} gap='6px' pos={'relative'}>
                      <Text fontSize='14px' lineHeight={'14px'} color='font_color.primary'>
                        {t('pinCode')}
                      </Text>
                      <Input
                        {...field}
                        placeholder={t('pinCode')}
                        maxLength={6}
                        inputMode='numeric'
                        pattern='[0-9]*'
                        borderRadius='6px'
                        border='1px'
                        borderStyle='solid'
                        borderColor={errors.pinCode ? 'toast.error' : '#A0A0A0'}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ''); // remove non-digits
                          if (val.length <= 6) field.onChange(val);
                        }}
                      />
                      {errors.pinCode && <ErrorText field={errors.pinCode.message} />}
                    </Box>
                  )}
                />
                <Controller
                  name='location'
                  control={control}
                  render={({ field }) => (
                    <Box w='100%' position='relative'>
                      <InputGroup
                        borderRadius='6px'
                        border='1px solid #A0A0A0'
                        endAddon={
                          <Button variant='unstyled' onClick={() => setPopupOpen(true)}>
                            {t('Select on the map')} <NavigationIcon />
                          </Button>
                        }
                      >
                        <Input
                          placeholder={t('location')}
                          value={field.value?.fullAddress || ''}
                          border={0}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange({ fullAddress: value, lat: null, lng: null });
                            search(value);
                          }}
                        />
                      </InputGroup>
                      {predictions.length > 0 && (
                        <Box
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
                      {errors.location?.fullAddress && <ErrorText field={errors.location.fullAddress.message} />}
                      {errors.location?.lat && <ErrorText field={errors.location.lat.message} />}
                      {errors.location?.lng && <ErrorText field={errors.location.lng.message} />}
                    </Box>
                  )}
                />

                <Flex justifyContent={'flex-end'} gap={3}>
                  <Button variant={'outline'} borderRadius={'99px'} onClick={handleLocationConfirm}>
                    <PenIcon />
                    {t('confirmAddress')}
                  </Button>
                </Flex>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Box
        bg='white'
        p={open === 'contact' ? { base: '0 16px 24px', md: '0 60px 60px' } : '0'}
        rounded='2xl'
        shadow='md'
        borderWidth='1px'
        transition={'padding 350ms ease-in-out'}
      >
        <Button
          variant={'unstyled'}
          w={'full'}
          fontSize={{ base: '18px', md: '20px', xl: '24px' }}
          fontWeight={600}
          lineHeight={'24px'}
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          onClick={() => toggle('contact')}
          color={'black'}
          p={open === 'contact' ? { base: '20px 0 0', md: '30px 0 0' } : { base: '20px 16px', md: '30px 60px' }}
          transition={'padding 350ms ease-in-out'}
        >
          <HStack>
            <Icon as={MessageIcon} w={'42px'} h={'42px'} />
            <VStack alignItems={'start'} justifyContent={'start'} gap={'12px'}>
              <Text>{t('howCanWeReachYou')}</Text>
              {(safeGet('mobileNumber') || safeGet('mailId')) && (
                <Text fontSize={'18px'} lineHeight={'18px'} fontWeight={500} color={'#6e6e6e'}>
                  {`${safeGet('mobileNumber', '')} ${safeGet('mailId', '')}`.trim()}
                </Text>
              )}
            </VStack>
          </HStack>
          {(safeGet('mobileNumber') || safeGet('mailId')) && open !== 'contact' && <SquareEditIcon />}
        </Button>

        <AnimatePresence initial={false}>
          {open === 'contact' && (
            <MotionBox
              transition={transition}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              overflow='hidden'
            >
              <Flex flexDir={'column'} gap={'24px'} mt={'24px'} w={'100%'}>
                <Controller
                  name='mobileNumber'
                  control={control}
                  render={({ field }) => (
                    <Box display='flex' flexDirection='column' alignItems={'start'} gap='6px' pos={'relative'}>
                      <Text fontSize='14px' lineHeight={'14px'} color='font_color.primary'>
                        {t('mobileNumber')}
                      </Text>
                      <Input
                        {...field}
                        placeholder={t('mobileNumber')}
                        maxLength={10}
                        inputMode='numeric'
                        pattern='[0-9]*'
                        borderRadius='6px'
                        border='1px'
                        borderStyle='solid'
                        borderColor={errors.mobileNumber ? 'toast.error' : '#A0A0A0'}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) field.onChange(val);
                        }}
                      />
                      {errors.mobileNumber && <ErrorText field={errors.mobileNumber.message} />}
                    </Box>
                  )}
                />
                <Controller
                  name='mailId'
                  control={control}
                  render={({ field }) => (
                    <Box display='flex' flexDirection='column' alignItems={'start'} gap='6px' pos={'relative'}>
                      <Text fontSize='14px' lineHeight={'14px'} color='font_color.primary'>
                        {t('emailId')}
                      </Text>
                      <Input
                        {...field}
                        placeholder={t('emailId')}
                        borderRadius='6px'
                        border={'1px'}
                        borderStyle={'solid'}
                        borderColor={errors.mailId ? 'toast.error' : '#A0A0A0'}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      {errors.mailId && <ErrorText field={errors.mailId.message} />}
                    </Box>
                  )}
                />
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
      <Flex justifyContent='center' px={{ base: '16px', md: 0 }}>
        <Button
          borderRadius={'99px'}
          w={{ base: '100%', md: 'auto' }}
          onClick={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        >
          {t('confirmBooking')}
          <BsCheckCircle />
        </Button>
      </Flex>
      <MapPopup isOpen={popupOpen} setIsOpen={setPopupOpen} handleSelect={handleSelect} />
      <OtpPopup isOpen={otpPopupOpen} setIsOpen={(val) => dispatch(commonSliceActions.setOtpPopupOpen(val))} />
      <HomeEnquiryDataPopup
        isOpen={homeEnquiryDataPopupOpen}
        setIsOpen={handleEnquiryPopupClose}
        enquiryData={homeEnquiryData}
      />
    </Flex>
  );
}
