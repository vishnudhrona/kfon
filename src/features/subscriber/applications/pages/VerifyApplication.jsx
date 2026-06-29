import { Button, Flex, Spinner, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { API_ACTION_TYPES, fetchSubscriberByEnquiryId, verifySubscriber } from '../actions';
import ApplicationDetailView from '../components/common/ApplicationDetailView';
import AssignWorkOrder from '../components/pop-up/AssignWorkOrder';
import RejectReason from '../components/pop-up/RejectReason';
import { getPrepopulatedData } from '../selectors';
import { actions } from '../slice';

const MAROON = '#8d0247';

const VerifyApplication = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prepopulatedData = useSelector(getPrepopulatedData);
  const isVerifying = useSelector((state) => !!getApiProgress(state)[API_ACTION_TYPES.VERIFY_SUBSCRIBER]);

  const [isLoading, setIsLoading] = useState(!prepopulatedData);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [assignWorkOrderOpen, setAssignWorkOrderOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const enquiryId = sessionStorage.getItem('verifyEnquiryId');
  const subscriberId = prepopulatedData?.basicDetail?.id;
  const isEws = prepopulatedData?.basicDetail?.type === 'EWS';

  useEffect(() => {
    if (!prepopulatedData && enquiryId) {
      dispatch(
        fetchSubscriberByEnquiryId({
          enquiryId,
          onSuccess: () => setIsLoading(false),
          onError: () => setIsLoading(false)
        })
      );
    } else {
      setIsLoading(false);
    }
  }, [dispatch, enquiryId, prepopulatedData]);

  const handleVerify = useCallback(
    (isApproved, reasonForRejection) => {
      if (!subscriberId) return;
      dispatch(
        verifySubscriber({
          id: subscriberId,
          isApproved,
          ...(isApproved ? {} : { reasonForRejection }),
          onSuccess: () => setVerifyStatus(isApproved ? 'approved' : 'rejected')
        })
      );
    },
    [dispatch, subscriberId]
  );

  const handleBack = useCallback(() => {
    dispatch(actions.clearApplicationState());
    sessionStorage.removeItem('verifyEnquiryId');
    navigate({ to: '/app/subscribers/enquiry-list' });
  }, [dispatch, navigate]);

  if (isLoading) {
    return (
      <Flex w='full' h='200px' align='center' justify='center'>
        <Spinner size='lg' color='primary.500' />
      </Flex>
    );
  }

  if (!prepopulatedData) {
    return (
      <Flex w='full' h='200px' align='center' justify='center'>
        <Text color='gray.500'>{t('noDataAvailable')}</Text>
      </Flex>
    );
  }

  const basicDetail = prepopulatedData.basicDetail || {};

  const basicFields = [
    { label: t('applicationNo'), value: basicDetail.applicationFormNumber },
    { label: t('applicantName'), value: basicDetail.applicantName },
    { label: t('dateOfBirth'), value: basicDetail.dateOfBirth },
    { label: t('mobileNo'), value: basicDetail.mobileNumber },
    { label: t('emailAddress'), value: basicDetail.emailAddress },
    { label: t('gender'), value: basicDetail.gender },
    { label: t('kycType'), value: basicDetail.kycType },
    { label: t('status'), value: basicDetail.status, type: 'status' }
  ];

  const footer = (
    <>
      <Button
        variant='outline'
        borderColor={MAROON}
        color={MAROON}
        onClick={handleBack}
        _hover={{ bg: 'transparent' }}
      >
        {t('back')}
      </Button>

      {!verifyStatus && (
        <>
          <Button
            variant='outline'
            borderColor={MAROON}
            color={MAROON}
            borderRadius='full'
            px={8}
            height='44px'
            onClick={() => setRejectOpen(true)}
            _hover={{ bg: 'transparent' }}
            loading={isVerifying}
          >
            {t('rejectSubscriber')}
          </Button>
          <Button
            bg={MAROON}
            color='white'
            borderRadius='full'
            px={8}
            height='44px'
            onClick={() => handleVerify(true)}
            _hover={{ bg: '#6d0136' }}
            loading={isVerifying}
          >
            {t('approveSubscriber')}
          </Button>
        </>
      )}

      {verifyStatus === 'approved' && isEws && (
        <Button
          variant='outline'
          borderColor={MAROON}
          color={MAROON}
          borderRadius='full'
          px={8}
          height='44px'
          onClick={() => setAssignWorkOrderOpen(true)}
          _hover={{ bg: 'transparent' }}
        >
          {t('assignWorkOrder')}
        </Button>
      )}
    </>
  );

  return (
    <ApplicationDetailView
      prepopulatedData={prepopulatedData}
      basicFields={basicFields}
      footer={footer}
    >
      {isEws && (
        <AssignWorkOrder
          data={{ enquiryId, trackingId: basicDetail.applicationFormNumber }}
          open={assignWorkOrderOpen}
          onClose={() => setAssignWorkOrderOpen(false)}
        />
      )}
      <RejectReason
        open={rejectOpen}
        setOpen={setRejectOpen}
        isLoading={isVerifying}
        onConfirm={(reasonForRejection) => handleVerify(false, reasonForRejection)}
      />
    </ApplicationDetailView>
  );
};

export default VerifyApplication;
