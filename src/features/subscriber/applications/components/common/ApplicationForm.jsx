import { Accordion, Box, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import useAccordionStepCompletion from '@/features/common/hooks/useAccordionStepCompletion';

import { API_ACTION_TYPES, fetchSubscriberByEnquiryId, finalizeCaf } from '../../actions';
import { clearAllFormStorage } from '../../hooks/useFormPersistence';
import {
  getBasicDetailsCompleted,
  getDeviceDetailsCompleted,
  getGstInformationCompleted,
  getInstallationAddressCompleted,
  getIsDifferentInstallationAddress,
  getPermanentAddressCompleted,
  getPrepopulatedData,
  getSubscriberId,
  getSubscriptionDetailsCompleted,
  getSupportingDocumentsCompleted
} from '../../selectors';
import { actions } from '../../slice';
import Address from './Address';
import BasicDetails from './BasicDetails';
import { CONNECTION_TYPES } from './constants';
import Declaration from './Declaration';
import DeviceDetails from './DeviceDetails';
import EwsSupportingDocuments from './EwsSupportingDocuments';
import GstInformation from './GstInformation';
import SubscriptionDetails from './SubscriptionDetails';
import SupportingDocument from './SupportingDocuments';

const STEP_TITLE_KEYS = {
  BasicDetails: 'basicDetails',
  permanentAddress: 'permanentAddress',
  installationAddress: 'installationAddress',
  SubscriptionDetails: 'subscriptionDetails',
  SupportingDocument: 'supportingDocument',
  GstInformation: 'gstInformation',
  DeviceDetails: 'deviceDetails'
};

const ApplicationForm = ({
  connectionType = CONNECTION_TYPES.HOME_CONNECTION,
  CustomBasicDetails,
  hideGst = false
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enquiryId: searchEnqId } = useSearch({ strict: false });
  const subscriberId = useSelector(getSubscriberId);
  const isBasicDetailsCompleted = useSelector(getBasicDetailsCompleted);
  const isPermanentAddressCompleted = useSelector(getPermanentAddressCompleted);
  const isInstallationAddressCompleted = useSelector(getInstallationAddressCompleted);
  const isSubscriptionDetailsCompleted = useSelector(getSubscriptionDetailsCompleted);
  const isDeviceDetailsCompleted = useSelector(getDeviceDetailsCompleted);
  const isSupportingDocumentsCompleted = useSelector(getSupportingDocumentsCompleted);
  const isGstInformationCompleted = useSelector(getGstInformationCompleted);
  const isDifferentInstallationAddress = useSelector(getIsDifferentInstallationAddress);

  const prepopulatedData = useSelector(getPrepopulatedData);
  let appliedOnlineEnqId = searchEnqId || sessionStorage.getItem(STORAGE_KEYS.APPLIED_ONLINE_ENQ_ID);
  if (!appliedOnlineEnqId || appliedOnlineEnqId === 'null' || appliedOnlineEnqId === 'undefined') {
    appliedOnlineEnqId = prepopulatedData?.basicDetail?.appliedOnlineEnqId || null;
  }

  // On mount: clear stale state then re-fetch if this is a partial CAF restore.
  // Unmount cleanup intentionally omitted — clearing on unmount caused StrictMode
  // double-invoke to wipe Redux state before the second mount could read it.
  // Navigation away is handled by EnquiryList which clears before dispatching fetch.
  useEffect(() => {
    const enquiryData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ENQUIRY_DATA) || 'null');
    const cafStatus = enquiryData?.enquiryCafStatus;
    const isPending = !cafStatus || cafStatus === 'PENDING';

    if (appliedOnlineEnqId && !isPending && !subscriberId) {
      // Fetch if no subscriber in Redux — handles refresh and StrictMode double-invoke.
      dispatch(fetchSubscriberByEnquiryId({ enquiryId: appliedOnlineEnqId }));
    } else if (!appliedOnlineEnqId || isPending) {
      dispatch(actions.clearApplicationState());
    }

    return () => {
      clearAllFormStorage();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstStep = 'BasicDetails';

  const isEkyc = useMemo(
    () =>
      [
        CONNECTION_TYPES.EKYC_CONNECTION,
        CONNECTION_TYPES.SME_EKYC_CONNECTION,
        CONNECTION_TYPES.EWS_EKYC_CONNECTION
      ].includes(connectionType),
    [connectionType]
  );

  const isEws = connectionType === CONNECTION_TYPES.EWS_EKYC_CONNECTION;

  // EWS always shows supporting document; other ekyc only when installation address differs
  const showSupportingDocument = isEws || !isEkyc || (isEkyc && isDifferentInstallationAddress);

  const stepOrder = useMemo(
    () => [
      firstStep,
      'permanentAddress',
      'installationAddress',
      'SubscriptionDetails',
      ...(showSupportingDocument ? ['SupportingDocument'] : []),
      ...(hideGst ? [] : ['GstInformation']),
      ...(isEws ? [] : ['DeviceDetails'])
    ],
    [firstStep, hideGst, isEws, showSupportingDocument]
  );

  // Map step key to whether it's completed.
  const completionMap = useMemo(
    () => ({
      BasicDetails: isBasicDetailsCompleted,
      permanentAddress: isPermanentAddressCompleted,
      installationAddress: isInstallationAddressCompleted,
      SubscriptionDetails: isSubscriptionDetailsCompleted,
      SupportingDocument: isSupportingDocumentsCompleted,
      GstInformation: isGstInformationCompleted,
      DeviceDetails: isDeviceDetailsCompleted
    }),
    [
      isBasicDetailsCompleted,
      isPermanentAddressCompleted,
      isInstallationAddressCompleted,
      isSubscriptionDetailsCompleted,
      isSupportingDocumentsCompleted,
      isGstInformationCompleted,
      isDeviceDetailsCompleted
    ]
  );

  const { activeItems, setActiveItems, makeBeforeSave, validateCompletedSteps, moveToNextStep } =
    useAccordionStepCompletion({
      stepOrder,
      completionMap,
      stepTitleKeys: STEP_TITLE_KEYS,
      t,
      initialOpenItems: [firstStep]
    });

  const isSubmitLoading = useSelector((state) => state['api-progress']?.[API_ACTION_TYPES.FINALIZE_CAF]) || false;

  const getFinalSubmitMessage = (firstIncompleteStep) =>
    firstIncompleteStep === 'SupportingDocument'
      ? t('pleaseUploadAllDocuments')
      : t('pleaseCompletePreviousStep', { 0: t(STEP_TITLE_KEYS[firstIncompleteStep]) });

  const handleSubmit = () => {
    if (!validateCompletedSteps({ getMessage: getFinalSubmitMessage })) return;

    dispatch(
      finalizeCaf({
        id: subscriberId,
        enquiryId: appliedOnlineEnqId,
        onSuccess: () => {
          clearAllFormStorage();
          navigate({ to: '/app/subscribers/enquiry-list' });
        }
      })
    );
  };

  const handleIncompleteSubmit = () => validateCompletedSteps({ getMessage: getFinalSubmitMessage });

  const isStepOneCompleted = isBasicDetailsCompleted;

  const isAllStepsCompleted = useMemo(() => {
    const steps = [
      isStepOneCompleted,
      isPermanentAddressCompleted,
      isInstallationAddressCompleted,
      isSubscriptionDetailsCompleted,
      ...(showSupportingDocument ? [isSupportingDocumentsCompleted] : []),
      ...(hideGst ? [] : [isGstInformationCompleted]),
      ...(isEws ? [] : [isDeviceDetailsCompleted])
    ];
    return steps.every(Boolean);
  }, [
    isStepOneCompleted,
    isPermanentAddressCompleted,
    isInstallationAddressCompleted,
    isSubscriptionDetailsCompleted,
    isSupportingDocumentsCompleted,
    isGstInformationCompleted,
    isDeviceDetailsCompleted,
    hideGst,
    isEws,
    showSupportingDocument
  ]);

  return (
    <VStack gap={4} width={'full'} alignItems='stretch'>
      <Accordion value={activeItems} onValueChange={({ value }) => setActiveItems(value)} collapsible>
        <Box id='accordion-BasicDetails'>
          {CustomBasicDetails ? (
            <CustomBasicDetails connectionType={connectionType} onSuccess={() => moveToNextStep('BasicDetails')} />
          ) : (
            <BasicDetails connectionType={connectionType} onSuccess={() => moveToNextStep('BasicDetails')} />
          )}
        </Box>
        <Box id='accordion-permanentAddress'>
          <Address
            previousStepCompleted={isStepOneCompleted}
            value='permanentAddress'
            connectionType={connectionType}
            onBeforeSave={makeBeforeSave('permanentAddress')}
            onSuccess={() => moveToNextStep('permanentAddress')}
          />
        </Box>
        <Box id='accordion-installationAddress'>
          <Address
            isInstallation={true}
            title={t('installationAddress')}
            value='installationAddress'
            previousStepCompleted={isPermanentAddressCompleted}
            connectionType={connectionType}
            onBeforeSave={makeBeforeSave('installationAddress')}
            onSuccess={() => moveToNextStep('installationAddress')}
          />
        </Box>
        <Box id='accordion-SubscriptionDetails'>
          <SubscriptionDetails
            isEws={isEws}
            previousStepCompleted={isInstallationAddressCompleted}
            onBeforeSave={makeBeforeSave('SubscriptionDetails')}
            onSuccess={() => moveToNextStep('SubscriptionDetails')}
          />
        </Box>
        {showSupportingDocument && (
          <Box id='accordion-SupportingDocument'>
            {isEws ? (
              <EwsSupportingDocuments
                previousStepCompleted={isSubscriptionDetailsCompleted}
                onBeforeSave={makeBeforeSave('SupportingDocument')}
                onSuccess={() => moveToNextStep('SupportingDocument')}
              />
            ) : (
              <SupportingDocument
                isEkyc={isEkyc}
                previousStepCompleted={isEkyc ? isInstallationAddressCompleted : isSubscriptionDetailsCompleted}
                onBeforeSave={makeBeforeSave('SupportingDocument')}
                onSuccess={() => moveToNextStep('SupportingDocument')}
              />
            )}
          </Box>
        )}
        {!hideGst && (
          <Box id='accordion-GstInformation'>
            <GstInformation
              previousStepCompleted={
                showSupportingDocument ? isSupportingDocumentsCompleted : isSubscriptionDetailsCompleted
              }
              onBeforeSave={makeBeforeSave('GstInformation')}
              onSuccess={() => moveToNextStep('GstInformation')}
            />
          </Box>
        )}
        <Box id='accordion-DeviceDetails'>
          <DeviceDetails
            previousStepCompleted={
              hideGst
                ? showSupportingDocument
                  ? isSupportingDocumentsCompleted
                  : isSubscriptionDetailsCompleted
                : isGstInformationCompleted
            }
            isEws={isEws}
            isLastStep={false}
            onBeforeSave={makeBeforeSave('DeviceDetails')}
            onSuccess={() => moveToNextStep('DeviceDetails')}
          />
        </Box>
      </Accordion>
      <Declaration
        onSubmit={handleSubmit}
        onIncompleteSubmit={handleIncompleteSubmit}
        isAllStepsCompleted={isAllStepsCompleted}
        isLoading={isSubmitLoading}
      />
    </VStack>
  );
};

export default ApplicationForm;
