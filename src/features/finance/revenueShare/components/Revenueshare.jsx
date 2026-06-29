import { Box, Button } from "@kfonbss/bss-ui-components";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { CirclePlusIcon } from "@/components/custom";
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn";
import GenericPageTable from "@/components/custom/GenericPageTable";
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { fetchDistrict } from "@/features/common/actions";
import { getDistrict } from "@/features/common/selectors";
import { fetchOnboardingSharePlan } from "@/features/onboarding/action";
import { getSharePlan } from "@/features/onboarding/selector";
import { mapObjectValues } from "@/utils/commonUtils";

import { downloadRevenueShareCsv, fetchRevenueShareList } from "../action";
import { VISIBLE_COLUMNS } from "../constants";
import NewGroup from "../popup/NewGroup";
import { getRevenueShareList } from "../selector";

const Revenueshare = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);

    const districtList = useSelector(getDistrict);
    const sharePlanList = useSelector(getSharePlan);

    useEffect(() => {
        dispatch(fetchDistrict());
        dispatch(fetchOnboardingSharePlan());
    }, [dispatch]);

    const columns = useMemo(() => {
        const dataColumns = mapObjectValues(VISIBLE_COLUMNS, t, ['header']);
        return [
            { header: 'SL.NO', accessor: 'slNo' },
            ...dataColumns
        ];
    }, [t]);

    const filterConfig = useMemo(
        () => [
            {
                name: 'district',
                label: 'district',
                type: 'select',
                items: districtList?.map((d) => ({ id: d.name, name: d.name })) || [],
                isClearable: true
            },
            {
                name: 'revenueShareUuid',
                label: 'revenueShareType',
                type: 'select',
                items: sharePlanList?.map((s) => ({ id: s.id, name: s.name })) || [],
                isClearable: true
            }
        ],
        [districtList, sharePlanList]
    );

    const actions = (
        <Box display='flex' gap='10px'>
            <CsvDownloadBtn onClick={() => dispatch(downloadRevenueShareCsv())} />
            <Button variant={'solid'} h={'40px'} borderRadius={'md'} onClick={() => setIsOpen(true)}>
                <CirclePlusIcon />
                {t('createNewGroup')}
            </Button>
        </Box>
    );

    return (
        <>
            <GenericPageTable
                pageTitle={t('revenueShareGroup')}
                fetchAction={fetchRevenueShareList}
                dataSelector={getRevenueShareList}
                columns={columns}
                actions={actions}
                filterConfig={filterConfig}
                tableKey={SERVER_SIDE_TABLE_KEYS.REVENUE_SHARE_TABLE}
            />

            <NewGroup isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default Revenueshare;
