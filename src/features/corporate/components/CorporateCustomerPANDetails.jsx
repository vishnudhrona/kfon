import { yupResolver } from '@hookform/resolvers/yup';
import {
    AccordionItem, Box, Button, FormController, HStack, Icons,
    Image, Popup, Spinner, Text, useForm,
    VStack
} from '@kfonbss/bss-ui-components';

const { BsCheckCircle } = Icons;
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

import infoImg from '@/assets/success.png';
import { errorToast } from '@/components/custom/Toast';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, deleteKycDocument, fetchKycDetails, fetchKycDocument, updateCustomerPANDetails, uploadKycDocument } from '../action';
import { getEnquiryDetailsData, getKycCustomer, getKycDetails } from '../selector';
import { CorporateCustomerPANDetailsSchema } from '../validation';

const isPdf = (contentType, src) =>
    contentType === 'application/pdf' || /\.pdf(\?.*)?$/i.test(src || '');

const CorporateCustomerPANDetails = ({ onSaveSuccess, customerId, onBasicDetailsRequired }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { cusId } = useSelector(getKycCustomer);
    const kycDetails = useSelector(getKycDetails);
    const { data: enquiryDetails } = useSelector(getEnquiryDetailsData);
    const apiProgress = useSelector(getApiProgress);
    const isPanSaving = apiProgress[ACTION_TYPES.UPDATE_CUSTOMER_PAN_DETAILS];

    const effectiveCustomerId = customerId || cusId || enquiryDetails?.customerId;

    const [showBasicDetailsWarning, setShowBasicDetailsWarning] = useState(false);

    const [panFileName, setPanFileName] = useState('');
    const [panFile, setPanFile] = useState(null);
    const [filePreviewUrl, setFilePreviewUrl] = useState('');
    const [previewContentType, setPreviewContentType] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(CorporateCustomerPANDetailsSchema(t)),
        defaultValues: { panNumber: '', panDocument: null }
    });

    const panPath = kycDetails?.data?.panPath || '';
    const effectiveCusId = cusId || effectiveCustomerId;
    const docCusId = kycDetails?.data?.cusId || effectiveCusId;

    useEffect(() => {
        if (effectiveCustomerId) {
            dispatch(fetchKycDetails({ customerId: effectiveCustomerId }));
        }
    }, [effectiveCustomerId, dispatch]);

    useEffect(() => {
        if (!kycDetails?.data || kycDetails?.isLoading) return;
        const data = kycDetails.data;
        reset({
            panNumber: data.pan || data.panNumber || '',
            panDocument: data.panPath ? 'existing' : null
        });
        if (data.panPath) setPanFileName(t('panDocument'));
    }, [kycDetails?.data, kycDetails?.isLoading, reset, t]);

    // Auto-fetch viewUrl for thumbnail on page load
    useEffect(() => {
        if (!panPath || panFile || !docCusId) return;
        dispatch(fetchKycDocument({
            cusId: docCusId,
            docType: 'PAN',
            onSuccess: ({ viewUrl, contentType }) => {
                setFilePreviewUrl(viewUrl);
                setPreviewContentType(contentType || '');
            }
        }));
    }, [panPath, docCusId, dispatch, panFile]);

    const requireBasicDetails = () => {
        if (!effectiveCustomerId) {
            setShowBasicDetailsWarning(true);
            return false;
        }
        return true;
    };

    const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!requireBasicDetails()) return;
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            errorToast({ description: t('onlyPdfAndImagesAllowed') });
            return;
        }
        if (panFile) URL.revokeObjectURL(filePreviewUrl);
        setFilePreviewUrl(URL.createObjectURL(file));
        setPreviewContentType(file.type);
        setPanFileName(file.name);
        setPanFile(file);
        dispatch(uploadKycDocument({ cusId: docCusId, docType: 'PAN', file }));
    };

    const handleDeleteDoc = (e) => {
        e.stopPropagation();
        if (!requireBasicDetails()) return;
        if (panFile) URL.revokeObjectURL(filePreviewUrl);
        dispatch(deleteKycDocument({
            cusId: docCusId,
            docType: 'PAN',
            onSuccess: () => {
                setFilePreviewUrl('');
                setPreviewContentType('');
                setPanFile(null);
                setPanFileName('');
                setValue('panDocument', null);
            }
        }));
    };

    const handleThumbnailClick = () => {
        if (panFile) {
            setPreviewOpen(true);
        } else if (panPath) {
            if (filePreviewUrl) {
                setPreviewOpen(true);
            } else {
                setPreviewLoading(true);
                dispatch(fetchKycDocument({
                    cusId: docCusId,
                    docType: 'PAN',
                    onSuccess: ({ viewUrl, contentType }) => {
                        setFilePreviewUrl(viewUrl);
                        setPreviewContentType(contentType || '');
                        setPreviewLoading(false);
                        setPreviewOpen(true);
                    }
                }));
            }
        }
    };

    const onSubmit = (data) => {
        if (!requireBasicDetails()) return;
        dispatch(
            updateCustomerPANDetails({
                cusId: effectiveCusId,
                panNumber: data.panNumber?.toUpperCase(),
                panDocument: panFile,
                onSuccess: () => onSaveSuccess?.()
            })
        );
    };

    const showThumbnail = !!(filePreviewUrl || panPath);

    const isPanLoading = isPanSaving;

    return (
        <Box css={isPanLoading ? { '& button[type="submit"] svg': { display: 'none' } } : {}}>
            <AccordionItem
                title={t('panDetails')}
                name="step2"
                value="step2"
                onSubmit={handleSubmit(onSubmit)}
                saveButton={true}
                buttonValue={isPanLoading ? <><Spinner size="xs" style={{ marginRight: '6px' }} />{t('loading') || 'Loading...'}</> : t('saveAndContinue')}
            >
                <FormController
                    name="panNumber"
                    labelName={t('panNumber')}
                    placeholder={t('enter', { 0: t('panNumber') })}
                    control={control}
                    errors={errors}
                    maxLength={10}
                    onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
                />
                {/* <FormController
                    name="customerId"
                    labelName={t('createNewCustomerId')}
                    placeholder={cusId || t('auto')}
                    control={control}
                    errors={errors}
                    disabled
                /> */}
                <Box>
                    <Box display="flex" alignItems="center" gap="8px">
                        <Box flex="1">
                            <FormController
                                name="panDocument"
                                labelName={t('panDocument')}
                                type="file"
                                control={control}
                                errors={errors}
                                required
                                value={panFileName}
                                placeholder={panFileName || t('dragAndDropHere')}
                                onFileSelect={handleFileSelect}
                                accept=".pdf,.jpeg,.png,.jpg"
                                isUploaded={!!panPath && !panFile}
                                showPreview={false}
                            />
                        </Box>
                        {showThumbnail && (
                            <Box position="relative" w="45px" h="45px" flexShrink={0} mt="22px">
                                <Box
                                    w="45px"
                                    h="45px"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    borderRadius="6px"
                                    overflow="hidden"
                                    cursor="pointer"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    bg="gray.50"
                                    onClick={handleThumbnailClick}
                                >
                                    {previewLoading ? (
                                        <Spinner size="sm" color="#8D0247" />
                                    ) : isPdf(previewContentType, filePreviewUrl) ? (
                                        <Box fontSize="10px" fontWeight="bold" color="red.500" textAlign="center" lineHeight="1.2">
                                            PDF
                                        </Box>
                                    ) : filePreviewUrl ? (
                                        <Image src={filePreviewUrl} w="100%" h="100%" objectFit="cover" />
                                    ) : (
                                        <Spinner size="sm" color="#8D0247" />
                                    )}
                                </Box>
                                <Box
                                    position="absolute"
                                    top="-8px"
                                    right="-8px"
                                    w="20px"
                                    h="20px"
                                    bg="white"
                                    border="2px solid"
                                    borderColor="#8D0247"
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    cursor="pointer"
                                    zIndex={1}
                                    color="#8D0247"
                                    _hover={{ bg: '#8D0247', color: 'white' }}
                                    onClick={handleDeleteDoc}
                                >
                                    <LuX size={10} />
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>

                {previewOpen && (
                    <Box
                        position="fixed"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        bg="blackAlpha.700"
                        zIndex="9999"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        onClick={() => setPreviewOpen(false)}
                    >
                        <Box
                            position="relative"
                            bg="white"
                            borderRadius="xl"
                            p={4}
                            maxW="95vw"
                            maxH="95vh"
                            w="800px"
                            overflow="auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Box
                                position="absolute"
                                top="8px"
                                right="8px"
                                w="28px"
                                h="28px"
                                bg="white"
                                border="2px solid"
                                borderColor="#8D0247"
                                borderRadius="full"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                cursor="pointer"
                                color="#8D0247"
                                zIndex={1}
                                _hover={{ bg: '#8D0247', color: 'white' }}
                                onClick={() => setPreviewOpen(false)}
                            >
                                <LuX size={12} />
                            </Box>
                            <Box display="flex" justifyContent="center" alignItems="center" minH="300px" w="100%">
                                {!filePreviewUrl ? (
                                    <Spinner size="lg" color="#8D0247" />
                                ) : isPdf(previewContentType, filePreviewUrl) ? (
                                    <iframe
                                        src={filePreviewUrl}
                                        width="100%"
                                        height="700px"
                                        style={{ border: 'none', borderRadius: '8px', display: 'block' }}
                                        title={t('panDocument')}
                                    />
                                ) : (
                                    <Image
                                        src={filePreviewUrl}
                                        maxW="100%"
                                        maxH="70vh"
                                        objectFit="contain"
                                        borderRadius="md"
                                        display="block"
                                    />
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </AccordionItem>

            <Popup
                isOpen={showBasicDetailsWarning}
                size="sm"
                maxW="500px"
                onOpenChange={(open) => setShowBasicDetailsWarning(open)}
            >
                <Box px={4} pb={6}>
                    <VStack spacing={5} align="center">
                        <Box>
                            <img src={infoImg} alt="info" style={{ width: '160px', height: 'auto' }} />
                        </Box>
                        <Text fontSize="xl" fontWeight="bold" color="#0F1121">
                            {t('information')}
                        </Text>
                        <Text fontSize="md" color="gray.600" textAlign="center" lineHeight="tall">
                            {t('customerBasicDetailsNotSaved')}
                        </Text>
                        <HStack spacing={4} mt={2}>
                            <Button
                                bg="#8D0247"
                                color="white"
                                px={8}
                                h="45px"
                                borderRadius="full"
                                _hover={{ bg: '#700138' }}
                                onClick={() => {
                                    setShowBasicDetailsWarning(false);
                                    onBasicDetailsRequired?.();
                                }}
                            >
                                {t('ok')}
                                <BsCheckCircle style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
                            </Button>
                        </HStack>
                    </VStack>
                </Box>
            </Popup>
        </Box>
    );
};

export default CorporateCustomerPANDetails;
