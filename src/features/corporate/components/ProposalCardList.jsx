import { Box, Button, HStack, Text } from '@kfonbss/bss-ui-components';
import { useLocation, useNavigate, useSearch } from '@tanstack/react-router';
import { get } from 'lodash-es';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import GenericCardPage from '@/components/custom/GenericCardPage';
import { showToast } from '@/components/custom/Toast';

import { bulkUpdateProposals, fetchCorporateProposalSend, fetchEnquiryProposals } from '../action';
import { CORPORATE_KEYS } from '../constants';
import { proposalDetailsRoute } from '../routes';
import { getProposalParams, getTableData } from '../selector';
import { actions as sliceActions } from '../slice';
import ProposalCard from './ProposalCard';

const getProposalLocationIDs = () => {
    try { return JSON.parse(sessionStorage.getItem('proposalLocationIDs') || '[]'); } catch { return []; }
};

const ProposalCardList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isReviseMode = location.pathname.includes('revise-proposal');

    const { enquiryId: searchEnquiryId } = useSearch({ strict: false });
    const { enquiryId: reduxEnquiryId } = useSelector(getProposalParams);
    const enquiryId = searchEnquiryId || reduxEnquiryId || sessionStorage.getItem('proposalEnquiryId') || '';
    const proposalLocationIDs = useMemo(() => getProposalLocationIDs(), []);
    const [proposalData, setProposalData] = useState([]);
    const cardFormDataRef = useRef({});

    const listData = useSelector(getTableData(CORPORATE_KEYS.CORPORATE_PROPOSAL_LIST));

    const versionData = get(listData, 'data', {});
    const versionKey = Object.keys(versionData)[0];
    const responseData = versionKey ? versionData[versionKey] : {};
    const currentVersion = versionKey ? parseInt(versionKey.replace('version', '')) : undefined;
    const apiGroups = get(responseData, 'groups', []);
    const overAllTotalIncludeGst = get(responseData, 'overAllTotalIncludeGst', 0);

    const mappedGroups = useMemo(() => apiGroups.map((group, idx) => ({
        id: `${group.serviceId}-${group.packageId}-${idx}`,
        enquiryId: group.proposals?.[0]?.enquiryId || enquiryId,
        services: group.serviceName,
        packageType: group.packageTypeName || group.packageType,
        packageName: group.packageName,
        totalCount: group.locationCount,
        locationIds: group.proposals?.map(p => p.locationId) || [],
        proposals: group.proposals || [],
        excludeGst: group.groupTotalIncludeGst,
        totalIncludeGst: group.groupTotalIncludeGst,
        proposed: group.proposals?.[0]?.proposedOtc ?? '',
        lockingPeriod: group.proposals?.[0]?.lockingPeriod || '',
        billingFrequency: group.proposals?.[0]?.billingFrequency || '',
        arc: group.proposals?.[0]?.arc || '',
        discount: group.proposals?.[0]?.discount || '',
        finalArc: group.proposals?.[0]?.finalArc || '',
        otc: group.proposals?.[0]?.otc || '',
        additionalServices: (group.additionalServices || []).map(s => ({ serviceName: s.serviceName, planNames: (s.planIds || []).map(p => p.planName).join(', ') }))
    })), [apiGroups, enquiryId]);

    const rawData = mappedGroups.length ? mappedGroups : proposalData;

    const tableData = useMemo(() => rawData, [rawData]);

    const resolvedEnquiryId = enquiryId || tableData[0]?.enquiryId || '';

    const handleSplit = useCallback((originalCard, splitValues) => {
        setProposalData((prevData) => {
            const base = prevData.length ? prevData : rawData;
            const index = base.findIndex(item => item.id === originalCard.id);
            if (index === -1) return base;

            const updatedData = [...base];
            const originalItem = updatedData[index];

            updatedData[index] = { ...originalItem, totalCount: splitValues[0], hasSplits: true };

            const newCards = splitValues.slice(1).map((val, i) => ({
                ...originalItem,
                totalCount: val,
                id: `${originalItem.id}-SPLIT-${Date.now()}-${i}`,
                parentId: originalItem.id,
                isSplit: true,
                hasSplits: true
            }));

            updatedData.splice(index + 1, 0, ...newCards);
            return updatedData;
        });
    }, [rawData]);

    const handleMerge = useCallback((card) => {
        setProposalData((prevData) => {
            const base = prevData.length ? prevData : rawData;
            let updatedData = [...base];

            if (card.isSplit) {
                const parentIndex = updatedData.findIndex(item => item.id === card.parentId);
                const childIndex = updatedData.findIndex(item => item.id === card.id);

                if (parentIndex !== -1 && childIndex !== -1) {
                    const parent = updatedData[parentIndex];
                    const child = updatedData[childIndex];
                    updatedData[parentIndex] = {
                        ...parent,
                        totalCount: parseInt(parent.totalCount) + parseInt(child.totalCount)
                    };
                    updatedData.splice(childIndex, 1);
                    const hasOtherChildren = updatedData.some(item => item.parentId === parent.id);
                    if (!hasOtherChildren) updatedData[parentIndex].hasSplits = false;
                }
            } else {
                const parentIndex = updatedData.findIndex(item => item.id === card.id);
                if (parentIndex !== -1) {
                    const parent = updatedData[parentIndex];
                    const childrenIndices = updatedData
                        .map((item, i) => ({ ...item, _i: i }))
                        .filter(item => item.parentId === parent.id)
                        .map(item => item._i)
                        .sort((a, b) => b - a);

                    let mergedCount = 0;
                    childrenIndices.forEach(ci => {
                        mergedCount += parseInt(updatedData[ci].totalCount);
                        updatedData.splice(ci, 1);
                    });
                    updatedData[parentIndex] = {
                        ...parent,
                        totalCount: parseInt(parent.totalCount) + mergedCount,
                        hasSplits: false
                    };
                }
            }

            return updatedData;
        });
    }, [rawData]);

    const handleFormChange = useCallback((id, values) => {
        cardFormDataRef.current[id] = values;
    }, []);

    const handleBulkSave = useCallback((_savedId, cardEnquiryId) => {
        const eid = resolvedEnquiryId || cardEnquiryId;
        const allCards = tableData;
        const proposals = allCards.map((item) => {
            const formVals = cardFormDataRef.current[item.id];
            if (formVals) return formVals;
            const fa = parseFloat(item.finalArc) || 0;
            const o = parseFloat(item.otc) || 0;
            const excl = parseFloat((fa + o).toFixed(2));
            return {
                locationIds: item.locationIds || [],
                lockingPeriod: Number(item.lockingPeriod) || 0,
                billingFrequency: item.billingFrequency || '',
                arc: Number(item.arc) || 0,
                discount: Number(item.discount) || 0,
                finalArc: fa,
                otc: o,
                excludeGst: excl,
                totalIncludeGst: parseFloat((excl * 1.18).toFixed(2)),
                additionalServices: (item.additionalServices || []).map(s => ({ serviceName: s.serviceName, amount: Number(s.amount || s.planNames) || 0 }))
            };
        });

        dispatch(bulkUpdateProposals({
            enquiryId: eid,
            proposals,
            onSuccess: () => {
                dispatch(fetchEnquiryProposals({
                    key: CORPORATE_KEYS.CORPORATE_PROPOSAL_LIST,
                    enquiryId: eid,
                    locationIds: proposalLocationIDs
                }));
            }
        }));
    }, [tableData, resolvedEnquiryId, proposalLocationIDs, dispatch]);

    const handleViewClick = useCallback((item) => {
        navigate({
            to: proposalDetailsRoute.to,
            params: { proposalId: item.slNo || item.proposalId }
        });
    }, [navigate]);

    const CardWrapper = (props) => {
        return (
            <ProposalCard
                {...props}
                onViewClick={handleViewClick}
                onSplit={handleSplit}
                onMerge={handleMerge}
                isReviseMode={isReviseMode}
                onSaved={handleBulkSave}
                onFormChange={handleFormChange}
            />
        );
    };

    const filters = {};


    const filterConfig = [
        {
            name: 'status',
            label: t('status'),
            type: 'select',
            items: [
                { id: 'Pending', name: t('pending'), value: 'Pending' },
                { id: 'Approved', name: t('approved'), value: 'Approved' },
                { id: 'Rejected', name: t('rejected'), value: 'Rejected' },
                { id: 'Draft', name: t('draft'), value: 'Draft' }
            ]
        }
    ];

    const overAllTotal = overAllTotalIncludeGst || rawData.reduce((sum, item) => sum + (Number(item.totalIncludeGst) || 0), 0);

    const footerBar = (
        <HStack justify="space-between" align="center" w="full" pt={4}>
            <Box border="1px solid #DEDEDE" borderRadius="md" px={4} py={2}>
                <HStack spacing={2}>
                    <Text fontSize="sm" color="#6D6D6D">{t('overAllTotal')}</Text>
                    <Text fontSize="sm" fontWeight="bold" color="#232F50">{overAllTotal}</Text>
                </HStack>
            </Box>
            <HStack spacing={3}>
                <Button
                    variant="outline"
                    borderColor="#8D0247"
                    color="#8D0247"
                    borderRadius="full"
                    px={6}
                    _hover={{ bg: '#FFF5F7' }}
                    onClick={() => navigate({ to: '/app/corporate/enquiry-detailed-view/$enquiryId', params: { enquiryId: resolvedEnquiryId } })}
                >
                    ← {t('back')}
                </Button>
                <Button
                    bg="#8D0247"
                    color="white"
                    borderRadius="full"
                    px={6}
                    _hover={{ bg: '#6d0136' }}
                    onClick={() => {
                        const allCards = tableData;
                        const hasInvalid = allCards.some((item) => {
                            const formVals = cardFormDataRef.current[item.id];
                            if (!formVals) {
                                return !item.lockingPeriod || !item.billingFrequency || !item.finalArc;
                            }
                            return !formVals.lockingPeriod || !formVals.billingFrequency || !formVals.finalArc;
                        });

                        if (hasInvalid) {
                            showToast({
                                title: t('warning'),
                                description: t('pleaseFillAllCardDetails', 'Please fill all required details in each proposal card'),
                                type: 'warning',
                                theme: 'colored'
                            });
                            return;
                        }

                        const proposals = allCards.map((item) => {
                            const formVals = cardFormDataRef.current[item.id];
                            if (formVals) return formVals;
                            const fa = parseFloat(item.finalArc) || 0;
                            const o = parseFloat(item.otc) || 0;
                            const excl = parseFloat((fa + o).toFixed(2));
                            return {
                                locationIds: item.locationIds || [],
                                lockingPeriod: Number(item.lockingPeriod) || 0,
                                billingFrequency: item.billingFrequency || '',
                                arc: Number(item.arc) || 0,
                                discount: Number(item.discount) || 0,
                                finalArc: fa,
                                otc: o,
                                excludeGst: excl,
                                totalIncludeGst: parseFloat((excl * 1.18).toFixed(2)),
                                additionalServices: (item.additionalServices || []).map(s => ({ serviceName: s.serviceName, amount: Number(s.amount || s.planNames) || 0 }))
                            };
                        });

                        dispatch(sliceActions.setProposalParams({ enquiryId: resolvedEnquiryId, currentVersion }));
                        dispatch(bulkUpdateProposals({
                            enquiryId: resolvedEnquiryId,
                            proposals,
                            onSuccess: () => {
                                dispatch(fetchCorporateProposalSend({
                                    enquiryId: resolvedEnquiryId,
                                    version: currentVersion,
                                    onSuccess: () => navigate({
                                        to: isReviseMode ? '/app/corporate/proposals/create-proposal/revise' : '/app/corporate/proposals/create-proposal',
                                        search: { enquiryId: resolvedEnquiryId, version: currentVersion }
                                    })
                                }));
                            }
                        }));
                    }}
                >
                    {t('next')} →
                </Button>
            </HStack>
        </HStack>
    );

    return (
        <Box>
            <GenericCardPage
                pageTitle=""
                data={tableData}
                fetchAction={fetchEnquiryProposals}
                staticParams={{ enquiryId, locationIds: proposalLocationIDs }}
                actions={''}
                footerActions={footerBar}
                tableKey={CORPORATE_KEYS.CORPORATE_PROPOSAL_LIST}
                filterConfig={filterConfig}
                CardComponent={CardWrapper}
                filters={filters}
            />
        </Box>
    );
};

export default ProposalCardList;
