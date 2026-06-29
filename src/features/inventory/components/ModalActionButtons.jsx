import { Button, HStack, Icons } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const { BsXCircle, BsCheckCircle } = Icons;

/**
 * Common action buttons footer for inventory modals.
 *
 * Props:
 *  - onClose: function — called when Close button is clicked
 *  - onSubmit: function — onClick handler for submit button (optional; use when not inside a <form>)
 *  - submitLabel: string — translation key for the submit button (default: 'save')
 *  - submitIcon: ReactNode — icon to show in submit button (default: BsCheckCircle)
 *  - closeLabel: string — translation key for the close button (default: 'close')
 *  - mt: Chakra spacing — top margin (default: 6)
 *  - px: Chakra spacing — horizontal padding on buttons (default: undefined)
 */
const ModalActionButtons = ({
  onClose,
  onSubmit,
  submitLabel = 'save',
  submitIcon,
  closeLabel = 'close',
  mt = 6,
  px
}) => {
  const { t } = useTranslation();

  return (
    <HStack justifyContent='end' spacing={4} mt={mt}>
      <Button
        variant='outline'
        onClick={onClose}
        borderColor='primary.500'
        color='primary.500'
        borderRadius='full'
        {...(px !== undefined ? { px } : {})}
      >
        <BsXCircle />
        {t(closeLabel)}
      </Button>
      <Button
        type='submit'
        bg='primary.500'
        color='white'
        borderRadius='full'
        _hover={{ bg: 'primary.600' }}
        {...(onSubmit !== undefined ? { onClick: onSubmit } : {})}
        {...(px !== undefined ? { px } : {})}
      >
        {t(submitLabel)}
        {submitIcon !== undefined ? submitIcon : <BsCheckCircle />}
      </Button>
    </HStack>
  );
};

export default ModalActionButtons;
