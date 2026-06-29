import { Box, Flex, Text } from '@kfonbss/bss-ui-components';

export const SegmentedProgress = ({ items, title = 'Balance Distribution' }) => {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Flex align='center' gap='20px' w='100%'>
      <Text
        minW='170px'
        fontSize='12px'
        fontWeight='700'
        color='#8d0247'
        textTransform='uppercase'
        letterSpacing='0.5px'
      >
        {title}
      </Text>

      <Box flex='1'>
        <Box h='10px' w='100%' borderRadius='full' overflow='hidden' display='flex' bg='gray.100'>
          {items.map((item) => (
            <Box key={item.label} bg={item.color} width={`${(item.count / total) * 100}%`} />
          ))}
        </Box>
      </Box>

      <Flex gap='16px' wrap='nowrap'>
        {items.map((item) => (
          <Flex key={item.label} align='center' gap='6px' whiteSpace='nowrap'>
            <Box w='8px' h='8px' borderRadius='full' bg={item.color} />

            <Text fontSize='12px' color='gray.600'>
              {item.label} ({item.count})
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default SegmentedProgress;
