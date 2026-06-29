import { Box, Flex, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { CustomCheckbox, HoverPopover } from '@/components/custom';
import TableActionMenu from '@/components/custom/TableActionMenu';

import { STOCK_STATUS_OPTIONS } from '../constants';
import TrackDevicePopup from './TrackDevicePopup';

const DeviceDetailCard = ({ item, isSelected, isCheckboxDisabled = false, handleSelect, actionItems, showCheckbox = true, onNotesClick, isActionsDisabled = false }) => {
  const { t } = useTranslation();
  return (
    <Flex align='flex-start' gap='17px' pb='10px'>
      {showCheckbox && (
        <CustomCheckbox mt='20px' checked={isSelected} onCheckedChange={() => handleSelect(item.detailsId)} disabled={isCheckboxDisabled} />
      )}
      <Box flex='1' bg='white' border='1px solid' borderColor='gray.200' borderRadius='12px' overflow='hidden'>
        <Flex justify='space-between' align='flex-start'>
          {(() => {
              const statusConfig = STOCK_STATUS_OPTIONS[item.status] || {
                label: item.status,
                color: '#2E7D32',
                bg: 'rgba(46, 125, 50, 0.1)'
              };
              const statusBadge = item.status === 'OEM' && item.oem ? (
                <HoverPopover
                  trigger={
                    <Box px='12px' py='3px' borderRadius='6px' border='1px solid' borderColor={statusConfig.color} bg={statusConfig.bg} cursor='pointer'>
                      <Text fontSize='16px' fontWeight='600' color={statusConfig.color}>{statusConfig.label}</Text>
                    </Box>
                  }
                  content={
                    <VStack align='stretch' spacing={0} divideY='1px solid #F0F0F0' p='4px'>
                      {item.oem.name && (
                        <Box py='5px' px='16px'>
                          <Text fontSize='14px' color='#232F50'>{t('oemName')} : <Text as='span' fontWeight='700' color='primary.500'>{item.oem.name}</Text></Text>
                        </Box>
                      )}
                      <Box py='5px' px='16px'>
                        <Text fontSize='14px' color='#232F50'>{t('contactNo')} : <Text as='span' fontWeight='700' color='primary.500'>{item.oem.contactNo ?? '-'}</Text></Text>
                      </Box>
                      <Box py='5px' px='16px'>
                        <Text fontSize='14px' color='#232F50'>{t('address')} : <Text as='span' fontWeight='700' color='primary.500'>{item.oem.address ?? '-'}</Text></Text>
                      </Box>
                    </VStack>
                  }
                />
              ) : (
                <Box px='12px' py='3px' borderRadius='6px' border='1px solid' borderColor={statusConfig.color} bg={statusConfig.bg}>
                  <Text fontSize='16px' fontWeight='600' color={statusConfig.color}>{statusConfig.label}</Text>
                </Box>
              );
              const topItems = [
                item.deviceType && <Text fontWeight='700' color='#232F50' fontSize='16px'>{item.deviceType}</Text>,
                item.make && <Text fontSize='16px' color='gray.500'>{t('deviceMake')}: <Text as='span' fontWeight='700' color='#232F50'>{item.make}</Text></Text>,
                item.category && <Text fontSize='16px' color='gray.500'>{t('category')}: <Text as='span' fontWeight='700' color='#232F50'>{item.category}</Text></Text>,
                item.modelNo && <Text fontSize='16px' color='gray.500'>{t('modelName')}: <Text as='span' fontWeight='700' color='#232F50'>{item.modelNo}</Text></Text>,
                item.oem?.name && <Text fontSize='16px' color='gray.500'>{t('vendor')}: <Text as='span' fontWeight='700' color='#232F50'>{item.oem.name}</Text></Text>,
                item.custodian && <Text fontSize='16px' color='gray.500'>{t('custodian')}: <Text as='span' fontWeight='700' color='primary.500'>{item.custodian}</Text></Text>,
                statusBadge,
                item.condition && <Text fontSize='16px' color='gray.500'>{t('condition')}: <Text as='span' fontWeight='700' color={item.condition === 'FAULTY' ? '#F00' : 'primary.500'}>{item.condition === 'FAULTY' ? t('faulty') : item.condition}</Text></Text>
              ].filter(Boolean);
              return (
                <Flex px='20px' py='14px' wrap='wrap' align='center' gap='8px'>
                  {topItems.map((node, i) => (
                    <Box key={i} display='flex' alignItems='center' borderRight={i < topItems.length - 1 ? '1px solid #E5E7EB' : 'none'} pr={i < topItems.length - 1 ? '8px' : '0'}>
                      {node}
                    </Box>
                  ))}
                </Flex>
              );
            })()}

          <HStack mr={4} spacing={1} flexShrink={0} alignSelf='flex-start' pt='10px'>
            <TrackDevicePopup deviceId={item.detailsId} />
            {onNotesClick && (
              <Box
                as='button'
                onClick={() => onNotesClick(item)}
                p={2}
                borderRadius='md'
                color='gray.500'
                cursor='pointer'
                _hover={{ color: 'primary.500', bg: 'gray.100' }}
                title={t('notes')}
              >
                <Icons.NotesIcon width='20px' height='20px' />
              </Box>
            )}
            {actionItems?.length > 0 && <TableActionMenu row={item} actionItems={actionItems} disabled={isActionsDisabled} />}
          </HStack>
        </Flex>

        <Box bg='gray.50' px='20px' py='10px' mx='14px' mb='14px' borderRadius='8px'>
          {(() => {
            const bottomItems = [
              <Text fontSize='14px' color='gray.500'>{t('serialNumber')}: <Text as='span' fontWeight='600' color='#232F50'>{item.serialNumber || '-'}</Text></Text>,
              <Text fontSize='14px' color='gray.500'>{t('gponSerialNumber')}: <Text as='span' fontWeight='600' color='#232F50'>{item.gponSerialNumber || '-'}</Text></Text>,
              item.distanceInKm && <Text fontSize='14px' color='gray.500'>{t('distanceInKm')}: <Text as='span' fontWeight='600' color='#232F50'>{item.distanceInKm}</Text></Text>,
              item.warrantyStartDate && <Text fontSize='14px' color='gray.500'>{t('warrantySDate')}: <Text as='span' fontWeight='600' color='#232F50'>{item.warrantyStartDate}</Text></Text>,
              item.warrantyEndDate && <Text fontSize='14px' color='gray.500'>{t('warrantyEDate')}: <Text as='span' fontWeight='600' color='#232F50'>{item.warrantyEndDate}</Text></Text>
            ].filter(Boolean);
            return (
              <Flex wrap='wrap' align='center' gap='8px'>
                {bottomItems.map((node, i) => (
                  <Box key={i} display='flex' alignItems='center' borderRight={i < bottomItems.length - 1 ? '1px solid #D1D5DB' : 'none'} pr={i < bottomItems.length - 1 ? '8px' : '0'}>
                    {node}
                  </Box>
                ))}
              </Flex>
            );
          })()}
        </Box>
      </Box>
    </Flex>
  );
};

export default DeviceDetailCard;
