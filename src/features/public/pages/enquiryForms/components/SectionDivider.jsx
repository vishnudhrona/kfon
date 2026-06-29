import { Box, Flex } from '@kfonbss/bss-ui-components';

const SectionDivider = ({ title }) => (
  <Flex alignItems='center' gap='12px'>
    <Box fontSize='16px' fontWeight='600'>
      {title}
    </Box>
    <Box flex='1' h='1px' bg='#E6E6E6' />
  </Flex>
);

export default SectionDivider;
