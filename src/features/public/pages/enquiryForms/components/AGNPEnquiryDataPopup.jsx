import { Box, Button, Flex, HStack, IconButton, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { CrossCircleIcon } from '@/components/custom';

const AGNPEnquiryDataPopup = ({ isOpen, setIsOpen, mobileEnquiryData, emailEnquiryData }) => {
    const { t } = useTranslation();

    const isSameEnquiry =
        mobileEnquiryData &&
        emailEnquiryData &&
        mobileEnquiryData.trackingId === emailEnquiryData.trackingId;

    const DataRow = ({ label, value }) => (
        <Flex justifyContent='space-between' alignItems='start' py={2} borderBottom='1px solid #E6E6E6'>
            <Text fontSize='14px' fontWeight={600} color='#545454' flex='0 0 40%'>
                {label}
            </Text>
            <Text fontSize='14px' color='#272727' flex='1' textAlign='right' wordBreak='break-word'>
                {value || '-'}
            </Text>
        </Flex>
    );

    const EnquirySection = ({ data, messageKey }) => (
        <>
            <DataRow label={t('agnpName')} value={data?.agnpName} />
            <DataRow label={t('agnpContactName')} value={data?.agnpContactName} />
            <DataRow label={t('agnpMobileNumber')} value={data?.agnpMobileNumber} />
            <DataRow label={t('alternateContactNumber')} value={data?.agnpAltrContactNumber} />
            <DataRow label={t('email')} value={data?.agnpEmail} />
            <Text fontSize='18px' fontWeight={600} color='#272727' mt={6} mb={3}>
                {t('enquiryInformation')}
            </Text>
            <DataRow label={t('trackingId')} value={data?.trackingId} />
            <Box mt={4} p={3} bg='primary.50' borderRadius='8px' borderLeft='4px solid' borderLeftColor='primary.500'>
                <Text fontSize='16px' color='primary.700' fontWeight={500}>
                    {t(messageKey)}
                </Text>
            </Box>
        </>
    );

    const displayData = mobileEnquiryData || emailEnquiryData;

    if (!isOpen || !displayData) return null;

    return (
        <Popup isOpen={isOpen} size='xl' placement='center' onOpenChange={setIsOpen}>
            <HStack p='20px 30px' justifyContent='space-between' borderBottom='1px solid #E6E6E6'>
                <Box>
                    <Text fontSize='24px' lineHeight='24px' mb='8px' p={0} color='#151515' fontWeight={600}>
                        {t('enquiryDetails')}
                    </Text>
                </Box>
                <IconButton variant='unstyled' w='fit-content' h='fit-content' onClick={() => setIsOpen(false)}>
                    <CrossCircleIcon width='24px' size='lg' />
                </IconButton>
            </HStack>

            <VStack p='20px 30px' gap={0} maxH='60vh' overflowY='auto' alignItems='stretch'>
                <Text fontSize='18px' fontWeight={600} color='#272727' mb={3}>
                    {t('partnerInformation')}
                </Text>

                {isSameEnquiry ? (
                    <>
                        <DataRow label={t('agnpName')} value={displayData?.agnpName} />
                        <DataRow label={t('agnpContactName')} value={displayData?.agnpContactName} />
                        <DataRow label={t('agnpMobileNumber')} value={displayData?.agnpMobileNumber} />
                        <DataRow label={t('alternateContactNumber')} value={displayData?.agnpAltrContactNumber} />
                        <DataRow label={t('email')} value={displayData?.agnpEmail} />
                        <Text fontSize='18px' fontWeight={600} color='#272727' mt={6} mb={3}>
                            {t('enquiryInformation')}
                        </Text>
                        <DataRow label={t('trackingId')} value={displayData?.trackingId} />
                        <Box mt={4} p={3} bg='primary.50' borderRadius='8px' borderLeft='4px solid' borderLeftColor='primary.500'>
                            <Text fontSize='16px' color='primary.700' fontWeight={500}>
                                {t('partnerEnquiryAlreadyExistsBothMobileAndEmail')}
                            </Text>
                        </Box>
                    </>
                ) : (
                    <>
                        {mobileEnquiryData && (
                            <EnquirySection data={mobileEnquiryData} messageKey='partnerEnquiryAlreadyExists' />
                        )}
                        {emailEnquiryData && (
                            <>
                                {mobileEnquiryData && <Box my={4} borderTop='2px solid #E6E6E6' />}
                                <EnquirySection data={emailEnquiryData} messageKey='partnerEnquiryAlreadyExistsWithEmail' />
                            </>
                        )}
                    </>
                )}
            </VStack>

            <Flex p='20px 30px' justifyContent='flex-end' borderTop='1px solid #E6E6E6'>
                <Button variant='outline' onClick={() => setIsOpen(false)}>
                    {t('close')}
                </Button>
            </Flex>
        </Popup>
    );
};

export default AGNPEnquiryDataPopup;
