import { Box, Button, Flex, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { formatNoteDate, getAvatarColor, getInitials } from './notesUtils';

const NoteItem = ({ note, onDocumentClick, index }) => {
  const { t } = useTranslation();
  const createdByName = note.createdEmployeeName || note.createdUserName || '';
  const avatarColor = getAvatarColor(createdByName);
  const initials = getInitials(createdByName);

  return (
    <Box px='12px' py='8px'>
      <Flex justify='space-between' align='center' mb='6px'>
        <HStack spacing='13px' align='center'>
          {index !== undefined && (
            <Flex w='22px' h='22px' borderRadius='full' bg='primary.500' align='center' justify='center' flexShrink={0}>
              <Text fontWeight='700' fontSize='11px' color='white' lineHeight='normal'>
                {index}
              </Text>
            </Flex>
          )}
          <Flex
            w='41px'
            h='41px'
            borderRadius='full'
            bg={avatarColor.bg}
            align='center'
            justify='center'
            flexShrink={0}
          >
            <Text fontWeight='600' fontSize='16px' color={avatarColor.color} lineHeight='normal'>
              {initials}
            </Text>
          </Flex>
          <VStack spacing='0' align='start'>
            <Text fontWeight='600' fontSize='15px' color='#353535' lineHeight='normal'>
              {createdByName || '-'}
            </Text>
            {note.createdDesignation && (
              <Text fontSize='12px' fontWeight='500' color='#838383' lineHeight='normal'>
                {note.createdDesignation}
              </Text>
            )}
            {
              <Text fontSize='12px' fontWeight='500' color='#838383' lineHeight='normal'>
                {note.employeeDesignation}
              </Text>
            }
          </VStack>
        </HStack>
        <Text fontSize='12px' fontWeight='600' color='#838383' whiteSpace='nowrap'>
          {formatNoteDate(note.createdDate)}
        </Text>
      </Flex>

      <Box pl='89px'>
        <Text fontSize='14px' fontWeight='500' color='#0F1121' lineHeight='1.3' mb={note.fileId ? '8px' : '0'}>
          {note.notes || note.note || '-'}
        </Text>

        {note.fileId && (
          <Flex justifyContent='flex-end'>
            <Button
              variant='outline'
              size='sm'
              borderColor='primary.500'
              color='primary.500'
              borderRadius='8px'
              px='12px'
              h='29px'
              fontSize='13px'
              fontWeight='500'
              onClick={() => onDocumentClick(note.fileId)}
              bg='transparent'
            >
              <Icons.AttachmentIcon boxSize='6' />
              {t('document')}
            </Button>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default NoteItem;
