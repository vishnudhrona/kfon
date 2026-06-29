import { Box, Flex, Popup, Text } from '@kfonbss/bss-ui-components';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';

import ModalActionButtons from '../components/ModalActionButtons';
import { STOCK_STATUS_CONFIG } from '../constants';

const APPROVE = 'APPROVE';

const StockMiniCard = memo(({ item, t }) => {
  const config = STOCK_STATUS_CONFIG[item.status] || { label: item.status, color: '#555', bg: '#f0f0f0' };

  return (
    <Flex justify='space-between' align='center' px='14px' py='10px' bg='#F9FAFB' border='1px solid #E5E7EB' borderRadius='8px'>
      <Flex gap='12px' align='center' wrap='wrap'>
        <Text fontWeight='700' color='#232F50' fontSize='14px'>
          {item?.type?.name}
        </Text>
        <Box w='1px' h='16px' bg='#E5E7EB' />
        <Text fontSize='14px' color='#6B7280'>
          {t('deviceModel')}:{' '}
          <Text as='span' fontWeight='600' color='#232F50'>
            {item?.model?.name}
          </Text>
        </Text>
        <Box w='1px' h='16px' bg='#E5E7EB' />
        <Text fontSize='14px' color='#6B7280'>
          {t('assetType')}:{' '}
          <Text as='span' fontWeight='600' color='#232F50'>
            {item.assetType || '-'}
          </Text>
        </Text>
        <Box w='1px' h='16px' bg='#E5E7EB' />
        <Text fontSize='14px' color='#6B7280'>
          {t('gponSerialNumber')}:{' '}
          <Text as='span' fontWeight='600' color='#232F50'>
            {item.gponSerialNumber || '-'}
          </Text>
        </Text>
      </Flex>
      <Box px='10px' py='4px' borderRadius='4px' bg={config.bg} flexShrink={0}>
        <Text fontSize='12px' fontWeight='600' color={config.color}>
          {config.label}
        </Text>
      </Box>
    </Flex>
  );
});

const StockApproveRejectPopup = ({ dialog, rows, onConfirm, onClose, isLoading }) => {
  const { t } = useTranslation();

  const items = useMemo(() => {
    if (!dialog) return [];
    if (dialog.poGroup) return rows;
    if (dialog.bulk) return rows.filter((r) => dialog.selectedIds?.has(r.detailsId));
    return [dialog.row];
  }, [dialog, rows]);

  return (
    <Popup
      isOpen={!!dialog}
      titleMain={t('stock')}
      onOpenChange={(open) => !open && onClose()}
      title={dialog?.actionType === APPROVE ? t('approve') : t('reject')}
      size='md'
    >
      <CustomLoaderProvider isLoading={isLoading}>
        <Text pb='3' px='4' color='#6B7280' fontSize='14px'>
          {dialog?.actionType === APPROVE ? t('approveStockConfirmation') : t('rejectStockConfirmation')}
        </Text>

        <Flex direction='column' gap='8px' mb='4' px='4' maxH='320px' overflowY='auto'>
          {items.map((item) => (
            <StockMiniCard key={item.detailsId} item={item} t={t} />
          ))}
        </Flex>

        <ModalActionButtons onClose={onClose} onSubmit={onConfirm} submitLabel='confirm' closeLabel='cancel' mt={4} />
      </CustomLoaderProvider>
    </Popup>
  );
};

export default StockApproveRejectPopup;
