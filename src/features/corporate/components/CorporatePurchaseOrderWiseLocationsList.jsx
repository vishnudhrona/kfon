import { Box, HStack, Icons, Popover, Text, VStack } from '@kfonbss/bss-ui-components';
import { useLocation, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import ChildCardBg from '@/assets/corporate/ChildCardBg.png';
import { DetailSummaryCard } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { DATE_FORMAT } from '@/constants/date';
import { router } from '@/routes/routes';
import { dayjs } from '@/utils/dateUtils';

import { fetchEnquiryLocationsSummary, fetchPurchaseOrderDetails } from '../action';
import { getEnquiryLocations, getPurchaseOrderDetails } from '../selector';
import CorporateGenericCardList from './CorporateGenericCardList';
import AssignToPopup from './popUps/AssignToPopup';
import CorporateFeasibilityPopup from './popUps/CorporateFeasibilityPopup';
import DispositionPopup from './popUps/DispositionPopup';

const STATUS_LABELS = {
    OPEN: 'Open',
    CLOSED: 'Closed',
    PENDING: 'Pending',
    FEASIBLE: 'Feasible',
    NOT_FEASIBLE: 'Not Feasible',
    PO_RECEIVED: 'PO Received',
    APPROVED: 'Approved'
};

const STATUS_TONES = {
    PO_RECEIVED: { bg: '#EAF7EF', color: '#1F8A4D', dot: '#27AE60', border: '1px solid #C5E5D3' },
    APPROVED: { bg: '#EAF7EF', color: '#1F8A4D', dot: '#27AE60', border: '1px solid #C5E5D3' },
    FEASIBLE: { bg: '#EAF7EF', color: '#1F8A4D', dot: '#27AE60', border: '1px solid #C5E5D3' }
};
const STATUS_DEFAULT = { bg: '#FFFFFF', color: '#8D0247', dot: '#FD1C7A', border: '1px solid #F0E1E7' };

const Sep = () => <Box h='18px' w='1px' bg='rgba(130,130,130,0.19)' flexShrink={0} />;

const formatStatusLabel = (status) =>
    STATUS_LABELS[status] ??
    (status ? status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : '-');

const StatusBadge = ({ status }) => {
    const tone = STATUS_TONES[status] ?? STATUS_DEFAULT;
    return (
        <Box
            display='inline-flex'
            alignItems='center'
            gap='6px'
            px={3}
            py='3px'
            borderRadius='full'
            bg={tone.bg}
            color={tone.color}
            border={tone.border}
            fontSize='12px'
            fontWeight='600'
            flexShrink={0}
        >
            <Box as='span' w='8px' h='8px' borderRadius='full' bg={tone.dot} />
            {formatStatusLabel(status)}
        </Box>
    );
};

const ProvisioningLocationRow = ({ row, index, t, onClick, onDisposition, onNearestLocation, actionItems = [] }) => {
    const { MobileNewIcon, NewEmailIcon, CardUserIcon, AddressCardIcon, CardViewIcon } = Icons;
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);

    const indexLabel = String(index + 1).padStart(2, '0');
    const createdAt = row?.createdAt && dayjs(row.createdAt).isValid()
        ? dayjs(row.createdAt).format(DATE_FORMAT.DATE_TIME)
        : (row?.createdAt || '-');
    const status = row?.locStatus || 'OPEN';
    const dispositionLabel = row?.dispositionCode ? formatStatusLabel(row.dispositionCode) : null;

    return (
        <Box
            bg='#FFFDF6'
            borderRadius='md'
            border='1.5px solid #E1E1E1'
            borderTop='1.5px solid #66D08F7A'
            px={4}
            py={3}
            mb={3}
            cursor='pointer'
            onClick={() => onClick?.(row)}
            _hover={{ boxShadow: 'md' }}
            position='relative'
            backgroundImage={`linear-gradient(rgba(255,253,246,0.3), rgba(255,253,246,0.3)), url(${ChildCardBg})`}
            backgroundRepeat='no-repeat'
            backgroundPosition='center'
            backgroundSize='cover'
        >
            <HStack w='full' spacing={4} align='flex-start' position='relative'>
                <Box flexShrink={0} minW='32px' display='flex' alignItems='center' justifyContent='center' alignSelf='center'>
                    <Text fontWeight='bold' fontSize='md' color='gray.600'>{indexLabel}</Text>
                </Box>

                <VStack flex={1} minW={0} align='stretch' spacing={2}>
                    {/* Row 1: locName | serviceName | (packageName) | spacer | Received from */}
                    <HStack w='full' spacing={3} align='center' flexWrap='wrap'>
                        <Text fontWeight='700' fontSize='16px' color='gray.900' flexShrink={0}>
                            {row?.locName || '-'}
                        </Text>
                        {row?.serviceName && (
                            <>
                                <Sep />
                                <Text fontWeight='500' fontSize='16px' color='#8D0247'>
                                    {row.serviceName}
                                </Text>
                            </>
                        )}
                        {row?.packageName && (
                            <>
                                <Sep />
                                <Text fontWeight='500' fontSize='16px' color='#8D0247'>
                                    {row.packageName}
                                </Text>
                            </>
                        )}
                        <Box flex={1} />
                        <Text fontSize='14px' fontWeight='400' color='#232F50' flexShrink={0}>
                            {t('receivedFrom')}:{' '}
                            <Text as='span' fontWeight='600'>
                                {row?.receivedFromName || row?.source || row?.receivedFrom || '-'}
                            </Text>
                            {row?.receivedFromDesignation && (
                                <Text as='span' fontWeight='400' color='gray.500'> {row.receivedFromDesignation}</Text>
                            )}
                        </Text>
                        {actionItems.length > 0 && (
                            <Box onClick={(e) => e.stopPropagation()} flexShrink={0} w='32px' display='flex' justifyContent='center'>
                                <TableActionMenu row={row} actionItems={actionItems} />
                            </Box>
                        )}
                    </HStack>

                    {/* Row 2: contactPerson | mobile | email | address | spacer | Received on */}
                    <HStack w='full' spacing={3} align='center' flexWrap='wrap'>
                        <HStack spacing={1} flexShrink={0}>
                            {CardUserIcon && <CardUserIcon width='22px' height='22px' />}
                            <Text fontSize='14px' color='#5F5F5F' fontWeight='500'>
                                {row?.contactPerson || '-'}
                            </Text>
                        </HStack>
                        <Sep />
                        <HStack spacing={1} flexShrink={0}>
                            {MobileNewIcon && <MobileNewIcon width='22px' height='22px' style={{ color: '#919191' }} />}
                            <Text fontSize='14px' color='#5F5F5F' fontWeight='600'>{row?.mobile || '-'}</Text>
                        </HStack>
                        <Sep />
                        <HStack spacing={1} flexShrink={0}>
                            {NewEmailIcon && <NewEmailIcon width='22px' height='22px' style={{ color: '#919191' }} />}
                            <Text fontSize='14px' color='#5F5F5F' fontWeight='400'>{row?.email || '-'}</Text>
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
                                            cursor='pointer'
                                            flexShrink={0}
                                            onClick={(e) => e.stopPropagation()}
                                            onMouseEnter={() => setIsAddressOpen(true)}
                                            onMouseLeave={() => setIsAddressOpen(false)}
                                        >
                                            <AddressCardIcon width='22px' height='22px' style={{ color: '#919191' }} />
                                            <Text fontSize='14px' color='#5F5F5F' fontWeight='400'>
                                                {t('address')}
                                            </Text>
                                        </HStack>
                                    </Popover.Trigger>
                                    <Popover.Positioner>
                                        <Popover.Content
                                            minW='320px'
                                            maxW='400px'
                                            bg='white'
                                            boxShadow='md'
                                            border='1px solid'
                                            borderColor='gray.100'
                                            borderRadius='md'
                                        >
                                            <Popover.Body p={3}>
                                                <Text fontSize='sm' color='gray.800' fontWeight='medium'>
                                                    {row?.address || '-'}
                                                </Text>
                                            </Popover.Body>
                                        </Popover.Content>
                                    </Popover.Positioner>
                                </Popover.Root>
                            </>
                        )}
                        <Box flex={1} />
                        <Text fontSize='14px' fontWeight='400' color='#232F50' flexShrink={0}>
                            {t('receivedOn')}:{' '}
                            <Text as='span' fontWeight='600'>{createdAt}</Text>
                        </Text>
                    </HStack>

                    {/* Row 3: additionalServices | disposition | spacer | Nearest LNP | status */}
                    <HStack w='full' spacing={3} align='center' flexWrap='wrap'>
                        {Array.isArray(row?.additionalServices) && row.additionalServices.length > 0 && (
                            <Popover.Root
                                open={isAdditionalOpen}
                                onOpenChange={(e) => setIsAdditionalOpen(e.open)}
                                positioning={{ placement: 'bottom-start' }}
                            >
                                <Popover.Trigger asChild>
                                    <Box
                                        border='1px solid #DEDEDE'
                                        borderRadius='6px'
                                        px={3}
                                        py='2px'
                                        fontSize='13px'
                                        fontWeight='600'
                                        color='#232F50'
                                        bg='white'
                                        flexShrink={0}
                                        cursor='pointer'
                                        onClick={(e) => e.stopPropagation()}
                                        onMouseEnter={() => setIsAdditionalOpen(true)}
                                        onMouseLeave={() => setIsAdditionalOpen(false)}
                                    >
                                        {t('additionalServices')} ({row.additionalServices.length})
                                    </Box>
                                </Popover.Trigger>
                                <Popover.Positioner>
                                    <Popover.Content minW='340px' bg='white' boxShadow='lg' borderRadius='md'>
                                        <Popover.Arrow />
                                        <Popover.Body p={5}>
                                            {row.additionalServices.map((s, i) => (
                                                <Box key={i} mb={i < row.additionalServices.length - 1 ? 4 : 0}>
                                                    <HStack spacing={2} mb={2}>
                                                        <Text fontSize='sm' color='gray.500'>{t('serviceName')}:</Text>
                                                        <Text fontSize='md' fontWeight='700' color='#232F50'>{s.serviceName}</Text>
                                                    </HStack>
                                                    {Array.isArray(s.planIds) && s.planIds.length > 0 && (
                                                        <Box>
                                                            <Text fontSize='sm' color='gray.500' mb={2}>{t('packageName')}:</Text>
                                                            {s.planIds.map((p) => (
                                                                <Text key={p.id} fontSize='sm' fontWeight='600' color='#232F50' pl={3} mb={1}>
                                                                    • {p.planName}
                                                                </Text>
                                                            ))}
                                                        </Box>
                                                    )}
                                                </Box>
                                            ))}
                                        </Popover.Body>
                                    </Popover.Content>
                                </Popover.Positioner>
                            </Popover.Root>
                        )}
                        {dispositionLabel && (
                            <HStack
                                spacing={1}
                                flexShrink={0}
                                align='center'
                                cursor='pointer'
                                onClick={(e) => { e.stopPropagation(); onDisposition?.(row); }}
                            >
                                <Text fontSize='13px' fontWeight='400' color='#232F50'>
                                    {t('disposition')}: <Text as='span' fontWeight='700'>{dispositionLabel}</Text>
                                </Text>
                                {CardViewIcon && (
                                    <CardViewIcon width='20px' height='20px' style={{ color: '#232F50' }} />
                                )}
                            </HStack>
                        )}
                        <Box flex={1} />
                        <Text
                            fontSize='13px'
                            fontWeight='400'
                            color='#232F50'
                            flexShrink={0}
                            cursor='pointer'
                            onClick={(e) => { e.stopPropagation(); onNearestLocation?.(row); }}
                        >
                            {t('nearestLnp')}:{' '}
                            <Text as='span' fontWeight='600'>
                                {row?.nearestLnpName || t('notAvailable', 'N/A')}
                            </Text>
                        </Text>
                        <Text
                            fontSize='13px'
                            fontWeight='400'
                            color='#7C7C7C'
                            cursor='pointer'
                            flexShrink={0}
                            onClick={(e) => { e.stopPropagation(); onNearestLocation?.(row); }}
                        >
                            {t('more')}...
                        </Text>
                        <StatusBadge status={status} />
                    </HStack>
                </VStack>
            </HStack>
        </Box>
    );
};

