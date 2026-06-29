import { Box, Icons, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const FilePreviewPanel = ({ showAttachmentPreview, attachment, attachmentPreviewUrl, fileViewData, onClose }) => {
  const { t } = useTranslation();
  const previewUrl = fileViewData?.url || null;

  const renderContent = () => {
    if (showAttachmentPreview) {
      return attachment?.type?.startsWith('image/') ? (
        <img src={attachmentPreviewUrl} alt={attachment.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        <iframe src={attachmentPreviewUrl} title={attachment.name} style={{ width: '100%', height: '100%', border: 'none' }} />
      );
    }

    if (previewUrl) {
      return fileViewData?.contentType?.startsWith('image/') ? (
        <img src={previewUrl} alt={t('document')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      ) : (
        <iframe src={previewUrl} title={t('document')} style={{ width: '100%', height: '100%', border: 'none' }} />
      );
    }

    return (
      <Text fontSize='14px' color='#9CA3AF'>
        {t('loading') || 'Loading...'}
      </Text>
    );
  };

  return (
    <Box
      flex={1}
      border='1px solid #E7E7E7'
      borderRadius='12px'
      overflow='hidden'
      bg='white'
      display='flex'
      alignItems='center'
      justifyContent='center'
      h='381px'
      position='relative'
    >
      <Box
        as='button'
        position='absolute'
        top='8px'
        right='8px'
        zIndex={1}
        w='24px'
        h='24px'
        borderRadius='full'
        display='flex'
        alignItems='center'
        justifyContent='center'
        cursor='pointer'
        onClick={onClose}
        _hover={{ bg: 'grey.50' }}
      >
        <Icons.CardCloseIcon boxSize='5' color='white' />
      </Box>
      {renderContent()}
    </Box>
  );
};

export default FilePreviewPanel;
