import { Box } from '@kfonbss/bss-ui-components';

import SplashLoader from './SplashLoader';

export default function CustomLoaderProvider({ isLoading, children, ...props }) {
  return (
    <Box position='relative' minH={isLoading ? '300px' : undefined} {...props}>
      {isLoading ? (
        <Box
          position='absolute'
          inset={0}
          display='flex'
          alignItems='center'
          justifyContent='center'
          bg='white'
          zIndex={10}
          borderRadius='inherit'
        >
          <SplashLoader inline />
        </Box>
      ) : (
        children
      )}
    </Box>
  );
}
