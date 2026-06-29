import { Box, Button, HStack, Popup, Spinner } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const ServiceCommissioningInvoicePopup = ({ isOpen, data, onCancel }) => {
    const { t } = useTranslation();

    const pdfUrl = data?.pdfUrl ?? data?.invoiceUrl ?? data?.url ?? null;

    return (
        <Popup
            isOpen={isOpen}
            onOpenChange={(e) => { if (!e?.open) onCancel?.(); }}
            placement="center"
            title={data?.invoiceNo ?? t('invoice', 'Invoice')}
            titleMain={t('preview', 'Preview')}
            size="xl"
            contentProps={{ maxW: '1400px', w: '95vw', mx: 'auto' }}
            closeButton
            closeOnInteractOutside={false}
        >
            <Box display="flex" flexDirection="column" h="70vh">
                <Box flex="1" overflow="hidden" position="relative">
                    {pdfUrl ? (
                        <iframe
                            src={`${pdfUrl}#zoom=100`}
                            width="100%"
                            height="100%"
                            style={{
                                border: 'none',
                                display: 'block',
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden'
                            }}
                            scrolling="no"
                            title={t('invoice', 'Invoice')}
                        />
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                            <Spinner size="lg" color="#8D0247" />
                        </Box>
                    )}
                </Box>

                <HStack
                    borderTop="1px solid"
                    borderColor="gray.200"
                    pt={4}
                    mt={4}
                    justify="flex-end"
                    flexShrink={0}
                >
                    <Button
                        variant="outline"
                        h="44px"
                        px="8"
                        borderRadius="full"
                        borderColor="#8D0247"
                        color="#8D0247"
                        _hover={{ bg: '#FFF5F7' }}
                        onClick={onCancel}
                    >
                        {t('close', 'Close')}
                    </Button>
                </HStack>
            </Box>
        </Popup>
    );
};

export default ServiceCommissioningInvoicePopup;
