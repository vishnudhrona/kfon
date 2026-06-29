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
  Image,
  Spinner,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useLocation, useParams, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { LuX } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { MENU_KEYS, PERMISSIONS } from '@/constants/permissions';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { usePageActions } from '@/hooks/usePageActions';

import {
  ACTION_TYPES,
  approveServiceProvisioning,
  createServiceProvisioning,
  fetchServiceCommissioningInvoice,
  fetchServiceProvisioning,
  generateServiceCommissioningInvoice,
  updateServiceProvisioning
} from '../action';
import { getServiceProvisioningDetails } from '../selector';
import { serviceProvisioningSchema } from '../validation';
import ServiceCommissioningInvoicePopup from './popUps/ServiceCommissioningInvoicePopup';

const isPdf = (contentType, src) =>
  contentType === 'application/pdf' || /\.pdf(\?.*)?$/i.test(src || '');

const Sep = () => <Box h='20px' w='1px' bg='rgba(130,130,130,0.19)' flexShrink={0} />;

const Field = ({ label, value, highlight }) => (
  <Text fontSize='15px' color='gray.500' fontWeight='500' flexShrink={0}>
    {label}:{' '}
    <Text as='span' fontWeight='600' fontSize='15px' color={highlight ? '#8D0247' : 'gray.800'}>
      {value || '-'}
    </Text>
  </Text>
);

