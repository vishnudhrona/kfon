import {
    Box, Button, HStack, Icons, Popover, Text, VStack
} from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { CustomCheckbox } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import SearchInput from '@/components/custom/SearchInput';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { showToast } from '@/components/custom/Toast';
import { STORAGE_KEYS } from '@/constants';
import { DATE_FORMAT } from '@/constants/date';
import { usePageActions } from '@/hooks/usePageActions';
import { dayjs } from '@/utils/dateUtils';
import { getTokenData } from '@/utils/encryptionUtils';

import { downloadEnquiryListCsv, fetchLocationsBySeat } from '../action';
import { getEnquiryLocations } from '../selector';
import AddCorporateLocation from './AddCorporateLocation';
import AssignToPopup from './popUps/AssignToPopup';
import CorporateFeasibilityPopup from './popUps/CorporateFeasibilityPopup';
import CorporateReturnToPopup from './popUps/CorporateReturnToPopup';
import DispositionPopup from './popUps/DispositionPopup';

const statusColorMap = {
    Open: '#AC5013', OPEN: '#AC5013',
    Pending: '#AC5013', PENDING: '#AC5013',
    Closed: '#9B1C1C', CLOSED: '#9B1C1C',
    Connected: '#166534', CONNECTED: '#166534',
    Feasible: '#166534', FEASIBLE: '#166534',
    'In Progress': '#AC5013', 'IN PROGRESS': '#AC5013',
    Rejected: '#9B1C1C', REJECTED: '#9B1C1C',
    NOT_INTERESTED: '#9B1C1C', 'Not Interested': '#9B1C1C',
    RE_ASSIGN: '#AC5013', 'Re-Assign': '#AC5013'
};
const statusBgMap = {
    Open: '#FFE1CD', OPEN: '#FFE1CD',
    Pending: '#FFE1CD', PENDING: '#FFE1CD',
    Closed: '#FEE2E2', CLOSED: '#FEE2E2',
    Connected: '#DCFCE7', CONNECTED: '#DCFCE7',
    Feasible: '#DCFCE7', FEASIBLE: '#DCFCE7',
    'In Progress': '#FFE1CD', 'IN PROGRESS': '#FFE1CD',
    Rejected: '#FEE2E2', REJECTED: '#FEE2E2',
    NOT_INTERESTED: '#FEE2E2', 'Not Interested': '#FEE2E2',
    RE_ASSIGN: '#FFE1CD', 'Re-Assign': '#FFE1CD'
};

const STATUS_LABEL_MAP = {
    NOT_INTERESTED: 'Not Interested',
    RE_ASSIGN: 'Re-Assign'
};

const formatStatus = (status) =>
    STATUS_LABEL_MAP[status] ?? status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const Sep = () => <Box h="20px" w="1px" bg="rgba(130,130,130,0.19)" flexShrink={0} />;

