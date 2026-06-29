import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Flex,
  FormController,
  HStack,
  Icons,
  Popup,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import EnquiryImage from '@/assets/enquiry/EnquiryImage.png';
import EnquiryNoData from '@/assets/enquiry/EnquiryNoData.png';
import { BsCheckCircle, CrossCircleIcon, LocationIcon } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { DATE_FORMAT } from '@/constants/date';
import { formatDisplayDate, formatDisplayTime, getDurationSince } from '@/utils/dateUtils';

import { fetchEnquiryTracking } from '../action';
import { getEnquiryTrackingData, getEnquiryTrackingError, getEnquiryTrackingLoading } from '../selector';
import { actions as enquirySliceActions } from '../slice';
import { trackEnquirySchema } from '../validations';

const { ClockOutline, CalendarNewIcon, NoteIcon, MobileNewIcon, NewEmailIcon, DeviceRequest } = Icons;

const formatStatus = (status = '') =>
  status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

const getStatusStyle = (status = '') => {
  const s = status.toUpperCase();
  if (s.includes('COMPLETED') || s.includes('CONNECTED') || s.includes('ACTIVE'))
    return { color: '#16A34A', bg: '#DCFCE7', iconType: 'success' };
  if (s.includes('PENDING') || s.includes('PROCESSING') || s.includes('KYC'))
    return { color: '#D97706', bg: '#FEF3C7', iconType: 'loop' };
  if (s.includes('SUBMITTED')) return { color: '#2563EB', bg: '#DBEAFE', iconType: 'transfer' };
  if (s.includes('ENQUIRY')) return { color: '#6B7280', bg: '#F3F4F6', iconType: 'transfer' };
  if (s.includes('REJECTED') || s.includes('CANCELLED')) return { color: '#DC2626', bg: '#FEE2E2', iconType: 'error' };
  return { color: '#6B7280', bg: '#F3F4F6', iconType: 'transfer' };
};

const ICON_MAP = {
  success: BsCheckCircle,
  transfer: LocationIcon,
  loop: ClockOutline,
  error: CrossCircleIcon
};

const TrackIcon = ({ type, bg }) => {
  const Icon = ICON_MAP[type] || DeviceRequest;
  return <Icon boxSize='36px' color={bg} flexShrink={0} />;
};

const StatusBadge = ({ label, color, bg }) => (
  <Box px='12px' py='3px' borderRadius='full' bg={bg} flexShrink={0}>
    <Text fontSize='14px' fontWeight='600' color={color}>
      {label}
    </Text>
  </Box>
);

