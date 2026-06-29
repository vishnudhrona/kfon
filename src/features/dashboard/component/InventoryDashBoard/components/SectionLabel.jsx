import { Box, HStack, Text } from '@kfonbss/bss-ui-components';

import { T } from './tokens';

const SectionLabel = ({ badge, title, meta, right }) => (
  <HStack gap='10px' mb='14px' mt='24px' flexWrap='wrap' align='center'>
    <Box
      w='22px'
      h='22px'
      borderRadius='50%'
      bg={T.maroon700}
      color={T.yellow}
      display='flex'
      alignItems='center'
      justifyContent='center'
      fontSize='xs'
      fontWeight='700'
      flexShrink={0}
    >
      {badge}
    </Box>
    <Text fontSize='xs' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={T.inkSoft} whiteSpace='nowrap'>
      {title}
    </Text>
    <Box flex='1' h='1px' bg={T.line} minW='20px' />
    {meta && (
      <Text fontSize='2xs' color={T.inkFaint} fontWeight='600'>
        {meta}
      </Text>
    )}
    {right}
  </HStack>
);

export default SectionLabel;
