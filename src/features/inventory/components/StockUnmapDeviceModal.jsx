import { Box, Popup } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import DeviceInfoHeader from './DeviceInfoHeader';
import ModalActionButtons from './ModalActionButtons';

const StockUnmapDeviceModal = ({ isOpen, onClose, onSubmit, device }) => {
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ device });
    onClose();
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) onClose();
      }}
      title={t('unmap')}
      titleMain={t('device')}
      closeButton={false}
      width='820px'
      maxWidth='820px'
      borderRadius='12px'
    >
      <Box px={4} pb={4}>
        <DeviceInfoHeader device={device} />
        <form onSubmit={handleSubmit}>
          <ModalActionButtons onClose={onClose} submitLabel='unmap' />
        </form>
      </Box>
    </Popup>
  );
};

export default StockUnmapDeviceModal;
