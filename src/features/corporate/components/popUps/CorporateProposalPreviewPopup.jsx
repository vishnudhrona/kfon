import { Box, Button, HStack, Popover, Popup, Spinner } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { BsChevronDown } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { PERMISSIONS } from '@/constants/permissions';
import { usePageActions } from '@/hooks/usePageActions';
import { router } from '@/routes/routes';
import { getTokenData } from '@/utils/encryptionUtils';

import { fetchCorporateEnquiryList, updateProposalStatus } from '../../action';

const CorporateProposalPreviewPopup = ({
    isOpen,
    enquiryId,
    data,
    version,
    onCancel,
    onCreate,
    onEdit,
    onRevise,
    onSendToCustomer,
    onUpdatePo,
    isReviseMode = false,
    viewOnly = false,
    proposalStatus
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { hasPermission } = usePageActions();

    const handleStatusUpdate = (status) => {
        dispatch(updateProposalStatus({
            enquiryId,
            version,
            status,
            revisedProposalStatus: false,
            onSuccess: () => {
                onCancel();
                const tokenData = getTokenData(STORAGE_KEYS.AUTH_TOKEN);
                const seatId = tokenData?.seatId ?? null;
                dispatch(fetchCorporateEnquiryList({ ...(seatId && { seatId }) }));
                router.navigate({ to: '/app/corporate/enquiry-list' });
            }
        }));
    };

    const dataProposalStatus = data?.proposalStatus ?? proposalStatus;
    const isSendToCustomer = dataProposalStatus === 'SEND_TO_CUSTOMER';
    const isRevised = dataProposalStatus === 'REVISED';
    const canEdit = hasPermission(PERMISSIONS.CORPORATE.PROPOSAL_EDIT) || hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_PROPOSAL_EDIT);
    const isEditableStatus = dataProposalStatus === 'CREATED' || dataProposalStatus === 'DRAFT';
    const isApproved = dataProposalStatus === 'APPROVED';
    const showRevise = !isRevised && isSendToCustomer && data?.revisedProposalStatus === false && (hasPermission(PERMISSIONS.CORPORATE.CORP_REVISE_PROPOSAL) || hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_CORP_REVISE_PROPOSAL));
    const showUpdatePo = !isRevised && isSendToCustomer && (hasPermission(PERMISSIONS.CORPORATE.CORP_UPDATE_PO) || hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_CORP_UPDATE_PO));
    const showSendToCustomer = !isRevised && isApproved && (hasPermission(PERMISSIONS.CORPORATE.CORP_SEND_TO_CUSTOMER) || hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_CORP_SEND_TO_CUSTOMER));
    const showEdit = !isRevised && !isReviseMode && !viewOnly && !isSendToCustomer && !isApproved && canEdit && isEditableStatus;
    const showVerify = !isRevised && !isReviseMode && !viewOnly && !isSendToCustomer && !isApproved && dataProposalStatus === 'CREATED' && (hasPermission(PERMISSIONS.CORPORATE.PROPOSAL_VERIFY) || hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_PROPOSAL_VERIFY));
    const showApprove = !isRevised && !isReviseMode && !viewOnly && !isSendToCustomer && !isApproved && dataProposalStatus === 'CREATED' && (hasPermission(PERMISSIONS.CORPORATE.PROPOSAL_APPROVE) || hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_PROPOSAL_APPROVE));
    const showCreate = !isRevised && !isReviseMode && !viewOnly && !isSendToCustomer && !isApproved && dataProposalStatus !== 'CREATED' && (hasPermission(PERMISSIONS.CORPORATE.PROPOSAL_CREATE) || hasPermission(PERMISSIONS.CORPORATE.ENQUIRY_PROPOSAL_CREATE)) && isEditableStatus;

    const actionItems = [
        ...(showEdit ? [{ label: t('edit'), onClick: onEdit }] : []),
        ...(showCreate ? [{ label: t('create'), onClick: onCreate }] : []),
        ...(showVerify ? [{ label: t('verify'), onClick: () => handleStatusUpdate('VERIFIED') }] : []),
        ...(showApprove ? [{ label: t('approve'), onClick: () => handleStatusUpdate('APPROVED') }] : []),
        ...(showSendToCustomer ? [{ label: t('sendToCustomer'), onClick: onSendToCustomer }] : []),
        ...(showUpdatePo ? [{ label: t('updatePo'), onClick: onUpdatePo }] : []),
        ...(showRevise ? [{ label: t('reviseProposal'), onClick: onRevise }] : [])
    ];

    
    return (
        <Popup
            isOpen={isOpen}
            onOpenChange={(e) => { if (!e?.open) onCancel(); }}
            placement="center"
            title={t('proposal')}
            titleMain={`${t('preview')} - Version - ${version}`}
            size="xl"
            contentProps={{ maxW: '1400px', w: '95vw', mx: 'auto' }}
            closeButton
            closeOnInteractOutside={false}
        >
            <Box display="flex" flexDirection="column" h="70vh">
                {/* PDF Content */}
                <Box flex="1" overflow="hidden" position="relative">
                    {data?.presignedUrl ? (
                        <iframe
                            src={`${data?.presignedUrl}#zoom=100`}
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
                                <Popover.Content width="auto" minW="160px" bg="white" boxShadow="lg" border="1px solid" borderColor="gray.100" borderRadius="md">
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

export default CorporateProposalPreviewPopup;
