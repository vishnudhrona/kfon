/* eslint-disable react-hooks/exhaustive-deps */
import { yupResolver } from '@hookform/resolvers/yup';
import {
    AccordionItem, Box, Button, FormController, HStack,
    Icons, Image, Input, Popup, Spinner, Text, useForm,
    VStack
} from '@kfonbss/bss-ui-components';

const { BsCheckCircle } = Icons;
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuX } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';

import infoImg from '@/assets/success.png';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { regex } from '@/utils/validationUtils';

import { ACTION_TYPES, deleteKycDocument, fetchKycDocument, searchCorporateGstDetails, updateCustomerGSTDetails, uploadKycDocument } from '../action';
import { getEnquiryDetailsData, getGstSearchDetails, getKycCustomer, getKycDetails } from '../selector';
import { CorporateCustomerGSTDetailsSchema } from '../validation';

const isPdf = (contentType, src) =>
    contentType === 'application/pdf' || /\.pdf(\?.*)?$/i.test(src || '');

const CorporateCustomerGSTDetails = ({ onSaveSuccess, customerId, onBasicDetailsRequired }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { cusId } = useSelector(getKycCustomer);
    const kycDetails = useSelector(getKycDetails);
    const { data: enquiryDetails } = useSelector(getEnquiryDetailsData);
    const gstSearchDetails = useSelector(getGstSearchDetails);
    const apiProgress = useSelector(getApiProgress);
    const isGstSaving = apiProgress[ACTION_TYPES.UPDATE_CUSTOMER_GST_DETAILS];

    const effectiveCustomerId = customerId || cusId || enquiryDetails?.customerId;
    const docCusId = kycDetails?.data?.cusId || cusId || effectiveCustomerId;

    const [showBasicDetailsWarning, setShowBasicDetailsWarning] = useState(false);

    // File objects (new selections)
    const [gstFile, setGstFile] = useState(null);
    const [gstFileName, setGstFileName] = useState('');
    const [supportingFile, setSupportingFile] = useState(null);
    const [supportingFileName, setSupportingFileName] = useState('');
    const [lutFile, setLutFile] = useState(null);
    const [lutFileName, setLutFileName] = useState('');

    // Thumbnail preview state per doc
    const [gstPreviewUrl, setGstPreviewUrl] = useState('');
    const [gstPreviewContentType, setGstPreviewContentType] = useState('');
    const [supportPreviewUrl, setSupportPreviewUrl] = useState('');
    const [supportPreviewContentType, setSupportPreviewContentType] = useState('');
    const [lutPreviewUrl, setLutPreviewUrl] = useState('');
    const [lutPreviewContentType, setLutPreviewContentType] = useState('');

    // Shared popup state
    const [previewLoading, setPreviewLoading] = useState(false);
    const [popup, setPopup] = useState({ open: false, url: '', contentType: '', title: '' });

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        register,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(CorporateCustomerGSTDetailsSchema(t)),
        mode: 'onChange',
        defaultValues: {
            gstInformation: 'No',
            stateCode: '32',
            panId: '',
            entityType: '',
            businessCode: 'Z',
            checkDigit: '',
            gstin: '',
            gstDocument: null,
            taxPayerType: '',
            legalName: '',
            tradeName: '',
            serviceDescription: '',
            sac: '',
            supportingDocument: null,
            lutDocument: null
        }
    });

    const gstInformation = watch('gstInformation');

    // Server path fields (file IDs for fetch/delete)
    const gstinPath = kycDetails?.data?.gstinPath || '';
    const supportDocPath = kycDetails?.data?.supportDocPath || '';
    const lutPath = kycDetails?.data?.lutPath || '';

    // Prefill from KYC data
    useEffect(() => {
        if (!kycDetails?.data) return;
        const data = kycDetails.data;
        const gstin = data.gstin || '';
        let gstParts = { stateCode: '32', panId: '', entityType: '', businessCode: 'Z', checkDigit: '' };
        if (gstin.length === 15) {
            gstParts = {
                stateCode: gstin.substring(0, 2),
                panId: gstin.substring(2, 12),
                entityType: gstin.substring(12, 13),
                businessCode: gstin.substring(13, 14),
                checkDigit: gstin.substring(14, 15)
            };
        }
        if (data.gstinPath) setGstFileName(t('gstDocument'));
        if (data.supportDocPath) setSupportingFileName(t('supportingDocument'));
        if (data.lutPath) setLutFileName(t('lutDocument'));
        reset({
            gstInformation: (data.gstInformation || data.gstin) ? 'Yes' : 'No',
            ...gstParts,
            panId: gstParts.panId || data.pan || '',
            gstin,
            gstDocument: data.gstinPath ? 'existing' : null,
            taxPayerType: data.taxPayerType
                ? data.taxPayerType.charAt(0).toUpperCase() + data.taxPayerType.slice(1).toLowerCase()
                : '',
            legalName: data.legalName || '',
            tradeName: data.tradeName || '',
            serviceDescription: data.serviceDescription || '',
            sac: data.sac || '',
            supportingDocument: data.supportDocPath ? 'existing' : null,
            lutDocument: data.lutPath ? 'existing' : null
        });
    }, [kycDetails?.data, reset]);

    // Auto-fetch thumbnails for server docs
    useEffect(() => {
        if (!gstinPath || gstFile || !docCusId) return;
        dispatch(fetchKycDocument({
            cusId: docCusId,
            docType: 'GST',
            onSuccess: ({ viewUrl, contentType }) => {
                setGstPreviewUrl(viewUrl);
                setGstPreviewContentType(contentType || '');
            }
        }));
    }, [gstinPath, docCusId]);

    useEffect(() => {
        if (!supportDocPath || supportingFile || !docCusId) return;
        dispatch(fetchKycDocument({
            cusId: docCusId,
            docType: 'SUPPORT',
            onSuccess: ({ viewUrl, contentType }) => {
                setSupportPreviewUrl(viewUrl);
                setSupportPreviewContentType(contentType || '');
            }
        }));
    }, [supportDocPath, docCusId]);

    useEffect(() => {
        if (!lutPath || lutFile || !docCusId) return;
        dispatch(fetchKycDocument({
            cusId: docCusId,
            docType: 'LUT',
            onSuccess: ({ viewUrl, contentType }) => {
                setLutPreviewUrl(viewUrl);
                setLutPreviewContentType(contentType || '');
            }
        }));
    }, [lutPath, docCusId]);

    // Watch GSTIN parts and trigger search
    const stateCode = watch('stateCode');
    const panId = watch('panId');
    const entityType = watch('entityType');
    const businessCode = watch('businessCode');
    const checkDigit = watch('checkDigit');

    useEffect(() => {
        const assembled = `${stateCode || ''}${panId || ''}${entityType || ''}${businessCode || ''}${checkDigit || ''}`;
        setValue('gstin', assembled);
        if (regex.gstNumber.test(assembled)) {
            dispatch(searchCorporateGstDetails({ gstin: assembled }));
        }
    }, [stateCode, panId, entityType, businessCode, checkDigit, setValue, dispatch]);

    // Auto-fill from GST search
    useEffect(() => {
        if (gstSearchDetails?.data) {
            const { dty, lgnm, tradeNam } = gstSearchDetails.data;
            setValue('taxPayerType', dty || '');
            setValue('legalName', lgnm || '');
            setValue('tradeName', tradeNam || '');
        }
    }, [gstSearchDetails?.data, setValue]);

    const requireBasicDetails = () => {
        if (!effectiveCustomerId) {
            setShowBasicDetailsWarning(true);
            return false;
        }
        return true;
    };

    // File select handlers
    const handleGstFileSelect = (file) => {
        if (!file) return;
        if (!requireBasicDetails()) return;
        if (gstFile) URL.revokeObjectURL(gstPreviewUrl);
        setGstPreviewUrl(URL.createObjectURL(file));
        setGstPreviewContentType(file.type);
        setGstFileName(file.name || '');
        setGstFile(file);
        dispatch(uploadKycDocument({ cusId: docCusId, docType: 'GST', file }));
    };

    const handleSupportingFileSelect = (file) => {
        if (!file) return;
        if (!requireBasicDetails()) return;
        if (supportingFile) URL.revokeObjectURL(supportPreviewUrl);
        setSupportPreviewUrl(URL.createObjectURL(file));
        setSupportPreviewContentType(file.type);
        setSupportingFileName(file.name || '');
        setSupportingFile(file);
        dispatch(uploadKycDocument({ cusId: docCusId, docType: 'SUPPORT', file }));
    };

    const handleLutFileSelect = (file) => {
        if (!file) return;
        if (!requireBasicDetails()) return;
        if (lutFile) URL.revokeObjectURL(lutPreviewUrl);
        setLutPreviewUrl(URL.createObjectURL(file));
        setLutPreviewContentType(file.type);
        setLutFileName(file.name || '');
        setLutFile(file);
        dispatch(uploadKycDocument({ cusId: docCusId, docType: 'LUT', file }));
    };

    // Thumbnail click → open popup
    const openPopup = (previewUrl, contentType, title, docType, path) => {
        if (previewUrl) {
            setPopup({ open: true, url: previewUrl, contentType, title });
        } else if (path && docCusId) {
            setPreviewLoading(true);
            dispatch(fetchKycDocument({
                cusId: docCusId,
                docType,
                onSuccess: ({ viewUrl, contentType: ct }) => {
                    setPreviewLoading(false);
                    setPopup({ open: true, url: viewUrl, contentType: ct || '', title });
                }
            }));
        }
    };

    // Delete handlers — always call API (file is uploaded on select)
    const handleDeleteGstDoc = (e) => {
        e.stopPropagation();
        if (!requireBasicDetails()) return;
        if (gstFile) URL.revokeObjectURL(gstPreviewUrl);
        dispatch(deleteKycDocument({
            cusId: docCusId,
            docType: 'GST',
            onSuccess: () => {
                setGstPreviewUrl('');
                setGstPreviewContentType('');
                setGstFile(null);
                setGstFileName('');
                setValue('gstDocument', null);
            }
        }));
    };

    const handleDeleteSupportDoc = (e) => {
        e.stopPropagation();
        if (!requireBasicDetails()) return;
        if (supportingFile) URL.revokeObjectURL(supportPreviewUrl);
        dispatch(deleteKycDocument({
            cusId: docCusId,
            docType: 'SUPPORT',
            onSuccess: () => {
                setSupportPreviewUrl('');
                setSupportPreviewContentType('');
                setSupportingFile(null);
                setSupportingFileName('');
                setValue('supportingDocument', null);
            }
        }));
    };

    const handleDeleteLutDoc = (e) => {
        e.stopPropagation();
        if (!requireBasicDetails()) return;
        if (lutFile) URL.revokeObjectURL(lutPreviewUrl);
        dispatch(deleteKycDocument({
            cusId: docCusId,
            docType: 'LUT',
            onSuccess: () => {
                setLutPreviewUrl('');
                setLutPreviewContentType('');
                setLutFile(null);
                setLutFileName('');
                setValue('lutDocument', null);
            }
        }));
    };

    const onSubmit = (data) => {
        if (!requireBasicDetails()) return;
        const effectiveCusId = cusId || effectiveCustomerId;
        const isGstEnabled = data.gstInformation === 'Yes';
        dispatch(
            updateCustomerGSTDetails({
                cusId: effectiveCusId,
                hasGstin: isGstEnabled,
                gstin: isGstEnabled ? data.gstin : '',
                serviceDescription: isGstEnabled ? data.serviceDescription : '',
                sac: isGstEnabled ? data.sac : '',
                taxPayerType: isGstEnabled ? (data.taxPayerType?.toUpperCase() || '') : '',
                legalName: isGstEnabled ? data.legalName : '',
                tradeName: isGstEnabled ? data.tradeName : '',
                gstDocument: gstFile,
                supportingDocument: supportingFile,
                lutDocument: lutFile,
                onSuccess: () => onSaveSuccess?.()
            })
        );
    };

    const renderThumbnail = (previewUrl, contentType, path, onDelete, docType, label) => {
        const show = !!(previewUrl || path);
        if (!show) return null;
        return (
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
                    onClick={() => openPopup(previewUrl, contentType, label, docType, path)}
                >
                    {isPdf(contentType, previewUrl) ? (
                        <Box fontSize="10px" fontWeight="bold" color="red.500" textAlign="center" lineHeight="1.2">
                            PDF
                        </Box>
                    ) : previewUrl ? (
                        <Image src={previewUrl} w="100%" h="100%" objectFit="cover" />
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
                    onClick={onDelete}
                >
                    <LuX size={10} />
                </Box>
            </Box>
        );
    };

    return (
        <Box css={isGstSaving ? { '& button[type="submit"] svg': { display: 'none' } } : {}}>
            <AccordionItem
                title={t('gstDetails')}
                name="step3"
                value="step3"
                onSubmit={handleSubmit(onSubmit)}
                saveButton={true}
                buttonValue={isGstSaving ? <><Spinner size="xs" style={{ marginRight: '6px' }} />{t('loading') || 'Loading...'}</> : t('saveAndContinue')}
            >
                <FormController
                    name="gstInformation"
                    labelName={t('gstIn')}
                    type="radio"
                    items={[{ label: t('yes'), value: 'Yes' }, { label: t('no'), value: 'No' }]}
                    control={control}
                    errors={errors}
                />

                {gstInformation === 'Yes' && (
                    <>
                        <Box>
                            <Text fontSize="sm" fontWeight="500" color="gray.700" mb={2}>{t('gstIn')}</Text>
                            <HStack spacing={2}>
                                <Input w="50px" {...register('stateCode')} readOnly textAlign="center" borderRadius="md" />
                                <Input flex={1} {...register('panId')} readOnly textAlign="center" borderRadius="md" />
                                <Input w="50px" {...register('entityType')} borderRadius="md" maxLength={1} />
                                <Input w="50px" {...register('businessCode')} readOnly textAlign="center" borderRadius="md" />
                                <Input w="50px" {...register('checkDigit')} borderRadius="md" maxLength={1} />
                            </HStack>
                        </Box>

                        <Box>
                            <Box display="flex" alignItems="center" gap="8px">
                                <Box flex="1">
                                    <FormController
                                        name="gstDocument"
                                        labelName={t('gstDocument')}
                                        type="file"
                                        control={control}
                                        errors={errors}
                                        required
                                        value={gstFileName}
                                        placeholder={gstFileName || t('dragAndDropHere')}
                                        onFileSelect={handleGstFileSelect}
                                        accept=".pdf,.jpeg,.png,.jpg"
                                        isUploaded={!!gstinPath && !gstFile}
                                        showPreview={false}
                                    />
                                </Box>
                                {renderThumbnail(gstPreviewUrl, gstPreviewContentType, gstinPath, handleDeleteGstDoc, 'GST', t('gstDocument'))}
                            </Box>
                        </Box>

                        <FormController
                            name="taxPayerType"
                            labelName={t('taxPayerType')}
                            control={control}
                            errors={errors}
                            disabled
                        />

                        <FormController
                            name="legalName"
                            labelName={t('legalNameOfBusiness')}
                            control={control}
                            errors={errors}
                            disabled
                        />

                        <FormController
                            name="tradeName"
                            labelName={t('tradeName')}
                            control={control}
                            errors={errors}
                            disabled
                        />

                        <FormController
                            name="serviceDescription"
                            labelName={t('serviceDescription')}
                            placeholder={t('enter', { 0: t('serviceDescription') })}
                            control={control}
                            errors={errors}
                        />

                        <FormController
                            name="sac"
                            labelName={t('sacCode')}
                            placeholder={t('enter', { 0: t('sacCode') })}
                            control={control}
                            errors={errors}
                        />
                    </>
                )}

                <Box>
                    <Box display="flex" alignItems="center" gap="8px">
                        <Box flex="1">
                            <FormController
                                name="supportingDocument"
                                labelName={t('supportingDocument')}
                                type="file"
                                control={control}
                                errors={errors}
                                required
                                value={supportingFileName}
                                placeholder={supportingFileName || t('dragAndDropHere')}
                                onFileSelect={handleSupportingFileSelect}
                                accept=".pdf,.jpeg,.png,.jpg"
                                isUploaded={!!supportDocPath && !supportingFile}
                                showPreview={false}
                            />
                        </Box>
                        {renderThumbnail(supportPreviewUrl, supportPreviewContentType, supportDocPath, handleDeleteSupportDoc, 'SUPPORT', t('supportingDocument'))}
                    </Box>
                </Box>

                <Box>
                    <Box display="flex" alignItems="center" gap="8px">
                        <Box flex="1">
                            <FormController
                                name="lutDocument"
                                labelName={t('lutDocument')}
                                type="file"
                                control={control}
                                errors={errors}
                                value={lutFileName}
                                placeholder={lutFileName || t('dragAndDropHere')}
                                onFileSelect={handleLutFileSelect}
                                accept=".pdf,.jpeg,.png,.jpg"
                                isUploaded={!!lutPath && !lutFile}
                                showPreview={false}
                            />
                        </Box>
                        {renderThumbnail(lutPreviewUrl, lutPreviewContentType, lutPath, handleDeleteLutDoc, 'LUT', t('lutDocument'))}
                    </Box>
                </Box>

                {/* Shared preview overlay */}
                {popup.open && (
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
                        onClick={() => setPopup((p) => ({ ...p, open: false }))}
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
                                onClick={() => setPopup((p) => ({ ...p, open: false }))}
                            >
                                <LuX size={12} />
                            </Box>
                            <Box display="flex" justifyContent="center" alignItems="center" minH="300px" w="100%">
                                {previewLoading || !popup.url ? (
                                    <Spinner size="lg" color="#8D0247" />
                                ) : isPdf(popup.contentType, popup.url) ? (
                                    <iframe
                                        src={popup.url}
                                        width="100%"
                                        height="700px"
                                        style={{ border: 'none', borderRadius: '8px', display: 'block' }}
                                        title={popup.title}
                                    />
                                ) : (
                                    <Image
                                        src={popup.url}
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

export default CorporateCustomerGSTDetails;
