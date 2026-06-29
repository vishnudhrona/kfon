import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Flex,
  FormController,
  HStack,
  Icons,
  Image,
  Link,
  SimpleGrid,
  Text,
  useForm
} from '@kfonbss/bss-ui-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';

import homeEnquiryImage from '@/assets/landingPage/homeEnquiry.png';
import { BsCheckCircle } from '@/components/custom';
import SplashLoader from '@/components/custom/SplashLoader';
import { errorToast } from '@/components/custom/Toast';
import { ACTION_TYPES as COMMON_ACTION_TYPES, sendOtp } from '@/features/common/actions';
import VerifyOtpPopUp from '@/features/common/components/VerifyOtpPopUp';
import { getOtpDetails } from '@/features/common/selectors';
import { actions as commonActions } from '@/features/common/slice';
import {
  ACTION_TYPES as CRM_ACTION_TYPES,
  customerSubmitTicket,
  deleteAttachment,
  fetchCustomerTypes,
  fetchIssueTypes,
  fetchSubscriberByNumber,
  uploadTicketDocument
} from '@/features/crm/action';
import {
  getCustomerTypes,
  getIsFileUploading,
  getIssueTypes,
  getSubmitTicket,
  getSubscriberByNumber,
  getUploadedFiles
} from '@/features/crm/selector';
import { actions as crmActions } from '@/features/crm/slice';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import SuccessPopup from '@/features/packagePlans/pop-up/SuccessPopup';
import { allowOnlyDigits } from '@/utils/validationUtils';

import { fetchDistrictByPincode, fetchTicketCategory } from '../action';
import ComplaintTracking from '../popup/ComplaintTracking';
import DeviceDetails from '../popup/DeviceDetails';
import { getPinCodeDetails, getTicketCategoryList } from '../selector';
import { complaintRegistrationSchema } from '../validations';
import CircleSelect from './CircleSelect';

const { LinkIcon } = Icons;

