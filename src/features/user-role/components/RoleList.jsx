import { Box, Button, Flex } from "@kfonbss/bss-ui-components";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { CirclePlusIcon } from "@/components/custom";
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn";
import GenericPageTable from "@/components/custom/GenericPageTable";
import TableActionMenu from "@/components/custom/TableActionMenu";
import Toggle from "@/components/custom/Toggle";
import { SERVER_SIDE_TABLE_KEYS } from "@/constants/server_table";
import { mapObjectValues } from "@/utils/commonUtils";

import { clearEditUserPermission, downloadRoleListCsv, fetchEditUserPermission, fetchUserRoleList, updateRoleStatus } from "../action";
import { VISIBLE_COLUMNS_ROLE_LIST } from "../constants";
import { getUserRoleList } from "../selector";

const RoleList = ({ fetchEditRole, clearEditUserPermission, downloadRoleListCsv, updateRoleStatus }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        clearEditUserPermission();
    }, [clearEditUserPermission]);

    const actionMenuItems = useMemo(() => {
        return [
            {
                label: 'edit',
                onClick: (row) => fetchEditRole(row?.id)
            },
            {
                label: 'changeStatus',
                component: ({ row }) => (
                    <>
                        {row.active ? t('active') : t('inActive')}
                        <Toggle
                            checked={(row.active ?? true)}
                            onChange={() => updateRoleStatus({ id: row.id, active: !(row.active ?? true) })}
                            size='sm'
                        />
                    </>
                )
            }
        ]
    }, [fetchEditRole, updateRoleStatus, t]);

    const columns = useMemo(() => {
        const dataColumns = mapObjectValues(VISIBLE_COLUMNS_ROLE_LIST, t, ['header']);
        const updatedColumns = dataColumns.map((col) => {
            if (col.accessor === 'active') {
                return {
                    ...col,
                    cell: (row) => (
                        <Box color={row.active ? 'green.500' : 'red.500'}>
                            {row.active ? t('active') : t('inActive')}
                        </Box>
                    )
                };
            }
            return col;
        });

        return [
            { header: 'Sl.NO', accessor: 'slNo' },
            ...updatedColumns,
            {
                header: t('action'),
                accessor: 'action',
                cell: (row) => (
                    <Box>
                        <TableActionMenu actionItems={actionMenuItems} row={row} />
                    </Box>
                )
            }
        ];
    }, [t, actionMenuItems]);

    const actions = (
        <Flex gap={2}>
            <CsvDownloadBtn onClick={() => downloadRoleListCsv()} />
            <Button
                variant={'outline'}
                borderRadius='lg'
                h='10'
                onClick={() => navigate({ to: '/app/users/roles/permission' })}
            >
                <CirclePlusIcon />
                {t('newRole')}
            </Button>
        </Flex>
    );

    return (
        <>
            <GenericPageTable
                fetchAction={fetchUserRoleList}
                dataSelector={getUserRoleList}
                tableKey={SERVER_SIDE_TABLE_KEYS.USER_ROLE_LIST_TABLE}
                columns={columns}
                actions={actions}
            />
        </>
    );
};

const mapDispatchToProps = {
    fetchEditRole: fetchEditUserPermission,
    clearEditUserPermission,
    downloadRoleListCsv,
    updateRoleStatus
};

export default connect(null, mapDispatchToProps)(RoleList);