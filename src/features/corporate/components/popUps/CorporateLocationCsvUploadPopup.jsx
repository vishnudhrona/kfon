import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Icons, Popup, Spinner, Text, useForm } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, corporateLocationUpload, downloadLocationCsvTemplate } from '../../action';
import { csvUploadSchema } from '../../validation';

const { BsXCircle, BsArrowRightCircle } = Icons;

const CorporateLocationCsvUploadPopup = ({ isOpen, setIsOpen, enquiryId, onSuccess }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [fileName, setFileName] = useState('');

    const apiProgress = useSelector(getApiProgress);
    const isSubmitting = !!apiProgress[ACTION_TYPES.CORPORATE_LOCATION_UPLOAD];

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(csvUploadSchema(t)),
        defaultValues: { csvFile: null }
    });

    const handleClose = () => {
        setFileName('');
        reset();
        setIsOpen(false);
    };

    const handleFileSelect = (file) => {
        setFileName(file?.name || '');
    };

    const onSubmit = (data) => {
        if (isSubmitting) return;
        dispatch(corporateLocationUpload({
            enquiryId,
            file: data.csvFile,
            onSuccess: () => {
                handleClose();
                onSuccess?.();
            }
        }));
    };

    return (
        <Popup
            isOpen={isOpen}
            title={t('add')}
            titleMain={t('location')}
            size="md"
            maxW="500px"
            closeButton
            onOpenChange={setIsOpen}
            closeOnInteractOutside={false}
        >
            <Box>
                <Box px={0}>
                    <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={5}>
                        <Box>
                            <FormController
                                name="csvFile"
                                labelName={t('deviceDetailsCsvFile')}
                                type="file"
                                accept=".csv"
                                control={control}
                                errors={errors}
                                required
                                placeholder={fileName || t('dragDropFiles')}
                                value={fileName}
                                onFileSelect={(file) => {
                                    handleFileSelect(file);
                                    setValue('csvFile', file, { shouldValidate: true });
                                }}
                                ctaText={!fileName ? t('downloadFormat') : undefined}
                                onCtaClick={!fileName ? () => dispatch(downloadLocationCsvTemplate()) : undefined}
                            />
                            <Text fontSize="sm" color="gray.500" mt={2}>
                                {t('csvUploadNote')}
                            </Text>
                        </Box>
                    </Box>

                    <HStack justify="flex-end" mt={6} spacing={4}>
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            borderColor="#8D0247"
                            color="#8D0247"
                            borderRadius="full"
                            px={8}
                            h="45px"
                            _hover={{ bg: 'pink.50' }}
                        >
                            <BsXCircle style={{ marginRight: '8px', width: '20px', height: '20px' }} />
                            {t('cancel')}
                        </Button>
                        <Button
                            variant="solid"
                            onClick={handleSubmit(onSubmit)}
                            bg="#8D0247"
                            color="white"
                            borderRadius="full"
                            px={8}
                            h="45px"
                            _hover={{ bg: '#700138' }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Spinner size='xs' style={{ marginRight: '8px' }} />}
                            {t('submit')}
                            <BsArrowRightCircle style={{ marginLeft: '8px', width: '20px', height: '20px' }} />
                        </Button>
                    </HStack>
                </Box>
            </Box>
        </Popup>
    );
};

export default CorporateLocationCsvUploadPopup;
