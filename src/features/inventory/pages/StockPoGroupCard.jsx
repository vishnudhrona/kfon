import { Box, Flex, HStack, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import TableActionMenu from '@/components/custom/TableActionMenu';
import { PERMISSIONS } from '@/constants/permissions';
import { formatDisplayDate } from '@/utils/dateUtils';

const APPROVE = 'APPROVE';
const REJECT = 'REJECT';

const StockPoGroupCard = ({ data: item, hasPermission, openDialog }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate({
      to: '/app/inventory/device-list',
      search: { poNo: item.poNo },
      state: { headerTitle: item.poNo }
    });
  };

  const types = item?.types || item?.type || [];
  const models = item?.models || item?.model || [];
  const typeNames = Array.isArray(types) ? types.map((t) => t.name).join(', ') : types?.name || '-';
  const modelNames = Array.isArray(models) ? models.map((m) => m.name).join(', ') : models?.name || '-';

  return (
    <Box
      bg='white'
      border='1px solid #E5E7EB'
      borderRadius='12px'
      overflow='hidden'
      cursor='pointer'
      onClick={handleCardClick}
    >
      <Flex justify='space-between' align='center' px='20px' py='14px'>
        <HStack spacing='0' wrap='wrap' gap='0' align='center'>
          <Text fontWeight='700' color='#232F50' fontSize='16px'>
            {item?.poNo || '-'}
          </Text>
          <Box w='1px' h='20px' bg='#E5E7EB' mx='8px' />
          <Text fontSize='16px' color='#6B7280'>
            {t('deviceVendor')}:{' '}
            <Text as='span' fontWeight='700' color='primary.500'>
              {item?.vendor?.name || '-'}
            </Text>
          </Text>
        </HStack>
        <HStack gap='2'>
          <Box px='10px' py='4px' borderRadius='4px' bg='#EFF6FF' display='inline-flex'>
            <Text fontSize='13px' fontWeight='700' color='#1D4ED8'>
              {t('total')}: {item?.totalDeviceCount ?? '-'}
            </Text>
          </Box>
          <Box px='10px' py='4px' borderRadius='4px' bg='#F0FDF4' display='inline-flex'>
            <Text fontSize='13px' fontWeight='700' color='#15803D'>
              {t('approved')}: {item?.approvedCount ?? '-'}
            </Text>
          </Box>
          <Box px='10px' py='4px' borderRadius='4px' bg='#FEF2F2' display='inline-flex'>
            <Text fontSize='13px' fontWeight='700' color='#B91C1C'>
              {t('rejected')}: {item?.rejectedCount ?? '-'}
            </Text>
          </Box>
          {(item?.totalDeviceCount ?? 0) > (item?.approvedCount ?? 0) + (item?.rejectedCount ?? 0) && (
            <Box onClick={(e) => e.stopPropagation()}>
              <TableActionMenu
                actionItems={[
                  {
                    label: 'approveStock',
                    onClick: () => openDialog(item, APPROVE),
                    hidden: !hasPermission(PERMISSIONS.STOCK_LIST.APPROVE_REJECT)
                  },
                  {
                    label: 'rejectStock',
                    onClick: () => openDialog(item, REJECT),
                    hidden: !hasPermission(PERMISSIONS.STOCK_LIST.APPROVE_REJECT)
                  }
                ]}
              />
            </Box>
          )}
        </HStack>
      </Flex>

      <Box bg='#F9FAFB' px='20px' py='10px' mx='14px' mb='14px' borderRadius='8px'>
        <HStack spacing='0' wrap='wrap' gap='0'>
          <Text fontSize='14px' color='#6B7280'>
            {t('invoiceDate')}:{' '}
            <Text as='span' fontWeight='600' color='#232F50'>
              {formatDisplayDate(item?.invoiceDate) || '-'}
            </Text>
          </Text>
          <Box w='1px' h='14px' bg='#D1D5DB' mx='16px' />
          <Text fontSize='14px' color='#6B7280'>
            {t('createdDate')}:{' '}
            <Text as='span' fontWeight='600' color='#232F50'>
              {formatDisplayDate(item?.createdDate) || '-'}
            </Text>
          </Text>
          <Box w='1px' h='14px' bg='#D1D5DB' mx='16px' />
          <Text fontSize='14px' color='#6B7280'>
            {t('createdBy')}:{' '}
            <Text as='span' fontWeight='600' color='#232F50'>
              {item?.createdBy?.empName || item?.createdBy || '-'}
            </Text>
          </Text>
          <Box w='1px' h='14px' bg='#D1D5DB' mx='16px' />
          <Text fontSize='14px' color='#6B7280'>
            {t('deviceType')}:{' '}
            <Text as='span' fontWeight='600' color='#232F50'>
              {typeNames}
            </Text>
          </Text>
          <Box w='1px' h='14px' bg='#D1D5DB' mx='16px' />
          <Text fontSize='14px' color='#6B7280'>
            {t('deviceModel')}:{' '}
            <Text as='span' fontWeight='600' color='#232F50'>
              {modelNames}
            </Text>
          </Text>
        </HStack>
      </Box>
    </Box>
  );
};

export default StockPoGroupCard;
