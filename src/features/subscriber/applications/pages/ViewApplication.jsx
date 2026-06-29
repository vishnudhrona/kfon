import { Button, Flex, Spinner, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { MENU_KEYS, PERMISSIONS } from '@/constants/permissions';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { usePageActions } from '@/hooks/usePageActions';

import { API_ACTION_TYPES, fetchSubscriberByEnquiryId, getOntAcknowledgement } from '../actions';
import ApplicationDetailView from '../components/common/ApplicationDetailView';
import OntAcknowledgementOtpPopup from '../components/pop-up/OntAcknowledgementOtpPopup';
import { getPrepopulatedData } from '../selectors';
import { actions } from '../slice';

const MAROON = '#8d0247';

const ViewApplication = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prepopulatedData = useSelector(getPrepopulatedData);
  const isGettingAck = useSelector((state) => !!getApiProgress(state)[API_ACTION_TYPES.GET_ONT_ACKNOWLEDGEMENT]);

  const { hasPermission } = usePageActions(MENU_KEYS.SUBSCRIBER_ENQUIRY_LIST);

  const [isLoading, setIsLoading] = useState(!prepopulatedData);
  const [ontOtpPopupOpen, setOntOtpPopupOpen] = useState(false);
  const [ontOtpRefId, setOntOtpRefId] = useState(null);

  const enquiryId = sessionStorage.getItem('viewEnquiryId');

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

  const subscriberId = prepopulatedData?.basicDetail?.id;

  const handleGetAcknowledgement = useCallback(() => {
    if (!subscriberId) return;
    dispatch(
      getOntAcknowledgement({
        id: subscriberId,
        onSuccess: (data) => {
          setOntOtpRefId(data?.otpRefId ?? null);
          setOntOtpPopupOpen(true);
        }
      })
    );
  }, [dispatch, subscriberId]);

  const handleBack = useCallback(() => {
    dispatch(actions.clearApplicationState());
    sessionStorage.removeItem('viewEnquiryId');
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
  const installationAddress = prepopulatedData.installationAddress || {};
  const deviceDetail = prepopulatedData.deviceDetail || {};

  const photo = basicDetail.photo ? `data:image/jpeg;base64,${basicDetail.photo}` : null;

  const basicFields = [
    { label: t('applicationNo'), value: basicDetail.applicationFormNumber },
    { label: t('applicantName'), value: basicDetail.applicantName },
    { label: t('aadharNumber'), value: basicDetail.aadharNumber },
    { label: t('dateOfBirth'), value: basicDetail.dateOfBirth },
    { label: t('mobileNo'), value: basicDetail.mobileNumber },
    { label: t('emailAddress'), value: basicDetail.emailAddress },
    { label: t('gender'), value: basicDetail.gender },
    { label: t('kycType'), value: basicDetail.kycType, type: 'kyc' },
    { label: t('status'), value: basicDetail.status, type: 'status' }
  ];

  const showSupportingDocs = !(basicDetail.kycType === 'E_KYC' && installationAddress.sameAsPermanent);

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
      {hasPermission(PERMISSIONS.SUBSCRIBER.SUBSCRIBER_ONT_ACKNOWLEDGEMENT) &&
        deviceDetail.freeToUse &&
        !deviceDetail.ontAcknowledged && (
          <Button
            variant='outline'
            borderColor={MAROON}
            color={MAROON}
            borderRadius='full'
            px={8}
            height='44px'
            onClick={handleGetAcknowledgement}
            _hover={{ bg: 'transparent' }}
            loading={isGettingAck}
          >
            {t('getAcknowledgementFromSubscriber')}
          </Button>
        )}
    </>
  );

  return (
    <ApplicationDetailView
      prepopulatedData={prepopulatedData}
      basicFields={basicFields}
      photo={photo ? { src: photo } : undefined}
      showSupportingDocs={showSupportingDocs}
      footer={footer}
    >
      <OntAcknowledgementOtpPopup
        isOpen={ontOtpPopupOpen}
        onClose={() => setOntOtpPopupOpen(false)}
        subscriberId={subscriberId}
        otpRefId={ontOtpRefId}
      />
    </ApplicationDetailView>
  );
};

export default ViewApplication;
