import { Box, Flex, HStack, Popover, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { resolveNotesHeaderContent } from '@/features/notes/components/notesHeaderContent';
import NotesModal from '@/features/notes/components/NotesModal';

import { fetchNotifications } from '../actions';
import { getNotificationsList, getNotificationsLoading } from '../selectors';

const getInitials = (name) => {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const getTitle = (item) => {
  if (item.moduleName && item.subModule) return `${item.moduleName} / ${item.subModule}`;
  return item.moduleName || item.subModule || '—';
};

const UserAvatar = ({ initials }) => (
  <Flex
    w='40px'
    h='40px'
    borderRadius='full'
    bg='#D4A96A'
    color='white'
    align='center'
    justify='center'
    flexShrink={0}
    fontSize='13px'
    fontWeight='600'
  >
    {initials}
  </Flex>
);

const NotificationsPopup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notificationsList = useSelector(getNotificationsList);
  const loading = useSelector(getNotificationsLoading);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleItemClick = (item, closePopover) => {
    closePopover();
    setSelectedItem(item);
  };

  const handleNotesModalClose = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <Popover.Context>
        {({ setOpen }) => (
          <Box>
            {/* Header */}
            <Flex px={5} py={4} align='center' borderBottom='1px solid' borderColor='gray.100'>
              <Text fontSize='xl' fontWeight='semibold'>
                {t('allNotes')}{' '}
                <Box as='span' color='primary.500'>
                  {t('notes')}
                </Box>
              </Text>
            </Flex>

            {/* List */}
            <Box px={4} py={3} maxH='420px' overflowY='auto'>
              {loading ? (
                <Flex align='center' justify='center' h='80px'>
                  <Spinner size='md' color='primary.500' />
                </Flex>
              ) : notificationsList.length === 0 ? (
                <Flex align='center' justify='center' h='80px'>
                  <Text fontSize='14px' color='gray.400'>
                    {t('noNotifications')}
                  </Text>
                </Flex>
              ) : (
                <VStack align='stretch' gap={0}>
                  {notificationsList.map((item, idx) => (
                    <Box
                      key={item.id || idx}
                      position='relative'
                      border='1px solid'
                      borderColor='gray.100'
                      borderRadius='12px'
                      p={4}
                      mb={3}
                      bg='white'
                      cursor='pointer'
                      _hover={{ borderColor: 'primary.200', bg: 'gray.50' }}
                      onClick={() => handleItemClick(item, () => setOpen(false))}
                    >
                      {!item.viewed && (
                        <Box
                          position='absolute'
                          top='8px'
                          right='8px'
                          w='8px'
                          h='8px'
                          borderRadius='full'
                          bg='primary.500'
                        />
                      )}
                      <HStack align='flex-start' gap={3} mb={2}>
                        <UserAvatar initials={getInitials(item.createdEmployeeName)} />
                        <Box flex={1}>
                          <Text fontWeight='700' fontSize='14px' color='gray.800'>
                            {item.createdEmployeeName || '—'}
                          </Text>
                          <Text fontSize='12px' color='gray.500'>
                            {item.createdDesignation || ''}
                          </Text>
                        </Box>
                        <Text fontSize='12px' color='gray.400' whiteSpace='nowrap'>
                          {item.createdDate ? dayjs(item.createdDate).format('DD-MM-YYYY hh:mm:ss A') : ''}
                        </Text>
                      </HStack>

                      <Text fontWeight='700' fontSize='13px' color='gray.800' mb={1}>
                        {getTitle(item)}
                      </Text>
                      <Text fontSize='13px' color='gray.600' lineHeight='1.5'>
                        {item.notes}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </Box>
        )}
      </Popover.Context>

      {selectedItem && (
        <NotesModal
          isOpen={!!selectedItem}
          onClose={handleNotesModalClose}
          moduleId={selectedItem.moduleId}
          moduleName={selectedItem.moduleName}
          subModule={selectedItem.subModule}
          title='sendNotes'
          headerContent={resolveNotesHeaderContent({
            moduleName: selectedItem.moduleName,
            subModule: selectedItem.subModule,
            moduleId: selectedItem.moduleId
          })}
        />
      )}
    </>
  );
};

export default NotificationsPopup;
