import { Box, Button, Icons, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

const { WalletTopuUpFailureIcon } = Icons;

const SubscriberWalletTopUpFailure = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Popup isOpen={isOpen} size="md" placement="center" onOpenChange={onClose}>
            <VStack p={6} gap={4} alignItems="center">
                {WalletTopuUpFailureIcon && (
                    <Box>
                        <WalletTopuUpFailureIcon width={'70px'} height={'70px'} />
                    </Box>
                )}

                <Text fontSize="24px" fontWeight={700} textAlign="center" color="#0F1121">
                    {t('topUpFailed')}
                </Text>

                <Text fontSize="14px" textAlign="center" color="#354259" mt={1}>
                    {t('rechargeCouldNotBeCompleted') || 'Your recharge could not be completed.'}
                </Text>

                <Text fontSize="14px" textAlign="center" color="#919191" mt={2} px={2} mb={4}>
                    {t('checkPaymentMethod') || 'Please check your payment method or network connection and try again.'}
                </Text>

                <Button w="100%" colorScheme="primary" mt={2} onClick={() => navigate({ to: '/app/finance/online-top-up' })} size="lg" borderRadius="8px">
                    {t('retry') || 'Retry'}
                </Button>
            </VStack>
        </Popup>
    );
};

export default SubscriberWalletTopUpFailure;
