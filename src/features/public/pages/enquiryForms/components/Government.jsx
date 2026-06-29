import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Controller,
  Flex,
  HStack,
  Icon,
  Input,
  Select,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { ArrowRightCircle, BsCheckCircle, ContactIcon, LocationIcon } from '@/components/custom';

import { fetchIndustry, fetchService, saveCorpGovSubscriberEnquiry } from '../action';
import { formatCorpGovEnquiryRequest } from '../helpers';
import { getIndustryList, getServiceList } from '../selector';
import { corporateEnquirySchema } from '../validations';

const MotionBox = motion.create(Box);

export default function GovernmentEnquiry({ tabType }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const industryList = useSelector(getIndustryList);
  const serviceList = useSelector(getServiceList);

  const [open, setOpen] = useState('details');

  useEffect(() => {
    dispatch(fetchIndustry());
    dispatch(fetchService());
  }, [dispatch]);

  const toggle = (name) => {
    setOpen((prev) => (prev === name ? null : name));
  };

  const transition = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] };

  const {
    control,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(corporateEnquirySchema(t)),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      mailId: '',
      companyName: '',
      pinCode: '',
      industry: null,
      service: null
    }
  });

  const safeGet = (key) => getValues()[key] || '';

  const ErrorText = ({ msg }) =>
    msg ? (
      <Text fontSize='14px' lineHeight='14px' color='toast.error'>
        {msg}
      </Text>
    ) : null;

  const handleDetailsNext = async () => {
    const valid = await trigger(['firstName', 'lastName', 'mobileNumber', 'mailId']);
    if (valid) setOpen('address');
  };
  const onSubmit = (data) => {
    const payload = {
      ...data,
      connectionType: tabType
    };
    dispatch(saveCorpGovSubscriberEnquiry(formatCorpGovEnquiryRequest(payload)));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex direction='column' gap={6} p={6} maxW='full' mx='auto'>
        {/* SECTION 1 — DETAILS */}
        <Box
          bg='white'
          p={open === 'details' ? { base: '0 16px 24px', md: '0 60px 60px' } : '0'}
          rounded='2xl'
          shadow='md'
          borderWidth='1px'
          transition='padding 350ms ease-in-out'
        >
          <Button
            variant='unstyled'
            w='full'
            fontSize='24px'
            fontWeight={600}
            lineHeight='24px'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            onClick={() => toggle('details')}
            color='black'
            p={open === 'details' ? { base: '20px 0 0', md: '30px 0 0' } : { base: '20px 16px', md: '30px 60px' }}
            transition='padding 350ms ease-in-out'
          >
            <HStack>
              <Icon as={ContactIcon} w='42px' h='42px' />
              <VStack alignItems='start' spacing={1}>
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
                  >
                    {safeGet('firstName')} {safeGet('lastName')}
                  </Text>
                )}
              </VStack>
            </HStack>
          </Button>

          <AnimatePresence initial={false}>
            {open === 'details' && (
              <MotionBox
                transition={transition}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                overflow='hidden'
              >
                <Flex direction='column' gap={6} mt='24px' w='100%'>
                  <Controller
                    name='firstName'
                    control={control}
                    render={({ field }) => (
                      <Box display='flex' flexDirection='column' gap='6px' alignItems={'start'}>
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('firstName')}
                        </Text>
                        <Input
                          {...field}
                          maxLength={100}
                          placeholder={t('firstName')}
                          borderRadius='6px'
                          border='1px solid'
                          borderColor={errors.firstName ? 'toast.error' : '#A0A0A0'}
                        />
                        <ErrorText msg={errors.firstName?.message} />
                      </Box>
                    )}
                  />
                  <Controller
                    name='lastName'
                    control={control}
                    render={({ field }) => (
                      <Box display='flex' flexDirection='column' gap='6px' alignItems={'start'}>
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('lastName')}
                        </Text>
                        <Input
                          {...field}
                          maxLength={100}
                          placeholder={t('lastName')}
                          borderRadius='6px'
                          border='1px solid'
                          borderColor={errors.lastName ? 'toast.error' : '#A0A0A0'}
                        />
                        <ErrorText msg={errors.lastName?.message} />
                      </Box>
                    )}
                  />
                  <Controller
                    name='mobileNumber'
                    control={control}
                    render={({ field }) => (
                      <Box display='flex' flexDirection='column' gap='6px' alignItems={'start'}>
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('mobileNumber')}
                        </Text>
                        <Input
                          {...field}
                          maxLength={10}
                          inputMode='numeric'
                          pattern='[0-9]*'
                          placeholder={t('mobileNumber')}
                          borderRadius='6px'
                          border='1px solid'
                          borderColor={errors.mobileNumber ? 'toast.error' : '#A0A0A0'}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                        />
                        <ErrorText msg={errors.mobileNumber?.message} />
                      </Box>
                    )}
                  />
                  <Controller
                    name='mailId'
                    control={control}
                    render={({ field }) => (
                      <Box display='flex' flexDirection='column' gap='6px' alignItems={'start'}>
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('emailId')}
                        </Text>
                        <Input
                          {...field}
                          placeholder={t('emailId')}
                          borderRadius='6px'
                          border='1px solid'
                          borderColor={errors.mailId ? 'toast.error' : '#A0A0A0'}
                        />
                        <ErrorText msg={errors.mailId?.message} />
                      </Box>
                    )}
                  />
                  <Flex justifyContent='flex-end'>
                    <Button variant='outline' borderRadius='99px' onClick={handleDetailsNext}>
                      {t('next')}
                      <ArrowRightCircle />
                    </Button>
                  </Flex>
                </Flex>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        {/* SECTION 2 — ADDRESS */}
        <Box
          bg='white'
          p={open === 'address' ? { base: '0 16px 24px', md: '0 60px 60px' } : '0'}
          rounded='2xl'
          shadow='md'
          borderWidth='1px'
          transition='padding 350ms ease-in-out'
        >
          <Button
            variant='unstyled'
            w='full'
            fontSize='24px'
            fontWeight={600}
            display='flex'
            justifyContent='space-between'
            onClick={() => toggle('address')}
            color='black'
            p={open === 'address' ? { base: '20px 0 0', md: '30px 0 0' } : { base: '20px 16px', md: '30px 60px' }}
          >
            <HStack>
              <Icon as={LocationIcon} w='42px' h='42px' />
              <VStack alignItems='start' spacing={1}>
                <Text whiteSpace='normal'>{t('whereShouldWeBringTheInternet')}</Text>

                {safeGet('companyName') && (
                  <Text
                    fontSize='18px'
                    lineHeight='18px'
                    fontWeight={500}
                    color='#6e6e6e'
                    maxW='560px'
                    whiteSpace='normal'
                    overflowWrap='break-word'
                    wordBreak='break-word'
                  >
                    {safeGet('companyName')}
                  </Text>
                )}
              </VStack>
            </HStack>
          </Button>

          <AnimatePresence initial={false}>
            {open === 'address' && (
              <MotionBox
                transition={transition}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                overflow='hidden'
              >
                <Flex direction='column' gap={6} mt='24px'>
                  {/* COMPANY NAME */}
                  <Controller
                    name='companyName'
                    control={control}
                    render={({ field }) => (
                      <Box display='flex' flexDirection='column' gap='6px' alignItems={'start'}>
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('companyName')}
                        </Text>
                        <Input
                          {...field}
                          placeholder={t('companyName')}
                          borderRadius='6px'
                          border='1px solid'
                          borderColor={errors.companyName ? 'toast.error' : '#A0A0A0'}
                        />
                        <ErrorText msg={errors.companyName?.message} />
                      </Box>
                    )}
                  />

                  {/* PINCODE */}
                  <Controller
                    name='pinCode'
                    control={control}
                    render={({ field }) => (
                      <Box display='flex' flexDirection='column' gap='6px' alignItems={'start'}>
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('pinCode')}
                        </Text>
                        <Input
                          {...field}
                          maxLength={6}
                          inputMode='numeric'
                          pattern='[0-9]*'
                          placeholder={t('pinCode')}
                          borderRadius='6px'
                          border='1px solid'
                          borderColor={errors.pinCode ? 'toast.error' : '#A0A0A0'}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                        />
                        <ErrorText msg={errors.pinCode?.message} />
                      </Box>
                    )}
                  />
                  <Controller
                    name='industry'
                    control={control}
                    render={({ field }) => (
                      <Box
                        position='relative'
                        w='100%'
                        flexDirection='column'
                        gap='6px'
                        textAlign='left'
                        alignItems='start'
                      >
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('industry')}
                        </Text>
                        <Select
                          {...field}
                          placeholder={t('industry')}
                          menuPortalTarget={document.body}
                          menuProps={{
                            style: {
                              width: '300px',
                              position: 'fixed',
                              zIndex: 999999,
                              left: 0
                            }
                          }}
                          triggerProps={{
                            w: '100%',
                            h: '42px',
                            border: '1px solid',
                            borderColor: errors.industry ? 'toast.error' : '#A0A0A0',
                            borderRadius: '6px',
                            paddingInlineStart: '12px'
                          }}
                          options={industryList}
                        />

                        <ErrorText msg={errors.industry?.message} />
                      </Box>
                    )}
                  />
                  <Controller
                    name='service'
                    control={control}
                    render={({ field }) => (
                      <Box
                        position='relative'
                        w='100%'
                        flexDirection='column'
                        gap='6px'
                        textAlign='left'
                        alignItems='start'
                      >
                        <Text fontSize='14px' lineHeight='14px' color='font_color.primary'>
                          {t('service')}
                        </Text>
                        <Select
                          {...field}
                          placeholder={t('service')}
                          menuPortalTarget={document.body}
                          menuProps={{
                            style: {
                              width: '300px',
                              position: 'fixed',
                              zIndex: 999999,
                              left: 0
                            }
                          }}
                          triggerProps={{
                            w: '100%',
                            h: '42px',
                            border: '1px solid',
                            borderColor: errors.service ? 'toast.error' : '#A0A0A0',
                            borderRadius: '6px',
                            paddingInlineStart: '12px'
                          }}
                          options={serviceList}
                        />

                        <ErrorText msg={errors.service?.message} />
                      </Box>
                    )}
                  />
                </Flex>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        <Flex justifyContent='center'>
          <Button borderRadius='99px' type='submit' isLoading={isSubmitting}>
            {t('confirmBooking')}
            <BsCheckCircle />
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
