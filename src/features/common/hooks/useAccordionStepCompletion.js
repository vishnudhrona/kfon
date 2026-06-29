import { useCallback, useState } from 'react';

import { warningToast } from '@/components/custom/Toast';

const scrollToAccordion = (stepKey, delay = 100) => {
  setTimeout(() => {
    document.getElementById(`accordion-${stepKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, delay);
};

const useAccordionStepCompletion = ({
  stepOrder,
  completionMap,
  stepTitleKeys,
  t,
  initialOpenItems = [],
  ignoredSteps = []
}) => {
  const [activeItems, setActiveItems] = useState(initialOpenItems);

  const completableSteps = useCallback(
    (steps = stepOrder) => steps.filter((step) => !ignoredSteps.includes(step) && step in completionMap),
    [completionMap, ignoredSteps, stepOrder]
  );

  const openStep = useCallback((stepKey, delay = 100) => {
    setActiveItems((prev) => (prev.includes(stepKey) ? prev : [...prev, stepKey]));
    scrollToAccordion(stepKey, delay);
  }, []);

  const getFirstIncompleteStep = useCallback(
    (steps = stepOrder) => completableSteps(steps).find((step) => !completionMap[step]),
    [completableSteps, completionMap, stepOrder]
  );

  const showIncompleteStep = useCallback(
    (stepKey, description) => {
      if (!stepKey) return;
      warningToast({
        description: description || t('pleaseCompletePreviousStep', { 0: t(stepTitleKeys?.[stepKey] || stepKey) })
      });
      openStep(stepKey);
    },
    [openStep, stepTitleKeys, t]
  );

  const makeBeforeSave = useCallback(
    (stepKey) => () => {
      const stepIndex = stepOrder.indexOf(stepKey);
      const previousSteps = completableSteps(stepOrder.slice(0, stepIndex));
      const firstIncomplete = previousSteps.find((step) => !completionMap[step]);

      if (!firstIncomplete) return true;

      showIncompleteStep(firstIncomplete);
      return false;
    },
    [completableSteps, completionMap, showIncompleteStep, stepOrder]
  );

  const validateCompletedSteps = useCallback(
    ({ steps = stepOrder, message, getMessage } = {}) => {
      const firstIncomplete = getFirstIncompleteStep(steps);
      if (!firstIncomplete) return true;

      showIncompleteStep(firstIncomplete, getMessage?.(firstIncomplete) || message || t('pleaseCompleteAllSteps'));
      return false;
    },
    [getFirstIncompleteStep, showIncompleteStep, stepOrder, t]
  );

  const moveToNextStep = useCallback(
    (currentStepKey) => {
      const currentIndex = stepOrder.indexOf(currentStepKey);
      if (currentIndex === -1 || currentIndex >= stepOrder.length - 1) return;
      const nextStep = stepOrder[currentIndex + 1];
      setActiveItems((prev) => {
        const withoutCurrent = prev.filter((item) => item !== currentStepKey);
        return withoutCurrent.includes(nextStep) ? withoutCurrent : [...withoutCurrent, nextStep];
      });
      scrollToAccordion(nextStep, 300);
    },
    [stepOrder]
  );

  return {
    activeItems,
    setActiveItems,
    getFirstIncompleteStep,
    makeBeforeSave,
    moveToNextStep,
    openStep,
    validateCompletedSteps
  };
};

export default useAccordionStepCompletion;
