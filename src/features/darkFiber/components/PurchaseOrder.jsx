import { Box, Preview, Span, useForm } from "@kfonbss/bss-ui-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { PrintBtn } from "@/components/custom";
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn";
import GenericPageTable from "@/components/custom/GenericPageTable";
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';

import { fetchEnquiryList } from "../action";
import { DARKFIBER_COLUMNS } from "../constants";
import { getEnquiryList } from "../selector";

const PurchaseOrder = () => {
    const { t } = useTranslation();
    const [selectedRow, setSelectedRow] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const { control, formState: { errors } } = useForm();

    const transformRowToPreviewData = (row) => {
        const baseFields = Object.keys(row).map((key) => ({
            label: t(key),
            value: <Span color='primary.500' fontWeight='semibold'>{row[key]}</Span>
        }));

        return [
            ...baseFields,
            {
                label: t('PanNumber'),
                type: 'text',
                name: 'panNumber',
                placeholder: t('enterPanNumber'),
                rules: { required: t('fieldRequired') }
            },
            {
                label: t('GstNumber'),
                type: 'gstInput',
                name: 'gstNumber',
                placeholder: t('enterGstNumber'),
                rules: { required: t('fieldRequired') }
            },
            {
                label: t('panDocument'),
                type: 'file',
                name: 'panDocument',
                placeholder: t('enterPanDocument'),
                rules: { required: t('fieldRequired') }
            },
            {
                label: t('gstDocument'),
                type: 'file',
                name: 'gstDocument',
                placeholder: t('enterGstDocument'),
                rules: { required: t('fieldRequired') }
            },
            {
                label: t('panDocument'),
                buttonLabel: t('view'),
                type: 'button'
            }
        ];
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);
        setShowPreview(true);
    };

    const handleBackClick = () => {
        setShowPreview(false);
        setSelectedRow(null);
    };

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
            <Box position="relative">
                <GenericPageTable
                    fetchAction={fetchEnquiryList}
                    tableKey={SERVER_SIDE_TABLE_KEYS.DARK_FIBER_ENQUIRY_LIST}
                    dataSelector={getEnquiryList}
                    columns={DARKFIBER_COLUMNS}
                    actions={actions}
                    onRowClick={handleRowClick}
                />

                {showPreview && selectedRow && (
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        zIndex={10}
                        bg="white"
                    >
                        <Preview
                            data={transformRowToPreviewData(selectedRow)}
                            control={control}
                            errors={errors}
                            onBack={handleBackClick}
                        />
                    </Box>
                )}
            </Box>
        </>
    );
};

export default PurchaseOrder;