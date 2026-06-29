import 'quill/dist/quill.snow.css';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Flex,
  FormController,
  Icons,
  SimpleGrid,
  Spinner,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useLocation, useRouter, useSearch } from '@tanstack/react-router';
import Quill from 'quill';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch, useSelector } from 'react-redux';

import { BsArrowLeftCircle } from '@/components/custom';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { showToast } from '@/components/custom/Toast';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, createCorporateProposalSend, fetchCorporateProposalSend, fetchProposalSendPreview, sendCorporateProposal, updateProposalStatus } from '../action';
import { getProposalDetailsData, getProposalParams } from '../selector';
import { CreateProposalFormSchema } from '../validation';
import CorporateProposalPreviewPopup from './popUps/CorporateProposalPreviewPopup';

const { BsArrowRightCircle, DocumentIcon } = Icons;

const CreateCorporateProposal = ({ proposalDetails }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const location = useLocation();
  const isReviseMode = location.pathname.includes('create-proposal/revise');
  const quillRef = useRef(null);
  const quillInstance = useRef(null);
  const [isSaved, setIsSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const dispatch = useDispatch();

  const { enquiryId: searchEnquiryId, version: searchVersion } = useSearch({ strict: false });
  const { enquiryId: reduxEnquiryId, companyName: reduxCompanyName, contactPerson: reduxContactPerson, currentVersion: reduxVersion } = useSelector(getProposalParams);
  const enquiryId = searchEnquiryId || reduxEnquiryId || sessionStorage.getItem('proposalEnquiryId') || '';
  const currentVersion = searchVersion ?? reduxVersion;
  const enquiryCompanyName = reduxCompanyName || sessionStorage.getItem('proposalCompanyName') || '';
  const enquiryContactPerson = reduxContactPerson || sessionStorage.getItem('proposalContactPerson') || '';

  const apiProgress = useSelector(getApiProgress);
  const isFetching = !!apiProgress[ACTION_TYPES.FETCH_CORPORATE_PROPOSAL_SEND];
  const isSaving = !!apiProgress[ACTION_TYPES.SEND_CORPORATE_PROPOSAL] || !!apiProgress[ACTION_TYPES.CREATE_CORPORATE_PROPOSAL_SEND];
  const isPreviewLoading = !!apiProgress[ACTION_TYPES.FETCH_PROPOSAL_SEND_PREVIEW];
  const isUpdatingStatus = !!apiProgress[ACTION_TYPES.UPDATE_PROPOSAL_STATUS];

  const formSchema = useMemo(() => CreateProposalFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(formSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, { theme: 'snow' });
      quillInstance.current.on('text-change', () => {
        setValue('specialTermsConditions', quillInstance.current.root.innerHTML);
        setIsSaved(false);
      });
    }
  }, [setValue]);

  // Fetch existing proposal-send data from API
  useEffect(() => {
    if (enquiryId && currentVersion) {
      dispatch(fetchCorporateProposalSend({ enquiryId, version: currentVersion }));
    }
  }, [dispatch, enquiryId, currentVersion]);

  // Fill form from fetched proposal-send data
  useEffect(() => {
    if (proposalDetails && Object.keys(proposalDetails).length > 0) {
      setValue('customer', proposalDetails.customerName || '');
      setValue('contactPerson', proposalDetails.contactPerson || '');
      setValue('proposalName', proposalDetails.proposalName || '');
      setValue('toAddress', proposalDetails.toAddress || '');
      setValue('remarks', proposalDetails.remarks || '');
      setValue('specialTermsConditions', proposalDetails.specialTermsAndConditions || '');

      if (quillInstance.current && proposalDetails.specialTermsAndConditions) {
        quillInstance.current.root.innerHTML = proposalDetails.specialTermsAndConditions;
      }
    }
  }, [proposalDetails, setValue]);

  // Auto-fill from enquiry params only when no API data available
  useEffect(() => {
    if (!proposalDetails?.id) {
      if (enquiryCompanyName) setValue('customer', enquiryCompanyName);
      if (enquiryContactPerson) setValue('contactPerson', enquiryContactPerson);
    }
  }, [enquiryCompanyName, enquiryContactPerson, proposalDetails, setValue]);

  const handleSave = handleSubmit((data) => {
    const hasExisting = !!proposalDetails?.id;
    const action = hasExisting ? sendCorporateProposal : createCorporateProposalSend;
    dispatch(action({
      enquiryId,
      version: proposalDetails?.currentVersion,
      customerName: data.customer,
      contactPerson: data.contactPerson,
      proposalName: data.proposalName,
      toAddress: data.toAddress,
      remarks: data.remarks || '',
      specialTermsAndConditions: data.specialTermsConditions || '',
      onSuccess: () => setIsSaved(true)
    }));
  });

  const handlePreview = () => {
    if (!isSaved && !proposalDetails?.id) {
      showToast({
        title: t('warning'),
        description: t('pleaseSubmitFormBeforePreview'),
        type: 'warning',
        theme: 'colored'
      });
      return;
    }
    dispatch(fetchProposalSendPreview({
      enquiryId,
      version: proposalDetails?.currentVersion,
      onSuccess: (data) => {
        setPreviewData(data);
        setPreviewOpen(true);
      }
    }));
  };

  return (
    <CustomLoaderProvider isLoading={isFetching} flex='1' minH='0' display='flex' flexDirection='column' w='full'>
    <VStack alignItems='stretch' h='full' position='relative' spacing={6}>
      <VStack spacing={6} px='8' mt='7' alignItems='stretch'>
        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          <FormController
            name='customer'
            labelName={t('customer')}
            placeholder={t('enter', { 0: t('customer') })}
            control={control}
            errors={errors}
            required
            disabled
          />

          <FormController
            name='contactPerson'
            labelName={t('contactPerson')}
            placeholder={t('enter', { 0: t('contactPerson') })}
            control={control}
            errors={errors}
            required
            disabled
          />

          <FormController
            name='proposalName'
            labelName={t('proposalName')}
            placeholder={t('enter', { 0: t('proposalName') })}
            control={control}
            errors={errors}
            required
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={6}>
          <FormController
            type='textArea'
            name='toAddress'
            labelName={t('toAddress')}
            placeholder={t('enter', { 0: t('toAddress') })}
            control={control}
            errors={errors}
            required
            rows={4}
          />

          <Box gridColumn={{ base: 'span 1', lg: 'span 2' }}>
            <FormController
              name='remarks'
              labelName={t('remarks')}
              placeholder={t('enter', { 0: t('remarks') })}
              control={control}
              errors={errors}
              type='textArea'
              rows={4}
            />
          </Box>
        </SimpleGrid>

        <Box>
          <Flex justify='space-between' align='center' mb={2}>
            <Text fontSize='sm' fontWeight='medium'>
              {t('specialTermsConditions')}
            </Text>
            <Button
              variant='link'
              color='#8D0247'
              size='sm'
              p={0}
            >
              {t('standardTermsConditions')}
              <DocumentIcon size={14} />
            </Button>
          </Flex>
          <Box border='1px solid' borderColor='gray.200' borderRadius='md' position='relative'>
            <div ref={quillRef} style={{ height: 300 }} />
            <Flex justify='flex-end' p={3} borderTop='1px solid' borderColor='gray.100'>
              <Button
                variant='outline'
                h='40px'
                px='8'
                borderRadius='full'
                borderColor='#8D0247'
                color='#8D0247'
                _hover={{ bg: '#FFF5F7' }}
                disabled={isSaving}
                onClick={handleSave}
              >
                {isSaving && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                {t('save')}
              </Button>
            </Flex>
          </Box>
        </Box>

        <Flex justify='flex-end' gap={4} mt={8} mb={10}>
          <Button
            variant='outline'
            h='44px'
            px='8'
            borderRadius='full'
            onClick={() => router.history.back()}
          >
            <BsArrowLeftCircle />
            {t('back')}
          </Button>

          <Button
            bg='#8D0247'
            color='white'
            h='44px'
            px='8'
            borderRadius='full'
            _hover={{ bg: '#6d0136' }}
            disabled={isPreviewLoading}
            onClick={handlePreview}
          >
            {isPreviewLoading && <Spinner size='xs' style={{ marginRight: '8px' }} />}
            {t('preview')}
            <BsArrowRightCircle />
          </Button>
        </Flex>
      </VStack>

      <CorporateProposalPreviewPopup
        isOpen={previewOpen}
        data={previewData}
        proposalStatus={proposalDetails?.proposalStatus ?? 'DRAFT'}
        isUpdatingStatus={isUpdatingStatus}
        onCancel={() => { setPreviewOpen(false); setPreviewData(null); }}
        onCreate={() => {
          if (isUpdatingStatus) return;
          dispatch(updateProposalStatus({
            enquiryId,
            version: proposalDetails?.currentVersion,
            status: 'CREATED',
            revisedProposalStatus: isReviseMode,
            onSuccess: () => {
              setPreviewOpen(false);
              router.navigate({ to: '/app/corporate/enquiry-list' });
            }
          }));
        }}
      />
    </VStack>
    </CustomLoaderProvider>
  );
};

const mapStateToProps = (state) => ({
  proposalDetails: getProposalDetailsData(state)?.data
});

export default connect(mapStateToProps)(CreateCorporateProposal);
