import { Box, Button, ButtonGroup, Flex, Icons, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const { BsExclamationCircle } = Icons;

const PackageConfirmationPopup = ({ isOpen, onOpenChange, tempSelectedRow, onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Popup isOpen={isOpen} onOpenChange={onOpenChange}>
      <VStack spacing={4} align='center' py={6} px={4}>
        <Box
          p={4}
          borderRadius='full'
          borderWidth='2px'
          borderColor='yellow.400'
          color='yellow.400'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <BsExclamationCircle size={40} />
        </Box>
        <Text fontSize='2xl' fontWeight='bold' color='gray.700'>
          {t('confirmAddPackage')}
        </Text>

        {tempSelectedRow && (
          <VStack
            spacing={2}
            align='stretch'
            w='full'
            bg='gray.50'
            p={5}
            borderRadius='md'
            mt={2}
            mb={2}
            borderWidth={1}
            borderColor='gray.200'
          >
            <Text fontWeight='bold' fontSize='xl' color='primary.500' textAlign='center' mb={2}>
              {tempSelectedRow.packageName || tempSelectedRow.plan}
            </Text>
            <Flex justify='space-between'>
              <Text color='gray.600'>{t('price')}:</Text>{' '}
              <Text fontWeight='semibold'>₹{tempSelectedRow.renewalFee || tempSelectedRow.price || '0'}</Text>
            </Flex>
            <Flex justify='space-between'>
              <Text color='gray.600'>{t('speed')}:</Text>{' '}
              <Text fontWeight='semibold'>
                {tempSelectedRow.speedInKbps
                  ? `${tempSelectedRow.speedInKbps / 1024} Mbps`
                  : tempSelectedRow.speedProfile || 'N/A'}
              </Text>
            </Flex>
            <Flex justify='space-between'>
              <Text color='gray.600'>{t('planVolume')}:</Text>{' '}
              <Text fontWeight='semibold'>
                {tempSelectedRow.allocatedVolume ? `${tempSelectedRow.allocatedVolume} GB` : 'N/A'}
              </Text>
            </Flex>
            <Flex justify='space-between'>
              <Text color='gray.600'>{t('fallbackSpeed')}:</Text>{' '}
              <Text fontWeight='semibold'>{tempSelectedRow.fallbackSpeed || 'N/A'}</Text>
            </Flex>
            <Flex justify='space-between'>
              <Text color='gray.600'>{t('validity')}:</Text>{' '}
              <Text fontWeight='semibold'>
                {tempSelectedRow.renewPeriod || tempSelectedRow.validity || 'N/A'} {t('days')}
              </Text>
            </Flex>
          </VStack>
        )}

        <Text color='gray.500' textAlign='center'>
          {t('addPackageConfirmationMessage')}
        </Text>
        <ButtonGroup spacing={4} mt={4}>
          <Button variant='outline' colorScheme='gray' onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button colorScheme='red' bg='primary.500' _hover={{ bg: 'primary.600' }} onClick={onConfirm}>
            {t('yesAddPackage')}
          </Button>
        </ButtonGroup>
      </VStack>
    </Popup>
  );
};

export default PackageConfirmationPopup;
