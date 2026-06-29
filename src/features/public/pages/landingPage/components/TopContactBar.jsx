import { Flex, HStack, Link } from '@kfonbss/bss-ui-components';

import { FbIcon, InstagramSvg, MailIcon, PhoneRingIcon, TwitterSvg, YouTubeSvg } from '@/assets/svg';

const TopContactBar = () => {
  return (
    <HStack
      w='100%'
      justifyContent='space-between'
      bg='#F2F2F2'
      px={{ base: '16px', md: '40px', xl: '100px' }}
      py={{ base: '12px', md: '0' }}
      minH={{ base: 'auto', md: '56px' }}
      flexWrap={{ base: 'wrap', md: 'nowrap' }}
      gap={{ base: '12px', md: '0' }}
    >
      {/* LEFT CONTACT INFO */}
      <Flex gap={{ base: '12px', md: '16px' }} flexWrap={{ base: 'wrap', md: 'nowrap' }} alignItems='center'>
        <Link
          href='#'
          fontSize={{ base: '14px', md: '16px' }}
          fontWeight={500}
          lineHeight='1'
          display='flex'
          alignItems='center'
          gap='8px'
        >
          <PhoneRingIcon />
          Toll Free - 18005704466
        </Link>

        <Link
          href='#'
          fontSize={{ base: '14px', md: '16px' }}
          fontWeight={500}
          lineHeight='1'
          display='flex'
          alignItems='center'
          gap='8px'
        >
          <MailIcon />
          info@bss.in
        </Link>
      </Flex>

      {/* RIGHT SOCIAL ICONS */}
      <Flex gap='10px' alignItems='center'>
        <Link aria-label='Facebook'>
          <FbIcon />
        </Link>
        <Link aria-label='Twitter'>
          <TwitterSvg />
        </Link>
        <Link aria-label='Instagram'>
          <InstagramSvg />
        </Link>
        <Link aria-label='YouTube'>
          <YouTubeSvg />
        </Link>
      </Flex>
    </HStack>
  );
};

export default TopContactBar;
