import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Flex, FormController, HStack, Icons, SimpleGrid, Text, useForm } from "@kfonbss/bss-ui-components";
import { useNavigate } from "@tanstack/react-router";
import { get } from "lodash-es";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { connect, useSelector } from 'react-redux';

import { BsCheckCircle } from "@/components/custom";
import { errorToast } from "@/components/custom/Toast";
import { sendOtp } from "@/features/common/actions";
import VerifyOtpPopUp from "@/features/common/components/VerifyOtpPopUp";
import { getOtpDetails } from "@/features/common/selectors";
import { actions as commonActions } from "@/features/common/slice";
import { fetchPartnerList } from "@/features/finance/revenueShare/action";
import { getPartnerLnpList } from "@/features/finance/revenueShare/selector";
import { fetchDistrictByPincode, fetchTicketCategory } from "@/features/public/pages/enquiryForms/action";
import { getPinCodeDetails, getTicketCategoryList } from "@/features/public/pages/enquiryForms/selector";
import { allowOnlyDigits } from "@/utils/validationUtils";

import DeviceDetails from "../../public/pages/enquiryForms/popup/DeviceDetails";
import { customerSubmitTicket, deleteAttachment, fetchCustomerSubTypes, fetchCustomerTypes, fetchGovtCustomers, fetchIssueTypes, fetchPriorities, fetchSubscriberByNumber, fetchSubscriberList, submitTicket, uploadTicketDocument } from "../action";
import { getAttachment, getCustomerSubTypes, getCustomerTypes, getGovtCustomers, getIsFileUploading, getIssueTypes, getPriorities, getSubscriberByNumber, getSubscriberList, getUploadedFiles } from "../selector";
import { actions as crmActions } from "../slice";
import { createTicketValidation } from "../validation";

const { LinkIcon } = Icons;

