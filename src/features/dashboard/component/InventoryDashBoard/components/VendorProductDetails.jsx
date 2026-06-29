import { Box, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import SectionLabel from './SectionLabel';
import { SHADOWS, T } from './tokens';

const VendorCard = ({ vendor }) => {
  const { t } = useTranslation();
  return (
    <Box
      bg={T.card}
      border={`1px solid ${T.line}`}
      borderRadius='14px'
      p='16px 18px'
      position='relative'
      overflow='hidden'
      transition='all 0.25s'
      display='flex'
      flexDir='column'
      gap='14px'
      cursor='pointer'
      _hover={{ transform: 'translateY(-2px)', boxShadow: SHADOWS.hover }}
    >
      <Box position='absolute' top='0' left='0' right='0' h='3px' bg={vendor.color} />
      <HStack justify='space-between' align='flex-start' gap='10px'>
        <HStack gap='10px'>
          <Box
            w='38px'
            h='38px'
            borderRadius='10px'
            bg={vendor.color}
            color='white'
            display='flex'
            alignItems='center'
            justifyContent='center'
            boxShadow='0 4px 10px rgba(0,0,0,0.1)'
            flexShrink={0}
          >
            <Icons.DeviceList w='18px' h='18px' />
          </Box>
          <Box pt='3px'>
            <Text fontSize='sm' fontWeight='800' color={T.ink} letterSpacing='0.2px' lineHeight='1.1'>
              {vendor.name}
            </Text>
            <Text fontSize='2xs' color={T.inkSoft} fontWeight='500' mt='3px'>
              {vendor.sub}
            </Text>
          </Box>
        </HStack>
        <Box
          px='10px'
          py='4px'
          borderRadius='100px'
          border={`1px solid ${T.yellowWarm}`}
          bg={T.yellowBg}
          color={T.maroon800}
          fontSize='14px'
          fontWeight='400'
          letterSpacing='-0.3px'
        >
          {vendor.pct}
        </Box>
      </HStack>

      <Box bg={T.paper} border={`1px solid ${T.line}`} borderRadius='10px' p='12px 14px'>
        <HStack justify='space-between' align='center' mb='6px'>
          <Text fontSize='2xs' fontWeight='800' letterSpacing='0.6px' textTransform='uppercase' color={T.inkSoft}>
            {t('totalUnits')}
          </Text>
        </HStack>
        <Text
          fontSize='2xl'
          fontWeight='400'
          color={T.maroon800}
          letterSpacing='-0.6px'
          lineHeight='1'
        >
          {vendor.total.toLocaleString()}
          <Text as='span' fontSize='xs' color={T.maroon700} ml='4px' opacity={0.7} fontWeight='600'>
            {' '}
            units
          </Text>
        </Text>
      </Box>

      <Box h='8px' borderRadius='100px' bg={T.lineSoft} overflow='hidden' display='flex'>
        {vendor.splits.map((s) => (
          <Box key={s.label} h='100%' w={`${Math.round((s.val / vendor.total) * 100)}%`} bg={s.color} />
        ))}
      </Box>

      <VStack gap='6px' pt='12px' borderTop={`1px dashed ${T.line}`} mt='auto'>
        {vendor.splits.map((s) => (
          <HStack key={s.label} justify='space-between' fontSize='xs'>
            <HStack gap='6px' color={T.inkSoft} fontWeight='600' letterSpacing='0.2px'>
              <Box w='7px' h='7px' borderRadius='2px' bg={s.color} flexShrink={0} />
              <Text>{s.label}</Text>
            </HStack>
            <Text
              fontSize='14px'
              color={T.ink}
              fontWeight='400'
              letterSpacing='-0.2px'
            >
              {s.val.toLocaleString()}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

const VendorProductDetails = ({ vendorStock }) => {
  const { t } = useTranslation();
  return (
    <>
      <SectionLabel
        badge='C'
        title={t('vendorProductDetails')}
        meta={`${(vendorStock ?? []).length} ${t('activeVendorsMeta')}`}
      />
      <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='14px'>
        {(vendorStock ?? []).map((v) => (
          <VendorCard key={v.name} vendor={v} />
        ))}
      </Box>
    </>
  );
};

export default VendorProductDetails;
