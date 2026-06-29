import { Box, Button, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LNPListCard = ({ data, index, onClick }) => {
    const { t } = useTranslation()
    const [isExpanded, setIsExpanded] = useState(true);
    const { MobileNewIcon, UpArrowIcon, DownArrowIcon } = Icons;
    const mainTitle = data.companyName || '-';
    const secondaryText = `SL No: ${data.slno || '-'}`;
    const status = data.linkEstablishmentStatus || 'Pending';
    const category = data.locationCategory || '-';

    const address = `${data.address || ''}, ${data.district || ''}${data.pinCode ? ` - ${data.pinCode}` : ''}`;
    const contact = data.contact || '-';
    const partnerType = data.partnerType ? data.partnerType.trim() : '-';
    const linkEstablishmentStatus = data.linkEstablishmentStatus || '-';
    const partnerId = data.partnerId || '-';

    return (
        <HStack w="full" spacing={0} alignItems="center">
            <Box
                flex={1}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
                boxShadow="sm"
                transition="all 0.2s"
                cursor={onClick ? 'pointer' : 'default'}
                onClick={() => onClick && onClick(data)}
                _hover={{ borderColor: 'primary.main', boxShadow: 'md' }}
            >
                <HStack align="center" spacing={4}>
                    <Text fontWeight="bold" color="#000000" minW="30px">{String(index + 1).padStart(2, '0')}</Text>

                    <VStack w="full" spacing={4} align="stretch">
                        <HStack w="full" justify="space-between" align="center">
                            <HStack spacing={3} align="center" wrap="wrap">
                                <Text fontWeight="bold" fontSize="md">{mainTitle}</Text>
                                <Box h="15px" w="1px" bg="gray.300" />
                                <Text color="#8D0247" fontWeight="medium">{partnerType}</Text>
                                <Box h="15px" w="1px" bg="gray.300" />
                                <Text color="#8D0247" fontWeight="medium">{t('partnerId')}: {partnerId}</Text>
                            </HStack>
                            <HStack spacing={3} align="center">
                                <Text fontSize="md" color="#232F50">{t('category')}: {category}</Text>

                                <Box h="15px" w="1px" bg="#232F50" />
                                <Text fontSize="md" fontWeight="bold">{secondaryText}</Text>

                                <Box
                                    bg="#FFE1CD"
                                    color="#AC5013"
                                    px={6}
                                    py={2}
                                    borderRadius="md"
                                    fontSize="md"
                                    fontWeight="semibold"
                                    border={'1px solid #FBB8B8'}
                                >
                                    {status}

                                </Box>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsExpanded(!isExpanded);
                                    }}
                                >
                                    {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
                                </Button>
                            </HStack>
                        </HStack>
                        {isExpanded && (
                            <HStack w="full" justify="space-between" align="center" pt={2} borderTop="1px solid" borderColor="gray.100">
                                <HStack spacing={3} wrap="wrap" align="center">
                                    <Text color="#232F50" fontSize="md">{t('address')}: {address}</Text>

                                    <Box h="15px" w="1px" bg="gray.300" />
                                    <HStack spacing={1}>
                                        <MobileNewIcon style={{ fontSize: '12px', width: '24px', height: '24px', color: '#670335' }} />
                                        <Text fontSize="md" color="#232F50">{contact}</Text>
                                    </HStack>
                                    <Box h="15px" w="1px" bg="gray.300" />
                                    <HStack spacing={1}>
                                        <Text fontSize="md" color="#232F50">{t('linkEstablishmentStatus')}: {linkEstablishmentStatus}</Text>
                                    </HStack>
                                </HStack>
                            </HStack>
                        )}
                    </VStack>
                </HStack>
            </Box >
        </HStack >
    );
};

export default LNPListCard;
