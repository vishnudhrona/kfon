import { Button } from "@kfonbss/bss-ui-components";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { CirclePlusIcon } from "@/components/custom";
import CustomEditIcon from "@/components/custom/CustomEditIcon";
import GenericPageTable from "@/components/custom/GenericPageTable";
import { SERVER_SIDE_TABLE_KEYS } from "@/constants/server_table";
import { mapObjectValues } from "@/utils/commonUtils";

import { fetchDivisionList } from "../action";
import { VISIBLE_COLUMNS_DIVISION_LIST } from "../constants";
import DivisionPopUp from "../pop-up/DivisionPopUp";
import { getDivisionList } from "../selector";

const Division = () => {

    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

    const columns = useMemo(() => {
        const dataColumns = mapObjectValues(VISIBLE_COLUMNS_DIVISION_LIST, t, ['header']).map((col) => {
            if (col.accessor === 'active') {
                return {
                    ...col,
                    cell: (row) => (
                        <span style={{ color: row?.active ? '#16a34a' : '#dc2626' }}>
                            {row?.active ? t('active') : t('inactive')}
                        </span>
                    )
                };
            }
            return col;
        });
        return [
            { header: 'Sl.NO', accessor: 'slNo' },
            ...dataColumns,
            {
                header: t('action'),
                accessor: 'action',
                cell: (row) => (
                    <CustomEditIcon
                        onClick={() => {
                            setIsEditMode(true);
                            setSelectedData(row);
                            setOpen(true);
                        }}
                    />
                )
            }
        ];
    }, [t]);

    const actions = (
        <>
            <Button
                variant={'outline'}
                borderRadius='lg'
                h='10'
                onClick={() => {
                    setIsEditMode(false);
                    setSelectedData(null);
                    setOpen(true);
                }}
            >
                <CirclePlusIcon />
                {t('createDivision')}
            </Button>
        </>
    );

    return (
        <>
            <GenericPageTable
                dataSelector={getDivisionList}
                fetchAction={fetchDivisionList}
                columns={columns}
                actions={actions}
                tableKey={SERVER_SIDE_TABLE_KEYS.DIVISION_LIST_TABLE}
            />

            <DivisionPopUp open={open} setOpen={setOpen} isEditMode={isEditMode} selectedData={selectedData} setSelectedData={setSelectedData} />
        </>
    )
}

export default Division;
