import { Box, Flex, Tab, Text, VStack } from '@kfonbss/bss-ui-components';
import { debounce, get } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import SearchInput from '@/components/custom/SearchInput';
import ServerSidePagination from '@/features/others/Pagination/components/Pagination';
import { getServerSidePaginationDetails } from '@/features/others/Pagination/selectors';
import { selectorWithKey } from '@/utils/commonUtils';

import { fetchPackageList, fetchPackageType } from '../../../actions';
import { PACKAGE_LIST_TABLE_KEY } from '../../../constants';
import { getPackageList, getPackageTypeList } from '../../../selectors';
import PackageCard from './PackageCard';
import PackageConfirmationPopup from './PackageConfirmationPopup';

const PackageSelection = ({ setValue, packageId, setPackageId, subscriptionType, planType, error }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const packageTypeList = useSelector(getPackageTypeList);
  const packageList = useSelector(getPackageList);

  const paginationDetails = useSelector(getServerSidePaginationDetails);
  // Just trigger re-render on pagination change; no local use of page/size needed
  selectorWithKey(paginationDetails, PACKAGE_LIST_TABLE_KEY);

  const [selectedPackageType, setSelectedPackageType] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const [tempSelectedRow, setTempSelectedRow] = useState(null);

  const selectedPackageRef = useRef(null);

  const getList = useCallback(
    (params = {}) => {
      dispatch(fetchPackageList({ key: PACKAGE_LIST_TABLE_KEY, ...params }));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchPackageType());
  }, [dispatch]);

  useEffect(() => {
    if (packageTypeList && packageTypeList.length > 0) {
      setSelectedPackageType(packageTypeList[0]);
    }
  }, [packageTypeList]);

  const debounceSearch = useMemo(() => debounce((value) => setDebouncedSearchTerm(value), 500), []);

  useEffect(() => {
    return () => debounceSearch.cancel();
  }, [debounceSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debounceSearch(e.target.value);
  };

  useEffect(() => {
    const params = { size: pageSize };
    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (selectedPackageType) params.packageType = selectedPackageType.name;
    if (subscriptionType) params.subscriptionType = subscriptionType;
    if (planType) params.planType = planType;
    getList(params);
  }, [getList, pageSize, debouncedSearchTerm, selectedPackageType, subscriptionType, planType]);

  const handlePageChange = useCallback(
    ({ page, size }) => {
      const newSize = size || pageSize;
      if (size && size !== pageSize) {
        setPageSize(size);
      }
      const params = { page, size: newSize };
      getList({ ...params });
    },
    [pageSize, getList]
  );

  const handleRowClick = (row) => {
    setTempSelectedRow(row);
    setPopupOpen(true);
  };

  const handleConfirmSelection = () => {
    if (tempSelectedRow) {
      setValue('selectedPackage', tempSelectedRow.packageName, { shouldValidate: true });
      setPackageId(tempSelectedRow.id);

      if (selectedPackageRef.current) {
        selectedPackageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    setPopupOpen(false);
  };

  return (
    <>
      <VStack alignItems='stretch' w='full' gridColumn={{ base: 'span 1', md: 'span 2', xl: 'span 3' }} spacing={4} overflow='visible'>
        {/* Header row: title + tabs + search */}
        <Box>
          <Text fontSize='lg' fontWeight='semibold'>
            {selectedPackageType ? `${selectedPackageType.name} ${t('plansAvailable')}` : t('fupPlansAvailable')}
          </Text>
          <Text color='font_color.placeholder' fontSize='sm'>
            {t('fupPlansDisclaimer')}
          </Text>
        </Box>

        <Flex w='full' align='center' justify='space-between' gap={4} flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
          <Flex align='center' gap={4} w={{ base: 'full', lg: 'auto' }} flexWrap='wrap'>
            {packageTypeList && packageTypeList.length > 0 && (
              <Tab
                key={packageTypeList[0].id}
                hilightColor='yellow.400'
                fontColor='gray.900'
                backgroundColor='background.light_gray'
                defaultValue={packageTypeList[0].id}
                items={packageTypeList.map((packageType) => ({
                  label: packageType.name,
                  value: packageType.id
                }))}
                onChange={(value) => {
                  const selected = packageTypeList.find((type) => type.id === value);
                  setSelectedPackageType(selected);
                }}
              />
            )}
            <SearchInput placeholder={t('search')} value={searchTerm} onChange={handleSearchChange} width={{ base: 'full', lg: '282px' }} />
          </Flex>
        </Flex>

        {/* Scrollable card grid */}
        <Box
          bg='#F8F8F8'
          borderRadius='9px'
          p={4}
          maxH='304px'
          overflowY='auto'
          overflowX='hidden'
          ref={selectedPackageRef}
        >
          <Box display='grid' gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
            {get(packageList, 'data', []).map((row) => (
              <PackageCard
                key={row.id}
                row={row}
                isSelected={row.id === packageId}
                onClick={() => handleRowClick(row)}
              />
            ))}
          </Box>
        </Box>

        <ServerSidePagination onPageChange={handlePageChange} tableKey={PACKAGE_LIST_TABLE_KEY} />

        {error && (
          <Text fontSize='sm' color='toast.error'>
            {error}
          </Text>
        )}
      </VStack>

      <PackageConfirmationPopup
        isOpen={popupOpen}
        onOpenChange={setPopupOpen}
        tempSelectedRow={tempSelectedRow}
        onConfirm={handleConfirmSelection}
      />
    </>
  );
};

export default PackageSelection;
