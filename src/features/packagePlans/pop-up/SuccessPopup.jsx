import { Box, Button, Flex, Image, Popup, Text, VStack } from "@kfonbss/bss-ui-components";
import { useTranslation } from "react-i18next";

import successImage from "@/assets/success.png";
import { Close, Save } from "@/components/custom";
import { successToast } from "@/components/custom/Toast";

const SuccessPopup = ({
    open,
    setOpen,
    title,
    description,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    trackingId
}) => {
    const { t } = useTranslation();

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        setOpen(false);
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        setOpen(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(trackingId);
        successToast({ description: t('copied') });
    };

    return (
        <Popup
            isOpen={open}
            onOpenChange={setOpen}
            placement='center'
            size='xs'
            closeButton={false}
        >
            <VStack spacing={6} textAlign="center" alignItems="center">
                <Box>
                    <Image
                        src={successImage}
                        alt="Success"
                        w="185px"
                        h="132px"
                        objectFit="contain"
                        mb={4}
                    />
                </Box>

                <Text fontSize="25px" fontWeight="700">
                    {title || t('savedSuccessfully')}
                </Text>

                <Text color="gray.500" fontSize="14px" fontWeight="400">
                    {description || t('subPackagesSubmittedMessage')}
                </Text>

                {trackingId && (
                    <Text color="gray.500" fontSize="14px" fontWeight="400">
                        {t('yourTrackingId')}: <b style={{ cursor: 'pointer', color: '#8D0247' }} onClick={handleCopy}>{trackingId}</b>
                    </Text>
                )}


                <Flex gap={4} w="100%" justify="center" pt={4}>
                    {cancelText && (
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                        >
                            {cancelText || t('cancel')} <Close />
                        </Button>
                    )}

                    <Button
                        variant="solid"
                        onClick={handleConfirm}
                    >
                        {confirmText || t('returnToList')} <Save />
                    </Button>
                </Flex>
            </VStack>
        </Popup>
    );
};

export default SuccessPopup;