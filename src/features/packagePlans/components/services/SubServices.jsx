import { Box, Button, HStack, Icons, VStack } from "@kfonbss/bss-ui-components";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { FilterIcon } from "@/components/custom";
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn";
import SearchInput from "@/components/custom/SearchInput";
import { SERVER_SIDE_TABLE_KEYS } from "@/constants/server_table";
import ServerSidePagination from "@/features/others/Pagination/components/Pagination";
import { getServerSidePaginationDetails } from "@/features/others/Pagination/selectors";
import { actions as paginationActions } from "@/features/others/Pagination/slice";
import { selectorWithKey } from "@/utils/commonUtils";

import { fetchSubServices } from "../../action";
import { formatSubServicedata } from "../../helper.jsx";
import SubServicePopup from "../../pop-up/SubServicePopup";
import { getSubServicesData } from "../../selector";
import ServiceCard from "./ServiceCard";

const { UserAdd } = Icons;

const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.SUB_SERVICES_TABLE;

const SubServices = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [editData, setEditData] = useState(null);

    const subServicesData = useSelector(getSubServicesData);
    const paginationDetails = useSelector(getServerSidePaginationDetails);
    const { page } = selectorWithKey(paginationDetails, TABLE_KEY) || {};

    const pageOffset = (page ?? 0) * pageSize;

    const handleEdit = (data) => {
        setEditData(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditData(null);
    };

    const getList = useCallback((params = {}) => {
        dispatch(fetchSubServices({ key: TABLE_KEY, ...params }));
    }, [dispatch]);

    useEffect(() => {
        getList({ page: 0, size: pageSize });
        return () => {
            dispatch(paginationActions.resetPagination({ key: TABLE_KEY }));
        };
    }, [dispatch, getList, pageSize]);

    const handlePageChange = useCallback(({ page: newPage, size: newSize }) => {
        const sz = newSize || pageSize;
        if (newSize && newSize !== pageSize) setPageSize(newSize);
        getList({ page: newPage, size: sz });
    }, [getList, pageSize]);

    const handleSearch = () => { };

    return (
        <>
            <VStack alignItems={'stretch'} h='full' gap='2'>
                <HStack justifyContent='space-between' alignItems='center' p={2}>

                    <Box flex={1} maxW="400px">
                        <SearchInput placeholder={t('search')} onChange={handleSearch} />
                    </Box>
                    <HStack>
                        <Button height={'40px'} borderRadius='md' variant={'outline'}>
                            <FilterIcon />{t('filter')}
                        </Button>
                        <CsvDownloadBtn />
                        <Button height={'40px'} borderRadius='md' variant={'outline'} onClick={() => setOpen(true)}>
                            <UserAdd />
                            {t('createSubService')}
                        </Button>
                    </HStack>
                </HStack>

                <Box
                    flex='1'
                    overflowY='auto'
                    w="full"
                    bg="#F9FAFB"
                    borderRadius="lg"
                    borderStyle="dashed"
                    borderWidth="1px"
                    borderColor="gray.200"
                    p={4}
                >
                    <ServiceCard mainServices={subServicesData} pageOffset={pageOffset} onEdit={handleEdit} formatData={formatSubServicedata} />
                </Box>

                <Box mt={'auto'}>
                    <ServerSidePagination onPageChange={handlePageChange} tableKey={TABLE_KEY} />
                </Box>
            </VStack>

            <SubServicePopup isOpen={open} handleClose={handleClose} editData={editData} />
        </>
    )
}

export default SubServices;