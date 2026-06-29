import { Box, Button, HStack, Icons, Popover, Popup, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MainCardBg from '@/assets/corporate/MainCardBg.png';
import infoImg from '@/assets/success.png';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { STORAGE_KEYS } from '@/constants';
import { DATE_FORMAT } from '@/constants/date';
import { PERMISSIONS } from '@/constants/permissions';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import TrackEnquiryPopup from '@/features/public/pages/enquiryForms/components/TrackEnquiryPopup';
import { usePageActions } from '@/hooks/usePageActions';
import { router } from '@/routes/routes';
import { dayjs } from '@/utils/dateUtils';
import { getTokenData } from '@/utils/encryptionUtils';

import { ACTION_TYPES, fetchCorporateEnquiryExpandedList, fetchCorporateEnquiryList, fetchProposalSendPreview, generatePoPdf, updateProposalStatus } from '../action';
import { actions as sliceActions } from '../slice';
import CorporateDispositionPopup from './popUps/CorporateDispositionPopup';
import CorporateMeetingHistoryPopup from './popUps/CorporateMeetingHistoryPopup';
import CorporateMeetingPopup from './popUps/CorporateMeetingPopup';
import CorporateProposalDispatchPopup from './popUps/CorporateProposalDispatchPopup';
import CorporateProposalPreviewPopup from './popUps/CorporateProposalPreviewPopup';
import CorporateReturnToPopup from './popUps/CorporateReturnToPopup';
import CorporateVerifiedCustomerPopup from './popUps/CorporateVerifiedCustomerPopup';
import CustomerMappingPopup from './popUps/CustomerMappingPopup';
import PurchaseOrderPreviewPopup from './popUps/PurchaseOrderPreviewPopup';
import SummaryNotesPopup from './popUps/SummaryNotesPopup';

const {
    DownArrowIcon,
    UpArrowIcon,
    MobileNewIcon,
    NewEmailIcon,
    CardUserIcon,
    AddressCardIcon,
    CardNotesIcon,
    CardTickIcon,
    CustomerVerifiedIcon,
    BsXCircle,
    BsCheckCircle,
    ThreeDotActionIcon,
    LocationCorporateNewIcon,
    ServiceSCorporateNewIcon,
    TimeCorporateNewIcon
} = Icons;

const statusColorMap = {
    Open: 'orange',
    OPEN: 'orange',
    Pending: 'orange',
    PENDING: 'orange',
    Closed: 'red',
    CLOSED: 'red',
    Connected: 'green',
    CONNECTED: 'green',
    Feasible: 'green',
    FEASIBLE: 'green',
    'In Progress': 'orange',
    'IN PROGRESS': 'orange',
    Rejected: 'red',
    REJECTED: 'red',
    'Presently not Feasible': 'red',
    'Partially Connected': 'yellow',
    CREATED: 'proposalCreated',
    Created: 'proposalCreated',
    SEND_TO_CUSTOMER: 'sendToCustomer',
    'Send To Customer': 'sendToCustomer',
    APPROVED: 'approved',
    Approved: 'approved',
    PO_RECEIVED: 'poReceived'
};

const statusLabelMap = {
    CREATED: 'Proposal Created',
    Created: 'Proposal Created',
    SEND_TO_CUSTOMER: 'Send To Customer',
    APPROVED: 'Proposal Approved',
    Approved: 'Proposal Approved',
    'IN PROGRESS': 'In Progress',
    CONNECTED: 'Connected',
    FEASIBLE: 'Feasible',
    OPEN: 'Open',
    CLOSED: 'Closed',
    PENDING: 'Pending',
    REJECTED: 'Rejected',
    DUPLICATE: 'Duplicate',
    RE_ASSIGN: 'Re-Assign',
    NOT_INTERESTED: 'Not Interested',
    PO_RECEIVED: 'PO Received'
};

const formatStatusLabel = (status) => {
    if (!status) return '-';
    return statusLabelMap[status] ?? status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
};

const BADGE_STYLE = { bg: '#F4F4F4', color: '#FD1C7A', border: '1px solid #D7D7D7' };

const badgeStyles = {
    blue: BADGE_STYLE,
    orange: BADGE_STYLE,
    red: BADGE_STYLE,
    green: BADGE_STYLE,
    yellow: BADGE_STYLE,
    gray: BADGE_STYLE,
    proposalCreated: BADGE_STYLE,
    sendToCustomer: BADGE_STYLE,
    approved: BADGE_STYLE,
    poReceived: BADGE_STYLE
};

const DEFAULT_DISPOSITION_STYLE = { bg: '#F4F4F4', border: '1px solid #D7D7D7', text: '#FD1C7A', countBg: '#FFCCE9', shadow: undefined };

const DISPOSITION_STYLE_MAP = {
    FEASIBLE: { bg: '#DAF0E5', border: '1px solid #B8E0CB', text: '#1F8A4D', countBg: '#B8E0CB', shadow: undefined },
    Feasible: { bg: '#DAF0E5', border: '1px solid #B8E0CB', text: '#1F8A4D', countBg: '#B8E0CB', shadow: undefined },
    NOT_FEASIBLE: { bg: '#FFE5EC', border: '1px solid #FFC4D2', text: '#C8123F', countBg: '#FFC4D2', shadow: undefined },
    'Not Feasible': { bg: '#FFE5EC', border: '1px solid #FFC4D2', text: '#C8123F', countBg: '#FFC4D2', shadow: undefined },
    FOLLOW_UP: { bg: '#FFF5CF', border: '1px solid #F0E5A5', text: '#8B6914', countBg: '#F0E5A5', shadow: undefined },
    'Follow Up': { bg: '#FFF5CF', border: '1px solid #F0E5A5', text: '#8B6914', countBg: '#F0E5A5', shadow: undefined }
};

const getDispositionStyle = (disposition) => DISPOSITION_STYLE_MAP[disposition] || DEFAULT_DISPOSITION_STYLE;

const Sep = () => <Box h="20px" w="1px" bg="rgba(130, 130, 130, 0.19)" flexShrink={0} />;

const StatusBadge = ({ status, style }) => (
    <Box
        px={4}
        py="2px"
        borderRadius="full"
        bg={style.bg}
        color={style.color}
        fontSize="sm"
        fontWeight="600"
        border={style.border}
        flexShrink={0}
        display="flex"
        alignItems="center"
        gap="6px"
        {...(style.shadow && { boxShadow: style.shadow })}
    >
        <Box as="span" w="8px" h="8px" borderRadius="full" bg="#FD1C7A" flexShrink={0} />
        {formatStatusLabel(status)}
    </Box>
);

const EnquiryCardItem = ({ data, index, isSelected, onSelect,
    // onForwardPlus,
    onForward, isAllExpanded, viewType }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiProgress = useSelector(getApiProgress);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isCustomerVerificationOpen, setIsCustomerVerificationOpen] = useState(false);
    const [isMeetingPopupOpen, setIsMeetingPopupOpen] = useState(false);
    const [isMeetingHistoryOpen, setIsMeetingHistoryOpen] = useState(false);
    const [isVerifiedCustomerOpen, setIsVerifiedCustomerOpen] = useState(false);
    const [isTrackEnquiryOpen, setIsTrackEnquiryOpen] = useState(false);
    const [isDispositionOpen, setIsDispositionOpen] = useState(false);
    const [activeDispositionCode, setActiveDispositionCode] = useState(null);
    const [isReturnToOpen, setIsReturnToOpen] = useState(false);
    const [isProposalPreviewOpen, setIsProposalPreviewOpen] = useState(false);
    const [proposalPreviewData, setProposalPreviewData] = useState(null);
    const [selectedProposalStatus, setSelectedProposalStatus] = useState(null);
    const [selectedPreviewVersion, setSelectedPreviewVersion] = useState(null);
    const [isRevisePreviewOpen, setIsRevisePreviewOpen] = useState(false);
    const [revisePreviewData, setRevisePreviewData] = useState(null);
    const [isDispatchOpen, setIsDispatchOpen] = useState(false);
    const [isPOPreviewOpen, setIsPOPreviewOpen] = useState(false);
    const [poPreviewData, setPoPreviewData] = useState(null);
    const [isKycPendingOpen, setIsKycPendingOpen] = useState(false);
    const { hasPermission } = usePageActions();
    const serviceTimeoutRef = useRef(null);
    const addressTimeoutRef = useRef(null);

    const handleServiceMouseEnter = () => {
        if (serviceTimeoutRef.current) clearTimeout(serviceTimeoutRef.current);
        setIsServicesOpen(true);
    };

    const handleServiceMouseLeave = () => {
        serviceTimeoutRef.current = setTimeout(() => setIsServicesOpen(false), 200);
    };

    const handleAddressMouseEnter = () => {
        if (addressTimeoutRef.current) clearTimeout(addressTimeoutRef.current);
        setIsAddressOpen(true);
    };

    const handleAddressMouseLeave = () => {
        addressTimeoutRef.current = setTimeout(() => setIsAddressOpen(false), 200);
    };

    const handleCheckboxChange = (e) => {
        e.stopPropagation();
        onSelect?.(data.enquiryId);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        if (!isExpanded) {
            const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
            const seatId = tokenData?.seatId ?? null;
            dispatch(fetchCorporateEnquiryExpandedList({ ...(seatId && { seatId }), enquiryId }));
        }
        setIsExpanded(prev => !prev);
    };

    useEffect(() => {
        if (isAllExpanded === undefined) return;
        setIsExpanded(isAllExpanded);
    }, [isAllExpanded]);

    const isExpandLoading = isExpanded && !!(apiProgress[ACTION_TYPES.FETCH_CORPORATE_ENQUIRY_EXPANDED_LIST]);
    const isProposalPreviewLoading = !!apiProgress[ACTION_TYPES.FETCH_PROPOSAL_SEND_PREVIEW];
    const isPoPdfLoading = !!apiProgress[ACTION_TYPES.GENERATE_PO_PDF];
    const isProposalUpdating = !!apiProgress[ACTION_TYPES.UPDATE_PROPOSAL_STATUS];

    const clearCorporateSession = () => {
        ['proposalLocationIDs', 'proposalEnquiryId', 'splitFilterLocationIds'].forEach(k => sessionStorage.removeItem(k));
    };

    const {
        enquiryId,
        enqId,
        trackingId,
        companyName,
        companyType,
        createdDate,
        daysAgo,
        source = 'WEB',
        receivedFromName,
        receivedFromDesignation,
        status = 'Pending',
        dispositionStatus,
        contactName,
        contactNumber,
        emailId,
        requestedServices,
        services,
        totalLocations: apiTotalLocations,
        totalServices: apiTotalServices,
        customerId,
        customerName,
        proposalName,
        customerStatus,
        totalProposalAmount,
        meetings = [],
        locations = [],
        dispositionSummary = [],
        proposals = {},
        purchaseOrders = []
    } = data;

    const actionItems = [
        {
            label: 'viewLocation',
            onClick: (row) => {
                clearCorporateSession();
                router.navigate({
                    to: '/app/corporate/enquiry-detailed-view/$enquiryId',
                    params: { enquiryId: row?.enquiryId || enquiryId }
                });
            },
            hidden: !hasPermission(PERMISSIONS.CORPORATE.LOCATION_VIEW)
        },
        {
            label: 'addLocation',
            onClick: (row) => {
                clearCorporateSession();
                router.navigate({
                    to: '/app/corporate/enquiry-detailed-view/$enquiryId',
                    params: { enquiryId: row?.enquiryId || enquiryId }
                });
            },
            hidden: !hasPermission(PERMISSIONS.CORPORATE.CORP_ADD_LOCATION)
        },
        {
            label: 'customerVerification',
            onClick: () => {
                if (customerId && customerStatus === 'KYC_PENDING') {
                    setIsKycPendingOpen(true);
                } else {
                    setIsCustomerVerificationOpen(true);
                }
            },
            hidden: !hasPermission(PERMISSIONS.CORPORATE.CORP_CUSTOMER_VERIFICATION)
        },
        {
            label: 'edit',
            onClick: (row) => router.navigate({
                to: '/app/corporate/edit-enquiry/$enquiryId',
                params: { enquiryId: row?.enquiryId ?? data?.enquiryId }
            }),
            hidden: !hasPermission(PERMISSIONS.CORPORATE.CORP_EDIT)
        },
        // {
        //     label: 'forwardPlus',
        //     onClick: (row) => {
        //         if (customerStatus === 'KYC_PENDING') {
        //             setIsKycPendingOpen(true);
        //         } else {
        //             onForwardPlus?.(row);
        //         }
        //     },
        //     hidden: !hasPermission(PERMISSIONS.CORPORATE.CORP_FORWARD_PLUS)
        // },
        {
            label: 'forward',
            onClick: (row) => {
                if (customerStatus === 'KYC_PENDING') {
                    setIsKycPendingOpen(true);
                } else {
                    onForward?.(row);
                }
            },
            hidden: !hasPermission(PERMISSIONS.CORPORATE.CORP_FORWARD_PLUS)
        },
        {
            label: 'meetings',
            onClick: () => { setIsMeetingPopupOpen(true); },
            hidden: !hasPermission(PERMISSIONS.CORPORATE.CORP_MEETINGS)
        },
        {
            label: 'returnTo',
            onClick: () => { setIsReturnToOpen(true); },
            hidden: !hasPermission(PERMISSIONS.CORPORATE.CORP_RETURN_TO)
        },
        {
            label: 'updatePo',
            onClick: () => {
                router.navigate({
                    to: '/app/corporate/proposals/create-po/$proposalId',
                    params: { proposalId: enquiryId },
                    state: {
                        proposalName: proposalName ?? '',
                        customerId: customerId ?? '',
                        customerName: customerName ?? companyName ?? ''
                    }
                });
            },
            hidden: (!hasPermission(PERMISSIONS.CORPORATE.CORP_UPDATE_PO) && !hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_CORP_UPDATE_PO)) || status !== 'SEND_TO_CUSTOMER'
        }
    ];

    const total = apiTotalLocations ?? locations.length;

    const sortedDispositions = [...dispositionSummary].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

    const dispositionFallback = dispositionStatus
        ? [{ disposition: dispositionStatus, count: 1 }]
        : [];
    const dispositionsToRender = sortedDispositions.length > 0 ? sortedDispositions : dispositionFallback;

    const servicesList = Array.isArray(services) && services.length > 0
        ? services
        : (Array.isArray(requestedServices) ? requestedServices : []);

    const badgeColor = statusColorMap[status] || 'gray';
    const currentBadgeStyle = badgeStyles[badgeColor] || badgeStyles.gray;

    const servicesCount = apiTotalServices ?? servicesList.length;


    const formattedDateOnly = createdDate && dayjs(createdDate).isValid()
        ? dayjs(createdDate).format(DATE_FORMAT.DATE)
        : (createdDate || '-');

    const formattedTimeOnly = createdDate && dayjs(createdDate).isValid()
        ? dayjs(createdDate).format('hh:mm A')
        : '';

    const indexLabel = String(index).padStart(2, '0');

    const ToggleBtn = ({ expanded }) => (
        <Button
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); handleToggle(e); }}
            p={1}
            borderRadius="full"
            _hover={{ bg: 'gray.100' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            minW="unset"
            w="32px"
            h="32px"
        >
            {expanded ? <UpArrowIcon /> : <DownArrowIcon />}
        </Button>
    );

    const IdBadge = () => (
        <HStack
            spacing={1}
            flexShrink={0}
            bg="#FFD557"
            borderRadius="full"
            px={3}
            py="4px"
            cursor="pointer"
            onClick={(e) => { e.stopPropagation(); setIsTrackEnquiryOpen(true); }}
        >
            {CardTickIcon && <CardTickIcon width="14px" height="14px" style={{ color: '#232F50' }} />}
            <Text fontSize="14px" fontWeight="700" color="#232F50">
                {trackingId || enqId || enquiryId}
            </Text>
        </HStack>
    );

    const ContactRow = () => (
        <HStack w="full" spacing={3} align="center" flexWrap="wrap">
            <HStack spacing={1} flexShrink={0}>
                {CardUserIcon && <CardUserIcon width="22px" height="22px" />}
                <Text fontSize="16px" color="#000000" fontWeight="600">
                    {contactName || '-'}
                </Text>
            </HStack>

            <Sep />

            <HStack spacing={1} flexShrink={0}>
                {MobileNewIcon && (
                    <MobileNewIcon width="22px" height="22px" style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                )}
                <Text fontSize="16px" color="#5F5F5F" fontWeight="600">
                    {contactNumber || '-'}
                </Text>
            </HStack>

            <Sep />

            <HStack spacing={1} flexShrink={0}>
                {NewEmailIcon && (
                    <NewEmailIcon width="22px" height="22px" style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
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
                                    <AddressCardIcon width="22px" height="22px" style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                                </Box>
                                <Text fontSize="16px" color="#5F5F5F" fontWeight="500">{t('address')}</Text>
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
                                        <HStack
                                            spacing={3}
                                            align="center"
                                            pt={2}
                                            borderTop="1px solid"
                                            borderColor="gray.100"
                                        >
                                            <Text fontSize="xs" color="gray.400">
                                                {t('latitude')}: <Text as="span" color="gray.800" fontWeight="medium">{data.latitude || '-'}</Text>
                                            </Text>
                                            <Box w="1px" h="12px" bg="gray.200" />
                                            <Text fontSize="xs" color="gray.400">
                                                {t('longitude')}: <Text as="span" color="gray.800" fontWeight="medium">{data.longitude || '-'}</Text>
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
    );

    const LocationServicesBadges = () => (
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
                    {t('totalLocations')} : <Text as="span" fontWeight="bold" fontSize="14px">{total}</Text>
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
                            {t('services')} : <Text as="span" fontWeight="bold" fontSize="14px">{servicesCount}</Text>
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
    );

    const ReceivedFromLine = () => (
        <HStack spacing={2} align="center" flexShrink={0}>
            {CardNotesIcon && (
                <CardNotesIcon
                    width="22px"
                    height="22px"
                    style={{ color: '#919191' }}
                    cursor="pointer"
                    onClick={(e) => { e.stopPropagation(); setIsNotesOpen(true); }}
                />
            )}
            <Text fontSize="16px" color="#5F5F5F" fontWeight="500">
                {t('receivedFrom')}: <Text as="span" fontWeight="600" color="#232F50">{receivedFromName || source}{receivedFromDesignation ? ` (${receivedFromDesignation})` : ''}</Text>
            </Text>
        </HStack>
    );

    const daysAgoLabel = typeof daysAgo === 'string' && daysAgo.trim()
        ? daysAgo
        : null;

    const ReceivedOnLine = () => (
        <HStack spacing={2} align="center" flexShrink={0}>
            <Text fontSize="16px" color="#5F5F5F" fontWeight="500">
                {t('receivedOn')}: <Text as="span" fontWeight="600" color="#232F50">{formattedDateOnly}</Text>
            </Text>
            {formattedTimeOnly && (
                <HStack spacing={1} align="center">
                    <Text fontSize="16px" fontWeight="600" color="#232F50">
                        {formattedTimeOnly}
                    </Text>
                    {TimeCorporateNewIcon && <TimeCorporateNewIcon width="20px" height="20px" />}
                </HStack>
            )}
            {daysAgoLabel && (
                <Text
                    fontWeight={700}
                    fontSize="16px"
                    color="#232F50"
                    flexShrink={0}
                >
                    {daysAgoLabel}
                </Text>
            )}
        </HStack>
    );

    return (
        <HStack w="full" spacing={0} alignItems="stretch" mb={3}>
            {viewType !== 'outbox' && (
                <input
                    type="checkbox"
                    checked={!!isSelected}
                    onChange={handleCheckboxChange}
                    style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--chakra-colors-primary-500)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        marginRight: '16px',
                        alignSelf: 'center'
                    }}
                />
            )}

            <Box
                flex={1}
                cursor="pointer"
                onClick={handleToggle}
                borderRadius="md"
                boxShadow="sm"
                _hover={{ boxShadow: 'md' }}
            >
                {/* ── CREAM TOP SECTION (always visible — up to received on) ── */}
                <Box
                    bg="#FFFDF6"
                    borderTop="0"
                    borderRight={`1.5px solid ${isExpanded ? '#EFDD9D' : '#E1E1E1'}`}
                    borderLeft={`1.5px solid ${isExpanded ? '#EFDD9D' : '#E1E1E1'}`}
                    borderBottom={isExpanded ? '0' : '1.5px solid #E1E1E1'}
                    borderTopRadius="md"
                    borderBottomRadius={isExpanded ? '0' : 'md'}
                    _hover={!isExpanded ? {
                        borderRightColor: '#EFDD9D',
                        borderLeftColor: '#EFDD9D',
                        borderBottomColor: '#EFDD9D'
                    } : undefined}
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
                >
                    <HStack w="full" spacing={3} align="center" position="relative">
                        <Box flexShrink={0} minW="32px" alignSelf="stretch" display="flex" alignItems="center" justifyContent="center">
                            <Text fontWeight="bold" fontSize="md" color="gray.600">
                                {indexLabel}
                            </Text>
                        </Box>
                        <VStack flex={1} minW={0} align="stretch" spacing={2}>
                            {/* Row 1: ID badge | Company + type | (verified) | spacer | Status | Toggle */}
                            <HStack w="full" spacing={3} align="center">
                                <IdBadge />
                                {customerId && CustomerVerifiedIcon && (
                                    <CustomerVerifiedIcon width="18px" height="18px" flexShrink={0} />
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
                                <StatusBadge status={status} style={currentBadgeStyle} />
                                <ToggleBtn expanded={isExpanded} />
                            </HStack>

                            {/* Row 2: contact (name/phone/email/address) | spacer | received from | action menu (under toggle) */}
                            <HStack w="full" spacing={3} align="center">
                                <Box flex={1} minW={0}>
                                    <ContactRow />
                                </Box>
                                <ReceivedFromLine />
                                {viewType !== 'outbox' && (
                                    <Box onClick={(e) => e.stopPropagation()} flexShrink={0} w="32px" display="flex" justifyContent="center">
                                        <TableActionMenu row={data} actionItems={actionItems} />
                                    </Box>
                                )}
                            </HStack>

                            {/* Row 3: total locations + services | spacer | received on */}
                            <HStack w="full" spacing={3} align="center">
                                <LocationServicesBadges />
                                <Box flex={1} />
                                <ReceivedOnLine />
                                <Box w="32px" flexShrink={0} />
                            </HStack>
                        </VStack>
                    </HStack>
                </Box>

                {/* ── WHITE BOTTOM SECTION (only when expanded — Total Locations onwards) ── */}
                {isExpanded && (
                    <Box
                        bg="#FFFFFF"
                        borderRight="1.5px solid #EFDD9D"
                        borderLeft="1.5px solid #EFDD9D"
                        borderBottom="1.5px solid #EFDD9D"
                        borderBottomRadius="md"
                        px={4}
                        py={3}
                    >
                        {isExpandLoading ? (
                            <Box display="flex" justifyContent="center" py={4} position="relative">
                                <Spinner size="md" color="#8D0247" />
                            </Box>
                        ) : (
                            <HStack w="full" spacing={3} align="stretch" position="relative">
                                <Box flexShrink={0} minW="32px" />
                                <VStack flex={1} minW={0} align="stretch" spacing={3}>
                                    {/* Row 3 (white): Meetings | Dispositions | More... | Proposal | PO | Amount */}
                                    <HStack w="full" spacing={3} align="center">
                                        {meetings.length > 0 && (
                                            <HStack
                                                spacing={1}
                                                align="center"
                                                cursor="pointer"
                                                flexShrink={0}
                                                mr={3}
                                                onClick={(e) => { e.stopPropagation(); setIsMeetingHistoryOpen(true); }}
                                            >
                                                {CardTickIcon && <CardTickIcon width="14px" height="14px" style={{ color: '#008A32' }} />}
                                                <Text fontSize="16px" fontWeight="semibold" color="#232F50">{t('meetings')}</Text>
                                            </HStack>
                                        )}

                                        {dispositionsToRender.slice(0, 3).map((item) => {
                                            const style = getDispositionStyle(item.disposition);
                                            return (
                                                <HStack
                                                    key={item.disposition}
                                                    spacing={2}
                                                    px={3}
                                                    py="3px"
                                                    borderRadius="full"
                                                    bg={style.bg}
                                                    border={style.border}
                                                    {...(style.shadow && { boxShadow: style.shadow })}
                                                    flexShrink={0}
                                                    mr={3}
                                                    cursor="pointer"
                                                    onClick={(e) => { e.stopPropagation(); setActiveDispositionCode(item.disposition); setIsDispositionOpen(true); }}
                                                >
                                                    <Box as="span" w="8px" h="8px" borderRadius="full" bg="#FD1C7A" flexShrink={0} />
                                                    <Text fontSize="14px" fontWeight="600" color={style.text}>{formatStatusLabel(item.disposition)}</Text>
                                                    <Box minW="22px" minH="22px" borderRadius="full" bg={style.countBg} display="flex" alignItems="center" justifyContent="center" px={1}>
                                                        <Text fontSize="xs" fontWeight="700" color={style.text} lineHeight="1">{item.count}</Text>
                                                    </Box>
                                                </HStack>
                                            );
                                        })}

                                        {dispositionsToRender.length > 3 && (
                                            <Text
                                                fontSize="14px"
                                                fontWeight="400"
                                                color="#7C7C7C"
                                                cursor="pointer"
                                                flexShrink={0}
                                                mr={5}
                                                onClick={(e) => { e.stopPropagation(); setActiveDispositionCode(null); setIsDispositionOpen(true); }}
                                            >
                                                {t('more')}...
                                            </Text>
                                        )}

                                        <HStack spacing={5} align="center" flexShrink={0} ml="auto">
                                            {(() => {
                                                const proposalEntries = Object.entries(proposals)
                                                    .filter(([, v]) => v?.proposalStatus && v?.proposalStatus !== 'DRAFT')
                                                    .sort((a, b) => parseInt(a[0].replace('version', '')) - parseInt(b[0].replace('version', '')));
                                                if (!proposalEntries.length) return null;
                                                const [latestKey, latestProposal] = proposalEntries[proposalEntries.length - 1];
                                                const latestLabel = latestKey.replace('version', 'V');
                                                const latestVersion = parseInt(latestKey.replace('version', ''), 10);
                                                const latestProposalStatus = latestProposal?.proposalStatus;
                                                return (
                                                    <HStack spacing={1} align="center" flexShrink={0} mr={5}>
                                                        <Text
                                                            fontSize="16px"
                                                            fontWeight="semibold"
                                                            color="#232F50"
                                                            cursor={isProposalPreviewLoading ? 'wait' : 'pointer'}
                                                            opacity={isProposalPreviewLoading ? 0.6 : 1}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isProposalPreviewLoading) return;
                                                                setSelectedProposalStatus(latestProposalStatus);
                                                                setSelectedPreviewVersion(latestVersion);
                                                                dispatch(fetchProposalSendPreview({
                                                                    enquiryId,
                                                                    version: latestVersion,
                                                                    onSuccess: (d) => { setProposalPreviewData(d); setIsProposalPreviewOpen(true); }
                                                                }));
                                                            }}
                                                        >
                                                            {t('proposal')} {latestLabel}
                                                        </Text>
                                                        {isProposalPreviewLoading && <Spinner size="xs" color="#8D0247" />}
                                                        <Box
                                                            display="inline-flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            bg="gray.100"
                                                            borderRadius="full"
                                                            w="30px"
                                                            h="30px"
                                                            cursor="pointer"
                                                            _hover={{ bg: 'primary.500', color: 'white' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.navigate({
                                                                    to: '/app/corporate/proposals-list/$enquiryId',
                                                                    params: { enquiryId }
                                                                });
                                                            }}
                                                        >
                                                            <ThreeDotActionIcon translate="5px 5px" />
                                                        </Box>
                                                    </HStack>
                                                );
                                            })()}

                                            {purchaseOrders.length > 0 && hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_VIEW_PURCHASE_ORDER) && (() => {
                                                const sortedPOs = [...purchaseOrders].sort((a, b) => a.version - b.version);
                                                const latestPO = sortedPOs[sortedPOs.length - 1];
                                                return (
                                                    <HStack spacing={1} align="center" flexShrink={0} mr={5}>
                                                        <Text
                                                            fontSize="16px"
                                                            fontWeight="semibold"
                                                            color="#232F50"
                                                            cursor={isPoPdfLoading ? 'wait' : 'pointer'}
                                                            opacity={isPoPdfLoading ? 0.6 : 1}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (isPoPdfLoading) return;
                                                                dispatch(generatePoPdf({
                                                                    enquiryId,
                                                                    version: latestPO.version,
                                                                    onSuccess: (d) => { setPoPreviewData(d); setIsPOPreviewOpen(true); }
                                                                }));
                                                            }}
                                                        >
                                                            {t('purchaseOrder')} (V{latestPO.version})
                                                        </Text>
                                                        {isPoPdfLoading && <Spinner size="xs" color="#8D0247" />}
                                                        <Box
                                                            display="inline-flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            bg="gray.100"
                                                            borderRadius="full"
                                                            w="30px"
                                                            h="30px"
                                                            cursor="pointer"
                                                            _hover={{ bg: 'primary.500', color: 'white' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.navigate({
                                                                    to: '/app/corporate/purchase-orders-list/$enquiryId',
                                                                    params: { enquiryId }
                                                                });
                                                            }}
                                                        >
                                                            <ThreeDotActionIcon translate="5px 5px" />
                                                        </Box>
                                                    </HStack>
                                                );
                                            })()}

                                            {(() => {
                                                const nonDraftEntries = Object.entries(proposals)
                                                    .filter(([, v]) => v?.proposalStatus && v?.proposalStatus !== 'DRAFT')
                                                    .sort((a, b) => parseInt(a[0].replace('version', '')) - parseInt(b[0].replace('version', '')));
                                                if (!nonDraftEntries.length) return null;
                                                const latestVersion = nonDraftEntries[nonDraftEntries.length - 1][1];
                                                const versionAmount = latestVersion?.overAllTotalIncludeGst ?? latestVersion?.totalAmount ?? latestVersion?.totalIncludeGst ?? totalProposalAmount;
                                                if (!versionAmount) return null;
                                                return (
                                                    <Text fontSize="16px" color="#232F50" flexShrink={0}>
                                                        {t('amount')}: <Text as="span" fontWeight="bold">{versionAmount}</Text>
                                                    </Text>
                                                );
                                            })()}
                                        </HStack>
                                    </HStack>
                                </VStack>
                            </HStack>
                        )}
                    </Box>
                )}
            </Box>

            <SummaryNotesPopup isOpen={isNotesOpen} setIsOpen={setIsNotesOpen} enquiryId={enquiryId} />

            <PurchaseOrderPreviewPopup
                isOpen={isPOPreviewOpen}
                data={poPreviewData}
                onCancel={() => { setIsPOPreviewOpen(false); setPoPreviewData(null); }}
                navigateOnClose={false}
            />

            <CustomerMappingPopup
                isOpen={isCustomerVerificationOpen}
                setIsOpen={setIsCustomerVerificationOpen}
                enquiryId={enquiryId}
                customerId={data.customerId}
                companyName={data.companyName}
            />

            <CorporateMeetingPopup
                isOpen={isMeetingPopupOpen}
                setIsOpen={setIsMeetingPopupOpen}
                enquiryId={enquiryId}
                enquiryDate={createdDate}
                customerId={data.customerId}
                contactName={data.contactName}
                contactNumber={data.contactNumber}
            />

            <CorporateMeetingHistoryPopup isOpen={isMeetingHistoryOpen} setIsOpen={setIsMeetingHistoryOpen} enquiryId={enquiryId} />

            <CorporateVerifiedCustomerPopup isOpen={isVerifiedCustomerOpen} setIsOpen={setIsVerifiedCustomerOpen} customerId={customerId} />

            <TrackEnquiryPopup
                isOpen={isTrackEnquiryOpen}
                onClose={() => setIsTrackEnquiryOpen(false)}
                data={{
                    customerName: data.companyName ?? '',
                    status: data.status ?? '',
                    dateOfEnquiry: data.createdDate ?? '',
                    plan: Array.isArray(data.requestedServices)
                        ? data.requestedServices.map((s) => s.serviceName ?? s).join(', ')
                        : data.requestedServices ?? '',
                    slNo: trackingId || enqId || enquiryId
                }}
            />

            <CorporateDispositionPopup
                isOpen={isDispositionOpen}
                setIsOpen={setIsDispositionOpen}
                enquiryId={enquiryId}
                dispositionCode={activeDispositionCode}
            />

            <CorporateReturnToPopup
                isOpen={isReturnToOpen}
                setIsOpen={setIsReturnToOpen}
                enquiryId={enquiryId}
            />

            <CorporateProposalPreviewPopup
                isOpen={isProposalPreviewOpen}
                enquiryId={enquiryId}
                data={proposalPreviewData}
                version={selectedPreviewVersion}
                proposalStatus={selectedProposalStatus}
                isLoading={isProposalUpdating}
                onCancel={() => { setIsProposalPreviewOpen(false); setProposalPreviewData(null); setSelectedProposalStatus(null); setSelectedPreviewVersion(null); }}
                onEdit={() => {
                    dispatch(sliceActions.setProposalParams({
                        enquiryId,
                        locationIds: [],
                        companyName: companyName || '',
                        contactPerson: contactName || ''
                    }));
                    setIsProposalPreviewOpen(false);
                    setProposalPreviewData(null);
                    router.navigate({ to: '/app/corporate/proposals/proposal-cards', search: { enquiryId } });
                }}
                onCreate={() => {
                    dispatch(updateProposalStatus({
                        enquiryId,
                        version: selectedPreviewVersion,
                        status: 'CREATED',
                        revisedProposalStatus: false,
                        onSuccess: () => {
                            setIsProposalPreviewOpen(false);
                            setProposalPreviewData(null);
                            const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
                            const seatId = tokenData?.seatId ?? null;
                            dispatch(fetchCorporateEnquiryList({ ...(seatId && { seatId }) }));
                        }
                    }));
                }}
                onSendToCustomer={() => {
                    setIsProposalPreviewOpen(false);
                    setProposalPreviewData(null);
                    setIsDispatchOpen(true);
                }}
                onUpdatePo={() => {
                    setIsProposalPreviewOpen(false);
                    setProposalPreviewData(null);
                    router.navigate({
                        to: '/app/corporate/proposals/create-po/$proposalId',
                        params: { proposalId: enquiryId },
                        state: {
                            proposalName: proposalName ?? '',
                            customerId: customerId ?? '',
                            customerName: customerName ?? companyName ?? '',
                            version: selectedPreviewVersion
                        }
                    });
                }}
                onRevise={() => {
                    const proposalEntries = Object.entries(proposals)
                        .filter(([, v]) => v?.proposalStatus && v?.proposalStatus !== 'DRAFT')
                        .sort((a, b) => parseInt(a[0].replace('version', '')) - parseInt(b[0].replace('version', '')));
                    const latestProposal = proposalEntries[proposalEntries.length - 1]?.[1];
                    const reviseLocationIds = latestProposal?.locations?.map(l => l.locationId).filter(Boolean) ?? [];
                    sessionStorage.setItem('proposalLocationIDs', JSON.stringify(reviseLocationIds));
                    dispatch(sliceActions.setProposalParams({
                        enquiryId,
                        locationIds: reviseLocationIds,
                        companyName: companyName || '',
                        contactPerson: contactName || ''
                    }));
                    setIsProposalPreviewOpen(false);
                    setProposalPreviewData(null);
                    router.navigate({ to: '/app/corporate/proposals/proposal-cards/revise-proposal', search: { enquiryId } });
                }}
            />

            <CorporateProposalDispatchPopup
                isOpen={isDispatchOpen}
                onClose={() => setIsDispatchOpen(false)}
                enquiryId={enquiryId}
                version={selectedPreviewVersion}
            />

            <CorporateProposalPreviewPopup
                isOpen={isRevisePreviewOpen}
                data={revisePreviewData}
                isReviseMode
                onCancel={() => { setIsRevisePreviewOpen(false); setRevisePreviewData(null); }}
                onRevise={() => {
                    const proposalEntries = Object.entries(proposals)
                        .filter(([, v]) => v?.proposalStatus && v?.proposalStatus !== 'DRAFT')
                        .sort((a, b) => parseInt(a[0].replace('version', '')) - parseInt(b[0].replace('version', '')));
                    const latestProposal = proposalEntries[proposalEntries.length - 1]?.[1];
                    const reviseLocationIds = latestProposal?.locations?.map(l => l.locationId).filter(Boolean) ?? [];
                    sessionStorage.setItem('proposalLocationIDs', JSON.stringify(reviseLocationIds));
                    dispatch(sliceActions.setProposalParams({
                        enquiryId,
                        locationIds: reviseLocationIds,
                        companyName: companyName || '',
                        contactPerson: contactName || ''
                    }));
                    setIsRevisePreviewOpen(false);
                    setRevisePreviewData(null);
                    router.navigate({ to: '/app/corporate/proposals/proposal-cards/revise-proposal', search: { enquiryId } });
                }}
            />

            <Popup
                isOpen={isKycPendingOpen}
                size="sm"
                maxW="500px"
                onOpenChange={(open) => setIsKycPendingOpen(open)}
            >
                <Box px={4} pb={6}>
                    <VStack spacing={5} align="center">
                        <Box>
                            <img src={infoImg} alt="info" style={{ width: '160px', height: 'auto' }} />
                        </Box>
                        <Text fontSize="xl" fontWeight="bold" color="#0F1121">
                            {t('information')}
                        </Text>
                        <Text fontSize="md" color="gray.600" textAlign="center" lineHeight="tall">
                            {t('kycDetailsPending')}
                        </Text>
                        <HStack spacing={4} mt={2}>
                            <Button
                                variant="outline"
                                borderColor="#8D0247"
                                color="#8D0247"
                                px={8}
                                h="45px"
                                minW="140px"
                                borderRadius="full"
                                _hover={{ bg: '#fdf0f4' }}
                                onClick={() => setIsKycPendingOpen(false)}
                            >
                                <BsXCircle style={{ marginRight: '8px', width: '20px', height: '20px' }} />
                                {t('cancel')}
                            </Button>
                            <Button
                                bg="#8D0247"
                                color="white"
                                px={8}
                                h="45px"
                                minW="140px"
                                borderRadius="full"
                                _hover={{ bg: '#700138' }}
                                onClick={() => {
                                    setIsKycPendingOpen(false);
                                    router.navigate({
                                        to: '/app/corporate/customers/create-customer',
                                        search: { enquiryId: enquiryId }
                                    });
                                }}
                            >
                                {t('ok')}
                                <BsCheckCircle style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Popup>

        </HStack>
    );
};

export default EnquiryCardItem;
