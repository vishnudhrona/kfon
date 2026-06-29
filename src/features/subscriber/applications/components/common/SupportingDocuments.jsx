import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, Box, Button, Flex, FormController, FormGroup, useForm } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import { errorToast } from '@/components/custom/Toast';
import { fileStorageDelete } from '@/features/common/actions';
import DocumentFileUploadField from '@/features/common/components/DocumentFileUploadField';
import { MAX_FILE_SIZE } from '@/features/common/constants';
import useDocumentUploadPreviews, {
  extractFileId,
  extractUploadedFileId
} from '@/features/common/hooks/useDocumentUploadPreviews';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import {
  API_ACTION_TYPES,
  fetchIdentityProofTypes,
  fetchResidenceProofTypes,
  updateSupportingDocuments,
  uploadSingleDocument
} from '../../actions';
import {
  getIdentityProofTypeList,
  getPrepopulatedData,
  getResidenceProofTypeList,
  getSubscriberId
} from '../../selectors';
import { actions as sliceActions } from '../../slice';
import { supportingDocumentsValidationSchema } from '../../validation';

const DOCUMENT_TYPE_MAP = {
  applicationFormCopy: 'APPLICATION_FORM',
  addressProofCopy: 'RESIDENCE_PROOF',
  idProofCopy: 'IDENTITY_PROOF'
};

const FIELD_NAMES = ['applicationFormCopy', 'addressProofCopy', 'idProofCopy'];

const URL_KEY_MAP = {
  applicationFormCopy: 'applicationFormUrl',
  addressProofCopy: 'residenceProofUrl',
  idProofCopy: 'identityProofUrl'
};

