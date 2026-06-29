import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Icons, Stack, Text, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams, useRouterState, useSearch } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { OtpInput } from '@/components/custom';
import ConfirmPopup from '@/components/custom/ConfirmPopup';
import { warningToast } from '@/components/custom/Toast';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { formatDisplayDate } from '@/utils/dateUtils';
import { MOBILE_NUMBER_LENGTH, OTP_LENGTH } from '@/utils/validationUtils';

import {
  API_ACTION_TYPES,
  fetchSubscriberDetail,
  resetSubscriberPassword,
  sendMobileChangeOtp,
  updateSubscriberDetail,
  verifyMobileChangeOtp
} from '../actions';
import ChangeUsernamePopup from '../components/pop-up/ChangeUsernamePopup';
import { getSubscriberDetail } from '../selectors';
import { subscriberDetailEditSchema } from '../validation';

const DetailRow = ({ label, value, children }) => (
  <HStack justify='space-between' w='full' py={2.5} borderBottom='1px solid' borderColor='gray.100' align='start'>
    <Text fontSize='sm' fontWeight='medium' color='#6d6d6d' flexShrink={0}>
      {label}
    </Text>
    {children ?? (
      <Text fontSize='sm' fontWeight='semibold' color='#333' textAlign='right'>
        {value ?? '—'}
      </Text>
    )}
  </HStack>
);

const SectionTitle = ({ title, action }) => (
  <HStack w='full' spacing={3} mb={4} align='center'>
    <Text fontSize='md' fontWeight='semibold' color='#060606' flexShrink={0}>
      {title}
    </Text>
    <Box flex={1} h='1px' bg='gray.200' />
    {action}
  </HStack>
);

const ClickHereLink = ({ label, onClick }) => {
  const { LinkIcon } = Icons;
  return (
    <HStack spacing={2} justify='flex-end' cursor='pointer' onClick={onClick}>
      <Text fontSize='sm' color='primary.500' fontWeight='medium'>
        {label}
      </Text>
      <LinkIcon boxSize={4} color='primary.500' />
    </HStack>
  );
};

const TypeBadge = ({ label, icon }) => (
  <HStack
    spacing={1}
    border='1px solid'
    borderColor='gray.300'
    bg='gray.50'
    color='#fd1c7a'
    px={4}
    py={1}
    borderRadius='31px'
    fontSize='sm'
    fontWeight='medium'
    flexShrink={0}
  >
    {icon}
    <Text>{label}</Text>
  </HStack>
);

// Right-aligned input used inside a DetailRow while editing
const EditField = ({ control, name, errors, ...rest }) => (
  <Box w={{ base: 'full', md: '260px' }}>
    <FormController control={control} name={name} errors={errors} type='text' {...rest} />
  </Box>
);

const SubscriberDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subscriberId } = useParams({ strict: false });
  // Present when navigated here from a CRM ticket — tells the user which ticket this subscriber relates to.
  // `id` (ticket uuid) lives in the URL → refresh-safe + builds the back-to-ticket link.
  // ticketId (display no.) + subject ride in router state → shown in the banner, not refresh-safe.
  const { id: ticketUuid } = useSearch({ strict: false });
  const { ticketId, ticketSubject } = useRouterState({ select: (s) => s.location.state }) ?? {};

  const detailData = useSelector(getSubscriberDetail);
  // Normalize the /subscriber-detail/{id}/view response onto the field names this page renders
  const detail = useMemo(
    () => ({
      ...detailData,
      subscriberId: detailData?.subscriberId,
      partner: detailData?.partnerName,
      mobile: detailData?.mobileNo,
      subscriptionExpiry: formatDisplayDate(detailData?.subscriptionExpiry),
      createdOn: formatDisplayDate(detailData?.createdOn),
      lastTopup: detailData?.lastTopupAmount
    }),
    [detailData]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [usernamePopup, setUsernamePopup] = useState(false);

  // Mobile-change OTP state (sent to the NEW number)
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpRefId, setOtpRefId] = useState(null);
  const [mobileVerified, setMobileVerified] = useState(false);

  const editSchema = useMemo(() => subscriberDetailEditSchema(t), [t]);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(editSchema),
    defaultValues: { name: '', address: '', email: '', mobile: '' }
  });

  const isSaving = useSelector((s) => !!getApiProgress(s)[API_ACTION_TYPES.UPDATE_SUBSCRIBER_DETAIL]);
  const isResetting = useSelector((s) => !!getApiProgress(s)[API_ACTION_TYPES.RESET_SUBSCRIBER_PASSWORD]);
  const isSendingOtp = useSelector((s) => !!getApiProgress(s)[API_ACTION_TYPES.SEND_MOBILE_CHANGE_OTP]);
  const isVerifyingOtp = useSelector((s) => !!getApiProgress(s)[API_ACTION_TYPES.VERIFY_MOBILE_CHANGE_OTP]);

  useEffect(() => {
    if (subscriberId) dispatch(fetchSubscriberDetail(subscriberId));
  }, [dispatch, subscriberId]);

  const mobileValue = watch('mobile');
  const mobileChanged = isEditing && mobileValue !== (detail.mobile ?? '');

  // Clear OTP requirement if the mobile is reverted to the original
  useEffect(() => {
    if (!mobileChanged) {
      setOtpSent(false);
      setOtp('');
      setOtpRefId(null);
      setMobileVerified(false);
    }
  }, [mobileChanged]);

  const resetOtpState = () => {
    setOtpSent(false);
    setOtp('');
    setOtpRefId(null);
    setMobileVerified(false);
  };

  const enterEdit = () => {
    reset({
      name: detail.name || '',
      address: detail.address || '',
      email: detail.email || '',
      mobile: detail.mobile || ''
    });
    resetOtpState();
    setIsEditing(true);
  };

  const cancelEdit = () => {
    reset();
    resetOtpState();
    setIsEditing(false);
  };

  const handleSendOtp = () => {
    dispatch(
      sendMobileChangeOtp({
        id: subscriberId,
        newMobile: mobileValue,
        onSuccess: (data) => {
          setOtpRefId(data?.otpReferenceId ?? data?.otpRefId ?? null);
          setOtpSent(true);
        }
      })
    );
  };

  const handleVerifyOtp = () => {
    dispatch(
      verifyMobileChangeOtp({
        id: subscriberId,
        otp,
        otpRefId,
        onSuccess: () => setMobileVerified(true)
      })
    );
  };

  const onSave = (data) => {
    dispatch(updateSubscriberDetail({ id: subscriberId, ...data, onSuccess: cancelEdit }));
  };

  const handleResetPassword = () => {
    dispatch(resetSubscriberPassword({ id: subscriberId, onSuccess: () => setConfirmReset(false) }));
  };

  // When reached from a CRM ticket, keep drill-downs inside the crm tree so the side menu stays on CRM
  // and the ticket context (id in URL + ticketId/subject in state) rides along.
  const fromTicket = !!ticketUuid;
  const ticketCtx = { search: { id: ticketUuid }, state: { ticketId, ticketSubject } };

  const handleBack = () =>
    fromTicket
      ? navigate({ to: '/app/crm/ticket-list/ticket-details/$ticketId', params: { ticketId: ticketUuid } })
      : navigate({ to: '/app/subscribers/subscribers-list' });
  const goToDataUsage = () =>
    navigate(
      fromTicket
        ? {
            to: '/app/crm/ticket-list/subscriber-data-usage/$subscriberId',
            params: { subscriberId },
            ...ticketCtx
          }
        : { to: '/app/subscribers/subscribers-list/subscriber-data-usage/$subscriberId', params: { subscriberId } }
    );
  const goToTickets = () => navigate({ to: '/app/support/tickets' });
  const goToRelatedTicket = () =>
    navigate({ to: '/app/crm/ticket-list/ticket-details/$ticketId', params: { ticketId: ticketUuid } });
  const goToFinance = () => navigate({ to: '/app/finance/accounts/subscriber-accounts/finance' });
  const goToRadius = () => {
    if (!detail.username) return warningToast({ description: t('radiusUsernameMissing') });
    navigate(
      fromTicket
        ? {
            to: '/app/crm/ticket-list/subscriber-radius-details/$username',
            params: { username: detail.username },
            ...ticketCtx
          }
        : {
            to: '/app/subscribers/subscribers-list/subscriber-radius-details/$username',
            params: { username: detail.username }
          }
    );
  };

  const saveDisabled = mobileChanged && !mobileVerified;

  return (
    <Box display='flex' flexDirection='column' h='calc(100vh - 120px)' overflow='hidden'>
      <Box flex={1} overflow='auto' p={6}>
        {/* Related-ticket banner — shown when arriving from a CRM ticket */}
        {ticketUuid && (
          <HStack
            justify='space-between'
            bg='#FEF3F8'
            border='1px solid'
            borderColor='primary.200'
            px={6}
            py={3}
            borderRadius='12px'
            mb={4}
          >
            <HStack spacing={2} minW={0}>
              <Icons.TicketIcon boxSize={4} color='primary.500' flexShrink={0} />
              <Text fontSize='sm' color='font_color.primary' flexShrink={0}>
                {t('viewingForTicket')}
              </Text>
              {ticketId && (
                <Text fontSize='sm' fontWeight='semibold' color='primary.500' flexShrink={0}>
                  #{ticketId}
                </Text>
              )}
              {ticketSubject && (
                <Text fontSize='sm' color='#6d6d6d' truncate>
                  — {ticketSubject}
                </Text>
              )}
            </HStack>
            <ClickHereLink label={t('viewTicket')} onClick={goToRelatedTicket} />
          </HStack>
        )}

        {/* Yellow header bar */}
        <HStack justify='space-between' bg='#FFFAEB' px={6} py={3.5} borderRadius='12px' mb={6}>
          <Text fontSize='lg' fontWeight='semibold' color='font_color.primary'>
            {t('subscriberDetails')}
          </Text>
          <Box
            as='button'
            type='button'
            w='30px'
            h='30px'
            borderRadius='full'
            bg='#ebebeb'
            display='flex'
            alignItems='center'
            justifyContent='center'
            opacity={isEditing ? 0.5 : 1}
            cursor={isEditing ? 'default' : 'pointer'}
            onClick={() => !isEditing && enterEdit()}
            aria-label={t('edit')}
          >
            <Icons.PenIcon boxSize={4} color='gray.600' />
          </Box>
        </HStack>

        <Box bg='white' border='1px solid' borderColor='gray.200' borderRadius='12px' p={6} overflow='auto'>
          {/* Basic Details */}
          <SectionTitle title={t('basicDetails')} />
          <Stack direction={{ base: 'column', lg: 'row' }} gap={16} mb={10}>
            <VStack flex={1} align='stretch' spacing={0}>
              <DetailRow label={t('name')} value={detail.name}>
                {isEditing ? <EditField control={control} name='name' errors={errors} /> : undefined}
              </DetailRow>
              <DetailRow label={t('address')} value={detail.address}>
                {isEditing ? <EditField control={control} name='address' errors={errors} /> : undefined}
              </DetailRow>
              <DetailRow label={t('username')} value={detail.username} />
            </VStack>
            <VStack flex={1} align='stretch' spacing={0}>
              <DetailRow label={t('partner')} value={detail.partner} />
              <DetailRow label={t('mobileNo')} value={detail.mobile}>
                {isEditing ? (
                  <VStack align='end' w={{ base: 'full', md: '260px' }} spacing={2}>
                    <EditField
                      control={control}
                      name='mobile'
                      errors={errors}
                      inputMode='numeric'
                      maxLength={MOBILE_NUMBER_LENGTH}
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '');
                      }}
                    />
                    {mobileChanged && !mobileVerified && !otpSent && (
                      <Button size='xs' variant='outline' onClick={handleSendOtp} loading={isSendingOtp}>
                        {t('sendOtp')}
                      </Button>
                    )}
                    {mobileChanged && !mobileVerified && otpSent && (
                      <VStack align='end' spacing={2}>
                        <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
                        <HStack spacing={2}>
                          <Button size='xs' variant='ghost' onClick={handleSendOtp} loading={isSendingOtp}>
                            {t('resendOtp')}
                          </Button>
                          <Button
                            size='xs'
                            variant='solid'
                            onClick={handleVerifyOtp}
                            loading={isVerifyingOtp}
                            disabled={otp.length !== OTP_LENGTH}
                          >
                            {t('verify')}
                          </Button>
                        </HStack>
                      </VStack>
                    )}
                    {mobileVerified && (
                      <HStack spacing={1} color='green.500'>
                        <Icons.BsCheckCircle boxSize={4} />
                        <Text fontSize='xs'>{t('verified')}</Text>
                      </HStack>
                    )}
                  </VStack>
                ) : undefined}
              </DetailRow>
              <DetailRow label={t('emailAddress')} value={detail.email}>
                {isEditing ? <EditField control={control} name='email' errors={errors} /> : undefined}
              </DetailRow>
            </VStack>
          </Stack>

          {/* Subscription Data */}
          <SectionTitle
            title={t('subscriptionData')}
            action={
              <Button
                size='sm'
                bg='primary.500'
                color='white'
                borderRadius='4px'
                fontSize='sm'
                fontWeight='semibold'
                flexShrink={0}
                _hover={{ bg: 'primary.600' }}
                onClick={() => setConfirmReset(true)}
              >
                <Icons.ResetPasswordIcon boxSize='12px' />
                {t('resetSubscriberPassword')}
              </Button>
            }
          />
          <Stack direction={{ base: 'column', lg: 'row' }} gap={16} mb={10}>
            <VStack flex={1} align='stretch' spacing={0}>
              <DetailRow label={t('subscriberId')} value={detail.subscriberId} />
              <DetailRow label={t('subscriptionExpiry')} value={detail.subscriptionExpiry} />
              <DetailRow label={t('cafStatus')} value={detail.cafStatus} />
              <DetailRow label={t('createdOn')} value={detail.createdOn} />
              <DetailRow label={t('newTickets')}>
                <ClickHereLink label={t('clickHere')} onClick={goToTickets} />
              </DetailRow>
              <DetailRow label={t('viewDataUsage')}>
                <ClickHereLink label={t('clickHere')} onClick={goToDataUsage} />
              </DetailRow>
              <DetailRow label={t('radiusDetails')}>
                <ClickHereLink label={t('clickHere')} onClick={goToRadius} />
              </DetailRow>
              <DetailRow label={t('lastTopup')} value={detail.lastTopup} />
            </VStack>
            <VStack flex={1} align='stretch' spacing={0}>
              <DetailRow label={t('subscriptionType')}>
                <TypeBadge label={detail.subscriptionType} />
              </DetailRow>
              {/* Mark VIP — on hold, not yet wired */}
              <DetailRow label={t('vipCustomer')}>
                <TypeBadge label={t('markVip')} icon={<Icons.VipStarIcon boxSize='12px' />} />
              </DetailRow>
              <DetailRow label={t('package')} value={detail.packageName} />
              <DetailRow label={t('applicationNumber')} value={detail.applicationNumber} />
              <DetailRow label={t('changeUsername')}>
                <ClickHereLink label={t('clickHere')} onClick={() => setUsernamePopup(true)} />
              </DetailRow>
              <DetailRow label={t('lastMonthDataUsage')}>
                <ClickHereLink label={t('clickHere')} onClick={goToDataUsage} />
              </DetailRow>
              <DetailRow label={t('subscriberFinanceDetails')}>
                <ClickHereLink label={t('clickHere')} onClick={goToFinance} />
              </DetailRow>
              <DetailRow label={t('accountBalance')} value={detail.accountBalance} />
            </VStack>
          </Stack>

          {/* Device Details */}
          <SectionTitle title={t('deviceDetails')} />
          <Stack direction={{ base: 'column', lg: 'row' }} gap={16}>
            <VStack flex={1} align='stretch' spacing={0}>
              <DetailRow label={t('deviceProvider')} value={detail.deviceProvider} />
              <DetailRow label={t('deviceType')} value={detail.deviceType} />
              <DetailRow label={t('deviceModel')} value={detail.deviceModel} />
              <DetailRow label={t('macAddress')} value={detail.macAddress} />
            </VStack>
            <VStack flex={1} align='stretch' spacing={0}>
              <DetailRow label={t('deviceMake')} value={detail.deviceMake} />
              <DetailRow label={t('deviceCategory')} value={detail.deviceCategory} />
              <DetailRow label={t('gphonSerialNumber')} value={detail.gponSerialNumber} />
              <DetailRow label={t('oltType')} value={detail.oltType} />
            </VStack>
          </Stack>
        </Box>

        {/* Footer actions */}
        <HStack justify='flex-end' mt={6} spacing={3}>
          {isEditing ? (
            <>
              <Button
                variant='outline'
                borderColor='primary.500'
                color='primary.500'
                borderRadius='40px'
                px={6}
                onClick={cancelEdit}
              >
                {t('cancel')}
              </Button>
              <Button
                bg='primary.500'
                color='white'
                borderRadius='40px'
                px={6}
                _hover={{ bg: 'primary.600' }}
                onClick={handleSubmit(onSave)}
                loading={isSaving}
                disabled={saveDisabled}
              >
                {t('save')}
                <Icons.BsCheckCircle boxSize={5} />
              </Button>
            </>
          ) : (
            <Button
              variant='outline'
              borderColor='primary.500'
              color='primary.500'
              borderRadius='40px'
              px={6}
              onClick={handleBack}
            >
              {t('close')}
            </Button>
          )}
        </HStack>
      </Box>

      <ConfirmPopup
        isConfirmOpen={confirmReset}
        handleClose={() => !isResetting && setConfirmReset(false)}
        handleConfirm={handleResetPassword}
        title='resetSubscriberPassword'
        content='confirmResetPassword'
      />

      <ChangeUsernamePopup
        isOpen={usernamePopup}
        onClose={() => setUsernamePopup(false)}
        subscriberId={subscriberId}
        currentUsername={detail.username}
      />
    </Box>
  );
};

export default SubscriberDetails;