const LocationCard = ({ data, index, isSelected, onSelect, onEdit, onDisposition, onReturnTo, onCardAssignTo, onNearestConnection }) => {
    const { t } = useTranslation();
    const { MobileNewIcon, NewEmailIcon, CardUserIcon, AddressCardIcon, DownArrowIcon, UpArrowIcon } = Icons;

    const { hasPermission } = usePageActions();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);

    const status = data.locStatus || 'OPEN';
    const statusColor = statusColorMap[status] || '#AC5013';
    const statusBg = statusBgMap[status] || '#FFE1CD';
    const indexLabel = String(index).padStart(2, '0');

    const formattedDate = data.createdAt
        ? dayjs(data.createdAt).isValid()
            ? dayjs(data.createdAt).format(DATE_FORMAT.DATE_TIME)
            : data.createdAt
        : '-';

    const collapseAndRun = (fn) => () => { setIsExpanded(false); fn(); };

    const actionItems = [
        { label: 'edit', onClick: collapseAndRun(() => onEdit?.(data)) },
        { label: 'returnTo', onClick: collapseAndRun(() => onReturnTo?.(data)) },
        { label: 'assignTo', onClick: collapseAndRun(() => onCardAssignTo?.(data)) },
        { label: 'dispositions', onClick: collapseAndRun(() => onDisposition?.(data)) },
        { label: 'nearestConnection', onClick: collapseAndRun(() => onNearestConnection?.(data)), hidden: !hasPermission('nearest_connection') }
    ];

    const ToggleBtn = () => (
        <Button
            variant="ghost"
            onClick={(e) => { e.stopPropagation(); setIsExpanded((prev) => !prev); }}
            p={1} borderRadius="full" _hover={{ bg: 'gray.100' }}
            display="flex" alignItems="center" justifyContent="center"
            flexShrink={0} minW="unset" h="unset"
        >
            {isExpanded ? <UpArrowIcon /> : <DownArrowIcon />}
        </Button>
    );

    return (
        <HStack w="full" spacing={3} alignItems="center" mb={3}>
            <CustomCheckbox checked={isSelected} onCheckedChange={onSelect} />
            <Box
                flex={1} bg="white" px={4} py={3} borderRadius="md"
                boxShadow="sm" border="1px solid" borderColor="gray.200"
                _hover={{ boxShadow: 'md' }}
            >
                {/* COLLAPSED */}
                {!isExpanded && (
                    <HStack w="full" spacing={3} align="center">
                        <Text fontWeight="bold" fontSize="md" color="gray.600" flexShrink={0} minW="28px">{indexLabel}</Text>
                        <Text fontWeight="700" fontSize="16px" color="gray.900" flexShrink={0}>{data.locName || '-'}</Text>
                        <Sep />
                        <Text fontWeight="500" fontSize="16px" color="#8D0247" flexShrink={0}>{data.serviceName || '-'}</Text>
                        <Sep />
                        <Text fontSize="16px" fontWeight="400" color="#232F50" flexShrink={0}>
                            {t('receivedOn')}:{' '}
                            <Text as="span" fontWeight="600" fontSize="16px">{formattedDate}</Text>
                        </Text>
                        <Box flex={1} />
                        <Box px={4} py="2px" borderRadius="full" bg={statusBg} color={statusColor}
                            fontSize="sm" fontWeight="600" border={`1px solid ${statusColor}33`} flexShrink={0}>
                            {formatStatus(status)}
                        </Box>
                        <ToggleBtn />
                    </HStack>
                )}

                {/* EXPANDED */}
                {isExpanded && (
                    <HStack w="full" spacing={3} align="center">
                        <Text fontWeight="bold" fontSize="md" color="gray.600" flexShrink={0} minW="28px" alignSelf="center">
                            {indexLabel}
                        </Text>
                        <VStack flex={1} align="stretch" spacing={0}>
                            {/* ROW 1 */}
                            <HStack w="full" spacing={3} align="center">
                                <Text fontWeight="700" fontSize="16px" color="gray.900" flexShrink={0}>{data.locName || '-'}</Text>
                                <Sep />
                                <Text fontWeight="500" fontSize="16px" color="#8D0247" flexShrink={0}>{data.serviceName || '-'}</Text>
                                {data.packageName && (
                                    <>
                                        <Sep />
                                        <Text fontWeight="500" fontSize="16px" color="#8D0247" flexShrink={0}>{data.packageName}</Text>
                                    </>
                                )}
                                <Box flex={1} />
                                {Array.isArray(data.additionalServices) && data.additionalServices.length > 0 && (
                                    <Popover.Root
                                        open={isAdditionalOpen}
                                        onOpenChange={(e) => setIsAdditionalOpen(e.open)}
                                        positioning={{ placement: 'bottom-start' }}
                                    >
                                        <Popover.Trigger asChild>
                                            <Box
                                                border="1px solid #DEDEDE" borderRadius="6px" px={3} py="2px"
                                                fontSize="14px" fontWeight="600" color="#232F50" bg="white"
                                                flexShrink={0} cursor="pointer"
                                                onMouseEnter={() => setIsAdditionalOpen(true)}
                                                onMouseLeave={() => setIsAdditionalOpen(false)}
                                            >
                                                {t('additionalServices')} ({data.additionalServices.length})
                                            </Box>
                                        </Popover.Trigger>
                                        <Popover.Positioner>
                                            <Popover.Content
                                                width="auto" minW="200px" bg="white" boxShadow="lg" borderRadius="md"
                                                onMouseEnter={() => setIsAdditionalOpen(true)}
                                                onMouseLeave={() => setIsAdditionalOpen(false)}
                                            >
                                                <Popover.Arrow />
                                                <Popover.Body p={4}>
                                                    {data.additionalServices.map((s, i) => (
                                                        <Box key={i} mb={i < data.additionalServices.length - 1 ? 2 : 0}>
                                                            <Text fontSize="sm" fontWeight="600" color="#232F50">{s.serviceName}</Text>
                                                            {Array.isArray(s.planIds) && s.planIds.map((p) => (
                                                                <Text key={p.id} fontSize="xs" color="gray.500">• {p.planName}</Text>
                                                            ))}
                                                        </Box>
                                                    ))}
                                                </Popover.Body>
                                            </Popover.Content>
                                        </Popover.Positioner>
                                    </Popover.Root>
                                )}
                                <ToggleBtn />
                            </HStack>

                            <VStack w="full" align="stretch" spacing={0} mt={4}>
                                {/* ROW 2 */}
                                <HStack w="full" spacing={3} align="center" mb={4}>
                                    <HStack spacing={1} flexShrink={0}>
                                        {CardUserIcon && <CardUserIcon width="24px" height="24px" />}
                                        <Text fontSize="16px" color="#5F5F5F" fontWeight="500">{data.contactPerson || '-'}</Text>
                                    </HStack>
                                    <Sep />
                                    <HStack spacing={1} flexShrink={0}>
                                        {MobileNewIcon && <MobileNewIcon width="24px" height="24px" style={{ color: '#919191' }} />}
                                        <Text fontSize="16px" color="#5F5F5F" fontWeight="600">{data.mobile || '-'}</Text>
                                    </HStack>
                                    <Sep />
                                    <HStack spacing={1} flexShrink={0}>
                                        {NewEmailIcon && <NewEmailIcon width="24px" height="24px" style={{ color: '#919191' }} />}
                                        <Text fontSize="16px" color="#5F5F5F" fontWeight="400">{data.email || '-'}</Text>
                                    </HStack>
                                    <Sep />
                                    {AddressCardIcon && (
                                        <Popover.Root
                                            open={isAddressOpen}
                                            onOpenChange={(e) => setIsAddressOpen(e.open)}
                                            positioning={{ placement: 'top-start' }}
                                        >
                                            <Popover.Trigger asChild>
                                                <HStack
                                                    spacing={1} cursor="pointer" flexShrink={0}
                                                    onMouseEnter={() => setIsAddressOpen(true)}
                                                    onMouseLeave={() => setIsAddressOpen(false)}
                                                >
                                                    <AddressCardIcon width="24px" height="24px" style={{ color: '#919191' }} />
                                                    <Text fontSize="16px" color="#5F5F5F" fontWeight="400">{t('address')}</Text>
                                                </HStack>
                                            </Popover.Trigger>
                                            <Popover.Positioner>
                                                <Popover.Content
                                                    width="auto" minW="320px" maxW="400px" bg="white"
                                                    boxShadow="md" border="1px solid" borderColor="gray.100" borderRadius="md"
                                                    onMouseEnter={() => setIsAddressOpen(true)}
                                                    onMouseLeave={() => setIsAddressOpen(false)}
                                                >
                                                    <Popover.Body p={3}>
                                                        <Text fontSize="sm" color="gray.800" fontWeight="medium">{data.address || '-'}</Text>
                                                    </Popover.Body>
                                                </Popover.Content>
                                            </Popover.Positioner>
                                        </Popover.Root>
                                    )}
                                    <Box flex={1} />
                                    <Box px={4} py="2px" borderRadius="full" bg={statusBg} color={statusColor}
                                        fontSize="sm" fontWeight="600" border={`1px solid ${statusColor}33`} flexShrink={0}>
                                        {formatStatus(status)}
                                    </Box>
                                    <TableActionMenu row={data} actionItems={actionItems} />
                                </HStack>

                                {/* ROW 3 */}
                                <HStack w="full" spacing={3} align="center">
                                    <Text fontSize="16px" fontWeight="400" color="#232F50" flexShrink={0}>
                                        {t('receivedFrom')}:{' '}
                                        <Text as="span" fontWeight="600" fontSize="16px">
                                            {data.receivedFromName
                                                ? `${data.receivedFromName}${data.receivedFromDesignation ? ` (${data.receivedFromDesignation})` : ''}`
                                                : '-'}
                                        </Text>
                                    </Text>
                                    <Box flex={1} />
                                    <Text fontSize="16px" fontWeight="400" color="#232F50" flexShrink={0}>
                                        {t('receivedOn')}:{' '}
                                        <Text as="span" fontWeight="600" fontSize="16px">{formattedDate}</Text>
                                    </Text>
                                    <Box w="32px" flexShrink={0} />
                                </HStack>
                            </VStack>
                        </VStack>
                    </HStack>
                )}
            </Box>
        </HStack>
    );
};

