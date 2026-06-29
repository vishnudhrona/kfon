import { Button, Flex, Tooltip } from "@kfonbss/bss-ui-components";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

import { CirclePlusIcon } from "@/components/custom";
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn";
import GenericPageTable from "@/components/custom/GenericPageTable";
import TableActionMenu from "@/components/custom/TableActionMenu";
import { SERVER_SIDE_TABLE_KEYS } from "@/constants/server_table";
import { mapObjectValues } from '@/utils/commonUtils';

import { delinkUser, downloadSeatListCsv, fetchSeatList } from "../action";
import { VISIBLE_COLUMNS_SEAT_LIST } from "../constants";
import CreateSeat from "../pop-up/CreateSeat";
import LinkUser from "../pop-up/LinkUser";
import PincodeMapping from "../pop-up/PincodeMapping";
import { getSeatList } from "../selector";

const SeatList = ({ delinkUser, downloadSeatListCsv }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedSeatRow, setSelectedSeatRow] = useState(null);
    const [isPincodeOpen, setIsPincodeOpen] = useState(false);

    const columns = useMemo(() => {
        const dataColumns = mapObjectValues(VISIBLE_COLUMNS_SEAT_LIST, t, ['header']).map((col) => {
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
            if (['roleStatus', 'userStatus', 'pincodeStatus'].includes(col.accessor)) {
                return {
                    ...col,
                    cell: (row) => (
                        <span style={{ color: row?.[col.accessor] ? '#16a34a' : '#8D0247' }}>
                            {row?.[col.accessor] ? 'Mapped' : 'Unmapped'}
                        </span>
                    )
                };
            }
            if (col.accessor === 'roles') {
                return {
                    ...col,
                    cell: (row) => {
                        const roleNames = row?.roles || [];
                        if (roleNames.length === 0) return '-';
                        if (roleNames.length <= 2) {
                            return roleNames.join(', ');
                        }
                        const displayed = roleNames.slice(0, 2).join(', ') + '...';
                        const tooltipContent = roleNames.join(', ');
                        return (
                            <Tooltip content={tooltipContent} contentProps={{ bg: 'gray.100', color: 'black' }}>
                                <span style={{ cursor: 'pointer' }}>
                                    {displayed}
                                </span>
                            </Tooltip>
                        );
                    }
                };
            }
            if (col.accessor === 'pincodes') {
                return {
                    ...col,
                    cell: (row) => {
                        const pinCodes = row?.pincodes?.map((p) => typeof p === 'object' ? p?.pincode : p).filter(Boolean) || [];
                        if (pinCodes.length === 0) return '-';
                        if (pinCodes.length <= 3) {
                            return pinCodes.join(', ');
                        }
                        const displayed = pinCodes.slice(0, 3).join(', ') + '...';
                        const tooltipContent = pinCodes.join(', ');
                        return (
                            <Tooltip content={tooltipContent} contentProps={{ bg: 'gray.100', color: 'black' }}>
                                <span style={{ cursor: 'pointer' }}>
                                    {displayed}
                                </span>
                            </Tooltip>
                        );
                    }
                };
            }
            if (col.accessor === 'districtMaps') {
                return {
                    ...col,
                    cell: (row) => {
                        const districtNames = row?.districtMaps?.map((d) => d.districtName).filter(Boolean) || [];
                        if (districtNames.length === 0) return '-';
                        if (districtNames.length <= 3) {
                            return districtNames.join(', ');
                        }
                        const displayed = districtNames.slice(0, 3).join(', ') + '...';
                        const tooltipContent = districtNames.join(', ');
                        return (
                            <Tooltip content={tooltipContent} contentProps={{ bg: 'gray.100', color: 'black' }}>
                                <span style={{ cursor: 'pointer' }}>
                                    {displayed}
                                </span>
                            </Tooltip>
                        );
                    }
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
                    <TableActionMenu
                        row={row}
                        actionItems={[
                            { label: 'roleMapping', onClick: (r) => navigate({ to: '/app/users/seat-list/role-mapping', state: { seatRow: r } }) },
                            {
                                label: row?.userStatus ? 'delinkUser' : 'linkUser',
                                onClick: (r) => {
                                    if (row?.userStatus) {
                                        delinkUser({ seatUserId: r?.seatUserId });
                                    } else {
                                        setIsEditMode(false);
                                        setSelectedSeatRow(r);
                                        setIsOpen(true);
                                    }
                                }
                            },
                            ...(row?.userStatus ? [{ label: 'pincodeMapping', onClick: (r) => { setIsPincodeOpen(true); setSelectedSeatRow(r); } }] : []),
                            { label: 'editSeat', onClick: (r) => { setIsEditMode(true); setSelectedSeatRow(r); setOpen(true); } }
                        ]}
                    />
                )
            }
        ];
    }, [t, navigate, delinkUser]);

    const actions = (
        <Flex gap={2}>
            <CsvDownloadBtn onClick={() => downloadSeatListCsv()} />
            <Button
                variant={'outline'}
                borderRadius='lg'
                h='10'
                onClick={() => { setIsEditMode(false); setSelectedSeatRow(null); setOpen(true); }}
            >
                <CirclePlusIcon />
                {t('createSeat')}
            </Button>
        </Flex>
    );
    return (
        <>
            <GenericPageTable
                dataSelector={getSeatList}
                fetchAction={fetchSeatList}
                columns={columns}
                actions={actions}
                tableKey={SERVER_SIDE_TABLE_KEYS.SEAT_LIST_TABLE}
            />
            <CreateSeat open={open} setOpen={setOpen} seatRow={selectedSeatRow} isEditMode={isEditMode} />
            <LinkUser isOpen={isOpen} setIsOpen={setIsOpen} seatRow={selectedSeatRow} isEditMode={isEditMode} />
            <PincodeMapping isOpen={isPincodeOpen} setIsOpen={setIsPincodeOpen} seatRow={selectedSeatRow} />
        </>
    );
};

const mapDispatchToProps = {
    delinkUser,
    downloadSeatListCsv
};

export default connect(null, mapDispatchToProps)(SeatList);