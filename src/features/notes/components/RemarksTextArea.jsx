import { Box, Icons } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

/**
 * Custom textarea for notes/remarks.
 * - White bg, rounded corners, subtle primary shadow
 * - Attachment icon in bottom-right (optional, hidden by default)
 * - No submit (+) icon
 */
const RemarksTextArea = ({ value, onChange, onAttach, placeholder, error, minH = '100px', rows, name, onBlur }) => {
  const { t } = useTranslation();

  return (
    <Box position='relative' width='100%'>
      <Box
        as='textarea'
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder ?? t('enterRemarks')}
        rows={rows}
        width='100%'
        minH={minH}
        bg='white'
        p='0'
        pb={onAttach ? '40px' : '12px'}
        fontSize='14px'
        resize='none'
        outline='none'
        display='block'
        _placeholder={{ color: 'font_color.placeholder' }}
      />
      {onAttach && (
        <Box
          as='button'
          type='button'
          position='absolute'
          bottom='8px'
          right='8px'
          onClick={onAttach}
          borderRadius='full'
          p='2'
          color='gray.400'
          bg='primary.50'
          transition='color 0.2s, background 0.2s'
          _hover={{ color: 'primary.500', bg: 'primary.100' }}
          display='flex'
          alignItems='center'
          justifyContent='center'
          zIndex={1}
          cursor={'pointer'}
        >
          <Icons.AttachmentIcon boxSize='6' />
        </Box>
      )}
      {error && (
        <Box color='red.500' fontSize='12px' mt='4px'>
          {error}
        </Box>
      )}
    </Box>
  );
};

export default RemarksTextArea;