const CorporatePurchaseOrderWiseLocationsList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enquiryId } = useParams({ strict: false });
    const routeState = useLocation({ select: (l) => l.state }) ?? {};
    const pathname = useLocation({ select: (l) => l.pathname }) ?? '';
    const version = routeState?.version;
    const stateLocationIds = routeState?.locationIds;
    const isCircuitProvisioningRoute = pathname.includes('circuit-provisioning');
    const isServiceProvisioningRoute = pathname.includes('service-provisioning') && !pathname.includes('circuit-provisioning');
    const isProvisioningRoute = isCircuitProvisioningRoute || isServiceProvisioningRoute;

    const [isAssignToOpen, setIsAssignToOpen] = useState(false);
    const [isFeasibilityOpen, setIsFeasibilityOpen] = useState(false);
    const [isDispositionOpen, setIsDispositionOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [assignLocationIds, setAssignLocationIds] = useState([]);

    const poDetails = useSelector(getPurchaseOrderDetails);
    const poData = poDetails?.data;

    const enquiryLocations = useSelector(getEnquiryLocations);
    const allLocations = Array.isArray(enquiryLocations?.data) ? enquiryLocations.data : [];

    const activeLocationIds = stateLocationIds?.length ? stateLocationIds : poData?.locationIds;
    const filteredLocations = activeLocationIds?.length
        ? allLocations.filter((loc) => activeLocationIds.includes(loc.id))
        : allLocations;

    const isPageLoading = !!(poDetails?.isLoading);

    useEffect(() => {
        if (enquiryId && version) {
            dispatch(fetchPurchaseOrderDetails({ enquiryId, version }));
        }
        if (enquiryId) {
            dispatch(fetchEnquiryLocationsSummary({ enquiryId }));
        }
    }, [dispatch, enquiryId, version]);

    const handleNearestLocation = (location) => {
        setSelectedLocation(location);
        setIsFeasibilityOpen(true);
    };

    const handleDisposition = (location) => {
        setSelectedLocation(location);
        setIsDispositionOpen(true);
    };

    const handleCardAssignTo = (location) => {
        setAssignLocationIds([location.id]);
        setIsAssignToOpen(true);
    };

    const handleCircuitProvisioning = (location) => {
        router.navigate({
            to: '/app/corporate/circuit-provisioning/$enquiryId',
            params: { enquiryId: location.enquiryId ?? enquiryId },
            state: { locationId: location.id ?? location.locationId, version }
        });
    };

    const handleServiceProvisioning = (location) => {
        router.navigate({
            to: '/app/corporate/service-provisioning/$enquiryId',
            params: { enquiryId: location.enquiryId ?? enquiryId },
            state: { locationId: location.id ?? location.locationId, version }
        });
    };

    const provisioningActionItems = isProvisioningRoute
        ? [
            {
                label: isCircuitProvisioningRoute ? 'circuitProvisioning' : 'serviceProvisioning',
                onClick: (row) => (isCircuitProvisioningRoute ? handleCircuitProvisioning : handleServiceProvisioning)(row)
            }
        ]
        : [];

    const summaryData = {
        poNumber: poData?.poNumber ?? '-',
        proposalName: poData?.proposalName ?? '-',
        customerName: poData?.customerName ?? '-',
        poDate: poData?.poDate ?? '-',
        poStartDate: poData?.poStartDate ?? '-',
        poEndDate: poData?.poEndDate ?? '-',
        remarks: poData?.remarks ?? '-',
        locationsCount: filteredLocations.length
    };

    const config = {
        header: {
            badge: {
                key: 'poNumber',
                label: 'poNumber',
                bg: '#FFDE74',
                textColor: 'black'
            },
            title: {
                key: 'proposalName',
                style: { color: '#2D3748' }
            },
            fields: [
                { key: 'customerName', label: 'customerName', labelStyle: { fontWeight: '500', color: '#515151' } }
            ],
            meta: [
                { key: 'poDate', label: 'poDate' },
                { key: 'poStartDate', label: 'poStartDate' },
                { key: 'poEndDate', label: 'poEndDate' }
            ]
        },
        body: {
            fields: [
                { key: 'remarks', label: 'remarks', labelStyle: { fontWeight: 'bold', color: '#515151' } }
            ],
            actions: [
                { label: 'locationsAdded', valueKey: 'locationsCount' }
            ]
        }
    };

    return (
        <CustomLoaderProvider isLoading={isPageLoading}>
            <Box>
                <DetailSummaryCard data={summaryData} config={config} />
                <Box mt={4}>
                    {isProvisioningRoute ? (
                        filteredLocations.length === 0 ? (
                            <Box bg='white' borderRadius='md' border='1px solid #E1E1E1' py={10}>
                                <Text textAlign='center' color='gray.500'>{t('noLocationsFound', 'No locations found')}</Text>
                            </Box>
                        ) : (
                            filteredLocations.map((loc, idx) => (
                                <ProvisioningLocationRow
                                    key={loc?.id ?? `${loc?.locName}-${idx}`}
                                    row={loc}
                                    index={idx}
                                    t={t}
                                    onClick={isCircuitProvisioningRoute ? handleCircuitProvisioning : handleServiceProvisioning}
                                    onDisposition={handleDisposition}
                                    onNearestLocation={handleNearestLocation}
                                    actionItems={provisioningActionItems}
                                />
                            ))
                        )
                    ) : (
                        <CorporateGenericCardList
                            data={filteredLocations}
                            onCardAssignTo={handleCardAssignTo}
                            onNearestLocation={handleNearestLocation}
                            onDisposition={handleDisposition}
                            onCircuitProvisioning={isCircuitProvisioningRoute ? handleCircuitProvisioning : undefined}
                            onServiceProvisioning={isServiceProvisioningRoute ? handleServiceProvisioning : undefined}
                            emptyLabel={t('noLocationsFound', 'No locations found')}
                            hideSelection={isProvisioningRoute}
                        />
                    )}
                </Box>
                <AssignToPopup
                    isOpen={isAssignToOpen}
                    setIsOpen={setIsAssignToOpen}
                    enquiryId={enquiryId}
                    locationIds={assignLocationIds}
                />
                <CorporateFeasibilityPopup
                    isOpen={isFeasibilityOpen}
                    onClose={() => { setIsFeasibilityOpen(false); setSelectedLocation(null); }}
                    enquiryId={enquiryId}
                    locationId={selectedLocation?.id}
                />
                <DispositionPopup
                    isOpen={isDispositionOpen}
                    setIsOpen={(open) => { setIsDispositionOpen(open); if (!open) setSelectedLocation(null); }}
                    enquiryId={enquiryId}
                    locationId={selectedLocation?.id}
                    onSuccess={() => {
                        if (enquiryId) dispatch(fetchEnquiryLocationsSummary({ enquiryId }));
                    }}
                />
            </Box>
        </CustomLoaderProvider>
    );
};

export default CorporatePurchaseOrderWiseLocationsList;
