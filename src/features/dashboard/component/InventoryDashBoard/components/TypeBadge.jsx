import { Box, HStack, Text } from '@kfonbss/bss-ui-components';

import { T, TYPE_COLORS } from './tokens';

const TypeBadge = ({ type }) => {
  const color = TYPE_COLORS[type] ?? T.slate;
  return (
    <HStack gap='5px' align='center'>
      <Box w='8px' h='8px' borderRadius='2px' bg={color} flexShrink={0} />
      <Text fontSize='xs' fontWeight='700' color={T.ink}>
        {type}
      </Text>
    </HStack>
  );
};

export default TypeBadge;
