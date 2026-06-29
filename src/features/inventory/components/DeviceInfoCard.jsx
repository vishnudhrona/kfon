import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const DeviceInfoCard = (props) => {
  const { deviceType, deviceMake, deviceCategory } = props;
  const { t } = useTranslation();
  return (
    <Box bg='gray.50' p='4' borderRadius='md' w='full' mt='2'>
      <Flex justify='space-between' align='center' wrap='wrap' gap='4'>
        <Flex align='center'>
          <Text fontSize='sm' color='gray.500' mr='2'>
            {t('deviceType')}
          </Text>
          <Text fontWeight='semibold' fontSize='sm' color='gray.800'>
            {deviceType}
          </Text>
        </Flex>
        <Flex align='center'>
          <Text fontSize='sm' color='gray.500' mr='2'>
            {t('deviceMake')}
          </Text>
          <Text fontWeight='semibold' fontSize='sm' color='gray.800'>
            {deviceMake}
          </Text>
        </Flex>
        <Flex align='center'>
          <Text fontSize='sm' color='gray.500' mr='2'>
            {t('deviceCategory')}
          </Text>
          <Text fontWeight='semibold' fontSize='sm' color='gray.800'>
            {deviceCategory}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DeviceInfoCard;