const FirstForm = ({
    fetchPriorities,
    priorities,
    fetchIssueTypes,
    issueTypes,
    customerTypes,
    fetchCustomerTypes,
    fetchCustomerSubTypes,
    customerSubTypes,
    submitTicket,
    fetchPartnerList,
    partnerLnpList,
    customerSubmitTicket,
    sendOtp,
    otpDetails,
    attachment,
    fetchSubscriberList,
    subscriberList,
    uploadedFiles,
    uploadTicketDocument,
    deleteAttachment,
    resetOtpDetails,
    ticketCategoryList,
    fetchTicketCategory,
    fetchGovtCustomers,
    govtCustomers,
    isFileUploading,
    fetchSubscriberByNumber,
    clearSubscriberByNumber,
    fetchDistrictByPincode,
    district,
    clearAttachment
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        resetOtpDetails();
        return () => {
            clearAttachment();
        };
    }, [resetOtpDetails, clearAttachment]);

    const [open, setOpen] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [deviceDetailsOpen, setDeviceDetailsOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState({});

    const user = useSelector((state) => get(state['authentication'], 'loginDetails.data'));
    const subscriberByNumber = useSelector(getSubscriberByNumber);

    const { control, formState: { errors, isSubmitting }, watch, handleSubmit, trigger, reset, setValue, clearErrors } = useForm({
        resolver: yupResolver(createTicketValidation(t, user?.roleName)),
        defaultValues: {
            subject: attachment?.subject,
            priority: attachment?.priority,
            typeOfCustomers: attachment?.customerType,
            lnp: attachment?.lnp,
            subTypes: null,
            keyContactNumber: attachment?.mobileNumber,
            remarks: attachment?.remarks,
            subjectResolve: attachment?.subjectResolve,
            ticketCategory: attachment?.ticketCategory,
            requestType: attachment?.requestType || 'complaintRegistration',
            file: null,
            district: null,
            pinCode: null,
            hasSubscribers: false
        },
        mode: 'onChange'
    });

    useEffect(() => {
        setValue('hasSubscribers', !!subscriberByNumber?.subscribers?.length);
    }, [subscriberByNumber, setValue]);

    const typeOfCustomersFieldValue = watch('typeOfCustomers');
    const mobileNumber = watch('keyContactNumber');
    const subject = watch('subject')
    const ticketCategory = watch('ticketCategory');
    const subTypes = watch('subTypes');
    const pinCode = watch('pinCode');

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

    useEffect(() => {
        if (pinCode?.length === 6) {
            fetchDistrictByPincode(pinCode);
        }
    }, [fetchDistrictByPincode, pinCode]);

    useEffect(() => {
        if (district?.id) {
            setValue('district', district, { shouldValidate: true });
            clearErrors('district');
        } else {
            setValue('district', null);
        }
    }, [district, setValue, clearErrors]);

    const isComplaintOrRequest = useMemo(() => {
        const categoryName = (ticketCategory?.name || '').toLowerCase();
        return categoryName.startsWith('complaint') || categoryName.startsWith('request');
    }, [ticketCategory]);

    useEffect(() => {
        if (user?.roleName === 'LNP' || ticketCategory?.name === 'Inward') {
            setValue('typeOfCustomers', null);
            clearErrors('typeOfCustomers');
        }
    }, [ticketCategory, user?.roleName, setValue, clearErrors]);

    useEffect(() => {
        const isPinCodeRequired = (ticketCategory?.name === 'Enquiries' && typeOfCustomersFieldValue?.code === 'GENERAL_PUBLIC') || ticketCategory?.name === 'Inward';
        if (!isPinCodeRequired) {
            setValue('district', null);
            setValue('pinCode', null);
            clearErrors('district');
            clearErrors('pinCode');
        }
    }, [ticketCategory, typeOfCustomersFieldValue?.code, setValue, clearErrors]);

    useEffect(() => {
        if (typeOfCustomersFieldValue?.code === 'GOVT_OFFICES') fetchGovtCustomers('GOVERNMENT');
        if (typeOfCustomersFieldValue?.code === 'ENTERPRISE') fetchGovtCustomers('PRIVATE');
        const isComplaint = (ticketCategory?.name || '').toLowerCase().startsWith('complaint');
        const isSubscriber = typeOfCustomersFieldValue?.code === 'SUBSCRIBERS';
        if (!isComplaint || !isSubscriber) {
            setValue('subTypes', null);
        }
    }, [fetchGovtCustomers, typeOfCustomersFieldValue, ticketCategory, setValue]);

    useEffect(() => {
        fetchTicketCategory();
        fetchPriorities();
        fetchCustomerTypes();
        fetchCustomerSubTypes();
        fetchPartnerList({ type: 'LNP' });
        fetchSubscriberList();
    }, [fetchPriorities, fetchCustomerTypes, fetchCustomerSubTypes, fetchPartnerList, user, isSubmitting, fetchSubscriberList, fetchTicketCategory]);

    useEffect(() => {
        if (ticketCategory?.id) {
            fetchIssueTypes({
                categoryId: ticketCategory?.id,
                customerTypeId: typeOfCustomersFieldValue?.id || undefined,
                customerSubtypeId: subTypes?.id || undefined
            });
        }
    }, [fetchIssueTypes, ticketCategory?.id, typeOfCustomersFieldValue?.id, subTypes?.id]);

    useEffect(() => {
        if (!attachment || (Array.isArray(attachment) && attachment.length === 0)) {
            reset({
                subject: null,
                priority: null,
                typeOfCustomers: null,
                lnp: null,
                keyContactNumber: '',
                remarks: '',
                subjectResolve: '',
                ticketCategory: null,
                requestType: 'complaintRegistration',
                file: null,
                district: null,
                pinCode: null
            });
        }
    }, [attachment, reset]);

    useEffect(() => {
        if (uploadedFiles?.length > 0) {
            setValue('file', uploadedFiles);
            clearErrors('file');
        } else {
            setValue('file', null);
        }
    }, [uploadedFiles, setValue, clearErrors]);

    useEffect(() => {
        if (mobileNumber?.length === 10 && isComplaintOrRequest) {
            const payload = {
                mobile: mobileNumber,
                onSuccess: () => {
                    setDeviceDetailsOpen(true);
                }
            };
            fetchSubscriberByNumber(payload);
        } else {
            clearSubscriberByNumber();
            setSelectedDevice({});
            resetOtpDetails();
        }
    }, [mobileNumber, typeOfCustomersFieldValue?.code, fetchSubscriberByNumber, clearSubscriberByNumber, resetOtpDetails, isComplaintOrRequest]);

    const handleFileSelect = (file) => {

        if (file) {
            setSelectedFileName(file?.name || "");
            const payload = { file: file }
            uploadTicketDocument(payload);
        }
    }

    const onDelete = (fileId) => {
        deleteAttachment(fileId)
    }

    const handleVerify = async () => {
        const isValid = await trigger('keyContactNumber');
        if (isValid) {
            sendOtp({ mobile: mobileNumber });
            setOpen(true);
        }
    };

    const onSubmit = (data) => {
        if (isComplaintOrRequest && (!selectedDevice || !selectedDevice.username) && typeOfCustomersFieldValue?.code === 'GENERAL_PUBLIC') {
            errorToast({ description: t('addRegisteredMobileNumber') });
            return;
        }
        const fileIds = uploadedFiles?.map(f => f.fileId) || [];
        if (user?.roleName === 'LNP') {
            const payload = {
                subjectId: data?.subject?.id,
                priority: data?.priority?.code,
                categoryId: data?.ticketCategory?.id,
                ticketCategory: data?.requestType === "complaintRegistration" ? 'COMPLAINT_REGISTRATION' : 'REQUEST',
                remarks: data?.remarks,
                subjectResolve: data?.subject?.resolvedTime,
                fileIds: fileIds
            }
            submitTicket(payload);
        } else {
            const payload = {
                subjectId: data?.subject?.id,
                priority: data?.priority?.code,
                customerTypeId: data?.typeOfCustomers?.id,
                categoryId: data?.ticketCategory?.id,
                customerId: data?.typeOfCustomers?.code === 'LNP' ? data?.lnp?.id : data?.typeOfCustomers?.code === 'SUBSCRIBERS' ? data?.subscriber?.id : data?.typeOfCustomers?.code === 'GOVT_OFFICES' ? data?.govtOfficers?.id : data?.private?.id,
                customerName: data?.typeOfCustomers?.code === 'LNP' ? data?.lnp?.companyName : data?.typeOfCustomers?.code === 'SUBSCRIBERS' ? data?.subscriber?.name : data?.typeOfCustomers?.code === 'GOVT_OFFICES' ? data?.govtOfficers?.name : data?.customerName,
                remarks: data?.remarks,
                subjectResolve: data?.subject?.resolvedTime,
                mobileNumber: data?.keyContactNumber,
                customerIssue: subject?.name === 'Others' ? data?.remarks : data?.issue,
                subscriberUserName: selectedDevice?.username || '',
                districtId: selectedDevice?.districtId || data?.district?.id || null,
                districtName: selectedDevice?.location || data?.district?.name || null,
                pincode: data?.pinCode,
                fileIds: fileIds
            }

            if ((typeOfCustomersFieldValue?.code === 'GENERAL_PUBLIC' || ticketCategory?.name === 'Inward') && otpDetails?.verified !== true) {
                errorToast({ description: t('otpVerificationPending') });
                return;
            }
            customerSubmitTicket(payload);
        }
    }

    return (
        <>
            <Box as={'form'} onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" h={'100%'}>
                <Box flex={1}>
                    <SimpleGrid
                        columns={{
                            base: 1,
                            lg: 2,
                            xl: 3
                        }}
                        gap={'70px'}
                        rowGap={5}
                        mt={5}
                        px={5}
                        pb={10}
                    >

                        <FormController
                            placeholder={t('choose', { 0: t('ticketCategory') })}
                            labelName={t('ticketCategory')}
                            name='ticketCategory'
                            control={control}
                            errors={errors}
                            type="select"
                            required
                            items={ticketCategoryList}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option}
                        />
                        {user?.roleName === 'LNP' && (
                            <FormController
                                labelName={t('ticketCategory')}
                                name='requestType'
                                errors={errors}
                                control={control}
                                type='radio'
                                required
                                items={[
                                    { label: t('complaintRegistration'), value: 'complaintRegistration' },
                                    { label: t('request'), value: 'request' }
                                ]}
                            />
                        )}
                        {user?.roleName !== 'LNP' && ticketCategory?.name !== 'Inward' && (
                            <>
                                <FormController
                                    placeholder={t('choose', { 0: t('typeOfCustomers') })}
                                    labelName={t('typeOfCustomers')}
                                    name='typeOfCustomers'
                                    control={control}
                                    errors={errors}
                                    type="select"
                                    items={customerTypes}
                                    required
                                />
                                {((ticketCategory?.name || '').toLowerCase().startsWith('complaint')) && typeOfCustomersFieldValue?.code === 'SUBSCRIBERS' ? (
                                    <FormController
                                        placeholder={t('choose', { 0: t('subTypes') })}
                                        labelName={t('subTypes')}
                                        name='subTypes'
                                        control={control}
                                        errors={errors}
                                        type="select"
                                        items={customerSubTypes}
                                        required
                                    />
                                ) : null}
                            </>
                        )}
                        {typeOfCustomersFieldValue?.code === 'LNP' || typeOfCustomersFieldValue?.code === 'SUBSCRIBERS' || typeOfCustomersFieldValue?.code === 'GOVT_OFFICES' || typeOfCustomersFieldValue?.code === 'ENTERPRISE' ? (
                            <FormController
                                placeholder={typeOfCustomersFieldValue?.code === 'LNP' ? t('select', { 0: t('selectLnp') }) : typeOfCustomersFieldValue?.code === 'GOVT_OFFICES' ? t('select', { 0: t('govtOfficers') }) : typeOfCustomersFieldValue?.code === 'ENTERPRISE' ? t('select', { 0: t('private') }) : t('select', { 0: t('selectSubscriber') })}
                                labelName={typeOfCustomersFieldValue?.code === 'LNP' ? t('selectLnp') : typeOfCustomersFieldValue?.code === 'GOVT_OFFICES' ? t('govtOfficers') : typeOfCustomersFieldValue?.code === 'ENTERPRISE' ? t('private') : t('selectSubscriber')}
                                name={typeOfCustomersFieldValue?.code === 'LNP' ? 'lnp' : typeOfCustomersFieldValue?.code === 'GOVT_OFFICES' ? 'govtOfficers' : typeOfCustomersFieldValue?.code === 'ENTERPRISE' ? 'private' : 'subscriber'}
                                control={control}
                                errors={errors}
                                type="select"
                                items={typeOfCustomersFieldValue?.code === 'LNP' ? partnerLnpList : typeOfCustomersFieldValue?.code === 'GOVT_OFFICES' ? govtCustomers : subscriberList}
                                required
                            />
                        ) : (typeOfCustomersFieldValue?.code === 'GENERAL_PUBLIC' || ticketCategory?.name === 'Inward') ? (
                            <>
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
                                        isVerified={otpDetails?.verified}
                                        paddingRight={otpDetails?.verified ? '40px' : '80px'}
                                    />
                                    <Box position='absolute' right='16px' top='37px' zIndex={2} display='flex' alignItems='center'>
                                        {otpDetails?.verified ? (
                                            <BsCheckCircle boxSize={7} color='green.500' />
                                        ) : (ticketCategory?.name === 'Enquiries' || !!selectedDevice?.username || ticketCategory?.name === 'Inward') ? (
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
                                        ) : null}
                                    </Box>
                                    {subscriberByNumber?.subscribers?.length > 0 && (
                                        <Text
                                            position='absolute'
                                            fontSize='14px'
                                            color='primary.500'
                                            fontWeight='400'
                                            cursor='pointer'
                                            mt={1}
                                            onClick={() => setDeviceDetailsOpen(true)}
                                        >
                                            {subscriberByNumber?.subscribers?.length} {t('deviceFound')}{selectedDevice?.username ? ` (${selectedDevice.username})` : ''} <LinkIcon boxSize={6} />
                                        </Text>
                                    )}
                                </Box>

                                {((ticketCategory?.name === 'Enquiries' && typeOfCustomersFieldValue?.code === 'GENERAL_PUBLIC') || (ticketCategory?.name === 'Inward')) && (
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
                                    placeholder={t('customerName')}
                                    labelName={t('customerName')}
                                    name='customerName'
                                    control={control}
                                    errors={errors}
                                    required
                                />
                            </>
                        ) : null}

                        <FormController
                            placeholder={t('select', { 0: t('subject') })}
                            labelName={t('subject')}
                            name='subject'
                            control={control}
                            errors={errors}
                            type="select"
                            required
                            items={issueTypes}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option}
                        />

                        <Flex justifyContent={'center'} alignItems={'center'} bg={'gray.100'} border={'1px solid'} borderColor={'gray.400'} mt={7} height={'45px'} borderRadius={'md'}>
                            <Text color={'primary.500'} fontSize={'14px'} fontWeight={500}>{subject?.resolvedTime}</Text>
                        </Flex>

                        <FormController
                            placeholder={t('select', { 0: t('selectPriority') })}
                            labelName={t('selectPriority')}
                            name='priority'
                            control={control}
                            errors={errors}
                            type="select"
                            required
                            items={priorities}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option}
                        />
                        <FormController
                            placeholder={t('enter', { 0: t('remarks') })}
                            labelName={t('remarks')}
                            name='remarks'
                            control={control}
                            errors={errors}
                            type="textArea"
                            required={subject?.name === "Others"}
                        />

                        <Box>
                            <FormController
                                placeholder={t('dragAndDropHere')}
                                value={selectedFileName}
                                labelName={t('attachment')}
                                name='file'
                                control={control}
                                errors={errors}
                                type="file"
                                multipleUpload={true}
                                uploadedFiles={uploadedFiles}
                                onFileSelect={handleFileSelect}
                                onDeleteFile={onDelete}
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                isLoading={isFileUploading}
                            />
                            <Text color='gray.500' fontSize='12px' mt={1}>
                                {t('acceptedFormatsNote', { defaultValue: 'Accepted formats: JPEG/JPG/PNG/PDF, up to 5MB.' })}
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Box>
                <HStack
                    justifyContent={'flex-end'}
                    gap={4}
                    mt={'auto'}
                    p={4}
                    px={5}
                >
                    <Button variant={'outline'} h={'40px'} onClick={() => navigate({ to: '/app/crm/ticket-list' })}>
                        <IoIosArrowRoundBack />
                        {t('Back')}
                    </Button>
                    <Button type="submit" h={'40px'}>
                        {t('Forward')}
                        <IoIosArrowRoundForward />
                    </Button>
                </HStack>
            </Box>
            <VerifyOtpPopUp open={open} setOpen={setOpen} mobileNumber={mobileNumber} />
            <DeviceDetails isOpen={deviceDetailsOpen} setIsOpen={setDeviceDetailsOpen} setSelectedDevice={setSelectedDevice} selectedDevice={selectedDevice} />
        </>
    );
};

