import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import NoteItem from './NoteItem';

const NotesList = ({ notes, onDocumentClick }) => {
  const { t } = useTranslation();

  if (!notes || notes.length === 0) {
    return (
      <Flex align='center' justify='center' h='100%' minH='80px'>
        <Text fontSize='14px' color='#9CA3AF'>
          {t('noRecordsFound')}
        </Text>
      </Flex>
    );
  }

  return notes.map((note, idx) => (
    <Box key={note.id || idx} borderBottom={idx < notes.length - 1 ? '1px solid #f0f0f0' : 'none'}>
      <NoteItem note={note} onDocumentClick={onDocumentClick} index={idx + 1} />
    </Box>
  ));
};

export default NotesList;
