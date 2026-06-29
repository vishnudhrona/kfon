import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Flex,
  FormController,
  HStack,
  Image,
  SimpleGrid,
  Spinner,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useLocation, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';
import { LuX } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import {
  ACTION_TYPES,
  createPurchaseOrder,
  deletePurchaseOrderDocument,
  fetchPurchaseOrderDetails,
  generatePoPdf,
  updatePurchaseOrder
} from '../action';
import { getPurchaseOrderDetails } from '../selector';
import { CreatePurchaseOrderSchema } from '../validation';
import PurchaseOrderPreviewPopup from './popUps/PurchaseOrderPreviewPopup';

// Parse "dd-mm-yyyy" string → Date object for the date picker
const parseDmyDate = (val) => {
  if (!val) return null;
  if (val instanceof Date) return val;
  const parts = String(val).split('-');
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const date = new Date(`${y}-${m}-${d}`);
    return isNaN(date) ? null : date;
  }
  return null;
};

const isPdf = (contentType, src) =>
  contentType === 'application/pdf' || /\.pdf(\?.*)?$/i.test(src || '');

const ReadOnlyField = ({ label, value }) => (
  <Box>
    <Text fontSize='sm' color='gray.500' mb={1}>{label}</Text>
    <Box
      border='1px solid'
      borderColor='gray.200'
      borderRadius='md'
      px={3}
      py={2}
      bg='gray.50'
      minH='40px'
      display='flex'
      alignItems='center'
    >
      <Text fontSize='sm' fontWeight='medium' color='gray.700'>{value || '-'}</Text>
    </Box>
  </Box>
);