const mapStateToProps = (state) => ({
    priorities: getPriorities(state),
    issueTypes: getIssueTypes(state),
    customerTypes: getCustomerTypes(state),
    customerSubTypes: getCustomerSubTypes(state),
    partnerLnpList: getPartnerLnpList(state),
    otpDetails: getOtpDetails(state),
    attachment: getAttachment(state),
    subscriberList: getSubscriberList(state),
    uploadedFiles: getUploadedFiles(state),
    ticketCategoryList: getTicketCategoryList(state),
    govtCustomers: getGovtCustomers(state),
    isFileUploading: getIsFileUploading(state),
    district: getPinCodeDetails(state)
});

const mapDispatchToProps = {
    fetchPriorities,
    fetchIssueTypes,
    fetchCustomerTypes,
    fetchCustomerSubTypes,
    submitTicket,
    fetchPartnerList,
    customerSubmitTicket,
    resetOtpDetails: commonActions.resetOtpDetails,
    sendOtp,
    fetchSubscriberList,
    uploadTicketDocument,
    deleteAttachment,
    fetchTicketCategory,
    fetchGovtCustomers,
    fetchSubscriberByNumber,
    clearSubscriberByNumber: crmActions.clearSubscriberByNumber,
    fetchDistrictByPincode,
    clearAttachment: crmActions.clearAttachment
};

export default connect(mapStateToProps, mapDispatchToProps)(FirstForm);