import { Box, Button, HStack, Popover, Popup, Spinner } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { BsChevronDown } from 'react-icons/bs';

import { router } from '@/routes/routes';

const PurchaseOrderPreviewPopup = ({ isOpen, data, onCancel, navigateOnClose = true, hideActions = false }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClose = () => {
        onCancel?.();
        if (navigateOnClose) navigate({ to: '/app/corporate/enquiry-list' });
    };

    const isPoReceived = data?.proposalStatus === 'PO_RECEIVED';
    const showCircuitProvisioning = !hideActions && isPoReceived;
    const showServiceProvisioning = !hideActions && isPoReceived;

    const actionItems = [
        ...(showCircuitProvisioning ? [{
            label: t('circuitProvisioning', 'Circuit Provisioning'),
            onClick: () => {
                onCancel?.();
                router.navigate({
                    to: '/app/corporate/enquiry-detailed-view/circuit-provisioning/$enquiryId',
                    params: { enquiryId: data?.enquiryId },
                    state: { version: data?.version, locationIds: data?.locationIds }
                });
            }
        }] : []),
        ...(showServiceProvisioning ? [{
            label: t('serviceProvisioning', 'Service Provisioning'),
            onClick: () => {
                onCancel?.();
                router.navigate({
                    to: '/app/corporate/enquiry-detailed-view/service-provisioning/$enquiryId',
                    params: { enquiryId: data?.enquiryId },
                    state: { version: data?.version, locationIds: data?.locationIds }
                });
            }
        }] : [])
    ];

    return (
        <Popup
            isOpen={isOpen}
            onOpenChange={(e) => { if (!e?.open) handleClose(); }}
            placement="center"
            title={t('purchaseOrder')}
            titleMain={t('preview')}
            size="xl"
            contentProps={{ maxW: '1400px', w: '95vw', mx: 'auto' }}
            closeButton
            closeOnInteractOutside={false}
        >
            <Box display="flex" flexDirection="column" h="70vh">
                {/* PDF Content */}
                <Box flex="1" overflow="hidden" position="relative">
                    {data?.pdfUrl ? (
                        <iframe
                            src={`${data.pdfUrl}#zoom=100`}
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
                            title={t('preview')}
                        />
                    ) : (
                        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                            <Spinner size="lg" color="#8D0247" />
                        </Box>
                    )}
                </Box>

                {/* Footer */}
                <HStack
                    borderTop="1px solid"
                    borderColor="gray.200"
                    pt={4}
                    mt={4}
                    justify="flex-end"
                    spacing={3}
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
                        onClick={handleClose}
                    >
                        {t('close', 'Close')}
                    </Button>

                    {actionItems.length === 1 && (
                        <Button
                            bg="#8D0247"
                            color="white"
                            h="44px"
                            px="8"
                            borderRadius="full"
                            _hover={{ bg: '#6d0136' }}
                            onClick={actionItems[0].onClick}
                        >
                            {actionItems[0].label}
                        </Button>
                    )}

                    {actionItems.length > 1 && (
                        <Popover.Root positioning={{ placement: 'top-end' }}>
                            <Popover.Trigger asChild>
                                <Button
                                    bg="#8D0247"
                                    color="white"
                                    h="44px"
                                    px="8"
                                    borderRadius="full"
                                    _hover={{ bg: '#6d0136' }}
                                >
                                    {t('action')}
                                    <BsChevronDown style={{ marginLeft: '8px' }} />
                                </Button>
                            </Popover.Trigger>
                            <Popover.Positioner>
                                <Popover.Content width="auto" minW="200px" bg="white" boxShadow="lg" border="1px solid" borderColor="gray.100" borderRadius="md">
                                    <Popover.Body p={2}>
                                        {actionItems.map((item, idx) => (
                                            <Box
                                                key={idx}
                                                px={4}
                                                py={2}
                                                fontSize="sm"
                                                color="gray.700"
                                                cursor="pointer"
                                                borderRadius="md"
                                                _hover={{ bg: 'gray.50', color: '#8D0247' }}
                                                onClick={item.onClick}
                                            >
                                                {item.label}
                                            </Box>
                                        ))}
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover.Positioner>
                        </Popover.Root>
                    )}
                </HStack>
            </Box>
        </Popup>
    );
};

export default PurchaseOrderPreviewPopup;
