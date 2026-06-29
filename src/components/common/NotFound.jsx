import { Box, Heading, Text, VStack } from '@kfonbss/bss-ui-components';

const NotFound = () => {
  return (
    <Box w='full' h='100vh' display='flex' alignItems='center' justifyContent='center'>
      <VStack spacing={4} mx='auto'>
        <Heading as='h1' size='2xl'>
          404
        </Heading>
        <Text fontSize='xl'>Page Not Found</Text>
        <Text color='gray.500'>The page you are looking for does not exist.</Text>
      </VStack>
    </Box>
  );
};

export default NotFound;
