import { Accordion, Box, Button, Text, VStack } from '@kfonbss/bss-ui-components';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch, useSelector } from 'react-redux';

import { BsArrowLeftCircle, BsCheckCircle, CustomCheckbox } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { errorToast, warningToast } from '@/components/custom/Toast';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchOnboardingDetails, fetchPartnerEnquiry, submitOnboarding } from '../action';
import OnboardingFormStep1 from '../components/OnboardingFormStep1';
import OnboardingFormStep2 from '../components/OnboardingFormStep2';
import OnboardingFormStep3 from '../components/OnboardingFormStep3';
import OnboardingFormStep4 from '../components/OnboardingFormStep4';
import OnboardingFormStep5 from '../components/OnboardingFormStep5';
import { getBasicDetails, getCompletedSteps, getGstInformation, getonboardingFormDetails } from '../selector';
import { actions as onboardingActions } from '../slice';

const STEP_TITLE_KEYS = {
  1: 'basicDetails',
  2: 'agreementDetails',
  3: 'bankDetails',
  4: 'kycGstInformation',
  5: 'supportingDocument'
};

const Onboarding = ({ completedSteps, gstInformation, formData, basicDetails }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiProgress = useSelector(getApiProgress);
  const isLoadingEnquiry =
    !!apiProgress?.[ACTION_TYPES.FETCH_PARTNER_ENQUIRY] || !!apiProgress?.[ACTION_TYPES.FETCH_ONBOARDING_DETAILS];
  const location = useLocation();
  const isOnboarded = !!location.state?.onboarded;
  const navigate = useNavigate();
  const [openAccordions, setOpenAccordions] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!basicDetails?.id && !isOnboarded) {
      setOpenAccordions(['step1']);
    }
  }, [basicDetails?.id, isOnboarded]);

  useEffect(() => {
    dispatch(onboardingActions.clearOnboardingDetails());
    return () => {
      dispatch(onboardingActions.clearOnboardingDetails());
    };
  }, [dispatch]);

  const { enquiryId, type } = useParams({ strict: false });

  const partnerOnboardId = location.state?.partnerOnboardId;
  useEffect(() => {
    if (partnerOnboardId) {
      dispatch(fetchOnboardingDetails({ id: partnerOnboardId }));
    } else if (enquiryId) {
      dispatch(fetchPartnerEnquiry({ enquiryId, type }));
    } else if (location?.state && Object.keys(location.state).length > 0) {
      dispatch(onboardingActions.setOnboardingFormDetails(location.state));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerOnboardId, dispatch, enquiryId, type]);

  const handleStepSuccess = (currentStepNum) => {
    const nextStep = `step${currentStepNum + 1}`;
    if (currentStepNum < 5) {
      setOpenAccordions([nextStep]);
      setTimeout(() => {
        const element = document.getElementById(`accordion-${nextStep}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } else {
      setOpenAccordions([]);
    }
  };

  const handleFinalSubmit = () => {
    const requiredDocs = [
      'cancelledChequeCopy',
      'panCardSupportingDocument',
      'cableTvLicenseOrCompanyRegCert',
      'agreementCopy',
      'aadhaarCopy'
    ];

    const supportingDocs = formData?.supportingDocuments || {};
    const missingDocs = requiredDocs.filter((doc) => !supportingDocs[doc]);
    const isStep5Complete = missingDocs.length === 0;

    if (completedSteps.length < 4 || !isStep5Complete) {
      const allSteps = [1, 2, 3, 4];
      let firstUnfilled = allSteps.find((step) => !completedSteps.includes(step));

      if (!firstUnfilled && !isStep5Complete) {
        firstUnfilled = 5;
      }

      if (firstUnfilled) {
        const stepId = `step${firstUnfilled}`;
        setOpenAccordions((prev) => {
          if (!prev.includes(stepId)) {
            return [...prev, stepId];
          }
          return prev;
        });

        setTimeout(() => {
          const element = document.getElementById(`accordion-step${firstUnfilled}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }

      const errorMsg =
        firstUnfilled === 5
          ? t('pleaseUploadAllDocuments')
          : t('pleaseCompletePreviousStep', { 0: t(STEP_TITLE_KEYS[firstUnfilled]) });
      warningToast({ description: errorMsg });
      return;
    }

    if (!acceptedTerms) {
      errorToast({ description: t('pleaseAcceptTermsAndConditions') });
      return;
    }

    const onboardingId = basicDetails?.id;

    if (onboardingId) {
      setIsSubmitting(true);
      dispatch(
        submitOnboarding({
          id: onboardingId,
          submitFlag: true,
          onSuccess: () => setIsSubmitting(false),
          onError: () => setIsSubmitting(false)
        })
      );
    } else {
      errorToast({ description: t('onboardingIdMissing') });
    }
  };

  const handleAccordionChange = (details) => {
    const newValue = Array.isArray(details) ? details : details?.value;
    if (Array.isArray(newValue)) {
      setOpenAccordions(newValue);
    }
  };

  const makeBeforeSave = useCallback(
    (stepId) => () => {
      const allPrevComplete = Array.from({ length: stepId - 1 }, (_, i) => i + 1).every((n) =>
        completedSteps.includes(n)
      );
      if (allPrevComplete) return true;

      const firstIncomplete = [1, 2, 3, 4].find((n) => !completedSteps.includes(n));
      if (firstIncomplete) {
        const incompleteKey = `step${firstIncomplete}`;
        warningToast({ description: t('pleaseCompletePreviousStep', { 0: t(STEP_TITLE_KEYS[firstIncomplete]) }) });
        setOpenAccordions((prev) => (prev.includes(incompleteKey) ? prev : [...prev, incompleteKey]));
        setTimeout(() => {
          document
            .getElementById(`accordion-${incompleteKey}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
      return false;
    },
    [completedSteps, t]
  );

  const onboardingSteps = [
    { id: 1, key: 'step1', Component: OnboardingFormStep1 },
    { id: 2, key: 'step2', Component: OnboardingFormStep2 },
    { id: 3, key: 'step3', Component: OnboardingFormStep3 },
    { id: 4, key: 'step4', Component: OnboardingFormStep4 },
    { id: 5, key: 'step5', Component: OnboardingFormStep5, extraProps: { gstInformation } }
  ];

  return (
    <CustomLoaderProvider isLoading={isLoadingEnquiry}>
      <Box px={3}>
        <VStack alignItems={'stretch'} gap={4} overflow={'Auto'} maxHeight={'full'}>
          <Accordion type={'multiple'} value={openAccordions} onValueChange={handleAccordionChange}>
            {onboardingSteps.map(({ id, key, Component, extraProps }) => (
              <Box id={`accordion-${key}`} key={key}>
                <Component
                  showSaveButton={!isOnboarded}
                  isActive={openAccordions.includes(key)}
                  isDisabled={isOnboarded}
                  onBeforeSave={id > 1 ? makeBeforeSave(id) : undefined}
                  onSaveSuccess={() => handleStepSuccess(id)}
                  {...(extraProps || {})}
                />
              </Box>
            ))}
          </Accordion>

          {isOnboarded && (
            <Box mt={6} display='flex' justifyContent='flex-end'>
              <Button
                variant='outline'
                h='10'
                px='6'
                borderRadius='full'
                onClick={() => navigate({ to: '/app/partners/list' })}
              >
                <BsArrowLeftCircle />
                {t('back')}
              </Button>
            </Box>
          )}

          {!isOnboarded && (
            <Box mt={6} p={4} borderWidth={1} borderRadius='md' borderColor='gray.200'>
              <VStack alignItems='flex-start' gap={3}>
                <Text fontSize='lg' fontWeight='semibold'>
                  {t('declaration')}
                </Text>
                <Text fontSize='sm' color='gray.600'>
                  {t('onboardingDeclarationText')}
                </Text>

                <CustomCheckbox
                  checked={acceptedTerms}
                  onCheckedChange={(e) => {
                    const newValue = typeof e === 'object' && e !== null && 'checked' in e ? !!e.checked : e;
                    setAcceptedTerms(newValue);
                  }}
                >
                  {t('acceptTermsAndConditions')}
                </CustomCheckbox>

                <Button
                  colorScheme='blue'
                  ml='auto'
                  w='fit-content'
                  disabled={!acceptedTerms || isSubmitting}
                  loading={isSubmitting}
                  onClick={handleFinalSubmit}
                >
                  {t('submit')}
                  <BsCheckCircle />
                </Button>
              </VStack>
            </Box>
          )}
        </VStack>
      </Box>
    </CustomLoaderProvider>
  );
};

const mapStateToProps = (state) => ({
  completedSteps: getCompletedSteps(state),
  gstInformation: getGstInformation(state),
  formData: getonboardingFormDetails(state),
  basicDetails: getBasicDetails(state)
});

export default connect(mapStateToProps, null)(Onboarding);
