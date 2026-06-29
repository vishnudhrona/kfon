import { Box, Button, Flex } from "@kfonbss/bss-ui-components";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { CirclePlusIcon } from "@/components/custom";
import GenericPageTable from "@/components/custom/GenericPageTable";
import TableActionMenu from "@/components/custom/TableActionMenu";
import { SERVER_SIDE_TABLE_KEYS } from "@/constants/server_table";

import { deleteCrmTemplate, fetchCrmTemplate } from "../action";
import { VISIBLE_COLUMNS_ISSUE_MAPPING } from "../constants";
import CrmMapping from "../popup/CrmMapping";
import { getCrmTemplateList } from "../selector";

const IssueMapping = ({ fetchCrmTemplate, deleteCrmTemplate }) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedData, setSelectedData] = useState(null);

     // eslint-disable-next-line react-hooks/exhaustive-deps
     const handleDelete = (row) => {
        deleteCrmTemplate(row);
    };

    const actionMenuItems = useMemo(() => {
        return [
            {
                label: 'edit',
                onClick: (row) => {
                    handleEdit(row);
                }
            },
            {
                label: 'delete',
                onClick: (row) => {
                    handleDelete(row?.id)
                }
            }
        ]
    }, [handleDelete]);

    const handleEdit = (row) => {
        setIsEditMode(true);
        setSelectedData(row);
        setOpen(true);
    };   

    const handleAdd = () => {
        setIsEditMode(false);
        setSelectedData(null);
        setOpen(true);
    };

    const columns = useMemo(() => [
        { header: 'slNo', accessor: 'slNo' },
        ...VISIBLE_COLUMNS_ISSUE_MAPPING,
        {
            header: 'action',
            accessor: 'action',
            cell: (row) => (
                <Box>
                    <TableActionMenu actionItems={actionMenuItems} row={row} />
                </Box>
            )
        }
    ], [actionMenuItems]);

    const actions = (
        <Flex gap={2}>
            <Button
                variant={'outline'}
                borderRadius='lg'
                h='10'
                onClick={handleAdd}
            >
                <CirclePlusIcon />
                {t('crmMapping')}
            </Button>
        </Flex>
    );


    return (
        <>
            <GenericPageTable
                fetchAction={fetchCrmTemplate}
                dataSelector={getCrmTemplateList}
                tableKey={SERVER_SIDE_TABLE_KEYS.CRM_TEMPLATE_LIST_TABLE}
                columns={columns}
                actions={actions}
            />

            <CrmMapping
                open={open}
                setOpen={setOpen}
                isEditMode={isEditMode}
                initialData={selectedData}
            />
        </>
    );
}

const mapDispatchToProps = {
    fetchCrmTemplate: fetchCrmTemplate,
    deleteCrmTemplate: deleteCrmTemplate
};

export default connect(null, mapDispatchToProps)(IssueMapping);