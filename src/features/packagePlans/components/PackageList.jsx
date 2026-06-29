import { Box, Button, HStack, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FilterIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import ExpandButton from '@/components/custom/ExpandButton';
import SearchInput from '@/components/custom/SearchInput';
import { ROUTE_APP, ROUTE_FEATURES } from '@/constants/routes';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';

import { ACTION_TYPES, fetchCorporatePackageList, fetchRetailPackageList } from '../action';
import { getCorporatePackages, getRetailPackages } from '../selector';
import PackageCard from './PackageCard';

const { CirclePlusIcon } = Icons;

const PackageList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const viewType = search.viewType || 'corporate';
  const setViewType = (newType) => navigate({ search: (prev) => ({ ...prev, viewType: newType }) });

  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const tableKey = viewType === 'corporate'
    ? SERVER_SIDE_TABLE_KEYS.CORPORATE_PACKAGES
    : SERVER_SIDE_TABLE_KEYS.RETAIL_PACKAGES;

  const corporatePackages = useSelector(getCorporatePackages);
  const retailPackages = useSelector(getRetailPackages);
  const apiProgress = useSelector(getApiProgress);
  const isListLoading = viewType === 'corporate'
    ? !!apiProgress[ACTION_TYPES.FETCH_CORPORATE_PACKAGE_LIST]
    : !!apiProgress[ACTION_TYPES.FETCH_RETAIL_PACKAGE_LIST];

  const packages = viewType === 'corporate' ? corporatePackages : retailPackages;

  const getList = useCallback(
    (params = {}) => {
      const fetchAction = viewType === 'corporate' ? fetchCorporatePackageList : fetchRetailPackageList;
      dispatch(fetchAction({ ...params, key: tableKey }));
    },
    [dispatch, tableKey, viewType]
  );

  useEffect(() => {
    const fetchParams = { key: tableKey, size: pageSize };
    if (searchQuery.length >= 3) {
      getList({ ...fetchParams, search: searchQuery });
    } else if (searchQuery.length === 0) {
      getList(fetchParams);
    }
  }, [searchQuery, getList, tableKey, pageSize]);

  const handlePageChange = useCallback(
    ({ page, size }) => {
      const newSize = size || pageSize;
      if (size && size !== pageSize) setPageSize(size);
      const params = { page, size: newSize };
      if (searchQuery.length >= 3) params.search = searchQuery;
      getList({ key: tableKey, ...params });
    },
    [pageSize, searchQuery, getList, tableKey]
  );

  const handleSearch = useMemo(
    () =>
      debounce((e) => {
        setSearchQuery(e.target.value);
      }, 500),
    []
  );

  const handleNewPackage = () => {
    const addPath =
      viewType === 'corporate'
        ? ROUTE_FEATURES.PACKAGE_PLANS.ADD_CORPORATE_PACKAGE
        : ROUTE_FEATURES.PACKAGE_PLANS.ADD_RETAIL_PACKAGE;
    navigate({
      to: `/${ROUTE_APP}/${ROUTE_FEATURES.PACKAGE_PLANS.PACKAGES}/${addPath}`
    });
  };

  return (
    <VStack alignItems='stretch' h='full' gap='12px'>
      {/* TOOLBAR */}
      <HStack
        bg='white'
        borderRadius='12px'
        boxShadow='0 2px 12px rgba(0,0,0,0.07)'
        p='12px 16px'
        gap='10px'
        flexWrap='wrap'
      >
        <HStack bg='#F4F5F8' borderRadius='8px' p='3px' gap='2px'>
          <Button
            border='none'
            bg={viewType === 'retail' ? '#F5A623' : 'transparent'}
            color={viewType === 'retail' ? '#1A1A2E' : '#6B7280'}
            onClick={() => setViewType('retail')}
            fontSize='13.5px'
            fontWeight={600}
            h='34px'
            px='20px'
            borderRadius='6px'
            _hover={{ bg: viewType === 'retail' ? '#F5A623' : '#F4F5F8' }}
          >
            {t('retail')}
          </Button>
          <Button
            border='none'
            bg={viewType === 'corporate' ? '#F5A623' : 'transparent'}
            color={viewType === 'corporate' ? '#1A1A2E' : '#6B7280'}
            onClick={() => setViewType('corporate')}
            fontSize='13.5px'
            fontWeight={600}
            h='34px'
            px='20px'
            borderRadius='6px'
            _hover={{ bg: viewType === 'corporate' ? '#F5A623' : '#F4F5F8' }}
          >
            {t('corporate')}
          </Button>
        </HStack>

        <Box minW='200px' maxW='420px' w='320px'>
          <SearchInput placeholder={t('search')} onChange={handleSearch} />
        </Box>

        <HStack ml='auto' gap='10px' flexWrap='wrap' justify='flex-end'>
          <Button
            h='38px'
            px='14px'
            borderRadius='8px'
            variant='outline'
            borderColor='#E5E7EB'
            color='#1A1A2E'
            fontSize='13px'
            fontWeight={500}
            _hover={{ borderColor: '#7B1040', color: '#7B1040' }}
          >
            <FilterIcon /> {t('filter')}
          </Button>

          <CsvDownloadBtn />

          <Button
            h='38px'
            px='14px'
            borderRadius='8px'
            bg='#7B1040'
            color='white'
            fontSize='13px'
            fontWeight={500}
            border='1.5px solid #7B1040'
            _hover={{ bg: '#5A0C2F', borderColor: '#5A0C2F' }}
            onClick={handleNewPackage}
          >
            {CirclePlusIcon && <CirclePlusIcon boxSize='14px' />} {t('newPackage', { defaultValue: 'New Package' })}
          </Button>

          <ExpandButton isAllExpanded={isAllExpanded} setIsAllExpanded={setIsAllExpanded} />
        </HStack>
      </HStack>

      {/* LIST */}
      <Box flex='1' overflowY='auto' w='full' bg='#F4F5F8' borderRadius='12px' p='16px' position='relative' minH='200px'>
        <CustomLoaderProvider isLoading={isListLoading}>
          {packages?.length === 0 ? (
            <Box bg='white' borderRadius='12px' py='60px' textAlign='center'>
              <Text fontSize='14px' color='#6B7280'>
                {isListLoading ? '' : t('noPackagesFound', { defaultValue: 'No packages found' })}
              </Text>
            </Box>
          ) : (
            packages.map((pkg, index) => (
              <PackageCard key={pkg.id || index} data={pkg} index={index} isAllExpanded={isAllExpanded} viewType={viewType} />
            ))
          )}
        </CustomLoaderProvider>
      </Box>

      {/* PAGINATION */}
      <Box mt='auto'>
        <ServerSidePagination tableKey={tableKey} onPageChange={handlePageChange} />
      </Box>
    </VStack>
  );
};

export default PackageList;
