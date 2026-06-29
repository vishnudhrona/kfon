import { Box, Flex, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const GlobeIcon = () => (
  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path
      d='M11.8791 3.70506C12.3863 4.60372 12.652 5.61847 12.6504 6.65039C12.6504 7.16906 12.5844 7.67239 12.4611 8.15239C12.1277 9.43993 11.3761 10.5803 10.3244 11.3944C9.2727 12.2085 7.98039 12.6503 6.65039 12.6504M1.42173 3.70506C0.930393 4.57506 0.650393 5.58039 0.650393 6.65039C0.649942 7.15704 0.713558 7.66171 0.839726 8.15239C1.17311 9.43993 1.92466 10.5803 2.97637 11.3944C4.02809 12.2085 5.32039 12.6503 6.65039 12.6504M6.65039 12.6504C8.30706 12.6504 9.65039 9.96372 9.65039 6.65039C9.65039 3.33706 8.30706 0.650391 6.65039 0.650391M6.65039 12.6504C4.99373 12.6504 3.65039 9.96372 3.65039 6.65039C3.65039 3.33706 4.99373 0.650391 6.65039 0.650391M12.4611 8.15239C10.6832 9.13798 8.68319 9.65358 6.65039 9.65039C4.54239 9.65039 2.56173 9.10706 0.839726 8.15239M6.65039 0.650391C7.71455 0.649947 8.75967 0.932629 9.67852 1.46943C10.5974 2.00624 11.3569 2.77784 11.8791 3.70506M6.65039 0.650391C5.58623 0.649947 4.54111 0.932629 3.62226 1.46943C2.70342 2.00624 1.94393 2.77784 1.42173 3.70506M11.8791 3.70506C10.4275 4.96234 8.57075 5.65315 6.65039 5.65039C4.65173 5.65039 2.82373 4.91706 1.42173 3.70506'
      stroke='#8D0247'
      strokeWidth='1.3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const CheckIcon = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
    <path d='M2 6L5 9L10 3' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const PackageCard = ({ row, isSelected, onClick }) => {
  const { t } = useTranslation();

  return (
    <Box
      as='button'
      type='button'
      onClick={onClick}
      cursor='pointer'
      position='relative'
      borderWidth='1px'
      borderStyle='solid'
      borderColor={isSelected ? '#8D0247' : 'gray.200'}
      bg={isSelected ? '#FFFAFA' : 'white'}
      borderRadius='12px'
      p={4}
      w='full'
      textAlign='left'
      _hover={{ borderColor: isSelected ? '#8D0247' : '#FDE68A' }}
      transition='all 0.2s'
    >
      {isSelected && (
        <Box
          position='absolute'
          top='-10px'
          right='-10px'
          w='23px'
          h='23px'
          borderRadius='full'
          bg='#8D0247'
          display='flex'
          alignItems='center'
          justifyContent='center'
          zIndex={1}
        >
          <CheckIcon />
        </Box>
      )}

      <Flex justify='space-between' align='center' mb={3}>
        <Flex align='center' gap={2}>
          <Flex
            w='30px'
            h='30px'
            borderRadius='full'
            bg='gray.100'
            align='center'
            justify='center'
            flexShrink={0}
          >
            <GlobeIcon />
          </Flex>
          <Text fontWeight='semibold' fontSize='md' color='#0F1121'>
            {row.packageName || row.plan}
          </Text>
        </Flex>

        <Box
          bg={isSelected ? '#FFE5D3' : 'white'}
          borderRadius='8px'
          px={3}
          py={1}
          h='30px'
          display='flex'
          alignItems='center'
          transition='background 0.2s'
        >
          <Text fontWeight='semibold' fontSize='md' color='#0F1121' whiteSpace='nowrap'>
            ₹ {row.renewalFee || row.price || '0'}
          </Text>
        </Box>
      </Flex>

      <Box
        bg='#FEF9E7'
        border='1px solid #FDE68A'
        borderRadius='12px'
        px={4}
        py={3}
        display='grid'
        gridTemplateColumns='repeat(4, 1fr)'
        gap={2}
      >
        <VStack align='flex-start' spacing={0}>
          <Text fontSize='10px' color='#717171'>
            {t('speed')}
          </Text>
          <Text fontSize='sm' fontWeight='bold' color='#0F1121'>
            {row.speedInKbps ? `${row.speedInKbps / 1024} Mbps` : row.speedProfile || 'N/A'}
          </Text>
        </VStack>

        <VStack align='flex-start' spacing={0}>
          <Text fontSize='10px' color='#717171'>
            {t('planVolume')}
          </Text>
          <Text fontSize='sm' fontWeight='bold' color='#0F1121'>
            {row.allocatedVolume ? `${row.allocatedVolume} GB` : 'N/A'}
          </Text>
        </VStack>

        <VStack align='flex-start' spacing={0}>
          <Text fontSize='10px' color='#717171' whiteSpace='nowrap'>
            {t('fallbackSpeed')}
          </Text>
          <Text fontSize='sm' fontWeight='bold' color='#0F1121'>
            {row.fbSpeedInKbps ? `${row.fbSpeedInKbps / 1024} Mbps` : 'N/A'}
          </Text>
        </VStack>

        <VStack align='flex-start' spacing={0}>
          <Text fontSize='10px' color='#717171'>
            {t('validity')}
          </Text>
          <Text fontSize='sm' fontWeight='bold' color='#0F1121'>
            {row.renewPeriod || row.validity || 'N/A'} {t('days')}
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default PackageCard;
