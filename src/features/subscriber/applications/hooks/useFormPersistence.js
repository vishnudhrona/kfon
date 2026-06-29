import { useCallback, useEffect, useRef } from 'react';

import { getDataFromStorage, setDataToStorage } from '@/utils/encryptionUtils';

/**
 * Custom hook to persist form data to localStorage
 * Automatically saves form data as user types and restores on mount
 *
 * @param {string} storageKey - Unique key for localStorage
 * @param {Object} options - Configuration options
 * @param {Function} options.watch - React Hook Form watch function
 * @param {Function} options.setValue - React Hook Form setValue function
 * @param {number} options.debounceMs - Debounce delay in milliseconds (default: 500)
 * @returns {Object} - { clearFormStorage, hasStoredData }
 */
export const useFormPersistence = (storageKey, { watch, setValue, debounceMs = 500 }) => {
  const debounceTimerRef = useRef(null);
  const isRestoringRef = useRef(false);
  const hasLoadedRef = useRef(false);

  /**
   * Clear form data from localStorage
   */
  const clearFormStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Error clearing form storage:', error);
    }
  }, [storageKey]);

  /**
   * Save form data to localStorage (debounced)
   */
  const saveFormData = useCallback(
    (data) => {
      // Don't save if we're currently restoring data
      if (isRestoringRef.current) return;

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        try {
          // Filter out file objects and undefined values
          const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
            // Skip file objects
            if (value instanceof File || value instanceof FileList) {
              return acc;
            }
            // Skip undefined values
            if (value === undefined) {
              return acc;
            }
            acc[key] = value;
            return acc;
          }, {});

          // Save to localStorage with encryption
          setDataToStorage(storageKey, sanitizedData, true);
        } catch (error) {
          console.error('Error saving form data:', error);
        }
      }, debounceMs);
    },
    [storageKey, debounceMs]
  );

  /**
   * Load form data from localStorage on mount
   */
  useEffect(() => {
    if (hasLoadedRef.current) return;

    try {
      isRestoringRef.current = true;
      const savedData = getDataFromStorage(storageKey, true);

      if (savedData && typeof savedData === 'object') {
        // Restore each field
        Object.entries(savedData).forEach(([key, value]) => {
          // Only set if value exists and is not the default value
          if (value !== null && value !== undefined && value !== '') {
            setValue(key, value, { shouldValidate: false });
          }
        });
      }

      hasLoadedRef.current = true;
    } catch (error) {
      console.error('Error loading form data:', error);
    } finally {
      // Small delay to ensure all setValue calls complete
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 100);
    }
  }, [storageKey, setValue]);

  /**
   * Watch form changes and save to localStorage
   */
  useEffect(() => {
    const subscription = watch((data) => {
      saveFormData(data);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [watch, saveFormData]);

  /**
   * Check if there's stored data
   */
  const hasStoredData = useCallback(() => {
    try {
      const savedData = getDataFromStorage(storageKey, true);
      return savedData && Object.keys(savedData).length > 0;
    } catch {
      return false;
    }
  }, [storageKey]);

  return {
    clearFormStorage,
    hasStoredData: hasStoredData()
  };
};

/**
 * Utility to clear application form session storage on submit or reset
 */
export const clearAllFormStorage = () => {
  const enquiryId = sessionStorage.getItem('appliedOnlineEnqId');
  if (enquiryId) {
    try {
      const stored = JSON.parse(sessionStorage.getItem('aadhaar_data') || '{}');
      delete stored[enquiryId];
      if (Object.keys(stored).length > 0) {
        sessionStorage.setItem('aadhaar_data', JSON.stringify(stored));
      } else {
        sessionStorage.removeItem('aadhaar_data');
      }
    } catch {
      sessionStorage.removeItem('aadhaar_data');
    }
  }
  sessionStorage.removeItem('appliedOnlineEnqId');
  sessionStorage.removeItem('applicationFormNumber');
};
