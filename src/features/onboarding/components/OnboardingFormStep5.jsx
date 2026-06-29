import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch, useSelector } from 'react-redux';

import { errorToast } from '@/components/custom/Toast';
import DocumentFileUploadField from '@/features/common/components/DocumentFileUploadField';
import { MAX_FILE_SIZE } from '@/features/common/constants';
import useDocumentUploadPreviews, {
  extractFileId,
  extractUploadedFileId
} from '@/features/common/hooks/useDocumentUploadPreviews';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, deleteOnboardingDocument, submitOnboardingSingleDocument } from '../action';
import { DOCUMENT_TYPE_MAP } from '../constants';
import { getBasicDetails, getGstEnabled, getGstInformation, getSupportingDocuments } from '../selector';
import { actions as onboardingActions } from '../slice';
import { supportingDocumentsValidation } from '../validation';

const FIELD_NAMES = [
  'cancelledChequeCopy',
  'panCardSupportingDocument',
  'gstRegistrationDocument',
  'cableTvLicenseOrCompanyRegCert',
  'agreementCopy',
  'aadhaarCopy'
];

const OnboardingFormStep5 = ({
  submitSingleDoc,
  supportingDocuments,
  basicDetails,
  gstInformation,
  isDisabled = false,
  onBeforeSave
}) => {
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const dispatch = useDispatch();
  const onboardingId = basicDetails?.id || id;
  const apiProgress = useSelector(getApiProgress);

  const isLoading = (fieldName) => apiProgress[`${ACTION_TYPES.ONBOARDING_SUPPORTING_DOCUMENTS_SUBMIT}_${fieldName}`];

  const defaultValues = useMemo(() => {
    const data = supportingDocuments;

    return {
      cancelledChequeCopy: data?.cancelledChequeCopy || null,
      panCardSupportingDocument: data?.panCardSupportingDocument || null,
      gstRegistrationDocument: data?.gstRegistrationDocument || null,
      cableTvLicenseOrCompanyRegCert: data?.cableTvLicenseOrCompanyRegCert || null,
      agreementCopy: data?.agreementCopy || null,
      aadhaarCopy: data?.aadhaarCopy || null
    };
  }, [supportingDocuments]);

  const resolver = useMemo(() => yupResolver(supportingDocumentsValidation(t, gstInformation)), [t, gstInformation]);

  const {
    control,
    formState: { errors },
    setValue
  } = useForm({
    resolver,
    defaultValues,
    mode: 'onChange'
  });

  const fileValues = useMemo(
    () =>
      FIELD_NAMES.reduce((acc, fieldName) => {
        acc[fieldName] = supportingDocuments?.[fieldName];
        return acc;
      }, {}),
    [supportingDocuments]
  );

  const { fileNames, previews, clearFile, loadPreview, setSelectedFile, setUploadedFile } = useDocumentUploadPreviews({
    fieldNames: FIELD_NAMES,
    fileValues,
    setValue
  });

  const handleFileSelect = (fieldName, file) => {
    if (!file) return;
    if (onBeforeSave && !onBeforeSave()) return;
    if (file.size >= MAX_FILE_SIZE) {
      errorToast({ description: t('fileSizeTooLarge') });
      return;
    }
    if (onboardingId) {
      setSelectedFile(fieldName, file.name);
      submitSingleDoc({
        files: { [fieldName]: file },
        fieldName,
        id: onboardingId,
        onSuccess: (responseData) => {
          const fileId = extractUploadedFileId(responseData);
          setUploadedFile(fieldName, file.name);
          if (!fileId) return;
          loadPreview(fieldName, fileId);
        }
      });
    } else {
      errorToast({ description: t('saveBasicDetailsFirst') });
      const element = document.getElementById('accordion-step1');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const onDelete = (fieldName) => {
    const fileId = extractFileId(supportingDocuments?.[fieldName]);
    if (!fileId) return;

    dispatch(
      deleteOnboardingDocument({
        fileId,
        documentType: DOCUMENT_TYPE_MAP[fieldName],
        fieldName,
        onSuccess: () => {
          dispatch(
            onboardingActions.setOnboardingFormDetails({
              supportingDocuments: { ...supportingDocuments, [fieldName]: null }
            })
          );
          clearFile(fieldName);
        }
      })
    );
  };

  const isUploaded = (fieldName) => {
    return !!previews[fieldName]?.url || typeof supportingDocuments?.[fieldName] === 'string';
  };

  const renderField = (name, label, required = false) => (
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
      disabled={isDisabled}
    />
  );

  return (
    <AccordionItem title={t('supportingDocument')} name={'Step5'} value={'step5'} gridRemove={true} saveButton={false}>
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 2, '2xl': 3 }} gap={10} rowGap={10} mt={5} px={5}>
        {(gstInformation === true || gstInformation === 'Yes') &&
          renderField('gstRegistrationDocument', t('gstRegistrationDoc'), true)}
        {renderField('cancelledChequeCopy', t('cancelledBankChequeLeafCopy'), true)}
        {renderField('panCardSupportingDocument', t('panCardSupportingNumber'), true)}

        {renderField('cableTvLicenseOrCompanyRegCert', t('cableTvLicenseOrCompanyRegistrationCertificate'), true)}
        {renderField('agreementCopy', t('agreementCopy'), true)}
        {renderField('aadhaarCopy', t('aadhaarCopy'), true)}
      </SimpleGrid>
    </AccordionItem>
  );
};

const mapStateToProps = (state) => ({
  supportingDocuments: getSupportingDocuments(state),
  basicDetails: getBasicDetails(state),
  gstInformation: getGstEnabled(state) ?? !!getGstInformation(state)?.gstin
});

const mapDispatchToProps = {
  submitSingleDoc: submitOnboardingSingleDocument
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingFormStep5);