const SupportingDocument = ({ isEkyc = false, previousStepCompleted = true, onBeforeSave, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const subscriberId = useSelector(getSubscriberId);
  const residenceProofTypeList = useSelector(getResidenceProofTypeList);
  const identityProofTypeList = useSelector(getIdentityProofTypeList);
  const apiProgress = useSelector(getApiProgress);

  const isLoading = (fieldName) => apiProgress[`${API_ACTION_TYPES.UPLOAD_SINGLE_DOCUMENT}_${fieldName}`];

  const residenceOptions = useMemo(
    () =>
      residenceProofTypeList?.map((item) => ({
        label: item.name,
        value: item.name,
        name: item.name,
        id: item.id || item.code
      })) || [],
    [residenceProofTypeList]
  );

  const identityOptions = useMemo(
    () =>
      identityProofTypeList?.map((item) => ({
        label: item.name,
        value: item.name,
        name: item.name,
        id: item.id || item.code
      })) || [],
    [identityProofTypeList]
  );

  const prepopulatedData = useSelector(getPrepopulatedData);
  const prepopulatedDataRef = useRef(prepopulatedData);
  prepopulatedDataRef.current = prepopulatedData;

  // Stores UUID returned by upload API so onDelete can use it immediately without parsing URLs
  const uploadedFileIdsRef = useRef({});

  const validationSchema = useMemo(() => supportingDocumentsValidationSchema(t, isEkyc), [t, isEkyc]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({ resolver: yupResolver(validationSchema) });

  const fileValues = useMemo(() => {
    const doc = prepopulatedData?.supportingDocument;
    return {
      applicationFormCopy: doc?.applicationFormUrl,
      addressProofCopy: doc?.residenceProofUrl,
      idProofCopy: doc?.identityProofUrl
    };
  }, [prepopulatedData]);

  const handlePreviewError = useCallback(
    (fieldName) => {
      const doc = prepopulatedData?.supportingDocument;
      dispatch(
        sliceActions.setPrepopulatedData({
          ...prepopulatedData,
          supportingDocument: { ...doc, [URL_KEY_MAP[fieldName]]: null }
        })
      );
      setValue(fieldName, null);
    },
    [dispatch, prepopulatedData, setValue]
  );

  const { fileNames, previews, clearFile, loadPreview, setSelectedFile, setUploadedFile } = useDocumentUploadPreviews({
    fieldNames: FIELD_NAMES,
    fileValues,
    setValue,
    onPreviewError: handlePreviewError
  });

  useEffect(() => {
    if (previousStepCompleted) {
      dispatch(fetchResidenceProofTypes());
      if (!isEkyc) dispatch(fetchIdentityProofTypes());
    }
  }, [dispatch, previousStepCompleted, isEkyc]);

  useEffect(() => {
    const doc = prepopulatedData?.supportingDocument;
    if (!doc) return;

    if (doc.residenceProofType && residenceOptions.length) {
      const match = residenceOptions.find((o) => o.value === doc.residenceProofType);
      setValue('residenceProofType', match || { label: doc.residenceProofType, value: doc.residenceProofType });
    }
    if (doc.residenceProofNo) setValue('addressProofNumber', doc.residenceProofNo);
    if (doc.identityProofType && identityOptions.length) {
      const match = identityOptions.find((o) => o.value === doc.identityProofType);
      setValue('idProofType', match || { label: doc.identityProofType, value: doc.identityProofType });
    }
    if (doc.identityProofNo) setValue('idProofNumber', doc.identityProofNo);
  }, [prepopulatedData, setValue, residenceOptions, identityOptions]);

  const handleFileSelect = (fieldName, file) => {
    if (!file) return;
    if (file.size >= MAX_FILE_SIZE) {
      errorToast({ description: t('fileSizeTooLarge') });
      return;
    }
    setSelectedFile(fieldName, file.name);
    dispatch(
      uploadSingleDocument({
        fieldName,
        type: DOCUMENT_TYPE_MAP[fieldName],
        file,
        subscriberId,
        onSuccess: (_, response) => {
          const fileId = extractUploadedFileId(response);
          setUploadedFile(fieldName, file.name);
          if (!fileId) return;
          uploadedFileIdsRef.current[fieldName] = fileId;
          loadPreview(fieldName, fileId);
        },
        onError: () => {
          setValue(fieldName, '', { shouldValidate: true });
        }
      })
    );
  };

  const onDelete = (fieldName) => {
    const current = prepopulatedDataRef.current;
    const doc = current?.supportingDocument;
    const fileId =
      uploadedFileIdsRef.current[fieldName] ||
      extractFileId(doc?.[URL_KEY_MAP[fieldName]]) ||
      extractFileId(previews[fieldName]?.url);
    if (!fileId) {
      clearFile(fieldName);
      return;
    }
    dispatch(
      fileStorageDelete({
        fileId,
        fieldName,
        onSuccess: () => {
          delete uploadedFileIdsRef.current[fieldName];
          const latest = prepopulatedDataRef.current;
          dispatch(
            sliceActions.setPrepopulatedData({
              ...latest,
              supportingDocument: { ...latest?.supportingDocument, [URL_KEY_MAP[fieldName]]: null }
            })
          );
          clearFile(fieldName);
        }
      })
    );
  };

  const isUploaded = (fieldName) => {
    return !!fileValues[fieldName] || !!previews[fieldName]?.url;
  };

  const onSubmit = useCallback(
    (data) => {
      if (onBeforeSave && !onBeforeSave()) return;
      dispatch(
        updateSupportingDocuments({
          subscriberId,
          residenceProofType: data.residenceProofType?.value || data.residenceProofType,
          residenceProofNo: data.addressProofNumber,
          identityProofType: data.idProofType?.value || data.idProofType,
          identityProofNo: data.idProofNumber,
          onSuccess
        })
      );
    },
    [onBeforeSave, dispatch, subscriberId, onSuccess]
  );

  const renderFileField = (name, label, required = false) => (
    <DocumentFileUploadField
      name={name}
      label={label}
      control={control}
      errors={errors}
      fileName={fileNames[name]}
      isLoading={isLoading(name)}
      isUploaded={isUploaded(name)}
      preview={previews[name]}
      onFileSelect={(file) => handleFileSelect(name, file)}
      onDeleteFile={() => onDelete(name)}
      required={required}
    />
  );

  return (
    <AccordionItem
      title={t('supportingDocument')}
      name={'SupportingDocument'}
      value={'SupportingDocument'}
      gridRemove
      saveButton={false}
    >
      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <FormGroup title={t('applicationFormCopy')}>
          {renderFileField('applicationFormCopy', t('applicationFormCopy'), true)}
        </FormGroup>

        <FormGroup title={t('residenceProof')}>
          <FormController
            placeholder={t('residenceProofType')}
            labelName={t('residenceProofType')}
            name='residenceProofType'
            control={control}
            errors={errors}
            type='select'
            items={residenceOptions}
            required
          />

          <FormController
            placeholder={t('addressProofNumber')}
            labelName={t('addressProofNumber')}
            name='addressProofNumber'
            control={control}
            errors={errors}
            required
          />

          {renderFileField('addressProofCopy', t('addressProofCopy'), true)}
        </FormGroup>

        {!isEkyc && (
          <FormGroup title={t('identityProof')}>
            <FormController
              placeholder={t('idProofType')}
              labelName={t('idProofType')}
              name='idProofType'
              control={control}
              errors={errors}
              type='select'
              items={identityOptions}
              required
            />

            <FormController
              placeholder={t('idProofNumber')}
              labelName={t('idProofNumber')}
              name='idProofNumber'
              control={control}
              errors={errors}
              required
            />

            {renderFileField('idProofCopy', t('idProofCopy'), true)}
          </FormGroup>
        )}

        <Flex justify='flex-end' px={5} pb={5}>
          <Button type='submit' variant='outline'>
            {t('saveAndContinue')}
            <BsArrowRightCircle />
          </Button>
        </Flex>
      </Box>
    </AccordionItem>
  );
};

export default SupportingDocument;
