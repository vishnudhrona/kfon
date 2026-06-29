import { Box, FormController } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const DocumentFileUploadField = ({
  name,
  label,
  control,
  errors,
  fileName,
  isLoading,
  isUploaded,
  preview,
  onFileSelect,
  onDeleteFile,
  required = false,
  accept = '.pdf,.jpeg,.png,.jpg',
  disabled = false
}) => {
  const { t } = useTranslation();
  const fieldValue = fileName || (preview?.url || isUploaded ? label : '');
  const hasError = !!errors?.[name];

  return (
    <Box position='relative' pointerEvents={disabled ? 'none' : 'auto'} opacity={disabled ? 0.5 : 1}>
      <FormController
        key={`${name}-${preview?.url || fieldValue}`}
        labelName={label}
        placeholder={fieldValue || t('dragAndDropHere')}
        name={name}
        control={control}
        errors={errors}
        type='file'
        accept={accept}
        required={required}
        value={fieldValue}
        isLoading={isLoading}
        isUploaded={isUploaded}
        onFileSelect={onFileSelect}
        onDeleteFile={onDeleteFile}
        previewUrl={preview?.url}
        showPreview={true}
      />
      {!hasError && (
        <Box fontSize='xs' color='gray.500' mt='1'>
          {t('fileUploadNote')}
        </Box>
      )}
    </Box>
  );
};

export default DocumentFileUploadField;
