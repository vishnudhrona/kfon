import { Button, HStack, Popup, Stack,VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import DUMMY_PDF from '@/assets/blank_pdf.pdf';
import { Close } from '@/components/custom';

const DocViewerPopup = ({ isOpen, setIsOpen }) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <Popup
        isOpen={isOpen}
        title=" "
        titleMain={t('corporateSubscriberDetails')}
        size='xl'
        placement='center'
        onOpenChange={setIsOpen}
      >
        <VStack alignItems='stretch' gap={5} p={4}>
          <embed src={DUMMY_PDF} height={'400px'}></embed>

          <HStack ml='auto'>
            <Button variant='outline' onClick={() => setIsOpen(false)}>
              <Close />
              {t('close')}
            </Button>
          </HStack>
        </VStack>
      </Popup>
    </Stack>
  );
};

export default DocViewerPopup;
