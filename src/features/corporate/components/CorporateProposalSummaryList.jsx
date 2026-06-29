import { Box, HStack, Icons, Popover, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MainCardBg from '@/assets/corporate/MainCardBg.png';
import SplashLoader from '@/components/custom/SplashLoader';
import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, fetchEnquirySummaryWithProposals } from '../action';
import { getEnquirySummaryWithProposals } from '../selector';

const {
    MobileNewIcon,
    NewEmailIcon,
    CardUserIcon,
    AddressCardIcon,
    CardNotesIcon,
    CardTickIcon,
    CustomerVerifiedIcon,
    LocationCorporateNewIcon,
    ServiceSCorporateNewIcon,
    TimeCorporateNewIcon
} = Icons;

const statusLabelMap = {
    CREATED: 'Proposal Created',
    SEND_TO_CUSTOMER: 'Send To Customer',
    APPROVED: 'Proposal Approved',
    PO_RECEIVED: 'PO Received',
    'IN PROGRESS': 'In Progress',
    CONNECTED: 'Connected',
    FEASIBLE: 'Feasible',
    OPEN: 'Open',
    CLOSED: 'Closed',
    PENDING: 'Pending',
    REJECTED: 'Rejected'
};

const formatStatusLabel = (status) =>
    statusLabelMap[status] ??
    status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const Sep = () => <Box h="20px" w="1px" bg="rgba(130,130,130,0.19)" flexShrink={0} />;

const ProposalVersionBadge = ({ proposalStatus }) => {
    if (!proposalStatus) return null;
    const bg = proposalStatus === 'APPROVED' ? '#E6FCEE' : proposalStatus === 'SEND_TO_CUSTOMER' ? '#DCEEFF' : '#FFDE74';
    const color = proposalStatus === 'APPROVED' ? '#008232' : proposalStatus === 'SEND_TO_CUSTOMER' ? '#0062BE' : '#000000';
    const borderColor = proposalStatus === 'APPROVED' ? '#008232' : proposalStatus === 'SEND_TO_CUSTOMER' ? '#0062BE' : '#9B7809';
    const label = statusLabelMap[proposalStatus] ?? formatStatusLabel(proposalStatus);
    return (
        <Box
            px={2}
            py="2px"
            borderRadius="full"
            fontSize="xs"
            fontWeight="600"
            bg={bg}
            color={color}
            border="1px solid"
            borderColor={borderColor}
            flexShrink={0}
        >
            {label}
        </Box>
    );
};

const ID_BADGE_BG = '#FFD557';

