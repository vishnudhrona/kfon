import { Box, Flex, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { submitStockRequest } from '../actions';
import DeviceDetailCard from './DeviceDetailCard';
import ModalActionButtons from './ModalActionButtons';

const RequestForPopup = ({ isOpen, onClose, items = [], categoryId, typeName }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(
      submitStockRequest({
        deviceIds: items.map((item) => item.detailsId),
        custodianId: items[0]?.custodianId || '',
        userNocId: '',
        userKfonDcId: '',
        nocName: '',
        kfonDcName: '',
        remarks: '',
        categoryId,
        typeName,
        onSuccess: onClose
      })
    );
  };

  return (
    <Popup
      title={t('transfer')}
      titleMain={t('request')}
      isOpen={isOpen}
      onOpenChange={onClose}
      size='xl'
      closeButton={false}
    >
      <Box px='28px' pt='20px' pb='8px'>
        <Flex justify='flex-end' mb='10px'>
          <Text fontSize='14px' color='gray.500'>
            {t('totalDevice')}: <Text as='span' fontWeight='700' color='#232F50'>{items.length}</Text>
          </Text>
        </Flex>
        <VStack spacing={3} align='stretch' maxH='60vh' overflowY='auto'>
          {items.map((item) => (
            <DeviceDetailCard key={item.detailsId} item={item} showCheckbox={false} actionItems={[]} />
          ))}
        </VStack>
      </Box>

      <ModalActionButtons onClose={onClose} onSubmit={handleSave} />
    </Popup>
  );
};

export default RequestForPopup;
