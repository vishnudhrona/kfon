import { Box, Button, Flex, Icons, Input, Select, Text, VStack } from '@kfonbss/bss-ui-components';
import { useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchLocationDetails } from '../action';
import {
  CORPORATE_STATUS_OPTIONS,
  DUMMY_ENQ_CUSTOMER_DETAILS_DATA,
  ENQ_CUSTOMER_DETAILS_COLUMNS,
  SCOPE_OPTIONS
} from '../constants';

const { BsXCircle, BsArrowRightCircle } = Icons;

const CorpEnqCustomerDetails = () => {
  const { t } = useTranslation();
  const { enquiryId } = useParams({ strict: false });
  const dispatch = useDispatch();
  const router = useRouter();

  // Local state for form fields
  const [formData, setFormData] = useState({
    feasibilityStatus: DUMMY_ENQ_CUSTOMER_DETAILS_DATA.feasibilityStatus || '',
    scope: DUMMY_ENQ_CUSTOMER_DETAILS_DATA.scope || '',
    remarks: DUMMY_ENQ_CUSTOMER_DETAILS_DATA.remarks || ''
  });

  const apiProgress = useSelector(getApiProgress);
  const isFetching = !!apiProgress[ACTION_TYPES.FETCH_LOCATION_DETAILS];

  useEffect(() => {
    if (enquiryId) {
      dispatch(fetchLocationDetails({ enquiryId }));
    }
  }, [dispatch, enquiryId]);

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const DetailItem = ({ label, value, color, children }) => (
    <Flex align='baseline' gap={4} borderBottom='1px solid' borderColor='gray.200' py={4} pr={10}>
      <Text color='gray.500' fontSize='14px' minW='200px'>
        {t(label)}
      </Text>
      <Box flex={1}>
        {children ? (
          children
        ) : (
          <Text fontSize='14px' fontWeight='bold' color={color || 'gray.800'}>
            {value || '-'}
          </Text>
        )}
      </Box>
    </Flex>
  );

  const HIGHLIGHT_FIELDS = ['companyName', 'contactName', 'contactNumber'];

  return (
    <CustomLoaderProvider isLoading={isFetching} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
    <VStack alignItems='stretch' h='full' position='relative' bg='white' p={6} borderRadius='8px'>
      {ENQ_CUSTOMER_DETAILS_COLUMNS.map((col) => (
        <Box key={col.accessor}>
          <DetailItem
            label={col.header}
            value={DUMMY_ENQ_CUSTOMER_DETAILS_DATA[col.accessor]}
            color={HIGHLIGHT_FIELDS.includes(col.accessor) ? 'primary.500' : undefined}
          />
          {col.accessor === 'address' && (
            <DetailItem label='Check Feasible'>
              <Button variant='outline' size='sm' colorScheme='pink' borderRadius='full' px={6}>
                {t('View')}
              </Button>
            </DetailItem>
          )}
        </Box>
      ))}

      {/* Form Fields */}
      <DetailItem label='Feasibility Status'>
        <Select
          options={CORPORATE_STATUS_OPTIONS}
          value={CORPORATE_STATUS_OPTIONS.find((opt) => opt.value === formData.feasibilityStatus) || null}
          placeholder='Select Feasibility Status'
          triggerProps={{
            h: '42px',
            border: '1px solid',
            borderColor: 'gray.200',
            borderRadius: '6px',
            paddingInlineStart: '12px',
            width: '400px'
          }}
          onChange={(val) => handleInputChange('feasibilityStatus', val)}
        />
      </DetailItem>

      <DetailItem label='Scope'>
        <Select
          options={SCOPE_OPTIONS}
          value={SCOPE_OPTIONS.find((opt) => opt.value === formData.scope) || null}
          placeholder='Select Scope'
          triggerProps={{
            h: '42px',
            border: '1px solid',
            borderColor: 'gray.200',
            borderRadius: '6px',
            paddingInlineStart: '12px',
            width: '400px'
          }}
          onChange={(val) => handleInputChange('scope', val)}
        />
      </DetailItem>

      <DetailItem label='Remarks *'>
        <Input
          as='textarea'
          value={formData.remarks}
          onChange={(e) => handleInputChange('remarks', e.target.value)}
          placeholder='Remarks'
          height='100px'
          py={2}
          resize='vertical'
          width='400px'
        />
      </DetailItem>

      <Flex w='full' justify='flex-end' pt={8} gap={4}>
        <Button
          variant='outline'
          h='10'
          px='8'
          borderRadius='full'
          onClick={() => router.history.back()}
          color='pink.600'
          borderColor='pink.200'
        >
          <BsXCircle style={{ marginRight: '8px' }} />
          {t('Back')}
        </Button>

        <Button type='button' h='10' px='8' borderRadius='full' colorScheme='pink'>
          {t('Submit')}
          <BsArrowRightCircle style={{ marginLeft: '8px' }} />
        </Button>
      </Flex>
    </VStack>
    </CustomLoaderProvider>
  );
};

export default CorpEnqCustomerDetails;