const CorporateEnquiryLocationsList = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { FilterIcon, UserProfileIcon } = Icons;

    const seatId = getTokenData(STORAGE_KEYS.AUTH_TOKEN)?.seatId ?? null;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [selectedLocationIds, setSelectedLocationIds] = useState([]);
    const [isAssignToOpen, setIsAssignToOpen] = useState(false);
    const [assignLocationIds, setAssignLocationIds] = useState([]);
    const [assignEnquiryId, setAssignEnquiryId] = useState('');
    const [isFeasibilityOpen, setIsFeasibilityOpen] = useState(false);
    const [isDispositionOpen, setIsDispositionOpen] = useState(false);
    const [isReturnToOpen, setIsReturnToOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const enquiryLocations = useSelector(getEnquiryLocations);
    const isLoading = !!enquiryLocations?.isLoading;
    const rows = Array.isArray(enquiryLocations?.data) ? enquiryLocations.data : [];

    const filteredRows = searchQuery
        ? rows.filter((r) => (r.locName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.serviceName ?? '').toLowerCase().includes(searchQuery.toLowerCase()))
        : rows;

    useEffect(() => {
        dispatch(fetchLocationsBySeat({ ...(seatId && { seatId }) }));
    }, [dispatch, seatId]);

    const handleSelectAll = (e) => {
        const isChecked = !!e?.checked;
        const newIndices = isChecked ? filteredRows.map((_, i) => i) : [];
        setSelectedIndices(newIndices);
        setSelectedLocationIds(newIndices.map((i) => filteredRows[i]?.id).filter(Boolean));
    };

    const handleSelectRow = (index) => {
        const newIndices = selectedIndices.includes(index)
            ? selectedIndices.filter((i) => i !== index)
            : [...selectedIndices, index];
        setSelectedIndices(newIndices);
        setSelectedLocationIds(newIndices.map((i) => filteredRows[i]?.id).filter(Boolean));
    };

    const handleAssignTo = () => {
        if (selectedLocationIds.length === 0) {
            showToast({
                title: t('warning'),
                theme: 'colored',
                description: t('pleaseSelectAtLeastOneLocation'),
                type: 'warning'
            });
            return;
        }
        setAssignLocationIds(selectedLocationIds);
        const firstSelected = filteredRows.find((r) => selectedLocationIds.includes(r.id));
        setAssignEnquiryId(firstSelected?.enquiryId ?? '');
        setIsAssignToOpen(true);
    };

    const handleCardAssignTo = (location) => {
        setAssignLocationIds([location.id]);
        setAssignEnquiryId(location.enquiryId ?? '');
        setIsAssignToOpen(true);
    };

    const handleReturnTo = (location) => {
        setSelectedLocation(location);
        setIsReturnToOpen(true);
    };

    const handleNearestConnection = (location) => {
        setSelectedLocation(location);
        setIsFeasibilityOpen(true);
    };

    const handleDownloadCsv = () => {
        dispatch(downloadEnquiryListCsv({}));
    };

    const handleEditLocation = (location) => {
        setSelectedLocation(location);
        setIsEditOpen(true);
    };

    const refreshList = () => {
        dispatch(fetchLocationsBySeat({ ...(seatId && { seatId }) }));
    };

    const handleDisposition = (location) => {
        setSelectedLocation(location);
        setIsDispositionOpen(true);
    };

    const isAllSelected = filteredRows.length > 0 && selectedIndices.length === filteredRows.length;
    const isEmpty = filteredRows.length === 0;

    return (
        <CustomLoaderProvider isLoading={isLoading}>
        <Box>
            <Box w="full" minH="500px" bg="#F9FAFB" borderRadius="lg" borderStyle="dashed" borderWidth="1px" borderColor="gray.200" p={6}>
                {/* HEADER */}
                <HStack justify="space-between" mb={5}>
                    <HStack spacing={0}>
                        <Box mr={2} pt={2}>
                            <CustomCheckbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                        </Box>
                        <Box w="300px">
                            <SearchInput
                                placeholder={t('search')}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                bg="white"
                            />
                        </Box>
                    </HStack>
                    <HStack spacing={4}>
                        <Button variant="outline" bg="white" borderRadius="md" height="40px" borderColor="#A11E52" color="#A11E52" _hover={{ bg: 'pink.50' }}>
                            <FilterIcon style={{ marginRight: '8px' }} />
                            {t('filter')}
                        </Button>
                        <Button variant="outline" bg="white" borderRadius="md" height="40px" borderColor="#A11E52" color="#A11E52" _hover={{ bg: 'pink.50' }} onClick={handleDownloadCsv}>
                            <UserProfileIcon style={{ marginRight: '8px' }} />
                            {t('downloadCsv')}
                        </Button>
                        <Button variant="outline" bg="white" borderRadius="md" height="40px" borderColor="#A11E52" color="#A11E52" _hover={{ bg: 'pink.50' }} onClick={handleAssignTo}>
                            <UserProfileIcon style={{ marginRight: '8px' }} />
                            {t('assignTo')}
                        </Button>
                    </HStack>
                </HStack>

                {/* LIST */}
                {isEmpty ? (
                    <VStack spacing={4} align="center" justify="center" h="300px">
                        <Text fontSize="lg" fontWeight="bold" color="gray.500">{t('noRecordsFound')}</Text>
                    </VStack>
                ) : (
                    <VStack spacing={3} align="stretch">
                        {filteredRows.map((item, index) => (
                            <LocationCard
                                key={item.id ?? index}
                                data={item}
                                index={index + 1}
                                isSelected={selectedIndices.includes(index)}
                                onSelect={() => handleSelectRow(index)}
                                onEdit={handleEditLocation}
                                onDisposition={handleDisposition}
                                onReturnTo={handleReturnTo}
                                onCardAssignTo={handleCardAssignTo}
                                onNearestConnection={handleNearestConnection}
                            />
                        ))}
                    </VStack>
                )}
            </Box>

            <AddCorporateLocation
                isOpen={isEditOpen}
                onClose={() => { setIsEditOpen(false); setSelectedLocation(null); }}
                enquiryId={selectedLocation?.enquiryId}
                locationId={selectedLocation?.id}
                customerId={selectedLocation?.customerId}
                onSuccess={refreshList}
            />
            <AssignToPopup
                isOpen={isAssignToOpen}
                setIsOpen={setIsAssignToOpen}
                enquiryId={assignEnquiryId}
                locationIds={assignLocationIds}
                onSuccess={refreshList}
            />
            <CorporateReturnToPopup
                isOpen={isReturnToOpen}
                setIsOpen={(open) => { setIsReturnToOpen(open); if (!open) setSelectedLocation(null); }}
                locationId={selectedLocation?.id}
                onSuccess={refreshList}
            />
            <CorporateFeasibilityPopup
                isOpen={isFeasibilityOpen}
                onClose={() => { setIsFeasibilityOpen(false); setSelectedLocation(null); }}
                enquiryId={selectedLocation?.enquiryId}
                locationId={selectedLocation?.id}
                onSuccess={refreshList}
            />
            <DispositionPopup
                isOpen={isDispositionOpen}
                setIsOpen={(open) => { setIsDispositionOpen(open); if (!open) setSelectedLocation(null); }}
                enquiryId={selectedLocation?.enquiryId}
                locationId={selectedLocation?.id}
                onSuccess={refreshList}
            />
        </Box>
        </CustomLoaderProvider>
    );
};

export default CorporateEnquiryLocationsList;
