import { Box, HStack, Icons, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ExpandableCard from '@/components/custom/ExpandableCard';
import TableActionMenu from '@/components/custom/TableActionMenu';

import { WORK_ORDER_STATUS_MAP } from '../constants';
import WorkOrderApprovalPopup from './WorkOrderApprovalPopup';

const Divider = () => <Box h='20px' w='1px' bg='gray.200' display={{ base: 'none', md: 'block' }} />;

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const label = WORK_ORDER_STATUS_MAP[(status || '').toUpperCase()] || status;
  return (
    <Box
      px={4}
      py='2px'
      borderRadius='full'
      bg='#F4F4F4'
      color='#FD1C7A'
      fontSize='sm'
      fontWeight='600'
      border='1px solid #D7D7D7'
      flexShrink={0}
      display='flex'
      alignItems='center'
      gap='6px'
    >
      <Box as='span' w='8px' h='8px' borderRadius='full' bg='#FD1C7A' flexShrink={0} />
      {label}
    </Box>
  );
};

const InfoItem = ({ label, value }) => (
  <HStack spacing={1}>
    <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
      {label} :
    </Text>
    <Text fontWeight='bold' fontSize='md' color='#232F50'>
      {value || '-'}
    </Text>
  </HStack>
);

const WorkOrderCard = memo(({ data, index }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const { UpArrowIcon, DownArrowIcon } = Icons;

  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);

  const actionItems = useMemo(
    () => [
      {
        label: t('reviewWorkOrder'),
        hidden: data.currentStatus !== 'SUBMITTED',
        onClick: () => setShowApprovalPopup(true)
      }
    ],
    [data.currentStatus, t]
  );

  return (
    <ExpandableCard
      index={index}
      isExpanded={isExpanded}
      onToggle={toggleExpand}
      toggleIcon={isExpanded ? <UpArrowIcon boxSize={5} /> : <DownArrowIcon boxSize={5} />}
      borderColor={{ collapsed: 'gray.200', expanded: 'gray.200' }}
      collapsedContent={
        <HStack w='full' spacing={2} align='center' flexWrap='wrap'>
          <HStack spacing={1} flexShrink={0}>
            <Text fontWeight='medium' fontSize='md' color='font_color.primary'>
              {t('id')} :
            </Text>
            <Text fontWeight='bold' fontSize='md' color='font_color.primary' whiteSpace='nowrap'>
              {data.wono}
            </Text>
          </HStack>
          <Divider />
          <HStack spacing={1} flexShrink={0}>
            <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
              {t('customers')} :
            </Text>
            <Text fontWeight='bold' fontSize='md' color='primary.500'>
              {data.connectedCustomers ?? 0}
            </Text>
            <Text fontSize='md' color='font_color.secondary'>
              /
            </Text>
            <Text fontWeight='bold' fontSize='md' color='#232F50'>
              {data.cusCount || data.noOfCustomers}
            </Text>
          </HStack>
          <Divider />
          <InfoItem label={t('validity')} value={`${data.validity || data.validityInMonths} ${t('months')}`} />
          <Divider />
          <InfoItem label={t('serviceStartDate')} value={data.serviceSdate || data.serviceStartDate} />
          <Divider />
          <HStack spacing={1} flexShrink={0}>
            <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
              {t('active')} :
            </Text>
            <Box
              px={2}
              py='1px'
              borderRadius='full'
              fontSize='xs'
              fontWeight='semibold'
              bg={data.isActive ? 'green.100' : 'red.100'}
              color={data.isActive ? 'green.700' : 'red.700'}
            >
              {t(data.isActive ? 'yes' : 'no')}
            </Box>
          </HStack>
          <Box flex={1} />
          <StatusBadge status={data.currentStatus || data.status} />
        </HStack>
      }
      expandedContent={
        <VStack align='stretch' spacing={3}>
          <HStack spacing={3} align='center' flexWrap='wrap'>
            <HStack spacing={1} flexShrink={0}>
              <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                {t('package')} :
              </Text>
              <Text fontWeight='bold' fontSize='md' color='primary.500'>
                {data.packageName || '-'}
              </Text>
            </HStack>
            <Divider />
            <InfoItem label={t('serviceEndDate')} value={data.serviceEdate || data.serviceEndDate} />
            {data.remarks && (
              <>
                <Divider />
                <HStack spacing={1}>
                  <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                    {t('remarks')} :
                  </Text>
                  <Text fontSize='md' color='#232F50'>
                    {data.remarks}
                  </Text>
                </HStack>
              </>
            )}
            {data.createdAt && (
              <>
                <Divider />
                <HStack spacing={1}>
                  <Text fontWeight='medium' fontSize='md' color='font_color.secondary'>
                    {t('createdDate')} :
                  </Text>
                  <Text fontWeight='bold' fontSize='md' color='black'>
                    {data.createdAt}
                  </Text>
                </HStack>
              </>
            )}
            <Box flex={1} />
            <TableActionMenu actionItems={actionItems} row={data} />
          </HStack>
        </VStack>
      }
    >
      {/* Portal sibling */}
      <Popup
        isOpen={showApprovalPopup}
        onClose={() => setShowApprovalPopup(false)}
        title={t('reviewWorkOrderTitle')}
        titleMain={t('workOrderStatus')}
        size='lg'
      >
        <WorkOrderApprovalPopup data={data} onClose={() => setShowApprovalPopup(false)} />
      </Popup>
    </ExpandableCard>
  );
});

export default WorkOrderCard;