const ProposalCard = ({ data, index }) => {
    const { t } = useTranslation();
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const addressTimeoutRef = useRef(null);
    const serviceTimeoutRef = useRef(null);

    const handleAddressMouseEnter = () => {
        if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
        setIsAddressOpen(true);
    };
    const handleAddressMouseLeave = () => {
        addressTimeoutRef.current = setTimeout(() => setIsAddressOpen(false), 200);
    };
    const handleServiceMouseEnter = () => {
        if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
        setIsServicesOpen(true);
    };
    const handleServiceMouseLeave = () => {
        serviceTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 200);
    };

    const {
        enquiryId,
        enqId,
        trackingId,
        companyName,
        companyType,
        createdDate,
        source = 'WEB',
        receivedFromName,
        receivedFromDesignation,
        contactName,
        contactNumber,
        emailId,
        customerId,
        requestedServices,
        services,
        totalLocations: apiTotalLocations,
        totalServices: apiTotalServices,
        locations = [],
        proposals = {}
    } = data;

    const indexLabel = String(index).padStart(2, '0');
    const displayId = trackingId || enqId || enquiryId;

    const total = apiTotalLocations ?? locations.length;
    const servicesList = Array.isArray(services) && services.length > 0
        ? services
        : (Array.isArray(requestedServices) ? requestedServices : []);
    const servicesCount = apiTotalServices ?? servicesList.length;

    const formattedDateOnly = createdDate && dayjs(createdDate).isValid()
        ? dayjs(createdDate).format(DATE_FORMAT.DATE)
        : (createdDate || '-');
    const formattedTimeOnly = createdDate && dayjs(createdDate).isValid()
        ? dayjs(createdDate).format('hh:mm A')
        : '';

    const proposalEntries = Object.entries(proposals)
        .filter(([, v]) => v?.proposalStatus && v?.proposalStatus !== 'DRAFT')
        .sort((a, b) => parseInt(a[0].replace('version', '')) - parseInt(b[0].replace('version', '')));

    const latestProposal = proposalEntries[proposalEntries.length - 1]?.[1];

    const handleNavigate = () => {
        router.navigate({
            to: '/app/corporate/proposals-list/$enquiryId',
            params: { enquiryId: enquiryId || enqId }
        });
    };

    return (
        <Box
            cursor="pointer"
            onClick={handleNavigate}
            borderRadius="md"
            boxShadow="sm"
            mb={3}
            _hover={{ boxShadow: 'md' }}
        >
            <Box
                bg="#FFFDF6"
                borderTop="0"
                borderRight="1.5px solid #E1E1E1"
                borderLeft="1.5px solid #E1E1E1"
                borderBottom="1.5px solid #E1E1E1"
                borderRadius="md"
                px={4}
                py={3}
                position="relative"
                backgroundImage={`url(${MainCardBg})`}
                backgroundRepeat="no-repeat"
                backgroundPosition="center"
                backgroundSize="40% auto"
                css={{ backgroundBlendMode: 'multiply' }}
                _before={{
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    bg: '#FFFDF6',
                    opacity: 0.90,
                    pointerEvents: 'none',
                    borderRadius: 'inherit'
                }}
                _hover={{
                    borderRightColor: '#EFDD9D',
                    borderLeftColor: '#EFDD9D',
                    borderBottomColor: '#EFDD9D'
                }}
            >
                <HStack w="full" spacing={3} align="center" position="relative">
                    <Box flexShrink={0} minW="32px" alignSelf="stretch" display="flex" alignItems="center" justifyContent="center">
                        <Text fontWeight="bold" fontSize="md" color="gray.600">
                            {indexLabel}
                        </Text>
                    </Box>
                    <VStack flex={1} minW={0} align="stretch" spacing={2}>
                        {/* Row 1: ID badge | Company + type | (verified) | spacer | Status | Arrow */}
                        <HStack w="full" spacing={3} align="center">
                            <HStack
                                spacing={1}
                                flexShrink={0}
                                bg={ID_BADGE_BG}
                                borderRadius="full"
                                px={3}
                                py="4px"
                            >
                                {CardTickIcon && <CardTickIcon width="14px" height="14px" style={{ color: '#232F50' }} />}
                                <Text fontSize="14px" fontWeight="700" color="#232F50">
                                    {displayId}
                                </Text>
                            </HStack>
                            {customerId && CustomerVerifiedIcon && (
                                <CustomerVerifiedIcon width="22px" height="22px" flexShrink={0} />
                            )}
                            <Text fontWeight="700" fontSize="16px" color="gray.900" noOfLines={1}>
                                {companyName || '-'}
                            </Text>
                            {companyType && (
                                <Box
                                    px={2}
                                    py="2px"
                                    borderRadius="full"
                                    bg="#F6EBD7"
                                    border="1px solid #EFDD9D"
                                    flexShrink={0}
                                >
                                    <Text fontSize="12px" fontWeight="500" color="#232F50">
                                        {companyType.charAt(0).toUpperCase() + companyType.slice(1).toLowerCase()}
                                    </Text>
                                </Box>
                            )}
                            <Box flex={1} />
                            {latestProposal && (
                                <ProposalVersionBadge proposalStatus={latestProposal.proposalStatus} />
                            )}
                        </HStack>

                        {/* Row 2: contact (name/phone/email/address) | spacer | Received From */}
                        <HStack w="full" spacing={3} align="center">
                            <Box flex={1} minW={0}>
                                <HStack w="full" spacing={3} align="center" flexWrap="wrap">
                                    <HStack spacing={1} flexShrink={0}>
                                        {CardUserIcon && <CardUserIcon width="25px" height="25px" />}
                                        <Text fontSize="16px" color="#000000" fontWeight="600">
                                            {contactName || '-'}
                                        </Text>
                                    </HStack>
                                    <Sep />
                                    <HStack spacing={1} flexShrink={0}>
                                        {MobileNewIcon && (
                                            <MobileNewIcon width="25px" height="25px" style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                                        )}
                                        <Text fontSize="16px" color="#5F5F5F" fontWeight="600">
                                            {contactNumber || '-'}
                                        </Text>
                                    </HStack>
                                    <Sep />
                                    <HStack spacing={1} flexShrink={0}>
                                        {NewEmailIcon && (
                                            <NewEmailIcon width="25px" height="25px" style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                                        )}
                                        <Text fontSize="16px" color="#5F5F5F" fontWeight="500">
                                            {emailId || '-'}
                                        </Text>
                                    </HStack>
                                    {AddressCardIcon && (
                                        <>
                                            <Sep />
                                            <Popover.Root
                                                open={isAddressOpen}
                                                onOpenChange={(e) => setIsAddressOpen(e.open)}
                                                positioning={{ placement: 'top-start' }}
                                            >
                                                <Popover.Trigger asChild>
                                                    <HStack
                                                        spacing={1}
                                                        cursor="pointer"
                                                        onMouseEnter={handleAddressMouseEnter}
                                                        onMouseLeave={handleAddressMouseLeave}
                                                        flexShrink={0}
                                                    >
                                                        <Box>
                                                            <AddressCardIcon width="25px" height="25px" style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                                                        </Box>
                                                        <Text fontSize="16px" color="#5F5F5F" fontWeight="500">{t('address', 'Address')}</Text>
                                                    </HStack>
                                                </Popover.Trigger>
                                                <Popover.Positioner>
                                                    <Popover.Content
                                                        width="auto"
                                                        minW="320px"
                                                        maxW="400px"
                                                        bg="white"
                                                        boxShadow="md"
                                                        border="1px solid"
                                                        borderColor="gray.100"
                                                        borderRadius="md"
                                                        onMouseEnter={handleAddressMouseEnter}
                                                        onMouseLeave={handleAddressMouseLeave}
                                                    >
                                                        <Popover.Body p={3}>
                                                            <VStack align="stretch" spacing={2}>
                                                                <Text fontSize="sm" color="gray.800" fontWeight="medium" lineHeight="short">
                                                                    {data.installationAddress || '-'}
                                                                </Text>
                                                                <HStack spacing={3} align="center" pt={2} borderTop="1px solid" borderColor="gray.100">
                                                                    <Text fontSize="xs" color="gray.400">
                                                                        {t('latitude', 'Latitude')}: <Text as="span" color="gray.800" fontWeight="medium">{data.latitude || '-'}</Text>
                                                                    </Text>
                                                                    <Box w="1px" h="12px" bg="gray.200" />
                                                                    <Text fontSize="xs" color="gray.400">
                                                                        {t('longitude', 'Longitude')}: <Text as="span" color="gray.800" fontWeight="medium">{data.longitude || '-'}</Text>
                                                                    </Text>
                                                                </HStack>
                                                            </VStack>
                                                        </Popover.Body>
                                                    </Popover.Content>
                                                </Popover.Positioner>
                                            </Popover.Root>
                                        </>
                                    )}
                                </HStack>
                            </Box>
                            <HStack spacing={2} align="center" flexShrink={0}>
                                {CardNotesIcon && (
                                    <CardNotesIcon width="25px" height="25px" style={{ color: '#919191' }} />
                                )}
                                <Text fontSize="16px" color="#5F5F5F" fontWeight="500">
                                    {t('receivedFrom', 'Received From')}: <Text as="span" fontWeight="600" color="#232F50">{receivedFromName || source}{receivedFromDesignation ? ` (${receivedFromDesignation})` : ''}</Text>
                                </Text>
                            </HStack>
                        </HStack>

                        {/* Row 3: Total Locations + Services | spacer | Received On + time */}
                        <HStack w="full" spacing={3} align="center">
                            <HStack spacing={3} align="center" flexShrink={0}>
                                <HStack
                                    spacing={2}
                                    flexShrink={0}
                                    bg="#FCF7F5"
                                    border="1px solid #F0E5EA"
                                    borderRadius="full"
                                    px={3}
                                    py="4px"
                                >
                                    {LocationCorporateNewIcon && (
                                        <LocationCorporateNewIcon width="20px" height="20px" />
                                    )}
                                    <Text fontSize="14px" fontWeight="500" color="#000000">
                                        {t('totalLocations', 'Total Locations')} : <Text as="span" fontWeight="bold" fontSize="14px">{total}</Text>
                                    </Text>
                                </HStack>
                                <Popover.Root
                                    open={isServicesOpen}
                                    onOpenChange={(e) => setIsServicesOpen(e.open)}
                                    positioning={{ placement: 'bottom-start' }}
                                >
                                    <Popover.Trigger asChild>
                                        <HStack
                                            spacing={2}
                                            cursor="pointer"
                                            flexShrink={0}
                                            bg="#FCF7F5"
                                            border="1px solid #F0E5EA"
                                            borderRadius="full"
                                            px={3}
                                            py="4px"
                                            onMouseEnter={handleServiceMouseEnter}
                                            onMouseLeave={handleServiceMouseLeave}
                                        >
                                            {ServiceSCorporateNewIcon && (
                                                <ServiceSCorporateNewIcon width="20px" height="20px" />
                                            )}
                                            <Text fontSize="14px" fontWeight="500" color="#000000">
                                                {t('services', 'Services')} : <Text as="span" fontWeight="bold" fontSize="14px">{servicesCount}</Text>
                                            </Text>
                                        </HStack>
                                    </Popover.Trigger>
                                    <Popover.Positioner>
                                        <Popover.Content
                                            width="auto"
                                            minW="200px"
                                            bg="white"
                                            boxShadow="lg"
                                            borderRadius="md"
                                            onMouseEnter={handleServiceMouseEnter}
                                            onMouseLeave={handleServiceMouseLeave}
                                        >
                                            <Popover.Arrow />
                                            <Popover.Body p={4}>
                                                <VStack align="start" spacing={2}>
                                                    {servicesList.length > 0
                                                        ? servicesList.map((svc, i) => (
                                                            <Box key={i} display="flex" justifyContent="space-between" w="full" gap={4}>
                                                                <Text fontWeight="medium" fontSize="sm">{typeof svc === 'string' ? svc : svc.serviceName}</Text>
                                                                {svc?.noOfConnections !== undefined && (
                                                                    <Text fontSize="sm" color="gray.600">{svc.noOfConnections}</Text>
                                                                )}
                                                            </Box>
                                                        ))
                                                        : (
                                                            <Text fontSize="sm" color="gray.500">
                                                                {servicesCount} service{servicesCount !== 1 ? 's' : ''}
                                                            </Text>
                                                        )
                                                    }
                                                </VStack>
                                            </Popover.Body>
                                        </Popover.Content>
                                    </Popover.Positioner>
                                </Popover.Root>
                            </HStack>
                            <Box flex={1} />
                            <HStack spacing={2} align="center" flexShrink={0}>
                                <Text fontSize="16px" color="#5F5F5F" fontWeight="500">
                                    {t('receivedOn', 'Received On')}: <Text as="span" fontWeight="600" color="#232F50">{formattedDateOnly}</Text>
                                </Text>
                                {formattedTimeOnly && (
                                    <HStack spacing={1} align="center">
                                        <Text fontSize="16px" fontWeight="600" color="#232F50">
                                            {formattedTimeOnly}
                                        </Text>
                                        {TimeCorporateNewIcon && <TimeCorporateNewIcon width="20px" height="20px" />}
                                    </HStack>
                                )}
                            </HStack>
                        </HStack>
                    </VStack>
                </HStack>
            </Box>
        </Box>
    );
};

const CorporateProposalSummaryList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiProgress = useSelector(getApiProgress);
    const summaryState = useSelector(getEnquirySummaryWithProposals);

    const isLoading = !!(apiProgress[ACTION_TYPES.FETCH_ENQUIRY_SUMMARY_WITH_PROPOSALS]) || summaryState?.isLoading;
    const list = summaryState?.data ?? [];

    useEffect(() => {
        dispatch(fetchEnquirySummaryWithProposals());
    }, [dispatch]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={10}>
                <SplashLoader inline />
            </Box>
        );
    }

    if (!list.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={10}>
                <Text fontSize="md" color="gray.500">{t('noData', 'No data available')}</Text>
            </Box>
        );
    }

    return (
        <Box p={4}>
            {list.map((item, index) => (
                <ProposalCard
                    key={item.enquiryId || item.id || index}
                    data={item}
                    index={index + 1}
                />
            ))}
        </Box>
    );
};

export default CorporateProposalSummaryList;
