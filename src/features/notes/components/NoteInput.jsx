import { Box, Button, Controller, Flex, Icons } from '@kfonbss/bss-ui-components';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import RemarksTextArea from './RemarksTextArea';

const NoteInput = ({
  control,
  errors,
  handleSubmit,
  onSubmit,
  attachment,
  onAttachmentPreviewClick,
  onRemoveAttachment
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachmentPreviewClick(file, URL.createObjectURL(file));
    }
    e.target.value = '';
  };

  return (
    <Box bg='white' borderRadius='md' p='3' boxShadow='0 1px 7px 0 rgba(141, 2, 71, 0.10)' flexShrink={0}>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*,.pdf'
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      {attachment && (
        <Flex align='center' gap={2} mb={2}>
          <Button
            variant='ghost'
            size='xs'
            color='primary.500'
            fontWeight='500'
            fontSize='12px'
            borderRadius='full'
            px={1}
            flex={1}
            justifyContent='flex-start'
            textDecoration='underline'
            noOfLines={1}
            onClick={() => onAttachmentPreviewClick(null, null)}
          >
            {attachment.name}
          </Button>
          <Button size='xs' variant='ghost' color='red.400' onClick={onRemoveAttachment}>
            <Icons.CardCloseIcon boxSize='6' />
          </Button>
        </Flex>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name='remark'
          control={control}
          render={({ field }) => (
            <RemarksTextArea
              {...field}
              placeholder={t('enterRemarks')}
              error={errors?.remark?.message}
              onAttach={() => fileInputRef.current?.click()}
            />
          )}
        />
      </form>
    </Box>
  );
};

export default NoteInput;
