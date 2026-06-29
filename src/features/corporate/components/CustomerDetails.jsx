import { Box, Flex, Grid, Icons, Text, VStack } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchCustomerDetails } from '../action';
import { CUSTOMER_DETAILS_DUMMY_DATA } from '../constants';

const { DocumentIcon } = Icons;

const CustomerDetails = () => {
  const { t } = useTranslation();
  const { customerId } = useParams({ strict: false });
  const dispatch = useDispatch();
  const dummyData = CUSTOMER_DETAILS_DUMMY_DATA;

  const apiProgress = useSelector(getApiProgress);
  const isFetching = !!apiProgress[ACTION_TYPES.FETCH_CUSTOMER_DETAILS];

  useEffect(() => {
    if (customerId) {
      dispatch(fetchCustomerDetails({ customerId }));
    }
  }, [dispatch, customerId]);

  const DetailItem = ({ label, value, isDocument }) => (
    <VStack alignItems='start' spacing={0} borderBottom='1px solid #E2E8F0' pb={1}>
      <Text fontSize='xs' color='gray.500' fontWeight='medium'>
        {label}
      </Text>
      {isDocument ? (
        <Flex alignItems='center' color='primary.500' cursor='pointer' gap={2}>
          <DocumentIcon size={14} />
          <Text fontSize='sm' textDecoration='underline'>
            {value}
          </Text>
        </Flex>
      ) : (
        <Text fontSize='sm' fontWeight='semibold' color='gray.700'>
          {value || 'N/A'}
        </Text>
      )}
    </VStack>
  );

  return (
    <CustomLoaderProvider isLoading={isFetching} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
    <VStack alignItems='stretch' h='full' position='relative' spacing={4}>
      <Box px={8} py={2}>
        <Grid
          templateRows='repeat(9, auto)'
          templateColumns='repeat(2, 1fr)'
          gridAutoFlow='column'
          columnGap={10}
          rowGap={2}
        >
          {dummyData.map((item, index) => (
            <DetailItem key={index} label={t(item.label)} value={item.value} isDocument={item.isDocument} />
          ))}
        </Grid>
      </Box>
    </VStack>
    </CustomLoaderProvider>
  );
};

export default CustomerDetails;
