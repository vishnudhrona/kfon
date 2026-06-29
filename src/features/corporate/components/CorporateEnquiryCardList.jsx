import { Button } from '@kfonbss/bss-ui-components';
import { get } from 'lodash-es';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import GenericCardPage from '@/components/custom/GenericCardPage';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchCorporateEnquiryList } from '../action';
import { getTableData } from '../selector';
import CorporateEnquiryCard from './CorporateEnquiryCard';
import CorporateFeasibilityPopup from './popUps/CorporateFeasibilityPopup';

const CorporateEnquiryCardList = () => {
    const { t } = useTranslation();

    const [selectedIds, setSelectedIds] = useState([]);
    const [isFeasibilityModalOpen, setIsFeasibilityModalOpen] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);

    const listData = useSelector(getTableData(SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST));
    const rawData = get(listData, 'data', []);

    const tableData = useMemo(() => {
        return rawData.map((item, idx) => ({
            ...item,
            id: item.enquiryId || `enq-${idx}`,
            isSelected: selectedIds.includes(item.enquiryId || `enq-${idx}`)
        }));
    }, [rawData, selectedIds]);

    const handleRowClick = useCallback((item) => {
        const id = item.id || item.enquiryId;
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((i) => i !== id);
            }
            return [...prev, id];
        });
    }, []);

    const handleEditClick = useCallback((item) => {
        setSelectedEnquiry(item);
        setIsFeasibilityModalOpen(true);
    }, []);

    const CardWrapper = (props) => {
        return (
            <CorporateEnquiryCard
                {...props}
                isSelected={props.data.isSelected}
                onClick={() => handleRowClick(props.data)}
                onEditClick={handleEditClick}
            />
        );
    };

    const handleSelectAll = useCallback(() => {
        if (selectedIds.length === rawData.length && rawData.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(rawData.map(item => item.enquiryId || item.id));
        }
    }, [selectedIds, rawData]);

    const onCloseFeasibilityModal = () => {
        setIsFeasibilityModalOpen(false);
        setSelectedEnquiry(null);
    };
    const filters = {};

    const selectAllCheckbox = (
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingRight: '10px' }}>
            <input
                type="checkbox"
                checked={rawData.length > 0 && selectedIds.length === rawData.length}
                onChange={handleSelectAll}
                style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--chakra-colors-primary-500)',
                    cursor: 'pointer'
                }}
                title={t('selectAll')}
            />
        </div>
    );

    const handleUpdateFeasibility = () => {
        // Open modal only if selection exists? Or always?
        if (selectedIds.length === 0) {
            // Optional: Show toast warning
        }
        setIsFeasibilityModalOpen(true);
    };


    const actions = (
        <Button
            variant="solid"
            bg="#8D0247"
            color="white"
            borderRadius="full"
            onClick={handleUpdateFeasibility}
            _hover={{ bg: "#6d0136" }}
        >
            {t('updateFeasibility')}
        </Button>
    );

    const filterConfig = [
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            items: [
                { id: 'Pending', name: 'Pending', value: 'Pending' },
                { id: 'Active', name: 'Active', value: 'Active' },
                { id: 'Closed', name: 'Closed', value: 'Closed' }
            ]
        }
    ];

    return (
        <>
            <GenericCardPage
                pageTitle=""
                data={tableData}
                fetchAction={fetchCorporateEnquiryList}
                actions={''}
                footerActions={actions}
                tableKey={SERVER_SIDE_TABLE_KEYS.ENQUIRY_LIST}
                filterConfig={filterConfig}
                CardComponent={CardWrapper}
                searchPrefix={selectAllCheckbox}
                filters={filters}
            />

            <CorporateFeasibilityPopup
                isOpen={isFeasibilityModalOpen}
                onClose={onCloseFeasibilityModal}
                enquiryId={selectedEnquiry?.enquiryId}
                locationId={selectedEnquiry?.id}
            />
        </>
    );
};

export default CorporateEnquiryCardList;
