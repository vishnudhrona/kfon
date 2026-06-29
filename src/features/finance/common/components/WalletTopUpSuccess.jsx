import { Box, Button, Flex, Icons, Popup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { fetchTopupPaymentResult } from '../action';
import { getPaymentResult } from '../selector';

const { WalletTopuUpSuccessIcon } = Icons;

const WalletTopUpSuccess = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const details = useSelector(getPaymentResult);

    useEffect(() => {
        if (isOpen) {
            dispatch(fetchTopupPaymentResult());
        }
    }, [isOpen, dispatch]);

    return (
        <Popup isOpen={isOpen} size="md" placement="center" onOpenChange={onClose}>
            <VStack p={6} gap={4} alignItems="center">
                {WalletTopuUpSuccessIcon && (
                    <Box>
                        <WalletTopuUpSuccessIcon width={'70px'} height={'70px'} />
                    </Box>
                )}

                <Text fontSize="24px" fontWeight={700} textAlign="center" color="#0F1121">
                    {t('topUpSuccessful') || 'Top-Up Successful!'}
                </Text>

                <Text fontSize="14px" textAlign="center" color="#354259" mt={1}>
                    {t('topUpSuccessMessage') || 'Thank you. your payment has been successfully received with the following details. Please quote your transaction reference number for any queries relating to this request .'}
                </Text>

                <Box w="100%" bg="#F5F5F5" borderRadius="12px" p={5} mt={2}>
                    <Flex justify="space-between" mb={4}>
                        <Text fontSize="14px" color="#717171" maxW="60%">
                            {t('transactionRef') || 'Transaction Reference Number to the Banker'}
                        </Text>
                        <Text fontSize="14px" fontWeight={600} color="#111827">
                            {details.txnId || '-'}
                        </Text>
                    </Flex>
                    <Flex justify="space-between" mb={4}>
                        <Text fontSize="14px" color="#717171">
                            {t('bssReference') || 'BSS Reference'}
                        </Text>
                        <Text fontSize="14px" fontWeight={600} color="#111827">
                            {details.referenceNo || '-'}
                        </Text>
                    </Flex>
                    <Flex justify="space-between" mb={4}>
                        <Text fontSize="14px" color="#717171">
                            {t('transactionDate') || 'Transaction Date'}
                        </Text>
                        <Text fontSize="14px" fontWeight={600} color="#111827">
                            {details.transactionDate || '-'}
                        </Text>
                    </Flex>
                    <Flex justify="space-between">
                        <Text fontSize="14px" color="#717171">
                            {t('paymentAmount') || 'Payment Amount (Rs)'}
                        </Text>
                        <Text fontSize="14px" fontWeight={600} color="#111827">
                            {details.amount ?? '0.00'}
                        </Text>
                    </Flex>
                </Box>

                <Text fontSize="14px" textAlign="center" color="#919191" mt={2} px={6}>
                    {t('topUpSuccessNote') || 'Note : Paymnet will be creadited to your Rconverge Billing acoount within 3 Working Days'}
                </Text>

                <Button w="100%" colorScheme="primary" mt={3} onClick={() => navigate({ to: '/app/finance/online-top-up' })} size="lg" borderRadius="8px">
                    {t('ok') || 'Ok'}
                </Button>
            </VStack>
        </Popup>
    );
};

export default WalletTopUpSuccess;
