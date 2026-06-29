import { Box, Button, HStack, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import SUCCESS_IMG from '@/assets/success.png';
import { TickIcon } from '@/assets/svg';

const SuccessPopup = ({ isOpen, setIsOpen, title = 'Thank You', message, onDone }) => {
  const { t } = useTranslation();

  const handleDone = () => {
    if (onDone) {
      onDone();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Popup
      isOpen={isOpen}
      size='sm'
      placement='center'
      onOpenChange={(v) => setIsOpen(v)}
      closeOnInteractOutside={false}
    >
      <VStack p={6} gap={4} alignItems='center'>
        <Box>
          <img src={SUCCESS_IMG} alt='success' style={{ width: '100%' }} />
        </Box>

        <Text fontSize='28px' fontWeight={700} textAlign='center'>
          {title}
        </Text>

        <Text fontSize='16px' textAlign='center' color='#555' mt={2}>
          {message || 'Your details have been received. Our team will contact you soon to assist further.'}
        </Text>

        <HStack gap={4} mt={4}>
          <Button colorScheme='primary' onClick={handleDone}>
            {t('done')}
            <TickIcon />
          </Button>
        </HStack>
      </VStack>
    </Popup>
  );
};

export default SuccessPopup;