const CorporateServiceProvisioning = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { enquiryId } = useParams({ strict: false });
  const routeState = useLocation({ select: (l) => l.state }) ?? {};
  const locationId = routeState?.locationId;

  const { MobileNewIcon, NewEmailIcon, AddressCardIcon, CardUserIcon } = Icons;

  const serviceProvisioningDetails = useSelector(getServiceProvisioningDetails);
  const d = serviceProvisioningDetails?.data;

  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [invoicePreviewData, setInvoicePreviewData] = useState(null);
  const [commissionDocFile, setCommissionDocFile] = useState(null);
  const [commissionDocUrl, setCommissionDocUrl] = useState('');
  const [commissionDocContentType, setCommissionDocContentType] = useState('');
  const [commissionDocName, setCommissionDocName] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const isGovernment = d?.companyType?.toUpperCase?.()?.includes('GOVERNMENT') ?? false;

  const { hasPermission } = usePageActions(MENU_KEYS.CORPORATE_SERVICE_PROVISIONING);
  const canSave = hasPermission(PERMISSIONS.CORPORATE.CORP_SAVE_SERVICE_PROVISIONING);
  const canApprove = hasPermission(PERMISSIONS.CORPORATE.CORP_APPROVE_SERVICE_PROVISIONING);

  const apiProgress = useSelector(getApiProgress);
  const isFetching = !!apiProgress[ACTION_TYPES.FETCH_SERVICE_PROVISIONING];
  const isSaving = !!apiProgress[ACTION_TYPES.CREATE_SERVICE_PROVISIONING] || !!apiProgress[ACTION_TYPES.UPDATE_SERVICE_PROVISIONING];
  const isApproving = !!apiProgress[ACTION_TYPES.APPROVE_SERVICE_PROVISIONING];
  const isGeneratingInvoice = !!apiProgress[ACTION_TYPES.GENERATE_SERVICE_COMMISSIONING_INVOICE];
  const isFetchingInvoice = !!apiProgress[ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_INVOICE];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(serviceProvisioningSchema(t)),
    defaultValues: {
      commissionDate: '',
      commissionDoc: null,
      newlyIdentifiedEO: false,
      primaryRouterIp: '',
      primaryRouterInterfaceId: '',
      primaryRouterInterfaceBandwidth: '',
      primarySwitchIp: '',
      primarySwitchInterfaceId: '',
      primarySwitchInterfaceBandwidth: '',
      primaryWanGatewayIp: '',
      primaryWanIpPool: '',
      primaryLanIpPool: '',
      secondaryRouterIp: '',
      secondaryRouterInterfaceId: '',
      secondaryRouterInterfaceBandwidth: '',
      secondarySwitchIp: '',
      secondarySwitchInterfaceId: '',
      secondarySwitchInterfaceBandwidth: '',
      secondaryWanGatewayIp: '',
      secondaryWanIpPool: '',
      secondaryLanIpPool: ''
    }
  });

  useEffect(() => {
    if (enquiryId && locationId) {
      dispatch(fetchServiceProvisioning({ enquiryId, locationId }));
    }
  }, [dispatch, enquiryId, locationId]);

  useEffect(() => {
    if (d) {
      // API returns dd-MM-yyyy, date input needs yyyy-MM-dd
      let inputDate = '';
      if (d.commissionDate) {
        const parts = d.commissionDate.split('-');
        inputDate = parts.length === 3 && parts[2].length === 4
          ? `${parts[2]}-${parts[1]}-${parts[0]}`
          : d.commissionDate;
      }

      reset({
        commissionDate: inputDate,
        commissionDoc: d.commissionDocUrl ? 'existing' : null,
        newlyIdentifiedEO: d.newlyIdentifiedEo ?? false,
        primaryRouterIp: d.primaryRouterIp || '',
        primaryRouterInterfaceId: d.primaryRouterInterfaceId || '',
        primaryRouterInterfaceBandwidth: d.primaryRouterInterfaceBandwidth || '',
        primarySwitchIp: d.primarySwitchIp || '',
        primarySwitchInterfaceId: d.primarySwitchInterfaceId || '',
        primarySwitchInterfaceBandwidth: d.primarySwitchInterfaceBandwidth || '',
        primaryWanGatewayIp: d.primaryWanGatewayIp || '',
        primaryWanIpPool: d.primaryWanIpPool || '',
        primaryLanIpPool: d.primaryLanIpPool || '',
        secondaryRouterIp: d.secondaryRouterIp || '',
        secondaryRouterInterfaceId: d.secondaryRouterInterfaceId || '',
        secondaryRouterInterfaceBandwidth: d.secondaryRouterInterfaceBandwidth || '',
        secondarySwitchIp: d.secondarySwitchIp || '',
        secondarySwitchInterfaceId: d.secondarySwitchInterfaceId || '',
        secondarySwitchInterfaceBandwidth: d.secondarySwitchInterfaceBandwidth || '',
        secondaryWanGatewayIp: d.secondaryWanGatewayIp || '',
        secondaryWanIpPool: d.secondaryWanIpPool || '',
        secondaryLanIpPool: d.secondaryLanIpPool || ''
      });

      if (d.commissionDocUrl) {
        // clear any local file blob and use the server URL
        if (commissionDocFile) URL.revokeObjectURL(commissionDocUrl);
        setCommissionDocFile(null);
        setCommissionDocUrl(d.commissionDocUrl);
        setCommissionDocContentType(isPdf(null, d.commissionDocUrl) ? 'application/pdf' : 'image/jpeg');
        setCommissionDocName(t('commissionDoc', 'Commission Document'));
      } else {
        setCommissionDocUrl('');
        setCommissionDocContentType('');
        setCommissionDocName('');
      }
    }
  }, [d, reset, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigateAfterSubmit = () =>
    router.navigate({ to: '/app/corporate/enquiry-detailed-view/service-provisioning/$enquiryId', params: { enquiryId } });

  const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];

  const handleCommissionDocSelect = (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) return;
    if (commissionDocFile) URL.revokeObjectURL(commissionDocUrl);
    setCommissionDocUrl(URL.createObjectURL(file));
    setCommissionDocContentType(file.type);
    setCommissionDocName(file.name);
    setCommissionDocFile(file);
    setValue('commissionDoc', file.name);
  };

  const handleDeleteDoc = (e) => {
    e.stopPropagation();
    if (commissionDocFile) URL.revokeObjectURL(commissionDocUrl);
    setCommissionDocUrl('');
    setCommissionDocContentType('');
    setCommissionDocFile(null);
    setCommissionDocName('');
    setValue('commissionDoc', null);
  };

  const onSubmit = (formData) => {
    const payload = {
      enquiryId,
      locationId,
      commissionDate: formData.commissionDate,
      commissionDoc: commissionDocFile || undefined,
      newlyIdentifiedEo: formData.newlyIdentifiedEO ?? false,
      primaryRouterIp: formData.primaryRouterIp,
      primaryRouterInterfaceId: formData.primaryRouterInterfaceId,
      primaryRouterInterfaceBandwidth: formData.primaryRouterInterfaceBandwidth,
      primarySwitchIp: formData.primarySwitchIp,
      primarySwitchInterfaceId: formData.primarySwitchInterfaceId,
      primarySwitchInterfaceBandwidth: formData.primarySwitchInterfaceBandwidth,
      primaryWanGatewayIp: formData.primaryWanGatewayIp,
      primaryWanIpPool: formData.primaryWanIpPool,
      primaryLanIpPool: formData.primaryLanIpPool,
      secondaryRouterIp: formData.secondaryRouterIp,
      secondaryRouterInterfaceId: formData.secondaryRouterInterfaceId,
      secondaryRouterInterfaceBandwidth: formData.secondaryRouterInterfaceBandwidth,
      secondarySwitchIp: formData.secondarySwitchIp,
      secondarySwitchInterfaceId: formData.secondarySwitchInterfaceId,
      secondarySwitchInterfaceBandwidth: formData.secondarySwitchInterfaceBandwidth,
      secondaryWanGatewayIp: formData.secondaryWanGatewayIp,
      secondaryWanIpPool: formData.secondaryWanIpPool,
      secondaryLanIpPool: formData.secondaryLanIpPool
    };
    if (d?.id) {
      dispatch(updateServiceProvisioning({ ...payload, onSuccess: navigateAfterSubmit }));
    } else {
      dispatch(createServiceProvisioning({ ...payload, onSuccess: navigateAfterSubmit }));
    }
  };

  return (
    <CustomLoaderProvider isLoading={isFetching} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
    <VStack alignItems='stretch' spacing={4} bg='white' borderRadius='8px' p={4}>

      {/* ── Info card ── */}
      <Box
        bg='white'
        border='1px solid'
        borderColor='gray.200'
        borderRadius='md'
        boxShadow='sm'
        px={5}
        py={4}
      >
        <VStack align='stretch' spacing={0}>

          {/* ROW 1: Company | Billing Acc | Proposal | spacer | Purchase Order */}
          <HStack w='full' spacing={3} align='center' py={3} borderBottom='1px solid' borderColor='gray.100'>
            <Text fontWeight='700' fontSize='16px' color='gray.900' flexShrink={0}>
              {d?.companyName || '-'}
            </Text>
            {d?.billingAccountNumber && (
              <>
                <Sep />
                <Text fontWeight='600' fontSize='15px' color='#8D0247' flexShrink={0}>
                  {d.billingAccountNumber}
                </Text>
              </>
            )}
            {d?.proposalName && (
              <>
                <Sep />
                <Text fontWeight='600' fontSize='15px' color='#8D0247' flexShrink={0}>
                  {d.proposalName}
                </Text>
              </>
            )}
            <Box flex={1} />
            <Field label={t('purchaseOrder', 'Purchase Order')} value={d?.purchaseOrder} />
          </HStack>

          {/* ROW 2: Service Type | Loc Code | ARC | OTC | Package */}
          <HStack w='full' spacing={3} align='center' >
            {d?.packageName && (
              <>
                <Text fontWeight='600' fontSize='14px' color='#8D0247' flexShrink={0}>{d.packageName}</Text>
                <Sep />
              </>
            )}
            <Field label={t('serviceType', 'Service Type')} value={d?.serviceType} />
            <Sep />
            <Field label={t('locCode', 'LOC Code')} value={d?.locCode} />
            <Sep />
            <Field label={t('arcPackageValue', 'ARC')} value={d?.arcPackageValue} />
            <Sep />
            <Field label={t('otcValue', 'OTC')} value={d?.otcValue} />
          </HStack>

          {/* ROW 3: Contact icons */}
          <HStack w='full' spacing={3} align='center' mt={2}>
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
            {AddressCardIcon && d?.locAddress && (
              <>
                <Sep />
                <HStack spacing={1} flexShrink={0}>
                  <Box sx={{ svg: { fill: '#8D0247', path: { fill: '#8D0247' } } }} display='flex'>
                    <AddressCardIcon width='20px' height='20px' />
                  </Box>
                  <Text fontSize='15px' color='#5F5F5F' fontWeight='400'>{d.locAddress}</Text>
                </HStack>
              </>
            )}
          </HStack>

          {/* ROW 4: Loc Name | Pincode | District | Location Type | spacer | Company Address */}
          <HStack w='full' spacing={3} align='center' mt={2}>
            <Field label={t('locName', 'Loc Name')} value={d?.locName} />
            <Sep />
            <Field label={t('locPincode', 'Pincode')} value={d?.locPincode} />
            <Sep />
            <Field label={t('locDistrict', 'District')} value={d?.locDistrict} />
            <Sep />
            <Field label={t('locationType', 'Location Type')} value={d?.locationType} />
            <Box flex={1} />
            <Field label={t('companyAddress', 'Company Address')} value={d?.companyAddress} />
          </HStack>

          {/* ROW 5: Service Provider | Multicast Type | LNP | Circuit Details */}
          <HStack w='full' spacing={3} align='center' mt={2}>
            <Field label={t('serviceProvider', 'Service Provider')} value={d?.serviceProvider} />
            <Sep />
            <Field label={t('popName', 'POP Name')} value={d?.popName} />
            <Sep />
            <Field label={t('multicastType', 'Multicast Type')} value={d?.multicastType} />
            <Sep />
            <Field label={t('lnp', 'LNP')} value={d?.lnp} />
            <Sep />
            <Field label={t('circuitDetails', 'Circuit Details')} value={d?.circuitDetails} />
          </HStack>

          {/* ROW 6: Multicast Source */}
          <HStack w='full' spacing={3} align='center' mt={2}>
            <Field label={t('multicastSourceAddress', 'Multicast Source Address')} value={d?.multicastSourceAddress} />
          </HStack>

          {/* ROW 7: Newly Identified EO (govt only) | Ration Card | Aadhaar | Delivery Status */}
          <HStack w='full' spacing={3} align='center' mt={2}>
            {isGovernment && (
              <Field
                label={t('newlyIdentifiedEO', 'Newly Identified EO')}
                value={d?.newlyIdentifiedEo === true ? t('yes', 'Yes') : d?.newlyIdentifiedEo === false ? t('no', 'No') : null}
              />
            )}
            {d?.rationCardNumber && (
              <>
                <Sep />
                <Field label={t('rationCardNumber', 'Ration Card Number')} value={d.rationCardNumber} />
              </>
            )}
            {d?.aadhaarNumber && (
              <>
                <Sep />
                <Field label={t('aadhaarNumber', 'Aadhaar')} value={d.aadhaarNumber} />
              </>
            )}
            {d?.deliveryStatus && (
              <>
                <Sep />
                <Field label={t('deliveryStatus', 'Delivery Status')} value={d.deliveryStatus} highlight />
              </>
            )}
          </HStack>

        </VStack>
      </Box>

      {/* ── POP Primary ── */}
      {/* <Box px={2}>
        <Text fontWeight='700' fontSize='15px' color='gray.700' mb={4}>
          {t('popPrimary', 'POP Primary')}
        </Text>
        <Grid templateColumns='1fr 1fr' gap={6}>
          <GridItem>
            <FormController control={control} name='primaryRouterIp' labelName={t('routerIp', 'Router IP')} placeholder={t('routerIp', 'Router IP')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primaryRouterInterfaceId' labelName={t('routerInterfaceId', 'Router Interface ID')} placeholder={t('routerInterfaceId', 'Router Interface ID')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primaryRouterInterfaceBandwidth' labelName={t('routerInterfaceBandwidth', 'Router Interface Bandwidth')} placeholder={t('routerInterfaceBandwidth', 'Router Interface Bandwidth')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primarySwitchIp' labelName={t('switchIp', 'Switch IP')} placeholder={t('switchIp', 'Switch IP')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primarySwitchInterfaceId' labelName={t('switchInterfaceId', 'Switch Interface ID')} placeholder={t('switchInterfaceId', 'Switch Interface ID')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primarySwitchInterfaceBandwidth' labelName={t('switchInterfaceBandwidth', 'Switch Interface Bandwidth')} placeholder={t('switchInterfaceBandwidth', 'Switch Interface Bandwidth')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primaryWanGatewayIp' labelName={t('wanGatewayIp', 'WAN Gateway IP')} placeholder={t('wanGatewayIp', 'WAN Gateway IP')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primaryWanIpPool' labelName={t('wanIpPool', 'WAN IP Pool')} placeholder={t('wanIpPool', 'WAN IP Pool')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='primaryLanIpPool' labelName={t('lanIpPool', 'LAN IP Pool')} placeholder={t('lanIpPool', 'LAN IP Pool')} errors={errors} />
          </GridItem>
        </Grid>
      </Box> */}

      {/* ── POP Secondary ── */}
      {/* <Box px={2}>
        <Text fontWeight='700' fontSize='15px' color='gray.700' mb={4}>
          {t('popSecondary', 'POP Secondary')}
        </Text>
        <Grid templateColumns='1fr 1fr' gap={6}>
          <GridItem>
            <FormController control={control} name='secondaryRouterIp' labelName={t('routerIp', 'Router IP')} placeholder={t('routerIp', 'Router IP')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondaryRouterInterfaceId' labelName={t('routerInterfaceId', 'Router Interface ID')} placeholder={t('routerInterfaceId', 'Router Interface ID')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondaryRouterInterfaceBandwidth' labelName={t('routerInterfaceBandwidth', 'Router Interface Bandwidth')} placeholder={t('routerInterfaceBandwidth', 'Router Interface Bandwidth')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondarySwitchIp' labelName={t('switchIp', 'Switch IP')} placeholder={t('switchIp', 'Switch IP')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondarySwitchInterfaceId' labelName={t('switchInterfaceId', 'Switch Interface ID')} placeholder={t('switchInterfaceId', 'Switch Interface ID')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondarySwitchInterfaceBandwidth' labelName={t('switchInterfaceBandwidth', 'Switch Interface Bandwidth')} placeholder={t('switchInterfaceBandwidth', 'Switch Interface Bandwidth')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondaryWanGatewayIp' labelName={t('wanGatewayIp', 'WAN Gateway IP')} placeholder={t('wanGatewayIp', 'WAN Gateway IP')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondaryWanIpPool' labelName={t('wanIpPool', 'WAN IP Pool')} placeholder={t('wanIpPool', 'WAN IP Pool')} errors={errors} />
          </GridItem>
          <GridItem>
            <FormController control={control} name='secondaryLanIpPool' labelName={t('lanIpPool', 'LAN IP Pool')} placeholder={t('lanIpPool', 'LAN IP Pool')} errors={errors} />
          </GridItem>
        </Grid>
      </Box> */}

      {/* ── Commission Date & Document ── */}
      <Box px={2} pt={2}>
        <Grid templateColumns='1fr 1fr' gap={6}>

          <GridItem>
            <FormController
              type='date'
              control={control}
              name='commissionDate'
              labelName={t('commissionDate', 'Commission Date')}
              placeholder='DD/MM/YYYY'
              errors={errors}
              required
            />
          </GridItem>

          {isGovernment && (
            <GridItem display='flex' alignItems='center'>
              <FormController
                type='checkbox'
                control={control}
                name='newlyIdentifiedEO'
                labelName={t('newlyIdentifiedEO', 'Newly Identified EO')}
                errors={errors}
              />
            </GridItem>
          )}

          <GridItem>
            <Box display='flex' alignItems='center' gap='8px'>
              <Box flex='1'>
                <FormController
                  name='commissionDoc'
                  labelName={t('commissionDoc', 'Commission Document')}
                  type='file'
                  control={control}
                  errors={errors}
                  value={commissionDocName}
                  placeholder={commissionDocName || t('dragAndDropHere', 'Drag & drop files here')}
                  onFileSelect={handleCommissionDocSelect}
                  accept='.pdf,.jpeg,.png,.jpg'
                  isUploaded={!!d?.commissionDocUrl && !commissionDocFile}
                  showPreview={false}
                />
              </Box>
              {commissionDocUrl && (
                <Box position='relative' w='45px' h='45px' flexShrink={0} mt='22px'>
                  <Box
                    w='45px'
                    h='45px'
                    border='1px solid'
                    borderColor='gray.300'
                    borderRadius='6px'
                    overflow='hidden'
                    cursor='pointer'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    bg='gray.50'
                    onClick={() => setPreviewOpen(true)}
                  >
                    {isPdf(commissionDocContentType, commissionDocUrl) ? (
                      <Box fontSize='10px' fontWeight='bold' color='red.500' textAlign='center' lineHeight='1.2'>
                        PDF
                      </Box>
                    ) : (
                      <Image src={commissionDocUrl} w='100%' h='100%' objectFit='cover' />
                    )}
                  </Box>
                  <Box
                    position='absolute'
                    top='-8px'
                    right='-8px'
                    w='20px'
                    h='20px'
                    bg='white'
                    border='2px solid'
                    borderColor='#8D0247'
                    borderRadius='full'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    cursor='pointer'
                    zIndex={1}
                    color='#8D0247'
                    _hover={{ bg: '#8D0247', color: 'white' }}
                    onClick={handleDeleteDoc}
                  >
                    <LuX size={10} />
                  </Box>
                </Box>
              )}
            </Box>
          </GridItem>

        </Grid>
      </Box>

      {/* ── Preview modal ── */}
      {previewOpen && (
        <Box
          position='fixed'
          top='0'
          left='0'
          right='0'
          bottom='0'
          bg='blackAlpha.700'
          zIndex='9999'
          display='flex'
          alignItems='center'
          justifyContent='center'
          onClick={() => setPreviewOpen(false)}
        >
          <Box
            position='relative'
            bg='white'
            borderRadius='xl'
            p={4}
            maxW='95vw'
            maxH='95vh'
            w='800px'
            overflow='auto'
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              position='absolute'
              top='8px'
              right='8px'
              w='28px'
              h='28px'
              bg='white'
              border='2px solid'
              borderColor='#8D0247'
              borderRadius='full'
              display='flex'
              alignItems='center'
              justifyContent='center'
              cursor='pointer'
              color='#8D0247'
              zIndex={1}
              _hover={{ bg: '#8D0247', color: 'white' }}
              onClick={() => setPreviewOpen(false)}
            >
              <LuX size={12} />
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' minH='300px' w='100%'>
              {isPdf(commissionDocContentType, commissionDocUrl) ? (
                <iframe
                  src={commissionDocUrl}
                  width='100%'
                  height='700px'
                  style={{ border: 'none', borderRadius: '8px', display: 'block' }}
                  title={t('commissionDoc', 'Commission Document')}
                />
              ) : (
                <Image
                  src={commissionDocUrl}
                  maxW='100%'
                  maxH='70vh'
                  objectFit='contain'
                  borderRadius='md'
                  display='block'
                />
              )}
            </Box>
          </Box>
        </Box>
      )}

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
          {canSave && d?.approvalStatus !== 'APPROVED' && d?.approvalStatus !== 'INVOICE_GENERATED' && (
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
          {d?.id && canApprove && d?.approvalStatus !== 'APPROVED' && d?.approvalStatus !== 'INVOICE_GENERATED' && (
            <Button
              bg='#8D0247'
              color='white'
              h='44px'
              px={8}
              borderRadius='full'
              _hover={{ bg: '#6d0136' }}
              disabled={isApproving}
              onClick={() => {
                if (isApproving) return;
                dispatch(approveServiceProvisioning({ enquiryId, locationId, approvalStatus: 'APPROVED', remarks: '' }));
              }}
            >
              {isApproving && <Spinner size='xs' style={{ marginRight: '8px' }} />}
              {t('approve', 'Approve')}
              <BsArrowRightCircle style={{ marginLeft: '8px' }} />
            </Button>
          )}
          {d?.id && d?.approvalStatus === 'APPROVED' && (
            <Button
              bg='#8D0247'
              color='white'
              h='44px'
              px={8}
              borderRadius='full'
              _hover={{ bg: '#6d0136' }}
              disabled={isGeneratingInvoice}
              onClick={() => {
                if (isGeneratingInvoice) return;
                dispatch(generateServiceCommissioningInvoice({ enquiryId, locationId }));
              }}
            >
              {isGeneratingInvoice && <Spinner size='xs' style={{ marginRight: '8px' }} />}
              {t('invoiceGeneration', 'Invoice Generation')}
              <BsArrowRightCircle style={{ marginLeft: '8px' }} />
            </Button>
          )}
          {d?.id && d?.approvalStatus === 'INVOICE_GENERATED' && (
            <Button
              bg='#8D0247'
              color='white'
              h='44px'
              px={8}
              borderRadius='full'
              _hover={{ bg: '#6d0136' }}
              disabled={isFetchingInvoice}
              onClick={() => {
                if (isFetchingInvoice) return;
                dispatch(fetchServiceCommissioningInvoice({
                  enquiryId,
                  locationId,
                  onSuccess: (data) => {
                    setInvoicePreviewData(data);
                    setIsInvoicePreviewOpen(true);
                  }
                }));
              }}
            >
              {isFetchingInvoice && <Spinner size='xs' style={{ marginRight: '8px' }} />}
              {t('invoice', 'Invoice')}
              <BsArrowRightCircle style={{ marginLeft: '8px' }} />
            </Button>
          )}
        </HStack>
      </Flex>

      <ServiceCommissioningInvoicePopup
        isOpen={isInvoicePreviewOpen}
        data={invoicePreviewData}
        onCancel={() => {
          setIsInvoicePreviewOpen(false);
          setInvoicePreviewData(null);
        }}
      />

    </VStack>
    </CustomLoaderProvider>
  );
};

export default CorporateServiceProvisioning;
