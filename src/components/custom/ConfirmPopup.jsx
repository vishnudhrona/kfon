import { Button , HStack , Popup,Text , VStack  } from "@kfonbss/bss-ui-components";
import { t } from "i18next";

const ConfirmPopup = ({isConfirmOpen, handleClose, handleConfirm, title='confirm', content='areYouSure', contentValues}) => <Popup isOpen={isConfirmOpen} onOpenChange={handleClose} title='' size='sm' closeButton={false}>
    <VStack spacing={4} alignItems='center'  pt={4} textAlign='center'>
      <Text fontSize='lg' fontWeight='bold'>{t(title) || 'Confirm'}</Text>
      <Text color='text.text_secondary'>{typeof content === 'string' ? (t(content, contentValues) || 'Are you sure you want to Continue?') : content}</Text>
      <HStack spacing={4} mt={4} width='100%' justifyContent='center'>
        <Button variant='outline' onClick={handleClose} borderColor='primary.500' color='primary.500' borderRadius='full' size='md' width='120px'>
          {t('no')}
        </Button>
        <Button onClick={handleConfirm} bg='primary.500' color='white' borderRadius='full' _hover={{ bg: 'primary.600' }} size='md' width='120px'>
          {t('yes')}
        </Button>
      </HStack>
    </VStack>
  </Popup>;


export default ConfirmPopup;