const TrackEnquiryPopup = ({ isOpen, onClose, data, defaultTrackingId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const trackingData = useSelector(getEnquiryTrackingData);
  const isLoading = useSelector(getEnquiryTrackingLoading);
  const trackingError = useSelector(getEnquiryTrackingError);
  const scrollRef = useRef(null);

  const resultData = data || trackingData;
  const showResults = !!resultData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: { trackingId: '' },
    resolver: yupResolver(trackEnquirySchema(t))
  });

  useEffect(() => {
    if (isOpen) {
      const id = defaultTrackingId ? String(defaultTrackingId) : '';
      reset({ trackingId: id });
      lastSearchedIdRef.current = '';
      dispatch(enquirySliceActions.clearEnquiryTrackingData());
      if (id) {
        dispatch(fetchEnquiryTracking({ trackingId: id }));
      }
    }
  }, [isOpen, reset, dispatch, defaultTrackingId]);

  const lastSearchedIdRef = useRef('');

  const handleSearch = handleSubmit((values) => {
    if (showResults && values.trackingId === lastSearchedIdRef.current) {
      setTimeout(() => scrollRef.current?.focus(), 100);
      return;
    }
    lastSearchedIdRef.current = values.trackingId;
    dispatch(fetchEnquiryTracking({ trackingId: values.trackingId }));
    setTimeout(() => scrollRef.current?.focus(), 100);
  });

  const history = resultData?.history || [];
  const enqStatusStyle = getStatusStyle(resultData?.status);

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={onClose}
      size='xl'
      closeButton={false}
    >
      <CustomLoaderProvider isLoading={isLoading}>
        <Box
          ref={scrollRef}
          px='8px'
          py='8px'
          overflowY='auto'
          maxH='75vh'
          tabIndex={-1}
          _focus={{ outline: 'none' }}
        >
          {!defaultTrackingId && (
            <Box bg='#F7F7F8' borderRadius='16px' px={{ base: '12px', md: '16px' }} py={{ base: '20px', md: '28px' }} mb='20px'>
              <HStack justify='center' spacing='8px' mb='10px'>
                <svg width='25' height='13' viewBox='0 0 25 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <rect x='5.5' y='0.5' width='19' height='12' rx='6' stroke='#8D0247' />
                  <rect width='19' height='13' rx='6.5' fill='#8D0247' />
                </svg>
                <Text fontSize='13px' fontWeight='700' color='#232F50' textTransform='uppercase' letterSpacing='0.5px'>
                  {t('bestInternetProvider')}
                </Text>
              </HStack>

              <Text
                textAlign='center'
                fontSize='34.4px'
                fontWeight={800}
                lineHeight='1.2'
                letterSpacing='0px'
                color='#8D0247'
                textTransform='uppercase'
                my='8px'
              >
                {t('trackYourEnquiry')}
              </Text>

              <Box
                as='form'
                onSubmit={(e) => {
                  e.stopPropagation();
                  handleSearch(e);
                }}
              >
                <HStack spacing={3} align='center' justify='center'>
                  <Box flex={1} maxW='560px'>
                    <FormController
                      control={control}
                      name='trackingId'
                      placeholder={t('enterTrackingId')}
                      maxLength={10}
                      height='44px'
                      inputMode='numeric'
                      onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ''))}
                      errors={errors}
                      required
                    />
                  </Box>
                  <Button
                    variant='outline'
                    borderColor='#8D0247'
                    color='#8D0247'
                    borderRadius='8px'
                    h='44px'
                    minH='44px'
                    px='6'
                    flexShrink={0}
                    _hover={{ bg: '#FDF2F8' }}
                    type='submit'
                  >
                    {t('search')}
                  </Button>
                </HStack>
              </Box>
            </Box>
          )}

          {trackingError && !resultData && !isLoading && (
            <VStack
              spacing='12px'
              bg='#F7F7F8'
              borderRadius='16px'
              py={{ base: '32px', md: '48px' }}
              px={{ base: '12px', md: '16px' }}
            >
              <Box as='img' src={EnquiryNoData} alt='no-enquiry-data' maxW='280px' w='100%' h='auto' />
              <Text fontWeight={500} fontSize='16.76px' lineHeight='24.7px' color='#8E8E8E' textAlign='center'>
                {t('validations.pleaseEnterValidEnquiryId')}
              </Text>
              <Text
                fontWeight={400}
                fontSize='12.35px'
                lineHeight='17.64px'
                color='#6B7280'
                textAlign='center'
                maxW='420px'
              >
                {t('validations.validEnquiryIdInfo')}
              </Text>
            </VStack>
          )}

          {!resultData && !trackingError && !defaultTrackingId && !isLoading && (
            <VStack
              spacing='12px'
              bg='#F7F7F8'
              borderRadius='16px'
              py={{ base: '32px', md: '48px' }}
              px={{ base: '12px', md: '16px' }}
            >
              <Box as='img' src={EnquiryImage} alt='track-enquiry' maxW='280px' w='100%' h='auto' />
              <Text fontWeight={500} fontSize='16.76px' lineHeight='24.7px' color='#8D0247' textAlign='center'>
                {t('validations.whatIsMyTrackingNumber')}
              </Text>
              <Text
                fontWeight={400}
                fontSize='12.35px'
                lineHeight='17.64px'
                color='#6B7280'
                textAlign='center'
                maxW='420px'
              >
                {t('validations.trackingNumberInfo')}
              </Text>
            </VStack>
          )}

          {showResults && resultData && (
            <Box bg='#F7F7F8' borderRadius='16px' px={{ base: '12px', md: '16px' }} py={{ base: '16px', md: '20px' }}>
              {/* Enquiry Details */}
              <Text fontSize='13px' fontWeight='700' color='#8D0247' mb='12px'>
                {t('enquiryDetails')}
              </Text>
              <Box bg='white' border='1px solid #E5E7EB' borderRadius='12px' overflow='hidden' mb='24px'>
                {/* Row 1: ID | Name | Status | Location | Enquiry Date | Duration */}
                <Flex
                  px='20px'
                  py='14px'
                  justify='space-between'
                  align='center'
                  gap='12px'
                  flexWrap='wrap'
                >
                  <HStack spacing='10px' flexWrap='wrap'>
                    {resultData.trackingId && (
                      <Box bg='#FFE9A8' px='10px' py='3px' borderRadius='6px' flexShrink={0}>
                        <Text fontSize='13px' fontWeight='700' color='#232F50'>
                          {t('idLabel')} {resultData.trackingId}
                        </Text>
                      </Box>
                    )}
                    <Text fontSize='14px' fontWeight='700' color='#232F50'>
                      {resultData.name}
                    </Text>
                    {resultData.address && (
                      <Text fontWeight={600} fontSize='14px' lineHeight='100%' color='#6B7280'>
                        {resultData.address}
                        {resultData.pincode && (
                          <Text as='span' fontWeight={600} color='#232F50'>
                            {' | '}
                            {resultData.pincode}
                          </Text>
                        )}
                      </Text>
                    )}
                  </HStack>
                  <HStack spacing='10px' flexShrink={0} flexWrap='wrap'>
                    <Text fontSize='14px' color='#232F50'>
                      {t('enquiryDateLabel')}{' '}
                      <Text as='span' fontWeight='600'>
                        {formatDisplayDate(resultData.createdDate, DATE_FORMAT.DATE)}
                      </Text>{' '}
                      <Text as='span' fontWeight='600'>
                        {formatDisplayTime(resultData.createdDate)}
                      </Text>
                    </Text>
                    <HStack spacing='4px'>
                      {ClockOutline && <ClockOutline boxSize='16px' color='#6B7280' />}
                      <Text fontSize='14px' fontWeight='700' color='#232F50'>
                        {getDurationSince(resultData.createdDate)}
                      </Text>
                    </HStack>
                  </HStack>
                </Flex>

                {/* Row 2: Contact Person | Mobile | Email | Source | Total Connections */}
                <Flex
                  px='20px'
                  py='12px'
                  justify='space-between'
                  align='center'
                  gap='12px'
                  flexWrap='wrap'
                >
                  <HStack spacing='14px' flexWrap='wrap'>
                    {resultData.contactPerson && (
                      <Text fontSize='13px' color='#232F50'>
                        {t('contactPersonNameLabel')}{' '}
                        <Text as='span' fontWeight='600'>
                          {resultData.contactPerson}
                        </Text>
                      </Text>
                    )}
                    {resultData.mobile && (
                      <HStack spacing='6px'>
                        {MobileNewIcon && <MobileNewIcon boxSize='18px' color='#919191' />}
                        <Text fontWeight={600} fontSize='14px' lineHeight='100%' color='#232F50'>
                          {resultData.mobile}
                        </Text>
                      </HStack>
                    )}
                    {resultData.email && (
                      <HStack spacing='6px'>
                        {NewEmailIcon && <NewEmailIcon boxSize='16px' color='#919191' />}
                        <Text fontWeight={600} fontSize='14px' lineHeight='100%' color='#232F50'>
                          {resultData.email}
                        </Text>
                      </HStack>
                    )}
                    {resultData.source && (
                      <Text fontSize='13px' color='#232F50'>
                        {t('sourceLabel')}{' '}
                        <Text as='span' fontWeight='600'>
                          {resultData.source}
                        </Text>
                      </Text>
                    )}
                  </HStack>
                  <HStack spacing='10px' flexShrink={0} flexWrap='wrap'>
                    {resultData.totalConnections != null && (
                      <Box border='1px solid #E5E7EB' borderRadius='8px' px='12px' py='6px' bg='white'>
                        <Text fontSize='13px' color='#232F50'>
                          {t('totalConnectionsLabel')}{' '}
                          <Text as='span' fontWeight='700'>
                            {resultData.totalConnections}
                          </Text>
                        </Text>
                      </Box>
                    )}
                    {resultData.status && (
                      <StatusBadge
                        label={formatStatus(resultData.status)}
                        color={enqStatusStyle.color}
                        bg={enqStatusStyle.bg}
                      />
                    )}
                  </HStack>
                </Flex>
              </Box>

              {/* Track Details */}
              <Text fontSize='16px' fontWeight='700' color='#8D0247' mb='16px'>
                {t('trackDetails')}
              </Text>

              <Box>
                {history.map((step, index) => {
                  const style = getStatusStyle(step.currentStatus);
                  const date = formatDisplayDate(step.createdDate, DATE_FORMAT.DATE);
                  const time = formatDisplayTime(step.createdDate);
                  return (
                    <Flex key={index} gap='16px' align='flex-start'>
                      <Box w='90px' flexShrink={0} display='flex' flexDirection='column' alignItems='center'>
                        <TrackIcon type={style.iconType} bg={style.color} />
                        <Text fontSize='11px' color='#232F50' mt='6px' textAlign='center' lineHeight='1.5'>
                          {date}
                          <br />
                          {time}
                        </Text>
                        {index < history.length - 1 && <Box mt='8px' h='36px' borderLeft='2px dashed #CBD5E1' />}
                      </Box>

                      <Box
                        flex={1}
                        bg='white'
                        border='1px solid #E5E7EB'
                        borderRadius='12px'
                        p='14px 18px'
                        mb={index < history.length - 1 ? '16px' : '0'}
                      >
                        <Flex justify='space-between' align='center' mb='8px'>
                          <HStack gap='8px'>
                            <CalendarNewIcon boxSize='16px' color='#232F50' />
                            <Text fontSize='13px' fontWeight='700' color='#232F50'>
                              {date}, {time}
                            </Text>
                          </HStack>
                          <StatusBadge label={formatStatus(step.currentStatus)} color={style.color} bg={style.bg} />
                        </Flex>

                        <HStack gap='8px' align='flex-start'>
                          <NoteIcon boxSize='16px' color='#232F50' flexShrink={0} />
                          <Box>
                            <Text fontSize='13px' color='#232F50'>
                              {step.remarks ||
                                t('statusChanged', {
                                  previousStatus: formatStatus(step.previousStatus),
                                  currentStatus: formatStatus(step.currentStatus)
                                })}
                            </Text>
                            {step.updatedRoles?.length > 0 && (
                              <Text fontSize='11px' color='#6B7280' mt='2px'>
                                {t('updatedBy')} {step.updatedRoles.join(', ')}
                              </Text>
                            )}
                          </Box>
                        </HStack>
                      </Box>
                    </Flex>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </CustomLoaderProvider>

      {/* Footer */}
      <Flex justify='flex-end' px='8px' py='8px'>
        <Button
          variant='outline'
          borderColor='#8D0247'
          color='#8D0247'
          h='10'
          px='6'
          borderRadius='full'
          onClick={onClose}
          _hover={{ bg: '#FDF2F8' }}
        >
          <CrossCircleIcon boxSize='18px' /> {t('close')}
        </Button>
      </Flex>
    </Popup>
  );
};

export default TrackEnquiryPopup;
