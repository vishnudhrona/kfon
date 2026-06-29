import { Box } from '@kfonbss/bss-ui-components';

import KfonLoaderLogo from '@/assets/KfonLoaderLogo';

const styles = `
  @keyframes kfon-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes kfon-spin-reverse {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  @keyframes kfon-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.92); }
  }
  .kfon-ring-outer {
    animation: kfon-spin 1.2s linear infinite;
  }
  .kfon-ring-inner {
    animation: kfon-spin-reverse 1.8s linear infinite;
  }
  .kfon-logo {
    animation: kfon-pulse 2s ease-in-out infinite;
  }
`;

export default function SplashLoader({ inline = false }) {
  return (
    <>
      <style>{styles}</style>
      <Box
        position={inline ? 'relative' : 'absolute'}
        inset={inline ? undefined : 0}
        display='flex'
        alignItems='center'
        justifyContent='center'
        bg={inline ? 'transparent' : 'rgba(255,255,255,0.85)'}
        zIndex={inline ? undefined : 9999}
        w={inline ? '120px' : undefined}
        h={inline ? '120px' : undefined}
      >
        <Box position='relative' w='120px' h='120px'>
          <Box
            className='kfon-ring-outer'
            position='absolute'
            inset={0}
            borderRadius='50%'
            border='3px solid transparent'
            borderTopColor='#c9a84c'
            borderRightColor='#c9a84c'
          />
          <Box
            className='kfon-ring-inner'
            position='absolute'
            inset='10px'
            borderRadius='50%'
            border='2px solid transparent'
            borderBottomColor='#8a6a2a'
          />
          <Box
            className='kfon-logo'
            position='absolute'
            inset='18px'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <KfonLoaderLogo />
          </Box>
        </Box>
      </Box>
    </>
  );
}
