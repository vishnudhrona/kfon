import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, Icons, Text, useController, useForm } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const { Accountbalance, BsCheckCircle, Forward, BsArrowRightCircle, ContactIcon, TickTrueIcon } = Icons;

import HdfcImage from '@/assets/hdfcbank.jpg';
import IkmImage from '@/assets/ikm.png';

import { fetchAccountBalance, submitOnlineTopupRecharge } from '../action';
import { getAccountBalance } from '../selector';
import { onlineTopupSchema } from '../validation';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

const GATEWAYS = [
  {
    value: 'hdfc',
    image: HdfcImage,
    nameKey: 'hdfcBank',
    tagKey: 'instantPayment',
    tagColor: 'primary.500',
    badgeKey: 'trustedByMillions',
    showMultiShield: true
  },
  {
    value: 'ikm',
    image: IkmImage,
    nameKey: 'IKM',
    tagKey: 'secureCheckout',
    tagColor: 'gray.500',
    badgeKey: 'pciDssCertified',
    showMultiShield: false
  }
];

const OnlineTopUp = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const accountBalance = useSelector(getAccountBalance);
  const [selectedQuick, setSelectedQuick] = useState(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      topupAmount: '',
      paymentGateway: 'hdfc',
      agreedToTerms: false
    },
    resolver: yupResolver(onlineTopupSchema(t))
  });

  const agreedToTerms = watch('agreedToTerms');
  const topupAmount = watch('topupAmount');
  const rechargeAmt = parseFloat(topupAmount) || 0;

  const { field: gatewayField } = useController({ name: 'paymentGateway', control });

  useEffect(() => {
    dispatch(fetchAccountBalance());
  }, [dispatch]);

  const handleQuickAmount = (amt) => {
    setSelectedQuick(amt);
    setValue('topupAmount', amt, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    dispatch(
      submitOnlineTopupRecharge({
        amount: parseFloat(data.topupAmount),
        type: data.paymentGateway.toUpperCase()
      })
    );
  };

  return (
    <Box>
      {/* Page Header */}
      <Flex alignItems='center' justifyContent='space-between' mb='24px'>
        <Flex alignItems='center' gap='12px'>
          <Flex
            w='44px'
            h='44px'
            borderRadius='10px'
            bg='primary.100'
            color='primary.500'
            alignItems='center'
            justifyContent='center'
            fontSize='22px'
          >
            <Accountbalance style={{ width: '22px', height: '22px' }} />
          </Flex>
          <Box>
            <Text fontSize='20px' fontWeight='700' color='gray.800'>
              {t('rechargeWallet')}
            </Text>
            <Text fontSize='13px' color='gray.500'>
              {t('manageBalanceInstantly')}
            </Text>
          </Box>
        </Flex>
        <Flex alignItems='center' gap='6px' color='gray.500' fontSize='13px'>
          <BsCheckCircle style={{ width: '14px', height: '14px' }} />
          <Text>{t('hundredPercentSecure')}</Text>
        </Flex>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex gap='20px' alignItems='flex-start' flexDir={{ base: 'column', lg: 'row' }}>
          {/* ── LEFT COLUMN ── */}
          <Box flex='3' minW={0}>
            {/* Available Balance Card */}
            <Box
              mb='24px'
              p='20px 24px'
              bg='primary.50'
              border='1px solid'
              borderColor='primary.200'
              borderRadius='12px'
            >
              <Flex alignItems='center' gap='16px'>
                <Flex
                  w='52px'
                  h='52px'
                  borderRadius='full'
                  bg='primary.500'
                  color='white'
                  alignItems='center'
                  justifyContent='center'
                  fontSize='26px'
                  flexShrink={0}
                >
                  <Accountbalance style={{ width: '26px', height: '26px' }} />
                </Flex>
                <Box>
                  <Text fontSize='13px' color='primary.500' fontWeight='500'>
                    {t('availableBalance')}
                  </Text>
                  <Text fontSize='28px' fontWeight='800' color='gray.800' lineHeight='1.1'>
                    ₹{Number(accountBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </Text>
                  <Flex alignItems='center' gap='6px' mt='4px'>
                    <Box w='7px' h='7px' borderRadius='full' bg='primary.400' />
                    <Text fontSize='12px' color='primary.500'>
                      {t('lastUpdatedJustNow')}
                    </Text>
                  </Flex>
                </Box>
              </Flex>
            </Box>

            {/* Step 1 — Enter Recharge Amount */}
            <Box mb='24px'>
              <Flex alignItems='center' gap='10px' mb='16px'>
                <Flex
                  w='26px'
                  h='26px'
                  borderRadius='full'
                  bg='primary.500'
                  color='white'
                  alignItems='center'
                  justifyContent='center'
                  fontSize='13px'
                  fontWeight='700'
                  flexShrink={0}
                >
                  1
                </Flex>
                <Text fontSize='15px' fontWeight='600' color='gray.800'>
                  {t('enterRechargeAmount')}
                </Text>
              </Flex>

              {/* Amount input with ₹ prefix inline */}
              <Flex
                alignItems='stretch'
                border='1px solid'
                borderColor='gray.300'
                borderRadius='8px'
                overflow='hidden'
                mb='12px'
                _focusWithin={{ borderColor: 'primary.400', boxShadow: '0 0 0 3px rgba(141,2,71,0.12)' }}
              >
                <Flex
                  px='14px'
                  alignItems='center'
                  justifyContent='center'
                  bg='gray.50'
                  borderRight='1px solid'
                  borderColor='gray.200'
                  fontSize='18px'
                  fontWeight='600'
                  color='gray.600'
                  flexShrink={0}
                >
                  ₹
                </Flex>
                <Box
                  flex='1'
                  onWheel={(e) => e.currentTarget.querySelector('input')?.blur()}
                  onKeyDown={(e) => {
                    const val = e.currentTarget.querySelector('input')?.value ?? '';
                    const [intPart, decPart] = val.split('.');
                    const key = e.key;
                    if (['ArrowUp', 'ArrowDown'].includes(key)) {
                      e.preventDefault();
                      return;
                    }
                    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                    if (allowedKeys.includes(key)) return;
                    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(key)) return;
                    // block non-numeric except single dot
                    if (key === '.') {
                      if (val.includes('.')) e.preventDefault();
                      return;
                    }
                    if (!/^\d$/.test(key)) {
                      e.preventDefault();
                      return;
                    }
                    // block if decimal part already has 2 digits
                    if (decPart !== undefined && decPart.length >= 2) {
                      e.preventDefault();
                      return;
                    }
                    // block if integer part already has 10 digits (no decimal yet)
                    if (decPart === undefined && intPart.length >= 7) {
                      e.preventDefault();
                      return;
                    }
                  }}
                >
                  <FormController
                    name='topupAmount'
                    placeholder={t('enterAmount')}
                    control={control}
                    errors={errors}
                    type='number'
                    required
                  />
                </Box>
              </Flex>

              {/* Quick amount chips */}
              <Flex gap='10px' flexWrap='wrap'>
                {QUICK_AMOUNTS.map((amt) => {
                  const isSelected = selectedQuick === amt;
                  return (
                    <Box
                      key={amt}
                      as='button'
                      type='button'
                      onClick={() => handleQuickAmount(amt)}
                      px='20px'
                      py='8px'
                      borderRadius='6px'
                      border='2px solid'
                      fontSize='14px'
                      fontWeight='500'
                      cursor='pointer'
                      transition='all 0.15s'
                      borderColor={isSelected ? 'primary.500' : 'gray.200'}
                      bg={isSelected ? 'primary.50' : 'white'}
                      color={isSelected ? 'primary.600' : 'gray.700'}
                      position='relative'
                      _focusVisible={{ outline: '2px solid', outlineColor: 'primary.500', outlineOffset: '2px' }}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                      {isSelected && (
                        <Flex
                          position='absolute'
                          top='-8px'
                          right='-8px'
                          w='18px'
                          h='18px'
                          borderRadius='full'
                          bg='primary.500'
                          color='white'
                          alignItems='center'
                          justifyContent='center'
                          flexShrink={0}
                        >
                          <TickTrueIcon style={{ width: '10px', height: '10px', flexShrink: 0 }} />
                        </Flex>
                      )}
                    </Box>
                  );
                })}
              </Flex>
            </Box>

            {/* Step 2 — Select Payment Method */}
            <Box mb='24px'>
              <Flex alignItems='center' gap='10px' mb='16px'>
                <Flex
                  w='26px'
                  h='26px'
                  borderRadius='full'
                  bg='primary.500'
                  color='white'
                  alignItems='center'
                  justifyContent='center'
                  fontSize='13px'
                  fontWeight='700'
                  flexShrink={0}
                >
                  2
                </Flex>
                <Text fontSize='15px' fontWeight='600' color='gray.800'>
                  {t('selectPaymentMethod')}
                </Text>
              </Flex>

              <Flex gap='16px' flexWrap='wrap' role='radiogroup' aria-label={t('selectPaymentMethod')}>
                {GATEWAYS.map((gw) => {
                  const isSelected = gatewayField.value === gw.value;
                  return (
                    <Box
                      key={gw.value}
                      flex='1'
                      minW='200px'
                      border='2px solid'
                      borderColor={isSelected ? 'primary.500' : 'gray.200'}
                      borderRadius='12px'
                      p='16px'
                      cursor='pointer'
                      bg={isSelected ? 'primary.50' : 'white'}
                      onClick={() => gatewayField.onChange(gw.value)}
                      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && gatewayField.onChange(gw.value)}
                      position='relative'
                      transition='all 0.15s'
                      role='radio'
                      aria-checked={isSelected}
                      tabIndex={0}
                      _focusVisible={{ outline: '2px solid', outlineColor: 'primary.500', outlineOffset: '2px' }}
                    >
                      {isSelected ? (
                        <Flex
                          position='absolute'
                          top='12px'
                          right='12px'
                          w='22px'
                          h='22px'
                          borderRadius='full'
                          bg='primary.500'
                          color='white'
                          alignItems='center'
                          justifyContent='center'
                          flexShrink={0}
                        >
                          <TickTrueIcon style={{ width: '12px', height: '12px', flexShrink: 0 }} />
                        </Flex>
                      ) : (
                        <Box
                          position='absolute'
                          top='12px'
                          right='12px'
                          w='22px'
                          h='22px'
                          borderRadius='full'
                          border='2px solid'
                          borderColor='gray.300'
                        />
                      )}

                      <Flex alignItems='center' gap='12px' mb='10px'>
                        <img src={gw.image} alt={t(gw.nameKey)} style={{ height: '40px', objectFit: 'contain' }} />
                        <Box>
                          <Text fontSize='14px' fontWeight='600' color='gray.800'>
                            {t(gw.nameKey)}
                          </Text>
                          <Text fontSize='12px' color={gw.tagColor} fontWeight='500'>
                            {t(gw.tagKey)}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex alignItems='center' gap='4px' color='gray.400' fontSize='12px'>
                        {gw.showMultiShield ? (
                          <>
                            <BsCheckCircle style={{ width: '12px', height: '12px' }} />
                            <BsCheckCircle style={{ width: '12px', height: '12px' }} />
                            <BsCheckCircle style={{ width: '12px', height: '12px' }} />
                          </>
                        ) : (
                          <BsCheckCircle style={{ width: '12px', height: '12px' }} />
                        )}
                        <Text ml='4px'>{t(gw.badgeKey)}</Text>
                      </Flex>
                    </Box>
                  );
                })}
              </Flex>
              {errors.paymentGateway && (
                <Text fontSize='12px' color='red.500' mt='6px'>
                  {errors.paymentGateway.message}
                </Text>
              )}
            </Box>

            {/* Feature badges */}
            <Flex
              gap='16px'
              p='20px'
              border='1px solid'
              borderColor='gray.100'
              borderRadius='12px'
              bg='gray.50'
              flexWrap='wrap'
            >
              {[
                {
                  icon: <BsCheckCircle style={{ width: '18px', height: '18px' }} />,
                  color: 'primary.500',
                  title: t('hundredPercentSecurePayments'),
                  desc: t('yourTransactionsSafe')
                },
                {
                  icon: <Forward style={{ width: '18px', height: '18px' }} />,
                  color: 'yellow.500',
                  title: t('instantRecharge'),
                  desc: t('getInstantWalletBalance')
                },
                {
                  icon: <BsCheckCircle style={{ width: '18px', height: '18px' }} />,
                  color: 'secondary.500',
                  title: t('encryptedGateway'),
                  desc: t('bankLevelSecurity')
                }
              ].map(({ icon, color, title, desc }) => (
                <Flex key={title} flex='1' minW='160px' gap='10px' alignItems='flex-start'>
                  <Flex
                    w='36px'
                    h='36px'
                    borderRadius='full'
                    bg='white'
                    border='1px solid'
                    borderColor='gray.200'
                    alignItems='center'
                    justifyContent='center'
                    fontSize='18px'
                    color={color}
                    flexShrink={0}
                  >
                    {icon}
                  </Flex>
                  <Box>
                    <Text fontSize='13px' fontWeight='600' color='gray.700'>
                      {title}
                    </Text>
                    <Text fontSize='12px' color='gray.500'>
                      {desc}
                    </Text>
                  </Box>
                </Flex>
              ))}
            </Flex>
          </Box>

          {/* ── RIGHT COLUMN — Recharge Summary ── */}
          <Box
            w={{ base: '100%', lg: '30%' }}
            flexShrink={0}
            border='1px solid'
            borderColor='gray.200'
            borderRadius='12px'
            overflow='hidden'
            position={{ lg: 'sticky' }}
            top={{ lg: '20px' }}
          >
            <Box p='20px' borderBottom='1px solid' borderColor='gray.100'>
              <Text fontSize='16px' fontWeight='700' color='gray.800'>
                {t('rechargeSummary')}
              </Text>
            </Box>

            <Box p='20px'>
              <Flex justifyContent='space-between' mb='12px'>
                <Text fontSize='13px' color='gray.600'>
                  {t('rechargeAmount')}
                </Text>
                <Text fontSize='13px' fontWeight='500' color='gray.800'>
                  ₹{rechargeAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Text>
              </Flex>
              <Flex justifyContent='space-between' mb='20px'>
                <Text fontSize='13px' color='gray.600'>
                  {t('gatewayCharge')}
                </Text>
                <Text fontSize='13px' fontWeight='500' color='gray.800'>
                  ₹0.00
                </Text>
              </Flex>

              <Box h='1px' bg='gray.200' mb='16px' />

              <Flex justifyContent='space-between' mb='24px'>
                <Text fontSize='14px' fontWeight='600' color='gray.700'>
                  {t('totalPayable')}
                </Text>
                <Text fontSize='18px' fontWeight='800' color='primary.500'>
                  ₹{rechargeAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Text>
              </Flex>

              {/* Terms & Conditions */}
              <Box
                p='12px'
                borderRadius='8px'
                border='1px solid'
                borderColor='gray.200'
                fontSize='12px'
                lineHeight='1.6'
                color='gray.600'
                mb='12px'
                maxH='160px'
                overflowY='auto'
              >
                <Text fontWeight='600' color='gray.700' mb='4px'>
                  {t('termsAndConditions')}
                </Text>
                <Text mb='10px'>{t('termsAndConditionsText')}</Text>
                <Text fontWeight='600' color='gray.700' mb='4px'>
                  {t('privacyPolicy')}
                </Text>
                <Text mb='10px'>{t('privacyPolicyText')}</Text>
                <Text fontWeight='600' color='gray.700' mb='4px'>
                  {t('refundCancellationPolicy')}
                </Text>
                <Text mb='10px'>{t('refundCancellationPolicyText')}</Text>
                <Text fontWeight='600' color='gray.700' mb='4px'>
                  {t('contactUs')}
                </Text>
                <Text>support@kfon.in</Text>
              </Box>

              <Flex alignItems='center' mb='16px'>
                <FormController name='agreedToTerms' errors={errors} control={control} type='checkbox' required />
                <Text
                  fontSize='13px'
                  color='gray.700'
                  cursor='pointer'
                  onClick={() => setValue('agreedToTerms', !agreedToTerms)}
                >
                  {t('iAgreeToTermsAndConditions')}
                </Text>
              </Flex>

              <Button
                type='submit'
                w='100%'
                disabled={!agreedToTerms}
                borderRadius='8px'
                fontSize='15px'
                fontWeight='600'
              >
                {t('proceedToPay')}
                <BsArrowRightCircle style={{ width: '16px', height: '16px' }} />
              </Button>

              <Box mt='20px' pt='16px' borderTop='1px solid' borderColor='gray.100'>
                {[
                  {
                    icon: <BsCheckCircle style={{ width: '16px', height: '16px' }} />,
                    title: t('securePaymentsSSL'),
                    desc: t('sslEncrypted')
                  },
                  {
                    icon: <Forward style={{ width: '16px', height: '16px' }} />,
                    title: t('instantCredit'),
                    desc: t('balanceUpdatedInstantly')
                  },
                  {
                    icon: <ContactIcon style={{ width: '16px', height: '16px' }} />,
                    title: t('support247'),
                    desc: t('weAreHereToHelp')
                  }
                ].map(({ icon, title, desc }) => (
                  <Flex key={title} gap='10px' alignItems='flex-start' mb='12px'>
                    <Box color='gray.400' fontSize='16px' mt='2px' flexShrink={0}>
                      {icon}
                    </Box>
                    <Box>
                      <Text fontSize='12px' fontWeight='600' color='gray.700'>
                        {title}
                      </Text>
                      <Text fontSize='11px' color='gray.500'>
                        {desc}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
            </Box>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};

export default OnlineTopUp;
