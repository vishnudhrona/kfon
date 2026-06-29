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
import { allowOnlyDigits } from '@/utils/validationUtils';

import { API_ACTION_TYPES, updateSupportingDocuments, uploadSingleDocument } from '../../actions';
import { getPrepopulatedData, getSubscriberId } from '../../selectors';
import { actions as sliceActions } from '../../slice';
import { ewsSupportingDocumentsValidationSchema } from '../../validation';

const RATION_CARD_DOCUMENT_TYPE = 'RATION_CARD_PROOF';

const DOCUMENT_TYPE_MAP = {
  applicationFormCopy: 'APPLICATION_FORM',
  rationCardDoc: RATION_CARD_DOCUMENT_TYPE
};

const FIELD_NAMES = ['applicationFormCopy', 'rationCardDoc'];

const URL_KEY_MAP = {
  applicationFormCopy: 'applicationFormUrl',
  rationCardDoc: 'rationCardDoc'
};

const RATION_CARD_TYPE_OPTIONS = [
  { label: 'Yellow', value: 'YELLOW', name: 'Yellow', id: 'YELLOW' },
  { label: 'Pink', value: 'PINK', name: 'Pink', id: 'PINK' },
  { label: 'Blue', value: 'BLUE', name: 'Blue', id: 'BLUE' },
  { label: 'White', value: 'WHITE', name: 'White', id: 'WHITE' }
];

const EwsSupportingDocuments = ({ onBeforeSave, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const subscriberId = useSelector(getSubscriberId);
  const apiProgress = useSelector(getApiProgress);
  const prepopulatedData = useSelector(getPrepopulatedData);
  const prepopulatedDataRef = useRef(prepopulatedData);
  prepopulatedDataRef.current = prepopulatedData;

  const uploadedFileIdsRef = useRef({});

  const isLoading = (fieldName) => apiProgress[`${API_ACTION_TYPES.UPLOAD_SINGLE_DOCUMENT}_${fieldName}`];

  const validationSchema = useMemo(() => ewsSupportingDocumentsValidationSchema(t), [t]);

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
      rationCardDoc: doc?.rationCardDoc
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
    const doc = prepopulatedData?.supportingDocument;
    if (!doc) return;

    if (doc.rationCardNo) setValue('rationCardNo', doc.rationCardNo);

    if (doc.rationCardType) {
      const match = RATION_CARD_TYPE_OPTIONS.find((o) => o.value === doc.rationCardType);
      setValue('rationCardType', match || { label: doc.rationCardType, value: doc.rationCardType });
    }
  }, [prepopulatedData, setValue]);

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

  const isUploaded = (fieldName) => !!fileValues[fieldName] || !!previews[fieldName]?.url;

  const onSubmit = useCallback(
    (data) => {
      if (onBeforeSave && !onBeforeSave()) return;
      dispatch(
        updateSupportingDocuments({
          subscriberId,
          rationCardNo: data.rationCardNo,
          rationCardType: data.rationCardType?.value,
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

        <FormGroup title={t('rationCardDetails')}>
          <FormController
            placeholder={t('choose', { 0: t('rationCardType') })}
            labelName={t('rationCardType')}
            name='rationCardType'
            control={control}
            errors={errors}
            type='select'
            items={RATION_CARD_TYPE_OPTIONS}
            required
          />

          <FormController
            placeholder={t('enter', { 0: t('rationCardNumber') })}
            labelName={t('rationCardNumber')}
            name='rationCardNo'
            control={control}
            errors={errors}
            inputMode='numeric'
            maxLength={10}
            onKeyDown={allowOnlyDigits}
            required
          />

          {renderFileField('rationCardDoc', t('rationCardDocument'), true)}
        </FormGroup>

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

export default EwsSupportingDocuments;
