import { Box, Button, HStack, Icons, Popover, Spinner, Text, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import SearchInput from '@/components/custom/SearchInput';
import TableActionMenu from '@/components/custom/TableActionMenu';
import { DATE_FORMAT } from '@/constants/date';
import { MENU_KEYS } from '@/constants/permissions';
import { ACTION_TYPES, fetchEnquiryLocations } from '@/features/corporate/action';
import CorporateDispositionPopup from '@/features/corporate/components/popUps/CorporateDispositionPopup';
import CorporateFeasibilityPopup from '@/features/corporate/components/popUps/CorporateFeasibilityPopup';
import CorporateReturnToPopup from '@/features/corporate/components/popUps/CorporateReturnToPopup';
import SummaryNotesPopup from '@/features/corporate/components/popUps/SummaryNotesPopup';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { usePageActions } from '@/hooks/usePageActions';
import { dayjs } from '@/utils/dateUtils';


const STATUS_LABEL_MAP = {
    NOT_INTERESTED: 'Not Interested',
    RE_ASSIGN: 'Re-Assign'
};

const formatStatus = (status) =>
    STATUS_LABEL_MAP[status] ?? status.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

const Sep = () => <Box h='20px' w='1px' bg='rgba(130,130,130,0.19)' flexShrink={0} />;

const CorporateGenericCardList = ({
    data = [],
    onAddSubscriber,
    onCsvUpload,
    onAssignTo,
    onCardAssignTo,
    onEdit,
    onNearestLocation,
    onDisposition,
    addButtonLabel,
    assignButtonLabel,
    emptyLabel,
    onSelectionChange,
    initialSelectedIds = [],
    onEditProposal,
    filterSlot,
    isReviseMode = false,
    onCircuitProvisioning,
    onServiceProvisioning,
    hideSelection = false
}) => {
    const { t } = useTranslation();
    const { FilterIcon, UserProfileIcon, AddNewSubscriber, EditProposalNewIcon } = Icons;
    const { hasPermission: hasLocationMenuPerm } = usePageActions(MENU_KEYS.CORPORATE_ENQUIRY_LOCATION_LIST);
    const { hasPermission: hasEnquiryMenuPerm } = usePageActions(MENU_KEYS.CORPORATE_ENQUIRY_LIST);
    const hasPermission = (name) => hasLocationMenuPerm(name) || hasEnquiryMenuPerm(name);
    const canSearch = hasPermission('location_search');
    const canFilter = hasPermission('location_filter');
    const canDownloadCsv = hasPermission('location_download_csv');
    const canAssignTo = hasPermission('location_assign_to') || hasPermission('assign_to');

    const [, setSearchQuery] = useState('');
    const [selectedIndices, setSelectedIndices] = useState([]);
    const [collapseKey, setCollapseKey] = useState(0);

    const collapseAll = () => setCollapseKey((k) => k + 1);

    useEffect(() => {
        if (!initialSelectedIds.length || !data.length) return;
        const indices = data.reduce((acc, item, i) => {
            if (initialSelectedIds.includes(item?.id)) acc.push(i);
            return acc;
        }, []);
        setSelectedIndices(indices);
        onSelectionChange?.(indices.map((i) => data[i]?.id).filter(Boolean));
    }, [data.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const isProposalLocked = (item) => {
        if (isReviseMode) return false;
        const ps = item?.proposalStatus;
        return ps === 'APPROVED' || ps === 'SEND_TO_CUSTOMER';
    };

    const selectableIndices = data.reduce((acc, item, i) => {
        if (!isProposalLocked(item)) acc.push(i);
        return acc;
    }, []);

    const handleSelectAll = (e) => {
        const isChecked = !!e?.checked;
        const newIndices = isChecked ? selectableIndices : [];
        setSelectedIndices(newIndices);
        onSelectionChange?.(newIndices.map((i) => data[i]?.id).filter(Boolean));
    };

    const handleSelectRow = (index) => {
        if (isProposalLocked(data[index])) return;
        const newIndices = selectedIndices.includes(index)
            ? selectedIndices.filter((i) => i !== index)
            : [...selectedIndices, index];
        setSelectedIndices(newIndices);
        onSelectionChange?.(newIndices.map((i) => data[i]?.id).filter(Boolean));
    };

    const isAllSelected = selectableIndices.length > 0 && selectableIndices.every(i => selectedIndices.includes(i));
    const isEmpty = !data || data.length === 0;

    return (
        <Box
            w='full'
            minH='500px'
            bg='#F9FAFB'
            borderRadius='lg'
            borderStyle='dashed'
            borderWidth='1px'
            borderColor='gray.200'
            p={6}
        >
            <HStack justify='space-between' mb={5}>
                {!isEmpty ? (
                    <HStack spacing={0} alignItems='center'>
                        {!hideSelection && (
                            <input
                                type='checkbox'
                                checked={isAllSelected}
                                onChange={(e) => handleSelectAll({ checked: e.target.checked })}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    accentColor: 'var(--chakra-colors-primary-500)',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    marginRight: '16px'
                                }}
                            />
                        )}
                        {canSearch && (
                            <Box w='300px'>
                                <SearchInput placeholder={t('search')} onChange={(e) => setSearchQuery(e.target.value)} bg='white' />
                            </Box>
                        )}
                    </HStack>
                ) : <Box />}
                <HStack spacing={4}>
                    {filterSlot}
                    {!isEmpty && onEditProposal && (
                        <Button
                            variant='outline'
                            bg='white'
                            borderRadius='md'
                            height='40px'
                            borderColor='#A11E52'
                            color='#A11E52'
                            _hover={{ bg: 'pink.50' }}
                            onClick={onEditProposal}
                        >
                            <EditProposalNewIcon style={{ marginRight: '8px' }} />
                            {t('editProposal')}
                        </Button>
                    )}
                    {!isEmpty && canFilter && (
                        <Button
                            variant='outline'
                            bg='white'
                            borderRadius='md'
                            height='40px'
                            borderColor='#A11E52'
                            color='#A11E52'
                            _hover={{ bg: 'pink.50' }}
                        >
                            <FilterIcon style={{ marginRight: '8px' }} />
                            {t('filter')}
                        </Button>
                    )}
                    {onCsvUpload && canDownloadCsv && (
                        <Button
                            variant='outline'
                            bg='white'
                            borderRadius='md'
                            height='40px'
                            borderColor='#A11E52'
                            color='#A11E52'
                            _hover={{ bg: 'pink.50' }}
                            onClick={onCsvUpload}
                        >
                            <UserProfileIcon style={{ marginRight: '8px' }} />
                            {t('csvUpload')}
                        </Button>
                    )}
                    {onAddSubscriber && (
                        <Button
                            variant='outline'
                            bg='white'
                            borderRadius='md'
                            height='40px'
                            borderColor='#A11E52'
                            color='#A11E52'
                            _hover={{ bg: 'pink.50' }}
                            onClick={onAddSubscriber}
                        >
                            <UserProfileIcon style={{ marginRight: '8px' }} />
                            {addButtonLabel || t('addSubscriber')}
                        </Button>
                    )}
                    {!isEmpty && onAssignTo && canAssignTo && (
                        <Button
                            variant='outline'
                            bg='white'
                            borderRadius='md'
                            height='40px'
                            borderColor='#A11E52'
                            color='#A11E52'
                            _hover={{ bg: 'pink.50' }}
                            onClick={onAssignTo}
                        >
                            <UserProfileIcon style={{ marginRight: '8px' }} />
                            {assignButtonLabel || t('assignTo')}
                        </Button>
                    )}
                </HStack>
            </HStack>

            {isEmpty ? (
                <VStack spacing={4} align='center' justify='center' h='300px'>
                    <AddNewSubscriber
                        style={{ width: '140px', height: '140px', color: '#1A365D', cursor: onAddSubscriber ? 'pointer' : 'default' }}
                        onClick={onAddSubscriber}
                    />
                    <Text fontSize='lg' fontWeight='bold' color='gray.500'>
                        {emptyLabel || t('addNewSubscriber')}
                    </Text>
                </VStack>
            ) : (
                <VStack spacing={3} align='stretch'>
                    {data.map((item, index) => (
                        <CorporateGenericCard
                            key={item.id ?? index}
                            data={item}
                            index={index + 1}
                            isSelected={selectedIndices.includes(index)}
                            isDisabled={isProposalLocked(item)}
                            onSelect={() => handleSelectRow(index)}
                            onAssignTo={onCardAssignTo ? () => onCardAssignTo(item) : onAssignTo}
                            onEdit={onEdit}
                            onNearestLocation={onNearestLocation}
                            onDisposition={onDisposition}
                            onCircuitProvisioning={onCircuitProvisioning}
                            onServiceProvisioning={onServiceProvisioning}
                            collapseKey={collapseKey}
                            onCollapseAll={collapseAll}
                            hideSelection={hideSelection}
                        />
                    ))}
                </VStack>
            )}
        </Box>
    );
};

const CorporateGenericCard = ({ data, index, isSelected, isDisabled, onSelect, onAssignTo, onEdit, onNearestLocation, onDisposition, onCircuitProvisioning, onServiceProvisioning, collapseKey, onCollapseAll, hideSelection = false }) => {
    const { t } = useTranslation();
    const { MobileNewIcon, NewEmailIcon, CardUserIcon, AddressCardIcon, DownArrowIcon, UpArrowIcon, CardViewIcon } = Icons;
    const dispatch = useDispatch();
    const apiProgress = useSelector(getApiProgress);
    const { hasPermission: hasLocationMenuPerm } = usePageActions(MENU_KEYS.CORPORATE_ENQUIRY_LOCATION_LIST);
    const { hasPermission: hasEnquiryMenuPerm } = usePageActions(MENU_KEYS.CORPORATE_ENQUIRY_LIST);
    const hasPermission = (name) => hasLocationMenuPerm(name) || hasEnquiryMenuPerm(name);
    const isFetchingLocations = apiProgress[ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS]?.isLoading ?? false;

    const [isExpanded, setIsExpanded] = useState(false);
    const [isExpandLoading, setIsExpandLoading] = useState(false);
    const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isFeasibilityOpen, setIsFeasibilityOpen] = useState(false);
    const [isReturnToOpen, setIsReturnToOpen] = useState(false);
    const [isDispositionOpen, setIsDispositionOpen] = useState(false);

    useEffect(() => {
        if (isExpandLoading && !isFetchingLocations) {
            setIsExpandLoading(false);
        }
    }, [isFetchingLocations, isExpandLoading]);

    useEffect(() => {
        if (collapseKey > 0) setIsExpanded(false);
    }, [collapseKey]);

    const collapseAndRun = (fn) => () => { setIsExpanded(false); fn(); };

    const actionItems = [
        { label: 'edit', onClick: collapseAndRun(() => onEdit?.(data)), hidden: !(hasPermission('location_edit') || hasPermission('edit')) },
        { label: 'returnTo', onClick: collapseAndRun(() => setIsReturnToOpen(true)), hidden: !(hasPermission('location_return_to') || hasPermission('return_to')) },
        { label: 'assignTo', onClick: collapseAndRun(() => onAssignTo?.()), hidden: !(hasPermission('location_assign_to') || hasPermission('assign_to')) },
        { label: 'dispositions', onClick: collapseAndRun(() => onDisposition?.(data)), hidden: !(hasPermission('location_disposition') || hasPermission('disposition')) },
        { label: 'nearestLocation', onClick: collapseAndRun(() => onNearestLocation?.(data)), hidden: !(hasPermission('location_nearest_connection') || hasPermission('nearest_connection')) },
        { label: 'circuitProvisioning', onClick: collapseAndRun(() => onCircuitProvisioning?.(data)), hidden: !onCircuitProvisioning || data.proposalStatus !== 'PO_RECEIVED' },
        { label: 'serviceProvisioning', onClick: collapseAndRun(() => onServiceProvisioning?.(data)), hidden: !onServiceProvisioning || data.proposalStatus !== 'PO_RECEIVED' }
    ];

    const status = data.locStatus || 'OPEN';

    const formattedDate = data.createdAt
        ? dayjs(data.createdAt).isValid()
            ? dayjs(data.createdAt).format(DATE_FORMAT.DATE_TIME)
            : data.createdAt
        : '-';

    const indexLabel = String(index).padStart(2, '0');

    const handleToggle = () => {
        const expanding = !isExpanded;
        setIsExpanded((prev) => !prev);
        if (expanding) {
            setIsExpandLoading(true);
            dispatch(fetchEnquiryLocations({ enquiryId: data.enquiryId, locationId: data.id }));
        }
    };

    const ToggleBtn = ({ expanded }) => (
        <Button
            variant='ghost'
            onClick={(e) => { e.stopPropagation(); handleToggle(); }}
            p={1}
            borderRadius='full'
            _hover={{ bg: 'gray.100' }}
            display='flex'
            alignItems='center'
            justifyContent='center'
            flexShrink={0}
            minW='unset'
            w='32px'
            h='32px'
        >
            {expanded ? <UpArrowIcon /> : <DownArrowIcon />}
        </Button>
    );

    return (
        <HStack w='full' spacing={0} alignItems='center' mb={3}>
            {!hideSelection && (
                <input
                    type='checkbox'
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={onSelect}
                    style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--chakra-colors-primary-500)',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        flexShrink: 0,
                        marginRight: '16px',
                        opacity: isDisabled ? 0.4 : 1
                    }}
                />
            )}

            <Box
                flex={1}
                bg='white'
                px={4}
                py={3}
                borderRadius='md'
                boxShadow='sm'
                border='1px solid'
                borderColor='gray.200'
                cursor='pointer'
                onClick={handleToggle}
                _hover={{ boxShadow: 'md' }}
            >
                {/* COLLAPSED VIEW */}
                {!isExpanded && (
                    <HStack w='full' spacing={3} align='center'>
                        <Text fontWeight='bold' fontSize='md' color='gray.600' flexShrink={0} minW='28px'>
                            {indexLabel}
                        </Text>
                        <Text fontWeight='700' fontSize='16px' color='gray.900' flexShrink={0}>
                            {data.locName || '-'}
                        </Text>
                        <Sep />
                        <Text fontWeight='500' fontSize='16px' color='#8D0247' flexShrink={0}>
                            {data.serviceName || '-'}
                        </Text>
                        {data.packageName && (
                            <>
                                <Sep />
                                <Text
                                    fontWeight='500'
                                    fontSize='16px'
                                    color='#8D0247'
                                    flexShrink={0}
                                >
                                    {data.packageName}
                                </Text>
                            </>
                        )}
                        {data.dispositionCode && (
                            <>
                                <Sep />
                                <Text fontSize='14px' fontWeight='400' color='#232F50' flexShrink={0}>
                                    {t('disposition')}:{' '}
                                    <Text as='span' fontWeight='700'>{formatStatus(data.dispositionCode)}</Text>
                                </Text>
                            </>
                        )}
                        <Box flex={1} />
                        <Box
                            px={4}
                            py='2px'
                            borderRadius='full'
                            bg='#F4F4F4'
                            color='#FD1C7A'
                            fontSize='sm'
                            fontWeight='600'
                            border='1px solid #D7D7D7'
                            flexShrink={0}
                            display='flex'
                            alignItems='center'
                            gap='6px'
                        >
                            <Box as='span' w='8px' h='8px' borderRadius='full' bg='#FD1C7A' flexShrink={0} />
                            {formatStatus(status)}
                        </Box>
                        <ToggleBtn expanded={false} />
                    </HStack>
                )}

                {/* EXPANDED VIEW */}
                {isExpanded && isExpandLoading && (
                    <HStack justify='center' py={6}>
                        <Spinner size='md' color='#8D0247' />
                    </HStack>
                )}
                {isExpanded && !isExpandLoading && (() => {
                    const dispositionLabel = data.dispositionCode ? formatStatus(data.dispositionCode) : null;

                    return (
                        <HStack w='full' spacing={3} align='center'>
                            <Text fontWeight='bold' fontSize='md' color='gray.600' flexShrink={0} minW='28px'>
                                {indexLabel}
                            </Text>

                            <VStack flex={1} align='stretch' spacing={0}>
                                {/* ROW 1: locName | serviceName | spacer | Received from: name designation | toggle */}
                                <HStack w='full' spacing={3} align='center'>
                                    <Text fontWeight='700' fontSize='16px' color='gray.900' flexShrink={0}>
                                        {data.locName || '-'}
                                    </Text>
                                    <Sep />
                                    <Text fontWeight='500' fontSize='16px' color='#8D0247' flexShrink={0}>
                                        {data.serviceName || '-'}
                                    </Text>
                                    <Box flex={1} />
                                    <Text fontSize='16px' fontWeight='400' color='#232F50' flexShrink={0}>
                                        {t('receivedFrom')}:{' '}
                                        <Text as='span' fontWeight='600' fontSize='16px'>
                                            {data.receivedFromName || data.source || data.receivedFrom || '-'}
                                        </Text>
                                        {data.receivedFromDesignation && (
                                            <Text as='span' fontWeight='400' fontSize='16px' color='gray.500'>
                                                {' '}{data.receivedFromDesignation}
                                            </Text>
                                        )}
                                    </Text>
                                    <ToggleBtn expanded={true} />
                                </HStack>

                                {/* ROW 2: packageName (pink) | spacer | On: date */}
                                <HStack w='full' spacing={3} align='center' mt={1} mb={3}>
                                    {data.packageName && (
                                        <Text fontWeight='600' fontSize='15px' color='#8D0247' flexShrink={0}>
                                            {data.packageName}
                                        </Text>
                                    )}
                                    <Box flex={1} />
                                    <Text fontSize='16px' fontWeight='400' color='#232F50' flexShrink={0}>
                                        {t('receivedOn')}:{' '}
                                        <Text as='span' fontWeight='600' fontSize='16px'>
                                            {formattedDate}
                                        </Text>
                                    </Text>
                                </HStack>

                                {/* ROW 3: contactPerson | mobile | email | address | spacer | status | three-dot */}
                                <HStack w='full' spacing={3} align='center' mb={3}>
                                    <HStack spacing={1} flexShrink={0}>
                                        {CardUserIcon && <CardUserIcon width='24px' height='24px' />}
                                        <Text fontSize='16px' color='#5F5F5F' fontWeight='500'>
                                            {data.contactPerson || '-'}
                                        </Text>
                                    </HStack>

                                    <Sep />

                                    <HStack spacing={1} flexShrink={0}>
                                        {MobileNewIcon && (
                                            <MobileNewIcon width='24px' height='24px'
                                                style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                                        )}
                                        <Text fontSize='16px' color='#5F5F5F' fontWeight='600'>
                                            {data.mobile || '-'}
                                        </Text>
                                    </HStack>

                                    <Sep />

                                    <HStack spacing={1} flexShrink={0}>
                                        {NewEmailIcon && (
                                            <NewEmailIcon width='24px' height='24px'
                                                style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                                        )}
                                        <Text fontSize='16px' color='#5F5F5F' fontWeight='400'>
                                            {data.email || '-'}
                                        </Text>
                                    </HStack>

                                    <Sep />

                                    {AddressCardIcon && (
                                        <Popover.Root
                                            open={isAddressOpen}
                                            onOpenChange={(e) => setIsAddressOpen(e.open)}
                                            positioning={{ placement: 'top-start' }}
                                        >
                                            <Popover.Trigger asChild>
                                                <HStack spacing={1} cursor='pointer' flexShrink={0}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onMouseEnter={() => setIsAddressOpen(true)}
                                                    onMouseLeave={() => setIsAddressOpen(false)}
                                                >
                                                    <AddressCardIcon width='24px' height='24px'
                                                        style={{ color: '#919191', stroke: '#919191', strokeWidth: '1.5px' }} />
                                                    <Text fontSize='16px' color='#5F5F5F' fontWeight='400'>
                                                        {t('address')}
                                                    </Text>
                                                </HStack>
                                            </Popover.Trigger>
                                            <Popover.Positioner>
                                                <Popover.Content width='auto' minW='320px' maxW='400px' bg='white'
                                                    boxShadow='md' border='1px solid' borderColor='gray.100' borderRadius='md'
                                                    onMouseEnter={() => setIsAddressOpen(true)}
                                                    onMouseLeave={() => setIsAddressOpen(false)}
                                                >
                                                    <Popover.Body p={3}>
                                                        <Text fontSize='sm' color='gray.800' fontWeight='medium'>
                                                            {data.address || '-'}
                                                        </Text>
                                                    </Popover.Body>
                                                </Popover.Content>
                                            </Popover.Positioner>
                                        </Popover.Root>
                                    )}

                                    <Box flex={1} />

                                    <Box px={4} py='2px' borderRadius='full' bg='#F4F4F4' color='#FD1C7A'
                                        fontSize='sm' fontWeight='600' border='1px solid #D7D7D7' flexShrink={0}
                                        display='flex' alignItems='center' gap='6px'
                                    >
                                        <Box as='span' w='8px' h='8px' borderRadius='full' bg='#FD1C7A' flexShrink={0} />
                                        {formatStatus(status)}
                                    </Box>

                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <TableActionMenu row={data} actionItems={actionItems} />
                                    </Box>
                                </HStack>

                                {/* ROW 4: Additional Services | Disposition (if exists) | spacer | Nearest LNP | More... */}
                                <HStack w='full' spacing={3} align='center'>
                                    {Array.isArray(data.additionalServices) && data.additionalServices.length > 0 && (
                                        <Popover.Root
                                            open={isAdditionalOpen}
                                            onOpenChange={(e) => setIsAdditionalOpen(e.open)}
                                            positioning={{ placement: 'bottom-start' }}
                                        >
                                            <Popover.Trigger asChild>
                                                <Box border='1px solid #DEDEDE' borderRadius='6px' px={3} py='2px'
                                                    fontSize='14px' fontWeight='600' color='#232F50' bg='white'
                                                    flexShrink={0} cursor='pointer'
                                                    onClick={(e) => e.stopPropagation()}
                                                    onMouseEnter={() => setIsAdditionalOpen(true)}
                                                    onMouseLeave={() => setIsAdditionalOpen(false)}
                                                >
                                                    {t('additionalServices')} ({data.additionalServices.length})
                                                </Box>
                                            </Popover.Trigger>
                                            <Popover.Positioner>
                                                <Popover.Content width='auto' minW='340px' bg='white' boxShadow='lg'
                                                    borderRadius='md'
                                                    onMouseEnter={() => setIsAdditionalOpen(true)}
                                                    onMouseLeave={() => setIsAdditionalOpen(false)}
                                                >
                                                    <Popover.Arrow />
                                                    <Popover.Body p={5}>
                                                        {data.additionalServices.map((s, i) => (
                                                            <Box key={i} mb={i < data.additionalServices.length - 1 ? 4 : 0}>
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
                                        <HStack spacing={1} flexShrink={0} align='center' cursor='pointer'
                                            onClick={(e) => { e.stopPropagation(); setIsDispositionOpen(true); }}
                                        >
                                            <Text fontSize='14px' fontWeight='400' color='#232F50'>
                                                {t('disposition')}:{' '}
                                                <Text as='span' fontWeight='700'>{dispositionLabel}</Text>
                                            </Text>
                                            {CardViewIcon && (
                                                <CardViewIcon width='24px' height='24px' style={{ color: '#232F50' }} />
                                            )}
                                        </HStack>
                                    )}

                                    <Box flex={1} />

                                    <Text fontSize='16px' fontWeight='400' color='#232F50' flexShrink={0}
                                        cursor='pointer'
                                        onClick={(e) => { e.stopPropagation(); setIsFeasibilityOpen(true); }}
                                    >
                                        {t('nearestLnp')}:{' '}
                                        <Text as='span' fontWeight='600' fontSize='16px'>
                                            {data.nearestLnpName || t('notAvailable')}
                                        </Text>
                                    </Text>

                                    <Text fontSize='14px' fontWeight='400' color='#7C7C7C' cursor='pointer' flexShrink={0}
                                        onClick={(e) => { e.stopPropagation(); setIsFeasibilityOpen(true); }}
                                    >
                                        {t('more')}...
                                    </Text>

                                    <Box w='32px' flexShrink={0} />
                                </HStack>
                            </VStack>
                        </HStack>
                    );
                })()}
            </Box>

            {isNotesOpen && <SummaryNotesPopup isOpen={isNotesOpen} setIsOpen={setIsNotesOpen} />}
            {isDispositionOpen && (
                <CorporateDispositionPopup
                    isOpen={isDispositionOpen}
                    setIsOpen={(open) => { setIsDispositionOpen(open); if (!open) onCollapseAll?.(); }}
                    enquiryId={data.enquiryId}
                />
            )}
            {isFeasibilityOpen && (
                <CorporateFeasibilityPopup
                    key={`${data.enquiryId}-${data.id ?? data.locationId}`}
                    isOpen={isFeasibilityOpen}
                    onClose={() => { setIsFeasibilityOpen(false); onCollapseAll?.(); }}
                    enquiryId={data.enquiryId}
                    locationId={data.id ?? data.locationId}
                />
            )}
            {isReturnToOpen && (
                <CorporateReturnToPopup
                    isOpen={isReturnToOpen}
                    setIsOpen={setIsReturnToOpen}
                    locationId={data.id ?? data.locationId}
                />
            )}
        </HStack>
    );
};

export default CorporateGenericCardList;
