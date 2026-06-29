import { Box, Flex, HStack, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { CustomCheckbox } from '@/components/custom';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { PERMISSIONS } from '@/constants/permissions';
import { formatDisplayDate } from '@/utils/dateUtils';

import { STOCK_STATUS_CONFIG } from '../constants';

const APPROVE = 'APPROVE';
const REJECT = 'REJECT';

const StockDetailsCard = ({ data: item, selectedIds, toggleRow, hasPermission, openDialog }) => {
  const { t } = useTranslation();

  const config = STOCK_STATUS_CONFIG[item.status] || { label: item.status, color: '#555', bg: '#f0f0f0' };
  const actionItems = [
    {
      label: 'approveStock',
      onClick: () => openDialog(item, APPROVE),
      hidden: !hasPermission(PERMISSIONS.STOCK_LIST.APPROVE_REJECT) || item.status !== 'STOCK_ENTERED'
    },
    {
      label: 'rejectStock',
      onClick: () => openDialog(item, REJECT),
      hidden: !hasPermission(PERMISSIONS.STOCK_LIST.APPROVE_REJECT) || item.status !== 'STOCK_ENTERED'
    }
  ];

  return (
    <Flex align='center' gap='12px' pb='8px'>
      <CustomCheckbox
        checked={selectedIds.has(item.detailsId)}
        onCheckedChange={() => toggleRow(item.detailsId)}
        onClick={(e) => e.stopPropagation()}
        disabled={item.status !== 'STOCK_ENTERED'}
      />
      <Box flex='1' bg='white' border='1px solid #E5E7EB' borderRadius='12px' overflow='hidden'>
        <Flex justify='space-between' align='center'>
          <HStack px='20px' py='14px' spacing='0' wrap='wrap' gap='0' align='center'>
            <Text fontSize='14px' color='#6B7280'>
              {t('custodian')}:{' '}
              <Text as='span' fontWeight='700' color='#232F50'>
                {item.custodian ? `${item.custodian.empName} (${item.custodian.username})` : '-'}
              </Text>
            </Text>
            <Box w='1px' h='20px' bg='#E5E7EB' mx='8px' />
            <Text fontWeight='700' color='#232F50' fontSize='16px'>
              {item?.type?.name}
            </Text>
            <Box w='1px' h='20px' bg='#E5E7EB' mx='8px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('category')}:{' '}
              <Text as='span' fontWeight='700' color='primary.500'>
                {item?.category?.name || '-'}
              </Text>
            </Text>
            <Box w='1px' h='20px' bg='#E5E7EB' mx='8px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('deviceModel')}:{' '}
              <Text as='span' fontWeight='700' color='primary.500'>
                {item?.model?.name}
              </Text>
            </Text>
            <Box w='1px' h='20px' bg='#E5E7EB' mx='8px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('deviceVendor')}:{' '}
              <Text as='span' fontWeight='700' color='primary.500'>
                {item?.vendor?.name}
              </Text>
            </Text>
            <Box w='1px' h='20px' bg='#E5E7EB' mx='8px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('assetType')}:{' '}
              <Text as='span' fontWeight='700' color='primary.500'>
                {item.assetType || '-'}
              </Text>
            </Text>
          </HStack>
          <HStack px='4' gap='2' align='center'>
            <Box px='10px' py='4px' borderRadius='4px' bg={config.bg} display='inline-flex'>
              <Text fontSize='12px' fontWeight='600' color={config.color}>
                {config.label}
              </Text>
            </Box>
            <TableActionMenu actionItems={actionItems} />
          </HStack>
        </Flex>

        <Box bg='#F9FAFB' px='20px' py='10px' mx='14px' mb='14px' borderRadius='8px'>
          <HStack spacing='0' wrap='wrap'>
            <Text fontSize='16px' color='#6B7280'>
              {t('gponSerialNumber')}:{' '}
              <Text as='span' fontWeight='600' color='#232F50'>
                {item.gponSerialNumber || '-'}
              </Text>
            </Text>
            <Box w='1px' h='14px' bg='#D1D5DB' mx='20px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('poNumber')}:{' '}
              <Text as='span' fontWeight='600' color='#232F50'>
                {item.poNo || '-'}
              </Text>
            </Text>
            <Box w='1px' h='14px' bg='#D1D5DB' mx='20px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('invoiceDate')}:{' '}
              <Text as='span' fontWeight='600' color='#232F50'>
                {formatDisplayDate(item.invoiceDate) || '-'}
              </Text>
            </Text>
            <Box w='1px' h='14px' bg='#D1D5DB' mx='20px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('deviceSlNo')}:{' '}
              <Text as='span' fontWeight='600' color='#232F50'>
                {item.deviceSlNo || '-'}
              </Text>
            </Text>
            <Box w='1px' h='14px' bg='#D1D5DB' mx='20px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('deviceMac')}:{' '}
              <Text as='span' fontWeight='600' color='#232F50'>
                {item.deviceMac || '-'}
              </Text>
            </Text>
            <Box w='1px' h='14px' bg='#D1D5DB' mx='20px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('warrantyStartDate')}:{' '}
              <Text as='span' fontWeight='600' color='#232F50'>
                {formatDisplayDate(item.warrantyStartDate) || '-'}
              </Text>
            </Text>
            <Box w='1px' h='14px' bg='#D1D5DB' mx='20px' />
            <Text fontSize='16px' color='#6B7280'>
              {t('warrantyEndDate')}:{' '}
              <Text as='span' fontWeight='600' color='#232F50'>
                {formatDisplayDate(item.warrantyEndDate) || '-'}
              </Text>
            </Text>
          </HStack>
        </Box>
      </Box>
    </Flex>
  );
};

export default StockDetailsCard;