const FilePreviewThumbnail = ({ url, contentType, label, onDelete }) => {
  const [open, setOpen] = useState(false);

  if (!url) return null;

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <>
      <Box position='relative' w='45px' h='45px' flexShrink={0} mt='22px' ml={3}>
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
          onClick={() => setOpen(true)}
        >
          {isPdf(contentType, url) ? (
            <Box fontSize='10px' fontWeight='bold' color='red.500' textAlign='center' lineHeight='1.2'>
              PDF
            </Box>
          ) : (
            <Image src={url} w='100%' h='100%' objectFit='cover' />
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
          onClick={handleDelete}
        >
          <LuX size={10} />
        </Box>
      </Box>

      {open && (
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
          onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
            >
              <LuX size={12} />
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center' minH='300px' w='100%'>
              {isPdf(contentType, url) ? (
                <iframe
                  src={url}
                  width='100%'
                  height='700px'
                  style={{ border: 'none', borderRadius: '8px', display: 'block' }}
                  title={label}
                />
              ) : (
                <Image
                  src={url}
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
    </>
  );
};

const CreatePurchaseOrder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { proposalId } = useParams({ strict: false });

  const routeState = useLocation({ select: (l) => l.state }) ?? {};
  const poDetails = useSelector(getPurchaseOrderDetails);
  const existingPO = poDetails?.data;

  const proposalName = existingPO?.proposalName || routeState?.proposalName || '';
  const customerIdName = existingPO?.customerIdName || routeState?.customerId || '';
  const customerName = existingPO?.customerName || routeState?.customerName || '';
  const version = existingPO?.version ?? routeState?.version;

  const hasPoDoc = !!existingPO?.poDocumentUrl;
  const hasAdditionalDoc = !!existingPO?.additionalDocumentUrl;

  const apiProgress = useSelector(getApiProgress);
  const isFetching = !!apiProgress[ACTION_TYPES.FETCH_PO_DETAILS];
  const isSaving = !!apiProgress[ACTION_TYPES.CREATE_PURCHASE_ORDER] || !!apiProgress[ACTION_TYPES.UPDATE_PURCHASE_ORDER];
  const isDeletingDoc = !!apiProgress[ACTION_TYPES.DELETE_PO_DOCUMENT];
  const isPreviewing = !!apiProgress[ACTION_TYPES.GENERATE_PO_PDF];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(CreatePurchaseOrderSchema(t, { hasPoDoc, hasAdditionalDoc })),
    defaultValues: {
      poDate: null,
      poNumber: '',
      poDocument: null,
      poStartDate: null,
      poEndDate: null,
      additionalDocument: null,
      remarks: ''
    }
  });

  useEffect(() => {
    if (proposalId && version) {
      dispatch(fetchPurchaseOrderDetails({ enquiryId: proposalId, version }));
    }
  }, [dispatch, proposalId, version]);

  useEffect(() => {
    if (existingPO) {
      reset({
        poDate: parseDmyDate(existingPO.poDate),
        poNumber: existingPO.poNumber || '',
        poDocument: existingPO.poDocumentUrl ? 'existing' : null,
        poStartDate: parseDmyDate(existingPO.poStartDate),
        poEndDate: parseDmyDate(existingPO.poEndDate),
        additionalDocument: existingPO.additionalDocumentUrl ? 'existing' : null,
        remarks: existingPO.remarks || ''
      });
    }
  }, [existingPO, reset]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [poFileUrl, setPoFileUrl] = useState('');
  const [poFileType, setPoFileType] = useState('');
  const [additionalFileUrl, setAdditionalFileUrl] = useState('');
  const [additionalFileType, setAdditionalFileType] = useState('');

  const handlePoFileSelect = (file) => {
    if (!file) return;
    if (poFileUrl) URL.revokeObjectURL(poFileUrl);
    setPoFileUrl(URL.createObjectURL(file));
    setPoFileType(file.type);
  };

  const handleAdditionalFileSelect = (file) => {
    if (!file) return;
    if (additionalFileUrl) URL.revokeObjectURL(additionalFileUrl);
    setAdditionalFileUrl(URL.createObjectURL(file));
    setAdditionalFileType(file.type);
  };

  const refetch = () => dispatch(fetchPurchaseOrderDetails({ enquiryId: proposalId, version }));

  const handleDeletePoDocument = () => {
    if (isDeletingDoc) return;
    dispatch(deletePurchaseOrderDocument({ enquiryId: proposalId, version, fileId: existingPO?.poDocumentId, onSuccess: refetch }));
  };

  const handleDeleteAdditionalDocument = () => {
    if (isDeletingDoc) return;
    dispatch(deletePurchaseOrderDocument({ enquiryId: proposalId, version, fileId: existingPO?.additionalDocumentId, onSuccess: refetch }));
  };

  const onSubmit = (formData) => {
    const { poDate, poStartDate, poEndDate, poNumber, remarks } = formData;
    const payload = { poDate, poStartDate, poEndDate, poNumber, remarks, enquiryId: proposalId, version };
    if (existingPO) {
      dispatch(updatePurchaseOrder({ ...payload, onSuccess: refetch }));
    } else {
      dispatch(createPurchaseOrder({ ...payload, onSuccess: refetch }));
    }
  };

  const handlePreview = () => {
    dispatch(generatePoPdf({
      enquiryId: proposalId,
      version,
      onSuccess: (data) => {
        setPreviewData({ ...existingPO, ...data });
        setPreviewOpen(true);
      }
    }));
  };

  return (
    <CustomLoaderProvider isLoading={isFetching} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
    <VStack alignItems='stretch' h='full' spacing={6} mt={7} px={8}>
      <SimpleGrid
        columns={{ base: 1, lg: 2, xl: 3 }}
        columnGap={{ base: 4, md: 6, lg: 8, xl: 16 }}
        rowGap={6}
      >
        {/* Read-only display fields from PO response */}
        <ReadOnlyField label={t('proposalName')} value={proposalName} />
        <ReadOnlyField label={t('customerIdName', 'Customer ID Name')} value={customerIdName} />
        <ReadOnlyField label={t('customerName')} value={customerName} />

        {/* PO Date */}
        <FormController
          type='date'
          control={control}
          name='poDate'
          labelName={t('poDate', 'PO Date')}
          errors={errors}
          required
          disablePortal={true}
          maxDate={new Date()}
        />

        {/* PO Number */}
        <FormController
          control={control}
          name='poNumber'
          labelName={t('poNumber')}
          placeholder={t('enter', { 0: t('poNumber') })}
          errors={errors}
          required
        />

        {/* PO Document */}
        <Flex align='flex-start'>
          <Box flex={1}>
            <FormController
              type='file'
              control={control}
              name='poDocument'
              labelName={t('poDocument')}
              errors={errors}
              required
              note={t('acceptedFormatsNote')}
              accept='.jpeg,.jpg,.png,.pdf'
              onFileSelect={handlePoFileSelect}
              showPreview={false}
            />
          </Box>
          <FilePreviewThumbnail
            url={poFileUrl || existingPO?.poDocumentUrl}
            contentType={poFileType}
            label={t('poDocument')}
            onDelete={handleDeletePoDocument}
          />
        </Flex>

        {/* PO Start Date */}
        <FormController
          type='date'
          control={control}
          name='poStartDate'
          labelName={t('poStartDate', 'PO Start Date')}
          errors={errors}
          required
          disablePortal={true}
        />

        {/* PO End Date */}
        <FormController
          type='date'
          control={control}
          name='poEndDate'
          labelName={t('poEndDate', 'PO End Date')}
          errors={errors}
          required
          disablePortal={true}
        />

        {/* Additional Document */}
        <Flex align='flex-start'>
          <Box flex={1}>
            <FormController
              type='file'
              control={control}
              name='additionalDocument'
              labelName={t('additionalDocument', 'Additional Document')}
              errors={errors}
              required
              note={t('acceptedFormatsNote')}
              accept='.jpeg,.jpg,.png,.pdf'
              onFileSelect={handleAdditionalFileSelect}
              showPreview={false}
            />
          </Box>
          <FilePreviewThumbnail
            url={additionalFileUrl || existingPO?.additionalDocumentUrl}
            contentType={additionalFileType}
            label={t('additionalDocument', 'Additional Document')}
            onDelete={handleDeleteAdditionalDocument}
          />
        </Flex>

        {/* Remarks - 2 column width */}
        <Box gridColumn={{ lg: 'span 2' }}>
          <FormController
            type='textArea'
            control={control}
            name='remarks'
            labelName={t('remarks')}
            placeholder={t('enter', { 0: t('remarks') })}
            errors={errors}
            required
            textAreaProps={{ resize: 'none', h: '100px' }}
          />
        </Box>
      </SimpleGrid>

      <PurchaseOrderPreviewPopup
        isOpen={previewOpen}
        data={previewData}
        onCancel={() => setPreviewOpen(false)}
      />

      {/* Footer Buttons */}
      <Flex justify='flex-end' mt={4} mb={10}>
        <HStack spacing={3}>
          <Button
            variant='outline'
            h='44px'
            px={8}
            borderRadius='full'
            borderColor='#8D0247'
            color='#8D0247'
            _hover={{ bg: '#FFF5F7' }}
            onClick={() => window.history.back()}
          >
            <BsArrowLeftCircle style={{ marginRight: '8px' }} />
            {t('back')}
          </Button>
          <Button
            variant='outline'
            h='44px'
            px={8}
            borderRadius='full'
            borderColor='#8D0247'
            color='#8D0247'
            _hover={{ bg: '#FFF5F7' }}
            disabled={isSaving}
            onClick={handleSubmit(onSubmit)}
          >
            {isSaving && <Spinner size='xs' style={{ marginRight: '8px' }} />}
            {t('save')}
          </Button>
          {existingPO?.proposalStatus === 'PO_RECEIVED' && (
            <Button
              bg='#8D0247'
              color='white'
              h='44px'
              px={8}
              borderRadius='full'
              _hover={{ bg: '#6d0136' }}
              disabled={isPreviewing}
              onClick={() => {
                if (isPreviewing) return;
                handlePreview();
              }}
            >
              {isPreviewing && <Spinner size='xs' style={{ marginRight: '8px' }} />}
              {t('preview')} <BsArrowRightCircle style={{ marginLeft: '8px' }} />
            </Button>
          )}
        </HStack>
      </Flex>
    </VStack>
    </CustomLoaderProvider>
  );
};

export default CreatePurchaseOrder;
