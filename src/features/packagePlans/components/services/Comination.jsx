import { Box, Button, HStack, Icons, VStack } from "@kfonbss/bss-ui-components"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"

import { FilterIcon } from "@/components/custom"
import CsvDownloadBtn from "@/components/custom/CsvDownloadBtn"
import SearchInput from "@/components/custom/SearchInput"
import { SERVER_SIDE_TABLE_KEYS } from "@/constants/server_table"
import ServerSidePagination from "@/features/others/Pagination/components/Pagination"
import { getServerSidePaginationDetails } from "@/features/others/Pagination/selectors"
import { actions as paginationActions } from "@/features/others/Pagination/slice"
import { selectorWithKey } from "@/utils/commonUtils"

import { fetchServiceMappings } from "../../action"
import { formatServiceMappingData } from "../../helper"
import CombinationPopup from "../../pop-up/CombinationPopup"
import { getServiceMappingsData } from "../../selector"
import ServiceCard from "./ServiceCard"

const { UserAdd } = Icons
const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.SERVICE_MAPPING_TABLE

const Combination = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const search = useSearch({ strict: false });
    const type = search.type || 'CORPORATE';
    const setType = (newType) => navigate({
        search: (prev) => {
            const searchParams = { ...prev, type: newType };
            delete searchParams.viewType;
            return searchParams;
        }
    });

    const [open, setOpen] = useState(false)
    const [pageSize, setPageSize] = useState(10)
    const [editData, setEditData] = useState(null)

    const serviceMappingsData = useSelector(getServiceMappingsData)

    const paginationDetails = useSelector(getServerSidePaginationDetails)
    const { page } = selectorWithKey(paginationDetails, TABLE_KEY) || {}

    const pageOffset = (page ?? 0) * pageSize

    const getList = useCallback((params = {}) => {
        dispatch(fetchServiceMappings({ key: TABLE_KEY, type, ...params }))
    }, [dispatch, type])

    useEffect(() => {
        getList({ page: 0, size: pageSize })
        return () => {
            dispatch(paginationActions.resetPagination({ key: TABLE_KEY }))
        }
    }, [dispatch, getList, pageSize, type])

    const handlePageChange = useCallback(({ page: newPage, size: newSize }) => {
        const sz = newSize || pageSize
        if (newSize && newSize !== pageSize) setPageSize(newSize)
        getList({ page: newPage, size: sz })
    }, [getList, pageSize])

    const handleSearch = (e) => {
        getList({ page: 0, size: pageSize, search: e.target.value })
    }

    const handleEdit = (data) => {
        setEditData(data)
        setOpen(true)
    }

    return (
        <>
            <VStack alignItems={'stretch'} h='full' gap='2'>
                <HStack justifyContent='space-between' alignItems='center' p={2}>
                    <Box display={'flex'} bg="gray.100" borderRadius="140px" p={1}>
                        <Button
                            border="none"
                            bg={type === 'CORPORATE' ? '#FFDE74' : 'transparent'}
                            color={type === 'CORPORATE' ? '#000' : 'gray.500'}
                            onClick={() => setType('CORPORATE')}
                            fontSize='16px'
                            fontWeight='500'
                            fontStyle='normal'
                            width='140px'
                            height='40px'
                        >
                            {t('corporate')}
                        </Button>
                        <Button
                            border="none"
                            bg={type === 'RETAIL' ? '#FFDE74' : 'transparent'}
                            color={type === 'RETAIL' ? '#000' : 'gray.500'}
                            onClick={() => setType('RETAIL')}
                            fontSize='16px'
                            fontWeight='500'
                            fontStyle='normal'
                            width='140px'
                            height='40px'
                        >
                            {t('retail')}
                        </Button>
                    </Box>
                    <Box flex={1} maxW="400px">
                        <SearchInput placeholder={t('search')} onChange={handleSearch} />
                    </Box>
                    <HStack>
                        <Button height={'40px'} borderRadius='md' variant={'outline'}>
                            <FilterIcon />{t('filter')}
                        </Button>
                        <CsvDownloadBtn />
                        <Button height={'40px'} borderRadius='md' variant={'outline'} onClick={() => { setEditData(null); setOpen(true); }}>
                            <UserAdd />
                            {t('combineServices')}
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
                    <ServiceCard
                        mainServices={serviceMappingsData}
                        pageOffset={pageOffset}
                        formatData={formatServiceMappingData}
                        onEdit={handleEdit}
                    />
                </Box>

                <Box mt={'auto'}>
                    <ServerSidePagination onPageChange={handlePageChange} tableKey={TABLE_KEY} />
                </Box>
            </VStack>

            <CombinationPopup isOpen={open} handleClose={() => { setOpen(false); setEditData(null); }} editData={editData} type={type} />
        </>
    )
}

export default Combination