import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormController,
  Icons,
  Image,
  Input,
  InputGroup,
  SimpleGrid,
  Text,
  useForm
} from '@kfonbss/bss-ui-components';
import { useRouter } from '@tanstack/react-router';
import _ from 'lodash-es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import bgImage from '@/assets/landingPage/BG.png';
import homeEnquiryImage from '@/assets/landingPage/homeEnquiry.png';
import { EditIcon, TickIcon } from '@/assets/svg';
import { NavigationIcon } from '@/components/custom';
import { fetchPostOficeByPincode } from '@/features/common/actions';
import { getPostOfficeByPincode } from '@/features/common/selectors';
import { fetchEnquiryDetails, updateCorporateEnquiry } from '@/features/corporate/action';
import { getEnquiryDetailsData } from '@/features/corporate/selector';
import { sendOtpForForms } from '@/features/public/common/actions';
import OtpPopup from '@/features/public/common/components/OtpPopup';
import SuccessPopup from '@/features/public/common/components/SuccessPopup';
import { STATE_REDUCER_KEY as COMMON_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';
import { allowOnlyAlpha, stripExtraSpaces } from '@/utils/validationUtils';

import {
  fetchDepartment,
  fetchService
} from '../action';
import { CUSTOMER_TYPES } from '../constants';
import { formatCorpGovEnquiryRequest } from '../helpers';
import {
  getCorpGovSubscriberSubmitDetails,
  getDepartmentList,
  getServiceList
} from '../selector';
import { corporateGovernmentEnquirySchema } from '../validations';
import AddServicesPopup from './AddServicesPopup';
import CircleSelect from './CircleSelect';
import MapPopup from './MapPopup';
import TrackEnquiryPopup from './TrackEnquiryPopup';

const { CirclePlusIcon } = Icons;

const CorporateGovernmentEnquiry = ({ tabType, hideLeftSection = false, enquiryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const isSuccessOpen = useSelector((s) => s[COMMON_KEY].successPopupOpen);
  const otpPopupOpen = useSelector((state) => state[COMMON_KEY].otpPopupOpen);

  const [serviceConnections, setServiceConnections] = useState([]);
  const [isAddServicesOpen, setIsAddServicesOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const { predictions, search, setPredictions } = usePlacesAutocomplete();

  const DEFAULT_VALUES = {
    circle: null,
    customerType: '',
    department: '',
    subDepartment: '',
    organizationName: '',
    contactPerson: '',
    mobileNumber: '',
    altMobileNumber: '',
    email: '',
    pinCode: '',
    district: '',
    districtId: '',
    postOffice: '',
    location: '',
    latitude: '',
    longitude: '',
    industry: '',
    service: '',
    services: []
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(corporateGovernmentEnquirySchema(t))
  });
  const postOfficeMaster = useSelector(getPostOfficeByPincode);
  const serviceList = useSelector(getServiceList);
  const departmentList = useSelector(getDepartmentList);
  const corpGovSavedDetails = useSelector(getCorpGovSubscriberSubmitDetails);
  const { data: enquiryDetails } = useSelector(getEnquiryDetailsData);

  const postOffice = watch('postOffice');
  const selectedCustomerType = watch('customerType');
  const isGovernment = selectedCustomerType === 'GOVERNMENT' || selectedCustomerType?.code === 'GOVERNMENT';
  useEffect(() => {
    dispatch(fetchService());
    // Reset any stale popup state from a previous submission so the page is interactive
    dispatch(commonSliceActions.clearAll());
    return () => {
      dispatch(commonSliceActions.clearAll());
    };
  }, [dispatch]);

  useEffect(() => {
    if (enquiryId) {
      dispatch(fetchEnquiryDetails({ enquiryId }));
    }
  }, [enquiryId, dispatch]);

  useEffect(() => {
    if (enquiryId && enquiryDetails && Object.keys(enquiryDetails).length > 0) {
      const services = enquiryDetails?.requestedServices || enquiryDetails?.services || [];
      setServiceConnections(services);
      const companyTypeCode = enquiryDetails?.customerType || enquiryDetails?.companyType || '';
      const matchedCustomerType = CUSTOMER_TYPES.find(
        (ct) => ct.code === companyTypeCode || ct.name === companyTypeCode
      ) || companyTypeCode;
      reset({
        customerType: matchedCustomerType,
        department: enquiryDetails?.department || '',
        subDepartment: enquiryDetails?.subDepartment || '',
        organizationName: enquiryDetails?.organizationName || enquiryDetails?.companyName || '',
        contactPerson: enquiryDetails?.contactPerson || enquiryDetails?.contactName || '',
        mobileNumber: enquiryDetails?.mobileNumber || String(enquiryDetails?.contactNumber || '') || '',
        altMobileNumber: enquiryDetails?.altMobileNumber || '',
        email: enquiryDetails?.email || enquiryDetails?.emailId || '',
        pinCode: enquiryDetails?.pinCode || enquiryDetails?.pincode || '',
        district: enquiryDetails?.district || '',
        districtId: enquiryDetails?.districtId || '',
        postOffice: enquiryDetails?.postOffice || '',
        location: enquiryDetails?.location || enquiryDetails?.address || enquiryDetails?.installationAddress || enquiryDetails?.companyLocation || '',
        latitude: enquiryDetails?.latitude?.toString() || '',
        longitude: enquiryDetails?.longitude?.toString() || '',
        industry: enquiryDetails?.industry || '',
        service: enquiryDetails?.service || '',
        services
      });
    }
  }, [enquiryId, enquiryDetails, reset]);

  useEffect(() => {
    if (isGovernment) {
      dispatch(fetchDepartment());
    }
  }, [dispatch, isGovernment]);

  const departmentChange = () => {
    // Sub Department not required for Government enquiry — no API call on department change
    setValue('subDepartment', '');
  };

  useEffect(() => {
    if (!_.isEmpty(postOfficeMaster)) {
      if (Array.isArray(postOfficeMaster)) {
        if (postOffice) {
          const selectedPostOffice = postOfficeMaster?.find(
            (item) =>
              item?.id === postOffice ||
              item?.value === postOffice ||
              item?.postOffice === postOffice ||
              (typeof postOffice === 'object' && item?.id === postOffice?.id)
          );
          if (selectedPostOffice) {
            setValue('district', selectedPostOffice?.district, { shouldValidate: true });
            setValue('districtId', selectedPostOffice?.districtId);
          }
        }
      } else if (postOfficeMaster?.district) {
        setValue('district', postOfficeMaster?.district, { shouldValidate: true });
        setValue('districtId', postOfficeMaster?.districtId);
      }
    }
  }, [postOffice, postOfficeMaster, setValue]);

  const onSubmit = (formValues) => {
    const payload = {
      ...formValues,
      connectionType: tabType,
      services: serviceConnections
    };
    const formattedPayload = formatCorpGovEnquiryRequest(payload);

    if (enquiryId) {
      dispatch(updateCorporateEnquiry({
        enquiryId,
        ...formattedPayload,
        onSuccess: () => router.navigate({ to: '/app/corporate/enquiry-list' })
      }));
    } else {
      dispatch(sendOtpForForms({
        ...formattedPayload,
        cusMobile: formattedPayload.contactNumber,
        enquiryType: 'CORP_GOV'
      }));
    }
  };

  const handleSuccessClose = (val) => {
    dispatch(commonSliceActions.setSuccessPopupOpen(val));

    if (!val) {
      reset(DEFAULT_VALUES);
      setServiceConnections([]);
      setValue('services', [], { shouldValidate: true });
      router.navigate({ to: hideLeftSection ? '/app/corporate/enquiry-list' : '/' });
    }
  };

  const pincodeChange = (e) => {
    const value = e?.target?.value;
    setValue('postOffice', '');
    setValue('district', '');
    setValue('districtId', '');

    if (value?.length === 6) {
      dispatch(fetchPostOficeByPincode({ pinCode: value }));
    }
  };

  const addServiceConnection = () => {
    setIsAddServicesOpen(true);
  };

  const handleSaveServices = (services) => {
    setServiceConnections(services);
    setValue('services', services, { shouldValidate: true, shouldDirty: true });
  };

  const handleSelect = (loc) => {
    setValue('location', loc.fullAddress || '', { shouldValidate: true, shouldDirty: true });
    if (loc.lat && loc.lng) {
      setValue('latitude', loc.lat.toString(), { shouldValidate: true });
      setValue('longitude', loc.lng.toString(), { shouldValidate: true });
    }
  };

  const handlePlaceClick = async (item) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    const { results } = await geocoder.geocode({ placeId: item.place_id });

    if (!results?.length) return;

    const result = results[0];
    const loc = result.geometry.location;

    setValue('location', result.formatted_address, { shouldValidate: true, shouldDirty: true });
    setValue('latitude', loc.lat().toString(), { shouldValidate: true });
    setValue('longitude', loc.lng().toString(), { shouldValidate: true });

    setPredictions([]);
  };

  return (
    <>
      <Box
        w='100%'
        position='relative'
        display='flex'
        alignItems='flex-start'
        justifyContent='center'
        p={hideLeftSection ? 0 : { base: '20px', md: '85px' }}
        zIndex={0}
        _before={hideLeftSection ? {} : {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: -1
        }}
      >
        <Flex
          w='100%'
          maxW={hideLeftSection ? '100%' : '1600px'}
          direction={{ base: 'column', lg: 'row' }}
          alignItems='center'
          justifyContent='space-between'
          gap={{ base: 10, lg: 32 }}
        >
          {!hideLeftSection && (
            <Box flex='1' textAlign='center' minW={{ lg: '600px' }} display='flex' flexDirection='column' alignItems='center'>
              <Text
                display={'flex'}
                justifyContent='center'
                alignItems={'center'}
                p={0}
                pb={{ base: '5px', xl: '20px' }}
                m={0}
                gap={'8px'}
                fontSize={{ base: '12px', '2xl': '20px', xl: '14px' }}
                lineHeight={{ '2xl': '16px', xl: '14px' }}
                fontWeight={500}
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
                fontSize={{ base: '24px', md: '36px', '2xl': '36px', xl: '32px' }}
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
                fontSize={{ base: '14px', md: '18px' }}
                color='#292929'
                lineHeight='1.6'
                fontWeight='500'
                textAlign='center'
                maxW='550px'
              >
                {t('homeEnquirySubText')}
              </Text>
            </Box>
          )}

          <Box
            flex={{ base: 1, xl: 1.5 }}
            w='100%'
            maxW={hideLeftSection ? '100%' : '1050px'}
            bg={hideLeftSection ? 'transparent' : 'white'}
            borderRadius={hideLeftSection ? 0 : '24px'}
            boxShadow={hideLeftSection ? 'none' : '0 20px 40px rgba(0,0,0,0.08)'}
            p={hideLeftSection ? 0 : { base: '24px', md: '40px', xl: '60px' }}
          >
            {!hideLeftSection && (
              <Text
                fontSize={{ base: '24px', md: '28px' }}
                fontWeight='700'
                textAlign='center'
                mb='40px'
                color='#2D3748'
              >
                {t('corporateGovernmentConnection')}
              </Text>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <SimpleGrid
                columns={{ base: 1, md: 2, xl: hideLeftSection ? 3 : 2 }}
                columnGap={{ base: 4, md: 6, xl: 8 }}
                rowGap={4}
              >
                <FormController
                  labelName={t('customerType')}
                  name='customerType'
                  type='select'
                  options={CUSTOMER_TYPES}
                  placeholder={t('choose', { 0: t('customerType') })}
                  control={control}
                  errors={errors}
                  required
                  optionKey='code'
                />
                {isGovernment && (
                  <>
                    <FormController
                      labelName={t('department')}
                      name='department'
                      type='select'
                      items={departmentList}
                      placeholder={t('choose', { 0: t('department') })}
                      control={control}
                      errors={errors}
                      onOptionSelect={departmentChange}
                      required
                    />
                    {/* Sub Department not required for Government enquiry */}
                    {/* <FormController
                      labelName={t('subDepartment')}
                      name='subDepartment'
                      type='select'
                      items={subDepartmentList}
                      placeholder={t('choose', { 0: t('subDepartment') })}
                      control={control}
                      errors={errors}
                      required
                    /> */}
                  </>
                )}
                <Box
                  gridColumn={
                    isGovernment
                      ? '1 / -1'
                      : hideLeftSection
                        ? { base: 'auto', xl: 'span 2' }
                        : 'auto'
                  }
                >
                  <FormController
                    labelName={t('nameOfTheOrganizationCompany')}
                    name='organizationName'
                    placeholder={t('enter', { 0: t('nameOfTheOrganizationCompany') })}
                    control={control}
                    errors={errors}
                    required
                    maxLength={100}
                    onInput={stripExtraSpaces}
                  />
                </Box>
                <FormController
                  labelName={t('contactPerson')}
                  name='contactPerson'
                  placeholder={t('enter', { 0: t('contactPerson') })}
                  control={control}
                  errors={errors}
                  required
                  maxLength={50}
                  onKeyDown={allowOnlyAlpha}
                  onInput={stripExtraSpaces}
                />
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
                />
                <FormController
                  labelName={t('emailId')}
                  name='email'
                  placeholder={t('enter', { 0: t('emailId') })}
                  control={control}
                  errors={errors}
                  required
                  type='email'
                  maxLength={100}
                />
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
                  handleChange={(e) => pincodeChange(e)}
                />

                {/* Commented out Fields */}
                {/* 
                  <FormController
                    labelName={t('alternativeMobileNumber')}
                    name='altMobileNumber'
                    placeholder={t('enter', { 0: t('alternativeMobileNumber') })}
                    control={control}
                    errors={errors}
                    maxLength={10}
                    inputMode='numeric'
                    pattern='[0-9]*'
                    onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                  />
                  <FormController
                    labelName={t('postOffice')}
                    name='postOffice'
                    type='select'
                    items={postOfficeMaster}
                    placeholder={t('choose', { 0: t('postOffice') })}
                    control={control}
                    errors={errors}
                    required
                  />
                  <FormController
                    labelName={t('district')}
                    name='district'
                    placeholder={t('district')}
                    control={control}
                    errors={errors}
                    required
                    readOnly
                  />
                  <FormController
                    labelName={t('latitude') + ' & ' + t('longitude')}
                    name='latitude'
                    placeholder={t('enter', { 0: t('latitude') + ' & ' + t('longitude') })}
                    control={control}
                    errors={errors}
                    inputMode='decimal'
                    onInput={(e) => (e.target.value = e.target.value.replace(/[^0-9.]/g, ''))}
                    readOnly
                  />
                */}

                <Box w='100%' position='relative' gridColumn={hideLeftSection ? 'auto' : { base: '1 / -1', md: '1 / span 2' }}>
                  <Box mb='8px' fontSize='14px' fontWeight='normal' color={errors.location ? '#D72D2E' : '#272727'}>
                    {hideLeftSection ? t('installationAddress') : t('locationAddress')} <Box as='span'>*</Box>
                  </Box>
                  <InputGroup
                    borderRadius='6px'
                    border='1px solid'
                    borderColor={errors.location ? 'red.500' : '#A0A0A0'}
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
                        whiteSpace="nowrap"
                      >
                        {t('Select on the map')} <NavigationIcon ml={2} />
                      </Button>
                    }
                  >
                    <Input
                      placeholder={t('enter', { 0: hideLeftSection ? t('installationAddress') : t('locationAddress') })}
                      value={watch('location') || ''}
                      border={0}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue('location', value);
                        search(value);
                        setValue('latitude', '');
                        setValue('longitude', '');
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
                  {errors.location && (
                    <Box position='absolute' right='0' fontSize='12px' color='#D72D2E' mt='4px' textAlign='right'>
                      {errors.location.message}
                    </Box>
                  )}
                </Box>

                <Box w='100%' position='relative' gridColumn={hideLeftSection ? 'auto' : { base: '1 / -1', md: '1 / span 2' }}>
                  <Box mb='8px' fontSize='14px' fontWeight='normal' color={errors.services ? '#D72D2E' : '#272727'}>
                    {t('requiredServices')} <Box as='span'>*</Box>
                  </Box>
                  <InputGroup
                    borderRadius='6px'
                    border='1px solid'
                    borderColor={errors.services ? 'red.500' : '#A0A0A0'}
                    _hover={{ borderColor: '#A0A0A0' }}
                    h='48px'
                    endAddon={
                      <Button
                        variant='unstyled'
                        onClick={addServiceConnection}
                        display='flex'
                        alignItems='center'
                        color='#8B1538'
                        fontWeight='600'
                        fontSize='14px'
                        px={3}
                        h='100%'
                      >
                        {serviceConnections.length > 0 ? (
                          <>
                            {t('viewAndEdit')} <EditIcon ml={2} />
                          </>
                        ) : (
                          <>
                            {t('add')} <CirclePlusIcon ml={2} />
                          </>
                        )}
                      </Button>
                    }
                  >
                    <Input
                      placeholder={t('addRequiredServices')}
                      value={
                        serviceConnections.length > 0
                          ? serviceConnections
                            .slice(0, 3)
                            .map((s, i) => s.serviceName || (s.serviceId ? `Service ${s.serviceId}` : `Service ${i + 1}`))
                            .join(', ') + (serviceConnections.length > 3 ? (' + ' + (serviceConnections.length - 3) + ' more') : '')
                          : ''
                      }
                      readOnly
                      onClick={addServiceConnection}
                      cursor='pointer'
                      border={0}
                      _focus={{ boxShadow: 'none', border: 'none' }}
                      focusBorderColor='transparent'
                      _focusVisible={{ outline: 'none' }}
                    />
                  </InputGroup>
                  {errors.services && (
                    <Box position='absolute' right='0' fontSize='12px' color='#E53E3E' mt='4px' textAlign='right'>
                      {errors.services.message}
                    </Box>
                  )}
                </Box>

              </SimpleGrid>

              {hideLeftSection ? (
                <Flex w='full' justify='flex-end' pb={5} pr='5' mt={10}>
                  <ButtonGroup spacing={4}>
                    <Button type='button' disabled={false} cursor='pointer' variant='outline' borderColor='#8D0247' color='#8D0247' borderRadius='full' h='12' px='8' onClick={() => router.history.back()}>
                      &larr; {t('back')}
                    </Button>
                    <Button type='submit' disabled={false} cursor='pointer' bg='#8D0247' color='white' borderRadius='full' h='12' px='8' _hover={{ bg: '#700138' }}>
                      {t('submit')} &rarr;
                    </Button>
                  </ButtonGroup>
                </Flex>
              ) : (
                <Flex justifyContent='center' mt='40px' direction='column' alignItems='center'>
                  <Button
                    type='submit'
                    disabled={false}
                    cursor='pointer'
                    w='auto'
                    minW='180px'
                    px='8'
                    py='6'
                    borderRadius='full'
                    bg='#8B1538'
                    color='white'
                    fontSize='16px'
                    fontWeight='600'
                    _hover={{ bg: '#6D1028' }}
                  >
                    {t('generateOTP')}
                    <Box as='span' ml={2}><TickIcon /></Box>
                  </Button>

                  <Text fontSize='14px' color='#292929' mt={4}>
                    {t('alreadyHaveABooking')}
                    <Box
                      as='span'
                      color='#8B1538'
                      fontWeight='700'
                      ml={1}
                      cursor='pointer'
                      onClick={() => setIsTrackOpen(true)}
                    >
                      {t('trackHere')}
                    </Box>
                  </Text>
                </Flex>
              )}
            </form>
          </Box>
        </Flex>
      </Box>
      <AddServicesPopup
        isOpen={isAddServicesOpen}
        onClose={setIsAddServicesOpen}
        serviceList={serviceList}
        onSave={handleSaveServices}
        initialServices={serviceConnections}
      />
      <SuccessPopup
        isOpen={isSuccessOpen}
        setIsOpen={handleSuccessClose}
        message={`${t('successMsgOne')} ${corpGovSavedDetails?.trackingId} ${t('successMsgTwo')}`}
      />
      <OtpPopup isOpen={otpPopupOpen} setIsOpen={(val) => dispatch(commonSliceActions.setOtpPopupOpen(val))} confirmLabel={t('confirm')} />
      <MapPopup
        isOpen={popupOpen}
        setIsOpen={setPopupOpen}
        handleSelect={handleSelect}
        initialLat={watch('latitude')}
        initialLng={watch('longitude')}
      />
      <TrackEnquiryPopup isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} />
    </>
  );
};

export default CorporateGovernmentEnquiry;