const ComplaintRegistration = ({
  issueTypes,
  fetchIssueTypes,
  customerSubmitTicket,
  sendOtp,
  otpDetails,
  uploadedFiles,
  uploadTicketDocument,
  deleteAttachment,
  resetOtpDetails,
  fetchTicketCategory,
  ticketCategoryList,
  clearUploadedFiles,
  submitTicket,
  fetchCustomerTypes,
  customerTypes,
  isFileUploading,
  fetchSubscriberByNumber,
  clearSubscriberByNumber,
  fetchDistrictByPincode,
  district
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [deviceDetailsOpen, setDeviceDetailsOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState({});

  const subscriberList = useSelector(getSubscriberByNumber);
  const apiProgress = useSelector(getApiProgress);
  const isProcessing = !!(
    apiProgress[COMMON_ACTION_TYPES.SUBMIT_OTP] ||
    apiProgress[CRM_ACTION_TYPES.FETCH_SUBSCRIBER_BY_NUMBER] ||
    apiProgress[CRM_ACTION_TYPES.CUSTOMER_SUBMIT_TICKET]
  );

  const filteredTicketCategoryList = useMemo(() => {
    if (!ticketCategoryList) return [];
    return ticketCategoryList.filter((category) => (category?.name || '').toLowerCase() !== 'inward');
  }, [ticketCategoryList]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    trigger,
    setValue,
    clearErrors,
    reset
  } = useForm({
    resolver: yupResolver(complaintRegistrationSchema(t)),
    defaultValues: {
      customerName: '',
      keyContactNumber: '',
      ticketCategory: null,
      subject: null,
      issue: '',
      remarks: '',
      files: [],
      district: null,
      pinCode: null,
      hasSubscribers: false
    }
  });

  useEffect(() => {
    setValue('hasSubscribers', !!subscriberList?.subscribers?.length);
  }, [subscriberList, setValue]);

  useEffect(() => {
    if (uploadedFiles?.length > 0) {
      setValue('files', uploadedFiles);
      clearErrors('files');
    } else {
      setValue('files', []);
    }
  }, [uploadedFiles, setValue, clearErrors]);

  const subject = watch('subject');
  const mobileNumber = watch('keyContactNumber');
  const ticketCategory = watch('ticketCategory');
  const pincode = watch('pinCode');

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue('keyContactNumber', '');
    resetOtpDetails();
    clearErrors('keyContactNumber');
  }, [ticketCategory, setValue, resetOtpDetails, clearErrors]);

  const isComplaintOrRequest = useMemo(() => {
    const categoryName = (ticketCategory?.name || '').toLowerCase();
    return categoryName.startsWith('complaint') || categoryName.startsWith('request');
  }, [ticketCategory]);

  useEffect(() => {
    setValue('subject', null);
    setValue('issue', '');
    if (ticketCategory?.name !== 'Enquiries') {
      setValue('pinCode', null);
    }
    if (!isComplaintOrRequest) {
      setSelectedDevice(null);
    }
  }, [ticketCategory, setValue, isComplaintOrRequest]);

  useEffect(() => {
    fetchTicketCategory();
    fetchCustomerTypes();
    // fetchDistrict();
  }, [fetchTicketCategory, fetchCustomerTypes]);

  useEffect(() => {
    if (ticketCategory?.id) {
      const customerTypeId = customerTypes?.find((type) => type.code === 'GENERAL_PUBLIC')?.id;
      fetchIssueTypes({
        categoryId: ticketCategory?.id,
        customerTypeId: customerTypeId
      });
    }
  }, [fetchIssueTypes, ticketCategory?.id, customerTypes]);

  useEffect(() => {
    if (pincode?.length === 6) {
      fetchDistrictByPincode(pincode);
    }
  }, [fetchDistrictByPincode, pincode]);

  useEffect(() => {
    if (district?.id) {
      setValue('district', district, { shouldValidate: true });
      clearErrors('district');
    } else {
      setValue('district', null);
    }
  }, [district, setValue, clearErrors]);

  const handleVerify = async () => {
    const isValid = await trigger('keyContactNumber');
    if (isValid) {
      sendOtp({ mobile: mobileNumber });
      setOpen(true);
    }
  };

  const isMobileNumberVerified = otpDetails?.verified;

  useEffect(() => {
    if (mobileNumber?.length === 10 && isComplaintOrRequest) {
      const payload = {
        mobile: mobileNumber,
        onSuccess: () => {
          if (isComplaintOrRequest) {
            setDeviceDetailsOpen(true);
          }
        }
      };
      fetchSubscriberByNumber(payload);
    } else {
      clearSubscriberByNumber();
      setSelectedDevice(null);
      resetOtpDetails();
    }
  }, [mobileNumber, fetchSubscriberByNumber, clearSubscriberByNumber, resetOtpDetails, isComplaintOrRequest]);

  const handleFileSelect = (file) => {
    if (file) {
      uploadTicketDocument({ file });
    }
  };

  const onDelete = (fileId) => {
    if (fileId) {
      deleteAttachment(fileId);
    }
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    reset();
    resetOtpDetails();
    clearUploadedFiles();
  };

  const onSubmit = (data) => {
    const payload = {
      subjectId: data?.subject?.id,
      customerTypeId: customerTypes?.find((type) => type.code === 'GENERAL_PUBLIC')?.id,
      customerName: data?.customerName,
      remarks: data?.remarks,
      customerIssue: subject?.name === 'Others' ? data?.remarks : data?.issue,
      subjectResolve: data?.subject?.resolvedTime,
      mobileNumber: data?.keyContactNumber,
      categoryId: data?.ticketCategory?.id,
      subscriberUserName: selectedDevice?.username || '',
      subscriberUuid: selectedDevice?.subscriberUuid || '',
      districtId: selectedDevice?.districtId || data?.district?.id || null,
      districtName: selectedDevice?.location || data?.district?.name || null,
      pincode: data?.pinCode,
      fileIds: uploadedFiles?.map((f) => f.fileId)
    };

    if ((ticketCategory?.name === 'Enquiries' || isComplaintOrRequest) && !isMobileNumberVerified) {
      errorToast({ description: t('pleaseVerifyNumber') });
      return;
    }

    if (isComplaintOrRequest && (!selectedDevice || !selectedDevice.username)) {
      errorToast({ description: t('addRegisteredMobileNumber') });
      return;
    }

    customerSubmitTicket({
      ...payload,
      onSuccess: () => {
        setConfirmOpen(true);
      }
    });
  };

  return (
    <>
      <Box
        w='100%'
        position='relative'
        display='flex'
        alignItems='flex-start'
        justifyContent='center'
        p={{ base: '20px', md: '85px' }}
        zIndex={0}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.02)',
          zIndex: -1
        }}
      >
        <Flex
          w='100%'
          maxW='1600px'
          direction={{ base: 'column', lg: 'row' }}
          alignItems='center'
          justifyContent='space-between'
          gap={{ base: 10, lg: 32 }}
        >
          <Box
            flex='1'
            textAlign='center'
            minW={{ lg: '600px' }}
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <Text
              display={'flex'}
              justifyContent='center'
              alignItems={'center'}
              p={0}
              pb={{ base: '5px', xl: '20px' }}
              m={0}
              gap={'8px'}
              fontSize={{ base: '12px', '2xl': '16px', xl: '14px' }}
              lineHeight={{ '2xl': '16px', xl: '14px' }}
              fontWeight={500}
              textTransform={'uppercase'}
              color='#292929'
            >
              <svg width='25' height='13' viewBox='0 0 25 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <rect x='5.5' y='0.5' width='19' height='12' rx='6' stroke='#8D0247' />
                <rect width='19' height='13' rx='6.5' fill='#8D0247' />
              </svg>
              {t('bestInternetProvider')}
            </Text>
            <Text
              p={0}
              m={0}
              fontSize={{ base: '24px', md: '36px', '2xl': '48px', xl: '48px' }}
              lineHeight={{ base: '1.2', xl: '1.1' }}
              fontWeight={800}
              letterSpacing='-1px'
              textAlign='center'
            >
              <Box as='span' color='#8D0247'>
                {t('keralaOwn')}
              </Box>
              <Box as='span' color='#292929' textTransform='uppercase' ml={2}>
                {t('internet')}
              </Box>
            </Text>

            <Box display='flex' justifyContent='center' mb={8}>
              <Image
                src={homeEnquiryImage}
                alt='BSS Internet Service'
                objectFit='contain'
                maxW={{ base: '280px', lg: '450px' }}
                w='100%'
                h='auto'
              />
            </Box>

            <Text
              fontSize={{ base: '14px', md: '20px' }}
              color='#292929'
              lineHeight='1.6'
              fontWeight='400'
              textAlign='center'
              maxW='550px'
            >
              {t('homeEnquirySubText')}
            </Text>
          </Box>

          <Box
            flex='1'
            w='100%'
            maxW='800px'
            bg='#FFF'
            borderRadius='20px'
            boxShadow='0 0 23.3px 0 rgba(0, 0, 0, 0.12)'
            p={{ base: '24px', md: '40px', xl: '52px' }}
          >
            <Text fontSize={{ base: '24px', md: '32px' }} fontWeight='600' textAlign='center' mb='9' color='#2D3748'>
              {t('createNewTicket')}
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box mb={5}>
                <FormController
                  placeholder={t('choose', { 0: t('ticketCategory') })}
                  labelName={t('ticketCategory')}
                  name='ticketCategory'
                  control={control}
                  errors={errors}
                  type='select'
                  required
                  items={filteredTicketCategoryList}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option}
                />
              </Box>
              <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} columnGap={{ base: 4, md: 8, xl: 10 }} rowGap={5}>
                <CircleSelect control={control} errors={errors} setValue={setValue} />
                <FormController
                  placeholder={t('customerName')}
                  labelName={t('customerName')}
                  name='customerName'
                  control={control}
                  errors={errors}
                  required
                />

                <Box position='relative' w='full'>
                  <FormController
                    placeholder={t('enter', { 0: t('mobileNumber') })}
                    labelName={t('mobileNumber')}
                    name='keyContactNumber'
                    control={control}
                    errors={errors}
                    maxLength={10}
                    required
                    onKeyDown={allowOnlyDigits}
                    disabled={isMobileNumberVerified}
                    isVerified={isMobileNumberVerified}
                    paddingRight={
                      ticketCategory?.name === 'Enquiries' || !!selectedDevice?.username
                        ? isMobileNumberVerified
                          ? '40px'
                          : '80px'
                        : '16px'
                    }
                  />
                  {(ticketCategory?.name === 'Enquiries' || !!selectedDevice?.username) && (
                    <Box position='absolute' right='16px' top='37px' zIndex={2} display='flex' alignItems='center'>
                      {isMobileNumberVerified ? (
                        <BsCheckCircle boxSize={7} color='green.500' />
                      ) : (
                        <Button
                          variant='unstyled'
                          color='primary.500'
                          h='24px'
                          minW='auto'
                          onClick={() => handleVerify()}
                          fontSize='14px'
                          fontWeight='600'
                        >
                          {t('verify')}
                        </Button>
                      )}
                    </Box>
                  )}

                  {isComplaintOrRequest && subscriberList?.subscribers?.length > 0 && (
                    <Text
                      position='absolute'
                      fontSize='14px'
                      color='primary.500'
                      fontWeight='400'
                      cursor='pointer'
                      mt={1}
                      onClick={() => setDeviceDetailsOpen(true)}
                    >
                      {subscriberList?.subscribers?.length} {t('deviceFound')}
                      {selectedDevice?.username ? ` (${selectedDevice.username})` : ''} <LinkIcon boxSize={6} />
                    </Text>
                  )}
                </Box>

                {ticketCategory?.name === 'Enquiries' && (
                  <>
                    <FormController
                      placeholder={t('enter', { 0: t('pinCode') })}
                      labelName={t('pinCode')}
                      name='pinCode'
                      control={control}
                      errors={errors}
                      required
                    />

                    <FormController
                      placeholder={t('enter', { 0: t('district') })}
                      labelName={t('district')}
                      name='district'
                      value={district?.name}
                      control={control}
                      errors={errors}
                      required
                      disabled
                    />
                  </>
                )}

                <FormController
                  placeholder={t('select', { 0: t('subject') })}
                  labelName={t('subject')}
                  name='subject'
                  control={control}
                  errors={errors}
                  type='select'
                  required
                  items={issueTypes}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option}
                />

                <Flex
                  justifyContent={'center'}
                  alignItems={'center'}
                  bg={'gray.100'}
                  border={'1px solid'}
                  borderColor={'gray.400'}
                  mt={7}
                  height={'45px'}
                  borderRadius={'md'}
                >
                  <Text color={'primary.500'} fontSize={'14px'} fontWeight={500}>
                    {subject?.resolvedTime}
                  </Text>
                </Flex>

                <Box>
                  <FormController
                    placeholder={t('dragAndDropHere')}
                    labelName={t('attachments')}
                    name='files'
                    control={control}
                    errors={errors}
                    type='file'
                    multipleUpload={true}
                    uploadedFiles={uploadedFiles}
                    onFileSelect={handleFileSelect}
                    onDeleteFile={onDelete}
                    accept='image/jpeg,image/jpg,image/png,application/pdf,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska'
                    isLoading={isFileUploading}
                  />
                  <Text color='gray.500' fontSize='12px' mt={1}>
                    {t('acceptedFormatsNote', {
                      defaultValue: 'Accepted formats: JPEG/JPG/PNG/PDF/MP4/MOV/AVI/MKV, up to 5MB.'
                    })}
                  </Text>
                </Box>
              </SimpleGrid>

              <Box mt={3}>
                <FormController
                  placeholder={t('remarks')}
                  labelName={t('remarks')}
                  name='remarks'
                  control={control}
                  errors={errors}
                  type='textArea'
                  size='xl'
                  required={subject?.name === 'Others'}
                />
              </Box>

              <Flex justifyContent='center' mt='40px'>
                <Button
                  type='submit'
                  w={{ base: '100%', md: 'auto' }}
                  px='8'
                  py='2'
                  bg='primary.500'
                  _hover={{ bg: 'primary.600' }}
                  color='white'
                  borderRadius='full'
                >
                  {t('generateOTP')}
                  <BsCheckCircle style={{ marginLeft: '8px' }} />
                </Button>
              </Flex>
              <HStack justifyContent='center' mt='20px'>
                <Text fontSize='16px' fontWeight={400} color='#292929'>
                  {t('alreadyHaveaBooking')}
                </Text>
                <Link onClick={() => setTrackingOpen(true)}>
                  <Text as='span' fontSize='18px' fontWeight={500} color='primary.500'>
                    {t('trackHere')}
                  </Text>
                </Link>
              </HStack>
            </form>
          </Box>
        </Flex>
      </Box>
      <VerifyOtpPopUp open={open} setOpen={setOpen} mobileNumber={mobileNumber} />
      <SuccessPopup
        open={confirmOpen}
        setOpen={setConfirmOpen}
        title={t('ticketCreated')}
        description={t('ticketSuccessDescription')}
        confirmText={t('done')}
        onConfirm={handleConfirm}
        trackingId={submitTicket?.id}
      />

      <ComplaintTracking open={trackingOpen} setOpen={setTrackingOpen} />
      <DeviceDetails
        isOpen={deviceDetailsOpen}
        setIsOpen={setDeviceDetailsOpen}
        setSelectedDevice={setSelectedDevice}
        selectedDevice={selectedDevice}
      />
      {isProcessing && (
        <Box position='fixed' inset={0} zIndex={10000} bg='rgba(255,255,255,0.6)'>
          <SplashLoader />
        </Box>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  issueTypes: getIssueTypes(state),
  otpDetails: getOtpDetails(state),
  uploadedFiles: getUploadedFiles(state),
  ticketCategoryList: getTicketCategoryList(state),
  submitTicket: getSubmitTicket(state),
  customerTypes: getCustomerTypes(state),
  isFileUploading: getIsFileUploading(state),
  district: getPinCodeDetails(state)
});

const mapDispatchToProps = {
  fetchIssueTypes,
  customerSubmitTicket,
  sendOtp,
  uploadTicketDocument,
  deleteAttachment,
  fetchCustomerTypes,
  resetOtpDetails: commonActions.resetOtpDetails,
  fetchTicketCategory,
  clearUploadedFiles: crmActions.clearUploadedFiles,
  fetchSubscriberByNumber,
  clearSubscriberByNumber: crmActions.clearSubscriberByNumber,
  fetchDistrictByPincode
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplaintRegistration);
