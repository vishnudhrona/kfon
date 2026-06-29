import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Flex,
  FormController,
  Grid,
  GridItem,
  HStack,
  Icons,
  Spinner,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useLocation, useParams, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { MENU_KEYS, PERMISSIONS } from '@/constants/permissions';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { usePageActions } from '@/hooks/usePageActions';

import {
  ACTION_TYPES,
  createCircuitProvisioning,
  fetchCircuitMulticastTypes,
  fetchCircuitProvisioning,
  fetchCircuitServiceProviders,
  fetchNearestPop,
  updateCircuitProvisioning
} from '../action';
import { getCircuitMulticastTypes, getCircuitProvisioningDetails, getCircuitServiceProviders, getNearestPopList } from '../selector';
import { circuitProvisioningSchema } from '../validation';

const Sep = () => <Box h='20px' w='1px' bg='rgba(130,130,130,0.19)' flexShrink={0} />;

const InfoField = ({ label, value, highlight }) => (
  <Text fontSize='15px' color='gray.500' fontWeight='600' flexShrink={0}>
    {label}:{' '}
    <Text as='span' fontWeight='600' fontSize='15px' color={highlight ? '#8D0247' : 'gray.800'}>{value || '-'}</Text>
  </Text>
);

const CorporateCircuitProvisioning = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { enquiryId } = useParams({ strict: false });
  const routeState = useLocation({ select: (l) => l.state }) ?? {};
  const locationId = routeState?.locationId;

  const { MobileNewIcon, NewEmailIcon, AddressCardIcon, CardUserIcon } = Icons;

  const { hasPermission } = usePageActions(MENU_KEYS.CORPORATE_CIRCUIT_PROVISIONING);
  const canSave = hasPermission(PERMISSIONS.CORPORATE.CORP_SAVE_CIRCUIT_PROVISIONING);

  const circuitDetails = useSelector(getCircuitProvisioningDetails);
  const d = circuitDetails?.data;

  const { data: nearestPopList = [] } = useSelector(getNearestPopList);
  const { data: multicastTypeList = [] } = useSelector(getCircuitMulticastTypes);
  const { data: serviceProviderList = [] } = useSelector(getCircuitServiceProviders);

  const apiProgress = useSelector(getApiProgress);
  const isFetchingDetails = !!apiProgress[ACTION_TYPES.FETCH_CIRCUIT_PROVISIONING];
  const isSaving = !!apiProgress[ACTION_TYPES.CREATE_CIRCUIT_PROVISIONING] || !!apiProgress[ACTION_TYPES.UPDATE_CIRCUIT_PROVISIONING];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(circuitProvisioningSchema(t)),
    defaultValues: {
      serviceProvider: null,
      popName: null,
      portDetails: '',
      circuitDetails: '',
      multicastType: null,
      multicastSourceAddress: ''
    }
  });

  useEffect(() => {
    dispatch(fetchNearestPop());
    dispatch(fetchCircuitMulticastTypes());
    dispatch(fetchCircuitServiceProviders());
    if (enquiryId && locationId) {
      dispatch(fetchCircuitProvisioning({ enquiryId, locationId }));
    }
  }, [dispatch, enquiryId, locationId]);

  useEffect(() => {
    if (d) {
      const matchedServiceProvider = serviceProviderList.find(
        (item) => item.id === d.serviceProvider || item.name === d.serviceProvider || item.value === d.serviceProvider
      ) ?? null;
      const matchedPop = nearestPopList.find(
        (item) => item.id === d.popName || item.id === d.popNameId || item.name === d.popName
      ) ?? null;
      const matchedMulticastType = multicastTypeList.find(
        (item) => item.id === d.multicastType || item.name === d.multicastType || item.value === d.multicastType
      ) ?? null;

      reset({
        serviceProvider: matchedServiceProvider
          ? { id: matchedServiceProvider.id ?? matchedServiceProvider.value ?? matchedServiceProvider.name, name: matchedServiceProvider.name ?? matchedServiceProvider.label }
          : null,
        popName: matchedPop
          ? { id: matchedPop.id, name: matchedPop.name }
          : null,
        portDetails: d.portDetails || '',
        circuitDetails: d.circuitDetails || '',
        multicastType: matchedMulticastType
          ? { id: matchedMulticastType.id ?? matchedMulticastType.value ?? matchedMulticastType.name, name: matchedMulticastType.name ?? matchedMulticastType.label }
          : null,
        multicastSourceAddress: d.multicastSourceAddress || ''
      });
    }
  }, [d, nearestPopList, serviceProviderList, multicastTypeList, reset]);

  const navigateAfterSubmit = () =>
    router.navigate({ to: '/app/corporate/enquiry-detailed-view/circuit-provisioning/$enquiryId', params: { enquiryId } });

  const onSubmit = (formData) => {
    const payload = {
      enquiryId,
      locationId,
      serviceProvider: formData.serviceProvider?.id ?? formData.serviceProvider ?? null,
      popName: formData.popName?.id ?? formData.popName ?? null,
      portDetails: formData.portDetails,
      circuitDetails: formData.circuitDetails,
      multicastType: formData.multicastType?.id ?? formData.multicastType ?? null,
      multicastSourceAddress: formData.multicastSourceAddress
    };
    if (d?.id) {
      dispatch(updateCircuitProvisioning({ ...payload, onSuccess: navigateAfterSubmit }));
    } else {
      dispatch(createCircuitProvisioning({ ...payload, onSuccess: navigateAfterSubmit }));
    }
  };

  const serviceProviderOptions = serviceProviderList.map((item) => ({ id: item.id ?? item.value ?? item.name, name: item.name ?? item.label }));
  const popNameOptions = nearestPopList.map((item) => ({ id: item.id, name: item.name }));
  const multicastTypeOptions = multicastTypeList.map((item) => ({ id: item.id ?? item.value ?? item.name, name: item.name ?? item.label }));

  return (
    <CustomLoaderProvider isLoading={isFetchingDetails} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
      <VStack alignItems='stretch' spacing={4} bg='white' borderRadius='8px' p={4}>

        {/* ── Card view: location details ── */}
        <Box
          bg='white'
          border='1px solid'
          borderColor='gray.200'
          borderRadius='md'
          boxShadow='sm'
          px={5}
          py={4}
        >
          {/* ROW 1: Company Name | sep | Billing Account | spacer | Purchase Order */}
          <HStack w='full' spacing={3} align='center' mb={5}>
            <Text fontWeight='700' fontSize='16px' color='gray.900' flexShrink={0}>
              {d?.companyName || '-'}
            </Text>
            <Sep />
            <Text fontWeight='600' fontSize='15px' color='#8D0247' flexShrink={0}>
              {d?.billingAccountNumber || '-'}
            </Text>
            {d?.proposalName && (
              <>
                <Sep />
                <Text fontWeight='600' fontSize='15px' color='#8D0247' flexShrink={0}>
                  {d.proposalName}
                </Text>
              </>
            )}
            <Box flex={1} />
            <InfoField label={t('purchaseOrder', 'Purchase Order')} value={d?.purchaseOrder} />
          </HStack>

          {/* ROW 2: Package | sep | Service Type | sep | Loc Code | sep | ARC | sep | OTC */}
          <HStack w='full' spacing={3} align='center' mb={5}>
            {d?.package && (
              <>
                <Text fontWeight='600' fontSize='14px' color='#8D0247' flexShrink={0}>
                  {d.package}
                </Text>
                <Sep />
              </>
            )}
            <InfoField label={t('serviceType', 'Service Type')} value={d?.serviceType} />
            <Sep />
            <InfoField label={t('locCode', 'LOC Code')} value={d?.locCode} />
            <Sep />
            <InfoField label={t('arcPackageValue', 'ARC')} value={d?.arcPackageValue} />
            <Sep />
            <InfoField label={t('otcValue', 'OTC')} value={d?.otcValue} />
          </HStack>

          {/* ROW 3: name (icon) | sep | mobile (icon) | sep | email (icon) | sep | address (icon) */}
          <HStack w='full' spacing={3} align='center' mb={5}>
            {CardUserIcon && (
              <HStack spacing={1} flexShrink={0}>
                <Box sx={{ svg: { fill: '#8D0247', path: { fill: '#8D0247' } } }} display='flex'>
                  <CardUserIcon width='20px' height='20px' />
                </Box>
                <Text fontSize='15px' color='#5F5F5F' fontWeight='500'>{d?.contactPerson || d?.locName || '-'}</Text>
              </HStack>
            )}
            <Sep />
            {MobileNewIcon && (
              <HStack spacing={1} flexShrink={0}>
                <MobileNewIcon width='20px' height='20px' style={{ color: '#8D0247', stroke: '#8D0247', strokeWidth: '1.5px' }} />
                <Text fontSize='15px' color='#5F5F5F' fontWeight='600'>{d?.mobileNumber || '-'}</Text>
              </HStack>
            )}
            <Sep />
            {NewEmailIcon && (
              <HStack spacing={1} flexShrink={0}>
                <NewEmailIcon width='20px' height='20px' style={{ color: '#8D0247', stroke: '#8D0247', strokeWidth: '1.5px' }} />
                <Text fontSize='15px' color='#5F5F5F' fontWeight='400'>{d?.emailId || '-'}</Text>
              </HStack>
            )}
            {AddressCardIcon && (
              <>
                <Sep />
                <HStack spacing={1} flexShrink={0}>
                  <Box sx={{ svg: { fill: '#8D0247', path: { fill: '#8D0247' } } }} display='flex'>
                    <AddressCardIcon width='20px' height='20px' />
                  </Box>
                  <Text fontSize='15px' color='#5F5F5F' fontWeight='400'>
                    {d?.locAddress || '-'}
                  </Text>
                </HStack>
              </>
            )}
          </HStack>

          {/* ROW 4: Loc Name | sep | Pincode | sep | District | sep | Location Type | spacer | Company Address | sep | Aadhaar | last mile */}
          <HStack w='full' spacing={3} align='center'>
            <InfoField label={t('locName', 'Loc Name')} value={d?.locName} />
            <Sep />
            <InfoField label={t('locPincode', 'Pincode')} value={d?.locPincode} />
            <Sep />
            <InfoField label={t('locDistrict', 'District')} value={d?.locDistrict} />
            <Sep />
            <InfoField label={t('locationType', 'Location Type')} value={d?.locationType} />
            <Box flex={1} />
            <InfoField label={t('companyAddress', 'Company Address')} value={d?.companyAddress} />
            {d?.aadhaarNumber && (
              <>
                <Sep />
                <InfoField label={t('aadhaarNumber', 'Aadhaar')} value={d.aadhaarNumber} />
              </>
            )}
            {d?.lastMileConnectivityDiagram && (
              <>
                <Sep />
                <InfoField label={t('lastMileConnectivityDiagram', 'Last Mile')} value={d.lastMileConnectivityDiagram} />
              </>
            )}
          </HStack>
        </Box>

        {/* ── Editable fields ── */}
        <Box px={2} pt={2}>
          <Grid templateColumns='1fr 1fr' gap={6}>

            <GridItem>
              <FormController
                type='select'
                control={control}
                name='serviceProvider'
                labelName={t('serviceProvider', 'Service Provider')}
                placeholder={t('chooseServiceProvider', 'Choose Service Provider')}
                errors={errors}
                required
                items={serviceProviderOptions}
              />
            </GridItem>

            <GridItem>
              <FormController
                type='select'
                control={control}
                name='popName'
                labelName={t('popName', 'POP Name')}
                placeholder={t('choosePop', 'Choose POP')}
                errors={errors}
                required
                items={popNameOptions}
              />
            </GridItem>

            <GridItem>
              <FormController
                control={control}
                name='portDetails'
                labelName={t('portDetails', 'Port Details')}
                placeholder={t('portDetails', 'Port Details')}
                errors={errors}
                required
              />
            </GridItem>

            <GridItem>
              <FormController
                control={control}
                name='circuitDetails'
                labelName={t('circuitDetails', 'Circuit Details')}
                placeholder={t('circuitDetails', 'Circuit Details')}
                errors={errors}
              />
            </GridItem>

            <GridItem>
              <FormController
                type='select'
                control={control}
                name='multicastType'
                labelName={t('multicastType', 'Multicast Type')}
                placeholder={t('chooseMulticastType', 'Choose Multicast Type')}
                errors={errors}
                items={multicastTypeOptions}
              />
            </GridItem>

            <GridItem>
              <FormController
                control={control}
                name='multicastSourceAddress'
                labelName={t('multicastSourceAddress', 'Multicast Source Address')}
                placeholder={t('multicastSourceAddress', 'Multicast Source Address')}
                errors={errors}
              />
            </GridItem>

          </Grid>
        </Box>

        {/* ── Footer buttons ── */}
        <Flex justify='flex-end' px={2} py={3}>
          <HStack spacing={3}>
            <Button
              variant='outline'
              h='44px'
              px={8}
              borderRadius='full'
              borderColor='#8D0247'
              color='#8D0247'
              _hover={{ bg: '#FFF5F7' }}
              onClick={() => router.history.back()}
            >
              <BsArrowLeftCircle style={{ marginRight: '8px' }} />
              {t('back', 'Back')}
            </Button>
            {canSave && (
              <Button
                bg='#8D0247'
                color='white'
                h='44px'
                px={8}
                borderRadius='full'
                _hover={{ bg: '#6d0136' }}
                disabled={isSaving}
                onClick={handleSubmit(onSubmit)}
              >
                {isSaving && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                {t('submit', 'Submit')}
                <BsArrowRightCircle style={{ marginLeft: '8px' }} />
              </Button>
            )}
          </HStack>
        </Flex>

      </VStack>
    </CustomLoaderProvider>
  );
};

export default CorporateCircuitProvisioning;
