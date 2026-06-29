import { Button, HStack, Icons } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const { BsXCircle, BsCheckCircle } = Icons;

const NotesActionButtons = ({ onClose, onSubmit, submitLabel = 'save', closeLabel = 'close', mt = 6 }) => {
  const { t } = useTranslation();

  return (
    <HStack justifyContent='end' spacing={4} mt={mt}>
      <Button
        variant='outline'
        onClick={onClose}
        borderColor='primary.500'
        color='primary.500'
        borderRadius='full'
      >
        <BsXCircle />
        {t(closeLabel)}
      </Button>
      <Button
        bg='primary.500'
        color='white'
        borderRadius='full'
        _hover={{ bg: 'primary.600' }}
        {...(onSubmit !== undefined ? { onClick: onSubmit } : {})}
      >
        {t(submitLabel)}
        <BsCheckCircle />
      </Button>
    </HStack>
  );
};

export default NotesActionButtons;
