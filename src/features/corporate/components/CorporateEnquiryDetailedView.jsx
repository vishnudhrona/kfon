import { Box, Button, HStack, Icons } from '@kfonbss/bss-ui-components';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { DetailSummaryCard } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { showToast } from '@/components/custom/Toast';
import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, fetchEnquiryDetails, fetchEnquiryLocations, fetchEnquiryLocationsSummary } from '../action';
import { getEnquiryDetailsData, getEnquiryLocations } from '../selector';
import { actions as sliceActions } from '../slice';
import AddCorporateLocation from './AddCorporateLocation';
import CorporateGenericCardList from './CorporateGenericCardList';
import AssignToPopup from './popUps/AssignToPopup';
import CorporateFeasibilityPopup from './popUps/CorporateFeasibilityPopup';
import CorporateLocationCsvUploadPopup from './popUps/CorporateLocationCsvUploadPopup';
import DispositionPopup from './popUps/DispositionPopup';

const getSessionIds = (key) => {
    try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
};

const CorporateEnquiryDetailedView = () => {
    const {
        TimerIcon,
        MobileNewIcon, NewEmailIcon
    } = Icons;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enquiryId } = useParams({ strict: false });
    const location = useLocation();
    const isReviseMode = location.pathname.includes('revise-proposal');

    const [isAddSubscriberOpen, setIsAddSubscriberOpen] = useState(false);
    const [isCsvUploadOpen, setIsCsvUploadOpen] = useState(false);
    const [isAssignToOpen, setIsAssignToOpen] = useState(false);
    const [isFeasibilityOpen, setIsFeasibilityOpen] = useState(false);
    const [isDispositionOpen, setIsDispositionOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [assignLocationIds, setAssignLocationIds] = useState([]);

    const [selectedLocationIds, setSelectedLocationIds] = useState(
        () => getSessionIds('proposalLocationIDs') || []
    );

    const [listKey, setListKey] = useState(0);

    const [splitFilter] = useState(() => {
        const val = getSessionIds('splitFilterLocationIds');
        if (val) sessionStorage.removeItem('splitFilterLocationIds');
        return val; // array of locationIds or null
    });
    const [activeFilter, setActiveFilter] = useState(splitFilter ? 'split' : 'all');

    const handleAddSubscriber = () => {
        setSelectedLocation(null);
        setIsAddSubscriberOpen(true);
    };

    const handleEditLocation = (location) => {
        setSelectedLocation(location);
        setIsAddSubscriberOpen(true);
    };

    const handleNearestLocation = (location) => {
        setSelectedLocation(location);
        setIsFeasibilityOpen(true);
    };

    const handleDisposition = (location) => {
        setSelectedLocation(location);
        setIsDispositionOpen(true);
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
        setIsAssignToOpen(true);
    };

    const handleCardAssignTo = (location) => {
        setAssignLocationIds([location.id]);
        setIsAssignToOpen(true);
    };

    const apiProgress = useSelector(getApiProgress);
    const isPageLoading = !!(apiProgress[ACTION_TYPES.FETCH_ENQUIRY_DETAILS] || apiProgress[ACTION_TYPES.FETCH_ENQUIRY_LOCATIONS_SUMMARY]);

    const enquiryDetails = useSelector(getEnquiryDetailsData);
    const rawData = enquiryDetails?.data ?? {};
    const data = {
        enquiryId: rawData.enquiryId ?? rawData.id ?? enquiryId ?? '',
        trackingId: rawData.trackingId ?? rawData.enqId ?? '',
        companyName: rawData.companyName ?? '',
        mobileNumber: rawData.contactNumber ?? '',
        email: rawData.emailId ?? '',
        enquiryDate: rawData.createdDate ?? rawData.enquiryDate ?? '',
        daysElapsed: rawData.daysElapsed ?? '',
        contactPerson: rawData.contactName ?? '',
        source: rawData.source ?? '',
        total: rawData.totalLocations ?? rawData.total ?? 0,
        feasibleCount: rawData.feasibleCount ?? 0,
        notFeasibleCount: rawData.notFeasibleCount ?? 0,
        pending: rawData.pending ?? 0,
        others: rawData.others ?? 0,
        customerId: rawData.customerId ?? ''
    };

    // Find any version with proposalStatus === 'DRAFT' or 'CREATED'
    const proposals = rawData.proposals ?? {};
    const editableVersion = Object.values(proposals).find(v => v?.proposalStatus === 'DRAFT' || v?.proposalStatus === 'CREATED') ?? null;

    const enquiryLocations = useSelector(getEnquiryLocations);
    const allRows = Array.isArray(enquiryLocations?.data) ? enquiryLocations.data : [];

    const filteredRows = (activeFilter === 'split' && splitFilter?.length)
        ? allRows.filter(r => splitFilter.includes(r.id))
        : allRows;

    useEffect(() => {
        if (enquiryId) {
            dispatch(fetchEnquiryDetails({ enquiryId }));
            dispatch(fetchEnquiryLocationsSummary({ enquiryId }));
        }
    }, [dispatch, enquiryId]);

    const handleSelectionChange = (ids) => {
        setSelectedLocationIds(ids);
        // Preserve non-visible IDs in sessionStorage
        const visibleIds = filteredRows.map(r => r.id).filter(Boolean);
        const previous = getSessionIds('proposalLocationIDs') || [];
        const nonVisible = previous.filter(id => !visibleIds.includes(id));
        const updated = [...new Set([...nonVisible, ...ids])];
        sessionStorage.setItem('proposalLocationIDs', JSON.stringify(updated));
    };

    const handleAllFilter = () => {
        setActiveFilter('all');
    };

    const handleEditProposal = () => {
        if (!editableVersion) return;
        const draftLocationIds = editableVersion.locations?.map(l => l.locationId).filter(Boolean) ?? [];
        setSelectedLocationIds(draftLocationIds);
        sessionStorage.setItem('proposalLocationIDs', JSON.stringify(draftLocationIds));
        setListKey(k => k + 1);
    };

    const config = {
        header: {
            badge: {
                key: 'trackingId',
                label: 'id',
                bg: '#FFDE74',
                textColor: 'black'
            },
            title: {
                key: 'companyName',
                style: { color: '#2D3748' }
            },
            fields: [
                { isSeparator: true },
                { key: 'mobileNumber', label: '', icon: MobileNewIcon, iconStyle: { fontSize: '13px', width: '23px', height: '23px' } },
                { isSeparator: true },
                { key: 'email', label: '', icon: NewEmailIcon, iconStyle: { fontSize: '13px', width: '23px', height: '23px' } }
            ],
            meta: [
                { key: 'enquiryDateMeta', label: 'enquiryDate', value: data.enquiryDate ? (dayjs(data.enquiryDate).isValid() ? dayjs(data.enquiryDate).format(DATE_FORMAT.DATE_TIME) : data.enquiryDate) : '' },
                { key: 'daysElapsed', label: '', icon: TimerIcon, iconPosition: 'left', iconStyle: { fontSize: '13px', width: '23px', height: '23px' } }
            ]
        },
        body: {
            fields: [
                { key: 'contactPerson', label: 'contactPersonName', labelStyle: { fontWeight: 'bold', color: '#515151' } },
                { isSeparator: true },
                { key: 'source', label: 'source', labelStyle: { fontWeight: 'bold', color: '#515151' } }
            ],
            actions: [
                { label: 'locationsAdded', valueKey: 'total' }
            ]
        }
    };

    return (
        <CustomLoaderProvider isLoading={isPageLoading}>
            <Box>
                <DetailSummaryCard data={data} config={config} />
                <Box mt={4}>
                    <CorporateGenericCardList
                        key={`${activeFilter}-${listKey}`}
                        data={filteredRows}
                        initialSelectedIds={selectedLocationIds}
                        onAddSubscriber={handleAddSubscriber}
                        onAssignTo={selectedLocationIds.length > 0 ? handleAssignTo : undefined}
                        onCardAssignTo={handleCardAssignTo}
                        onEdit={handleEditLocation}
                        onNearestLocation={handleNearestLocation}
                        onDisposition={handleDisposition}
                        onCsvUpload={() => setIsCsvUploadOpen(true)}
                        onSelectionChange={handleSelectionChange}
                        addButtonLabel={t('addLocation')}
                        emptyLabel={t('addNewLocation')}
                        onEditProposal={editableVersion ? handleEditProposal : undefined}
                        isReviseMode={isReviseMode}
                        filterSlot={splitFilter?.length > 0 ? (
                            <Button
                                variant="outline"
                                bg={activeFilter === 'all' ? '#8D0247' : 'white'}
                                color={activeFilter === 'all' ? 'white' : '#A11E52'}
                                borderColor="#A11E52"
                                borderRadius="md"
                                height="40px"
                                _hover={{ bg: activeFilter === 'all' ? '#6d0136' : 'pink.50' }}
                                onClick={handleAllFilter}
                            >
                                {t('all')}
                            </Button>
                        ) : undefined}
                    />

                </Box>
                <HStack justify="flex-end" mt={4} spacing={3}>
                    {/* <Button
                        variant="outline"
                        borderColor="#8D0247"
                        color="#8D0247"
                        borderRadius="full"
                        px={6}
                        _hover={{ bg: '#FFF5F7' }}
                        onClick={() => navigate({ to: '/app/corporate/enquiry-list' })}
                    >
                        ← {t('back')}
                    </Button> */}
                    {selectedLocationIds.length > 0 && (
                        <Button
                            bg="#8D0247"
                            color="white"
                            borderRadius="full"
                            px={6}
                            _hover={{ bg: '#6d0136' }}
                            onClick={() => {
                                const selectedLocations = allRows.filter((loc) => selectedLocationIds.includes(loc.id));
                                const hasNonFeasible = selectedLocations.some((loc) => loc.dispositionCode !== 'FEASIBLE');
                                if (hasNonFeasible) {
                                    showToast({
                                        title: t('warning'),
                                        theme: 'colored',
                                        description: t('onlyFeasibleLocationsAllowedForProposal'),
                                        type: 'warning'
                                    });
                                    return;
                                }
                                const resolvedEnquiryId = data.enquiryId || enquiryId;
                                sessionStorage.setItem('proposalEnquiryId', resolvedEnquiryId);
                                sessionStorage.setItem('proposalCompanyName', data.companyName || '');
                                sessionStorage.setItem('proposalContactPerson', data.contactPerson || '');
                                dispatch(sliceActions.setProposalParams({
                                    enquiryId: resolvedEnquiryId,
                                    locationIds: selectedLocationIds,
                                    companyName: data.companyName || '',
                                    contactPerson: data.contactPerson || ''
                                }));
                                navigate({
                                    to: isReviseMode
                                        ? '/app/corporate/proposals/proposal-cards/revise-proposal'
                                        : '/app/corporate/proposals/proposal-cards',
                                    search: { enquiryId: resolvedEnquiryId }
                                });
                            }}
                        >
                            {isReviseMode ? t('reviseProposal') : t('createProposal')} →
                        </Button>
                    )}
                </HStack>
                <AddCorporateLocation
                    isOpen={isAddSubscriberOpen}
                    onClose={() => { setIsAddSubscriberOpen(false); setSelectedLocation(null); }}
                    enquiryId={data.enquiryId}
                    locationId={selectedLocation?.id}
                    customerId={data.customerId}
                />
                <AssignToPopup
                    isOpen={isAssignToOpen}
                    setIsOpen={setIsAssignToOpen}
                    enquiryId={data?.enquiryId}
                    locationIds={assignLocationIds}
                />
                <CorporateFeasibilityPopup
                    isOpen={isFeasibilityOpen}
                    onClose={() => { setIsFeasibilityOpen(false); setSelectedLocation(null); }}
                    enquiryId={data.enquiryId}
                    locationId={selectedLocation?.id}
                />
                <DispositionPopup
                    isOpen={isDispositionOpen}
                    setIsOpen={(open) => { setIsDispositionOpen(open); if (!open) setSelectedLocation(null); }}
                    enquiryId={data.enquiryId}
                    locationId={selectedLocation?.id}
                    onSuccess={() => {
                        if (selectedLocation?.id) {
                            dispatch(fetchEnquiryLocations({ enquiryId: data.enquiryId, locationId: selectedLocation.id }));
                        }
                    }}
                />
                <CorporateLocationCsvUploadPopup
                    isOpen={isCsvUploadOpen}
                    setIsOpen={setIsCsvUploadOpen}
                    enquiryId={data?.enquiryId || enquiryId}
                    onSuccess={() => dispatch(fetchEnquiryLocationsSummary({ enquiryId }))}
                />
            </Box>
        </CustomLoaderProvider>
    );
};

export default CorporateEnquiryDetailedView;
