import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fileStorageViewUrl } from '@/features/common/actions';

export const extractFileId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.split('/files/')[1];
  return match ? match.split('/')[0] : url;
};

export const extractUploadedFileId = (response) =>
  response?.data?.documentUrl || response?.data?.fileId || response?.documentUrl || response?.fileId || null;

const getFileName = (url) => (typeof url === 'string' ? url.split('/').pop() : '');

const createEmptyFileNames = (fieldNames) =>
  fieldNames.reduce((acc, fieldName) => {
    acc[fieldName] = '';
    return acc;
  }, {});

const useDocumentUploadPreviews = ({ fieldNames, fileValues, setValue, onPreviewError }) => {
  const dispatch = useDispatch();
  const loadedPreviewsRef = useRef(new Set());
  const [fileNames, setFileNames] = useState(() => createEmptyFileNames(fieldNames));
  const [previews, setPreviews] = useState({});

  const normalizedFileValues = useMemo(() => fileValues || {}, [fileValues]);

  const clearPreview = useCallback((fieldName) => {
    loadedPreviewsRef.current.forEach((key) => {
      if (key.startsWith(`${fieldName}:`)) {
        loadedPreviewsRef.current.delete(key);
      }
    });
    setPreviews((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  }, []);

  const clearFile = useCallback(
    (fieldName) => {
      clearPreview(fieldName);
      setFileNames((prev) => ({ ...prev, [fieldName]: '' }));
      if (setValue) setValue(fieldName, null);
    },
    [clearPreview, setValue]
  );

  const loadPreview = useCallback(
    (fieldName, sourceFileId) => {
      const fileId = extractFileId(sourceFileId);
      if (!fileId) return;
      const previewKey = `${fieldName}:${fileId}`;
      if (loadedPreviewsRef.current.has(previewKey)) return;

      loadedPreviewsRef.current.add(previewKey);
      dispatch(
        fileStorageViewUrl({
          fileId,
          onSuccess: ({ url: viewUrl, contentType }) => {
            setPreviews((prev) => ({ ...prev, [fieldName]: { url: viewUrl, contentType: contentType || '' } }));
          },
          onError: () => {
            loadedPreviewsRef.current.delete(previewKey);
            if (onPreviewError) onPreviewError(fieldName);
          }
        })
      );
    },
    [dispatch, onPreviewError]
  );

  useEffect(() => {
    setFileNames((prev) => {
      const next = { ...prev };
      fieldNames.forEach((fieldName) => {
        const value = normalizedFileValues[fieldName];
        next[fieldName] = getFileName(value);
        if (value && setValue) setValue(fieldName, value);
      });
      return next;
    });

    fieldNames.forEach((fieldName) => {
      const value = normalizedFileValues[fieldName];
      if (!value || typeof value !== 'string') return;
      loadPreview(fieldName, value);
    });
  }, [fieldNames, loadPreview, normalizedFileValues, setValue]);

  const setSelectedFile = useCallback(
    (fieldName, fileName) => {
      clearPreview(fieldName);
      setFileNames((prev) => ({ ...prev, [fieldName]: fileName || '' }));
      if (setValue) setValue(fieldName, '', { shouldValidate: false });
    },
    [clearPreview, setValue]
  );

  const setUploadedFile = useCallback(
    (fieldName, fileName) => {
      setFileNames((prev) => ({ ...prev, [fieldName]: fileName || '' }));
      if (setValue) setValue(fieldName, fileName || '', { shouldValidate: true });
    },
    [setValue]
  );

  return {
    fileNames,
    previews,
    clearFile,
    clearPreview,
    loadPreview,
    setFileNames,
    setSelectedFile,
    setUploadedFile
  };
};

export default useDocumentUploadPreviews;
