import { Box, Flex, Icons, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchForwardedNotes, markNoteViewed } from '../actions';
import { getForwardedNotes, getUnreadForwardedCount } from '../selectors';
import { resolveNotesHeaderContent } from './notesHeaderContent';
import NotesModal from './NotesModal';

/**
 * NotificationBell — shows a bell icon with unread forwarded-note count badge.
 * On click opens a dropdown listing forwarded notes; clicking a note opens NotesModal
 * for the user to reply or re-forward.
 *
 * Props:
 *  - userId: string (uuid) — the logged-in user's ID to poll forwarded notes for
 *  - pollIntervalMs: number — how often to refresh (default: 30000ms)
 */
const NotificationBell = ({ userId, pollIntervalMs = 30000 }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const forwardedNotes = useSelector(getForwardedNotes);
  const unreadCount = useSelector(getUnreadForwardedCount);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchForwardedNotes({ userId }));
    const interval = setInterval(() => {
      dispatch(fetchForwardedNotes({ userId }));
    }, pollIntervalMs);
    return () => clearInterval(interval);
  }, [userId, pollIntervalMs, dispatch]);

  const handleNoteClick = (note) => {
    if (!note.viewed) {
      dispatch(markNoteViewed({ noteId: note.id }));
    }
    setSelectedNote(note);
    setDropdownOpen(false);
  };

  const handleNotesModalClose = () => {
    setSelectedNote(null);
    if (userId) dispatch(fetchForwardedNotes({ userId }));
  };

  return (
    <>
      <Popup
        isOpen={dropdownOpen}
        onOpenChange={(e) => setDropdownOpen(e.open)}
        trigger={
          <Box position='relative' cursor='pointer' display='inline-flex' alignItems='center'>
            <Icons.BsBell size={22} />
            {unreadCount > 0 && (
              <Flex
                position='absolute'
                top='-6px'
                right='-6px'
                w='18px'
                h='18px'
                borderRadius='full'
                bg='primary.500'
                align='center'
                justify='center'
              >
                <Text fontSize='10px' fontWeight='700' color='white' lineHeight='normal'>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </Flex>
            )}
          </Box>
        }
        title={t('notifications')}
        width='360px'
        borderRadius='12px'
      >
        <Box maxH='420px' overflowY='auto'>
          {forwardedNotes.length === 0 ? (
            <Flex align='center' justify='center' h='80px'>
              <Text fontSize='14px' color='#9CA3AF'>
                {t('noNotifications')}
              </Text>
            </Flex>
          ) : (
            <VStack align='stretch' spacing={0}>
              {forwardedNotes.map((note, idx) => (
                <Box
                  key={note.id || idx}
                  px={4}
                  py={3}
                  borderBottom={idx < forwardedNotes.length - 1 ? '1px solid #f0f0f0' : 'none'}
                  bg={note.viewed ? 'white' : 'rgba(141,2,71,0.04)'}
                  cursor='pointer'
                  _hover={{ bg: 'rgba(141,2,71,0.08)' }}
                  onClick={() => handleNoteClick(note)}
                >
                  <Flex justify='space-between' align='flex-start' gap={2}>
                    <Box flex={1}>
                      <Text fontWeight={note.viewed ? '500' : '700'} fontSize='13px' color='#353535' noOfLines={1}>
                        {note.moduleName} — {note.subModule}
                      </Text>
                      <Text fontSize='12px' color='#6B7280' noOfLines={2} mt='2px'>
                        {note.notes || note.note || '-'}
                      </Text>
                    </Box>
                    {!note.viewed && (
                      <Box w='8px' h='8px' borderRadius='full' bg='primary.500' flexShrink={0} mt='4px' />
                    )}
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Popup>

      {selectedNote && (
        <NotesModal
          isOpen={!!selectedNote}
          onClose={handleNotesModalClose}
          moduleId={selectedNote.moduleId}
          moduleName={selectedNote.moduleName}
          subModule={selectedNote.subModule}
          title='sendNotes'
          headerContent={resolveNotesHeaderContent({
            moduleName: selectedNote.moduleName,
            subModule: selectedNote.subModule,
            moduleId: selectedNote.moduleId
          })}
        />
      )}
    </>
  );
};

export default NotificationBell;
