import { Box, chakra, HStack, IconButton, Image, Label, Portal, Spinner, VStack } from '@kfonbss/bss-ui-components';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { LuX } from 'react-icons/lu';

import { UploadIcon } from '@/components/ui/icons';

const ErrorText = ({ children }) => (
  <chakra.span position='absolute' bottom='-20px' right={0} fontSize='12px' color='toast.error'>
    {children}
  </chakra.span>
);

const PreviewDialog = ({ previewUrl, isFetchingPreview, contentType }) => {
  const isPdf = /\.pdf(\?.*)?$/i.test(previewUrl || '') || (contentType && contentType.includes('application/pdf'));
  const isImage =
    /\.(jpeg|jpg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(previewUrl || '') ||
    (contentType && contentType.startsWith('image/'));

  if (isFetchingPreview) {
    return (
      <Box w='45px' h='45px' display='flex' alignItems='center' justifyContent='center'>
        <Spinner size='sm' />
      </Box>
    );
  }

  if (!previewUrl) return null;

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Box
          w='45px'
          h='45px'
          border='1px solid'
          borderColor='border.primary'
          borderRadius='6px'
          overflow='hidden'
          cursor='pointer'
          display='flex'
          alignItems='center'
          justifyContent='center'
          bg='white'
          flexShrink={0}
        >
          {isImage ? (
            <Image src={encodeURI(previewUrl)} w='100%' h='100%' objectFit='cover' />
          ) : (
            <UploadIcon size='sm' color='gray.500' />
          )}
        </Box>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop backdropFilter='blur(10px)' />
        <Dialog.Positioner>
          <Dialog.Content
            width='fit-content'
            height='fit-content'
            maxWidth='95vw'
            maxHeight='95vh'
            background='transparent'
            boxShadow='none'
            padding={0}
          >
            <Dialog.Body padding={0} display='flex' justifyContent='center' alignItems='center' position='relative'>
              {isPdf ? (
                <chakra.embed
                  src={encodeURI(previewUrl)}
                  type='application/pdf'
                  width='80vw'
                  height='90vh'
                  style={{ borderRadius: '8px' }}
                />
              ) : (
                <Image src={encodeURI(previewUrl)} maxWidth='90vw' maxHeight='90vh' objectFit='contain' />
              )}
              <Dialog.CloseTrigger asChild position='absolute' top='-15px' right='-15px'>
                <IconButton
                  aria-label='Close'
                  variant='solid'
                  rounded='full'
                  size='sm'
                  bg='white'
                  _hover={{ bg: 'gray.100' }}
                >
                  <BsXCircle />
                </IconButton>
              </Dialog.CloseTrigger>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

const FileUploadField = ({
  name,
  labelName,
  required = false,
  accept = '.pdf,.jpeg,.png,.jpg',
  fileId = null,
  fileName = null,
  isLoading = false,
  isUploaded = false,
  previewUrl = null,
  isFetchingPreview = false,
  previewContentType = null,
  onUpload,
  onDelete,
  onRequestPreview,
  error,
  disabled = false
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const handleTriggerClick = () => {
    if (!disabled && !isLoading) {
      inputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    e.target.value = '';
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (fileId && onDelete) {
      onDelete(fileId);
    }
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    if (fileId && onRequestPreview && !previewUrl) {
      onRequestPreview(fileId);
    }
  };

  const displayName = fileName || t('dragAndDropHere');

  return (
    <VStack gap={0} align='stretch' opacity={disabled ? 0.5 : 1} pointerEvents={disabled ? 'none' : 'auto'}>
      {labelName && <Label name={name} label={labelName} required={required} error={error} />}

      <HStack gap='8px' align='center'>
        <Box
          as='button'
          type='button'
          flex='1'
          height='45px'
          px='3'
          border='1px solid'
          borderColor={error ? 'toast.error' : 'border.primary'}
          borderRadius='6px'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          gap='6px'
          bg='white'
          cursor={disabled || isLoading ? 'not-allowed' : 'pointer'}
          _hover={{ borderColor: disabled || isLoading ? undefined : 'primary.700' }}
          onClick={handleTriggerClick}
        >
          <HStack gap='6px' flex='1' minW={0} overflow='hidden'>
            <UploadIcon size='2xl' flexShrink={0} />
            <chakra.span
              color='font_color.primary'
              display='block'
              flex='1'
              textAlign='left'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
              fontSize='sm'
            >
              {displayName}
            </chakra.span>
          </HStack>

          <HStack gap='6px' flexShrink={0}>
            {isLoading && <Spinner size='sm' color='blue.500' />}
            {!isLoading && isUploaded && <BsCheckCircle color='green' size={16} />}
            {!isLoading && isUploaded && fileId && (
              <Box
                as='span'
                onClick={handleDelete}
                cursor='pointer'
                display='flex'
                alignItems='center'
                p='1'
                borderRadius='full'
                _hover={{ bg: 'gray.100' }}
              >
                <LuX size={14} color='gray' />
              </Box>
            )}
          </HStack>
        </Box>

        {isUploaded && fileId && (
          <Box onClick={handlePreviewClick} cursor='pointer' flexShrink={0}>
            <PreviewDialog
              previewUrl={previewUrl}
              isFetchingPreview={isFetchingPreview}
              contentType={previewContentType}
            />
          </Box>
        )}
      </HStack>

      <chakra.input ref={inputRef} type='file' accept={accept} display='none' onChange={handleFileChange} />

      {error && (
        <Box display='flex' justifyContent='flex-end'>
          <ErrorText>{error}</ErrorText>
        </Box>
      )}
    </VStack>
  );
};

export default FileUploadField;
