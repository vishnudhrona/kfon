import { Box } from "@kfonbss/bss-ui-components";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { PrintBtn } from "@/components/custom";
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn";
import GenericPageTable from "@/components/custom/GenericPageTable"
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchEnquiryList } from "../action";
import { DARKFIBER_COLUMNS } from "../constants";
import { getEnquiryList } from "../selector";

const CustomersList = () => {
    const { t } = useTranslation()

    const listData = useSelector(getEnquiryList);

    const actions = (
        <Box display='flex' gap='10px'>
            <CsvDownloadBtn />
            <PrintBtn
                title={t('purchaseOrderList')}
                columns={DARKFIBER_COLUMNS}
                data={listData?.data || []}
                label={t('print')}
            />
        </Box>
    );
    return (
        <>
            <GenericPageTable
                fetchAction={fetchEnquiryList}
                tableKey={SERVER_SIDE_TABLE_KEYS.DARK_FIBER_CUSTOMER_LIST}
                dataSelector={getEnquiryList}
                columns={DARKFIBER_COLUMNS}
                actions={actions}
            />
        </>
    )
}

export default CustomersList