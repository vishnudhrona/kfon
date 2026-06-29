import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';

import {
  getBasicDetailsCompleted,
  getDeviceDetailsCompleted,
  getGstInformationCompleted,
  getInstallationAddressCompleted,
  getPermanentAddressCompleted,
  getSubscriberId,
  getSubscriptionDetailsCompleted,
  getSupportingDocumentsCompleted
} from '../selectors';
import { actions } from '../slice';

export const useFormCompletionPersistence = () => {
  const dispatch = useDispatch();
  const [isRestored, setIsRestored] = useState(false);

  // Selectors for all completion states
  const basicDetailsCompleted = useSelector(getBasicDetailsCompleted);
  const permanentAddressCompleted = useSelector(getPermanentAddressCompleted);
  const installationAddressCompleted = useSelector(getInstallationAddressCompleted);
  const subscriptionDetailsCompleted = useSelector(getSubscriptionDetailsCompleted);
  const deviceDetailsCompleted = useSelector(getDeviceDetailsCompleted);
  const gstInformationCompleted = useSelector(getGstInformationCompleted);
  const supportingDocumentsCompleted = useSelector(getSupportingDocumentsCompleted);
  const subscriberId = useSelector(getSubscriberId);

  // Restore from storage on mount
  useEffect(() => {
    try {
      const storedStatus = localStorage.getItem(STORAGE_KEYS.FORM_COMPLETION_STATUS);
      if (storedStatus) {
        const parsedStatus = JSON.parse(storedStatus);
        dispatch(actions.restoreCompletionStatus(parsedStatus));
      }
    } catch (error) {
      console.error('Failed to restore form completion status:', error);
    } finally {
      setIsRestored(true);
    }
  }, [dispatch]);

  // Persist to storage on change
  useEffect(() => {
    if (isRestored) {
      const status = {
        basicDetailsCompleted,
        permanentAddressCompleted,
        installationAddressCompleted,
        subscriptionDetailsCompleted,
        deviceDetailsCompleted,
        gstInformationCompleted,
        supportingDocumentsCompleted,
        subscriberId
      };
      localStorage.setItem(STORAGE_KEYS.FORM_COMPLETION_STATUS, JSON.stringify(status));
    }
  }, [
    basicDetailsCompleted,
    permanentAddressCompleted,
    installationAddressCompleted,
    subscriptionDetailsCompleted,
    deviceDetailsCompleted,
    gstInformationCompleted,
    supportingDocumentsCompleted,
    subscriberId,
    isRestored
  ]);

  return { isRestored };
};
