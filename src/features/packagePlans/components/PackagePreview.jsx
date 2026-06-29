import { Box, Flex, SimpleGrid, Text } from '@kfonbss/bss-ui-components';

const PackagePreview = ({ details=[] }) => {
  return (
    <Box bg={'gray.100'} py={3} px={8} borderRadius='md'>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={4}>
        {details.map((item, index) => (
          <Flex key={index} gap={2} alignItems='center' minW={0}>
            <Text fontSize={'14px'} fontWeight={'400'} color={'gray.500'} whiteSpace='nowrap'>
              {item.label}
            </Text>
            <Text fontSize={'14px'} fontWeight={'600'} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>
              {item.value}
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PackagePreview;
