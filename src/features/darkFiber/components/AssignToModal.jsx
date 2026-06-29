import { Box, Button, FormController, HStack, Icons, Popup, useForm } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const AssignToModal = ({ isOpen, onClose, onSubmit, users = [] }) => {
  const { t } = useTranslation();
  const { BsCheckCircle, BsXCircle } = Icons;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t('assignTo')}
      size='sm'
      borderRadius='16px'
      footer={
        <HStack w='100%' justifyContent='flex-end' spacing={6} pt={10} mr={-5}>
          <Button
            variant='outline'
            colorScheme='pink'
            onClick={onClose}
            borderRadius='full'
            h='47px'
            px='18px'
            display='flex'
            alignItems='center'
            justifyContent='center'
            gap='6px'
            borderColor='primary.500'
            color='primary.500'
          >
            {t('cancel')} <BsXCircle />
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            colorScheme='pink'
            bg='primary.500'
            color='white'
            borderRadius='full'
            h='47px'
            px='18px'
            display='flex'
            alignItems='center'
            justifyContent='center'
            gap='6px'
          >
            {t('submit')} <BsCheckCircle />
          </Button>
        </HStack>
      }
    >
      <Box gap={6} width='100%' pt={4}>
        <FormController
          name='assigningPerson'
          labelName={t('assigningPerson')}
          placeholder={t('choosePerson')}
          type='select'
          items={users}
          control={control}
          errors={errors}
          required
          h='45px'
          borderRadius='md'
        />
      </Box>
    </Popup>
  );
};

export default AssignToModal;
