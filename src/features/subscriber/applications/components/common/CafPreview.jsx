import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Icons,
  SimpleGrid,
  Text,
  VStack
} from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { getPrepopulatedData } from '../../selectors';
import { CONNECTION_TYPES } from './constants';

const { MdEdit } = Icons;

const DataField = ({ label, value }) => (
  <Flex align="center" w="full">
    <Text fontSize="14px" color="gray.500" fontWeight="medium" w="180px" flexShrink={0}>
      {label}
    </Text>
    <Text fontSize="14px" fontWeight="semibold" color="font_color.primary">
      {value || '-'}
    </Text>
  </Flex>
);

const Section = ({ title, children }) => (
  <VStack align="stretch" spacing={4} w="full">
    <Heading fontSize="16px" fontWeight="bold" color="font_color.primary" mb={2} borderBottom="1px solid" borderColor="gray.100" pb={2}>
      {title}
    </Heading>
    <SimpleGrid columns={2} spacingY={4} spacingX={12}>
      {children}
    </SimpleGrid>
  </VStack>
);

const CafPreview = ({ onEdit, connectionType = CONNECTION_TYPES.HOME_CONNECTION, onSubmit }) => {
  const { t } = useTranslation();
  const prepopulatedData = useSelector(getPrepopulatedData);

  const basicDetail = prepopulatedData?.basicDetail || {};
  const permanentAddress = prepopulatedData?.permanentAddress || {};
  const installationAddress = prepopulatedData?.installationAddress || {};
  const subscriberDetail = prepopulatedData?.subscriberDetail || {};
  const deviceDetail = prepopulatedData?.deviceDetail || {};

  return (
    <Box bg="white" borderRadius="20px" p={10} boxShadow="0px 10px 30px rgba(0, 0, 0, 0.08)" w="full" maxW="1000px" mx="auto">
      <Flex pb={6} mb={8} justifyContent="space-between" alignItems="center">
        <Heading fontSize="24px" fontWeight="bold" color="font_color.primary">
          {t('cafPreview')}
        </Heading>
        <Button
          variant="ghost"
          p={2}
          onClick={onEdit}
          _hover={{ bg: 'gray.100' }}
          borderRadius="full"
          bg="gray.50"
        >
          <Icon as={MdEdit} color="gray.600" boxSize={5} />
        </Button>
      </Flex>

      <VStack spacing={12} align="stretch">
        <Section title={t('basicDetails')}>
          <DataField label={t('applicationNo')} value={basicDetail.applicationFormNumber} />
          <DataField label={t('dateOfBirth')} value={basicDetail.dateOfBirth} />
          <DataField label={t('subscriptionType')} value={connectionType === CONNECTION_TYPES.HOME_CONNECTION ? t('homeConnection') : t('smeConnection')} />
          <DataField label={t('mobileNo')} value={basicDetail.mobileNumber} />
          <DataField label={t('applicantName')} value={basicDetail.applicantName} />
          <DataField label={t('emailAddress')} value={basicDetail.emailAddress} />
        </Section>

        <Section title={t('permanentAddressDetails')}>
          <DataField label={t('doorNoApartment')} value={permanentAddress.doorNo} />
          <DataField label={t('district')} value={permanentAddress.districtName} />
          <DataField label={t('streetLocalityName')} value={permanentAddress.streetName} />
          <DataField label={t('locationType')} value={permanentAddress.locationType} />
          <DataField label={t('city')} value={permanentAddress.city} />
          <DataField label={t('localBodyType')} value={permanentAddress.localBodyTypeName} />
          <DataField label={t('pincode')} value={permanentAddress.pincode} />
          <DataField label={t('corporationMunicipalityName')} value={permanentAddress.corporationMunicipalityName} />
          <DataField label={t('postOfficeName')} value={permanentAddress.postOfficeName} />
        </Section>

        <Section title={t('installationAddressDetails')}>
          <DataField label={t('doorNoApartment')} value={installationAddress.doorNo} />
          <DataField label={t('district')} value={installationAddress.districtName} />
          <DataField label={t('streetLocalityName')} value={installationAddress.streetName} />
          <DataField label={t('locationType')} value={installationAddress.locationType} />
          <DataField label={t('city')} value={installationAddress.city} />
          <DataField label={t('localBodyType')} value={installationAddress.localBodyTypeName} />
          <DataField label={t('pincode')} value={installationAddress.pincode} />
          <DataField label={t('corporationMunicipalityName')} value={installationAddress.corporationMunicipalityName} />
          <DataField label={t('postOfficeName')} value={installationAddress.postOfficeName} />
        </Section>

        <Section title={t('subscriptionDetails')}>
          <DataField label={t('planType')} value={subscriberDetail.planType} />
          <DataField label={t('distributor')} value={subscriberDetail.agnpName} />
          <DataField label={t('desiredUserName')} value={subscriberDetail.username} />
          <DataField label={t('selectedPackage')} value={subscriberDetail.packageName} />
        </Section>

        <Section title={t('deviceDetails')}>
          <DataField label={t('deviceProvider')} value={deviceDetail.deviceProviderName} />
          <DataField label={t('selectDevice')} value={deviceDetail.deviceName} />
          <DataField label={t('deviceType')} value={deviceDetail.deviceType} />
          <DataField label={t('vlanID')} value={deviceDetail.vlanId} />
          <DataField label={t('oltType')} value={deviceDetail.oltType} />
          <DataField label={t('oltDevice')} value={deviceDetail.oltdeviceDetail?.name} />
          <DataField label={t('ponPortNumber')} value={deviceDetail.ponportNumberName} />
          <DataField label={t('ontPosition')} value={deviceDetail.ontPosition} />
        </Section>
      </VStack>

      <Flex justifyContent="flex-end" gap={4} mt={16} pt={8}>
        <Button 
          variant="outline" 
          borderColor="gray.200" 
          color="font_color.primary" 
          borderRadius="full" 
          px={12} 
          height="48px"
          onClick={() => window.history.back()}
          _hover={{ bg: 'gray.50' }}
        >
          {t('close')}
        </Button>
        <Button 
          bg="primary.500" 
          color="white" 
          borderRadius="full" 
          px={12} 
          height="48px"
          _hover={{ bg: 'primary.600' }} 
          onClick={onSubmit}
        >
          {t('submit')}
        </Button>
      </Flex>
    </Box>
  );
};


export default CafPreview;
