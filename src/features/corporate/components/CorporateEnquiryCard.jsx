import { Box, Button, HStack, Icons, Popover, Text, VStack } from '@kfonbss/bss-ui-components';
import { useRef, useState } from 'react';

import { DATE_FORMAT } from '@/constants/date';
import { dayjs } from '@/utils/dateUtils';

const CorporateEnquiryCard = ({ data, index, isSelected, onClick, onEditClick }) => {
    const { DownArrowIcon, UpArrowIcon, MobileNewIcon, NewEmailIcon, EditActionIcon } = Icons;
    const [isExpanded, setIsExpanded] = useState(true);

    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const serviceTimeoutRef = useRef(null);

    const handleServiceMouseEnter = () => {
        if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
        setIsServicesOpen(true);
    };

    const handleServiceMouseLeave = () => {
        serviceTimeoutRef.current = setTimeout(() => {
            setIsServicesOpen(false);
        }, 200);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onClick(data);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const statusColorMap = {
        Open: 'blue',
        Pending: 'orange',
        Closed: 'red',
        Processed: 'green',
        Feasible: 'green',
        'Presently not Feasible': 'red',
        'Partially Connected': 'yellow'
    };

    const status = data.status || 'Pending';
    const badgeColor = statusColorMap[status] || 'gray';

    const badgeStyles = {
        blue: { bg: 'blue.100', color: 'blue.800' },
        orange: { bg: '#FFE1CD', color: '#AC5013', border: '1px solid #FBB8B8' },
        red: { bg: 'red.100', color: 'red.800' },
        green: { bg: 'green.100', color: 'green.800' },
        yellow: { bg: 'yellow.100', color: 'yellow.800' },
        gray: { bg: 'gray.100', color: 'gray.800' }
    };
    const currentBadgeStyle = badgeStyles[badgeColor] || badgeStyles.gray;

    const servicesCount = Array.isArray(data.additionalServices) ? data.additionalServices.length : 4;

    return (
        <HStack w="full" spacing={3} alignItems="center" mb={3}>
            <input
                type="checkbox"
                checked={isSelected}
                onChange={handleCheckboxChange}
                style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--chakra-colors-primary-500)',
                    cursor: 'pointer'
                }}
            />
            <Box
                flex={1}
                bg="white"
                p={4}
                borderRadius="md"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ boxShadow: 'md' }}
            >
                <HStack align="center" spacing={4} width="full">

                    <Text fontWeight="bold" fontSize="md" minW="30px" color="gray.600">
                        {String(index + 1).padStart(2, '0')}
                    </Text>

                    <HStack flex="1" align="center" spacing={3}>
                        <HStack spacing={3} align="center" wrap="wrap" marginInlineEnd="auto">
                            <Text fontWeight="bold" fontSize="lg" color="gray.900">
                                {data.companyName || '-'}
                            </Text>

                            <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                            <Text
                                fontWeight="bold"
                                fontSize="md"
                                color="#8D0247"
                                bg="pink.50"
                                px={2}
                                py={1}
                                borderRadius="md"
                                display="inline-block"
                                noOfLines={1}
                            >
                                {data.packageName || data.industry || '699_Platinum_Plan_Platinum_Plan'}
                            </Text>

                            <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                            <Popover.Root
                                open={isServicesOpen}
                                onOpenChange={(e) => setIsServicesOpen(e.open)}
                                positioning={{ placement: 'bottom-start' }}
                            >
                                <Popover.Trigger asChild>
                                    <Box
                                        border="1px solid #DEDEDE"
                                        borderRadius="md"
                                        px={4}
                                        py={2}
                                        bg="gray.50"
                                        cursor="pointer"
                                        onMouseEnter={handleServiceMouseEnter}
                                        onMouseLeave={handleServiceMouseLeave}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Text fontSize="md" fontWeight="bold" color="#232F50">
                                            Additional Services: {servicesCount}
                                        </Text>
                                    </Box>
                                </Popover.Trigger>
                                <Popover.Positioner>
                                    <Popover.Content
                                        width='auto'
                                        minW='200px'
                                        bg='white'
                                        boxShadow='lg'
                                        borderRadius='md'
                                        onMouseEnter={handleServiceMouseEnter}
                                        onMouseLeave={handleServiceMouseLeave}
                                    >
                                        <Popover.Arrow />
                                        <Popover.Body p={4}>
                                            <VStack align='start' spacing={2}>
                                                {[
                                                    { serviceName: 'Static IP', count: 5 },
                                                    { serviceName: 'MSP Service', count: 10 }
                                                ].map((service, index) => (
                                                    <Box key={index} display='flex' justifyContent='space-between' w='full' gap={4}>
                                                        <Text fontWeight='medium' fontSize='sm'>
                                                            {service.serviceName}
                                                        </Text>
                                                        <Text fontSize='sm' color='gray.600'>
                                                            {service.count}
                                                        </Text>
                                                    </Box>
                                                ))}
                                            </VStack>
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover.Positioner>
                            </Popover.Root>

                            <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                            <Text fontWeight="bold" fontSize="sm" color="#232F50" noOfLines={1}>
                                {data.district || data.locDistrict || 'Kottayam'}
                            </Text>
                        </HStack>

                        <HStack spacing={3} align="center" flexShrink={0}>
                            <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                            <HStack spacing={1}>
                                <Text fontSize="sm" color="gray.500">Enquiry Date:</Text>
                                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                                    {data.createdDate ? dayjs(data.createdDate).format(DATE_FORMAT.DATE_TIME) : '-'}
                                </Text>
                            </HStack>
                        </HStack>

                        <Button
                            variant="ghost"
                            onClick={handleToggle}
                            p={1}
                            borderRadius="full"
                            _hover={{ bg: 'gray.100' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                            minW="unset"
                            h="unset"
                        >
                            {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
                        </Button>
                    </HStack>        </HStack>

                {isExpanded && (
                    <VStack w="full" align="stretch" spacing={4} pt={4} mt={4} borderTop="1px solid" borderColor="gray.100">
                        {/* Address and Contact Info Row */}
                        <HStack w="full" justify="space-between" align="start" wrap="wrap">
                            <HStack spacing={4} align="center" wrap="wrap" flex={1}>
                                <Text fontSize="md" color="#232F50">
                                    {data.address || data.district ? `${data.address || ''} ${data.district || ''} ${data.pincode || '695003'}`.trim() : 'Axis Bank Kasargod, Opposite Panchayat Office, Palayam Kasargod District 695003'}
                                </Text>
                            </HStack>

                            <HStack spacing={3} align="center">
                                <Text fontSize="sm" fontWeight="bold" color="#232F50">
                                    {data.contactName || 'Anil Kumar M'}
                                </Text>

                                <Box h="15px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                                <HStack spacing={1}>
                                    {MobileNewIcon && <MobileNewIcon width={"24px"} height={"24px"} style={{ color: '#8D0247' }} />}
                                    <Text fontSize="sm" fontWeight="bold" color="#232F50">
                                        {data.contactNumber || '9876543210'}
                                    </Text>
                                </HStack>

                                <Box h="15px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                                <HStack spacing={1}>
                                    {NewEmailIcon && <NewEmailIcon width={"24px"} height={"24px"} style={{ color: '#8D0247' }} />}
                                    <Text fontSize="sm" color="#232F50">
                                        {data.email || 'axiskagd@gmail.com'}
                                    </Text>
                                </HStack>

                                <Box h="15px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                                <Box
                                    px={4}
                                    py={1}
                                    borderRadius="md"
                                    bg={currentBadgeStyle.bg}
                                    color={currentBadgeStyle.color}
                                    fontSize="md"
                                    fontWeight="500"
                                    border={currentBadgeStyle.border}
                                >
                                    {status}
                                </Box>
                            </HStack>
                        </HStack>

                        {/* Feasibility Details Section */}
                        {(status) && (
                            <HStack w="full" spacing={3} align="center" mt={2}>
                                <HStack spacing={1}>
                                    <Text fontSize="md" color="#232F50">Nearest LNP:</Text>
                                    <Text fontSize="md" fontWeight="semibold" color="#232F50">{data.nearestLnp || '-'}</Text>
                                </HStack>

                                <Box h="15px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                                <HStack spacing={1}>
                                    <Text fontSize="md" color="#232F50">Nearest Closure ID:</Text>
                                    <Text fontSize="md" fontWeight="semibold" color="#232F50">{data.nearestClosureId || '-'}</Text>
                                </HStack>

                                <Box h="15px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                                <HStack spacing={1}>
                                    <Text fontSize="md" color="#232F50">Distance from Nearest Location:</Text>
                                    <Text fontSize="md" fontWeight="semibold" color="#232F50">{data.distance || '-'}</Text>
                                </HStack>

                                <Box h="15px" w="1px" bg="rgba(130, 130, 130, 0.19)" />

                                <HStack spacing={1}>
                                    <Text fontSize="md" color="#232F50">Connected By:</Text>
                                    <Text fontSize="md" fontWeight="semibold" color="#232F50">{data.connectedBy || '-'}</Text>
                                </HStack>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    ml="auto"
                                    bg="#FFF5F5"
                                    borderRadius="full"
                                    w="32px"
                                    h="32px"
                                    minW="32px"
                                    p={0}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    _hover={{ bg: '#FFE5E5' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onEditClick) onEditClick(data);
                                    }}
                                >
                                    <EditActionIcon color="#E53E3E" boxSize={8} />
                                </Button>
                            </HStack>
                        )}
                    </VStack>
                )}

            </Box>
        </HStack>
    );
};

export default CorporateEnquiryCard;
