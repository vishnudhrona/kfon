import { Accordion, AccordionItem, Box, Button, HStack, Icons, Popup, Spinner } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchKycDetails } from '../../action';
import { getKycDetails } from '../../selector';

const { BsXCircle } = Icons;

const LabelValue = ({ label, value, fullWidth }) => (
    <div style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
        <div style={{ fontSize: '12px', color: 'rgb(35, 47, 80)', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '13px', color: '#272727', fontWeight: '500', wordBreak: 'break-word' }}>{value || '-'}</div>
    </div>
);

const FieldGrid = ({ fields }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '32px', rowGap: '20px', padding: '8px 16px', width: '100%', boxSizing: 'border-box' }}>
        {fields.map((field) => (
            <LabelValue key={field.label} label={field.label} value={field.value} fullWidth={field.fullWidth} />
        ))}
    </div>
);
const CorporateVerifiedCustomerPopup = ({ isOpen, setIsOpen, customerId }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const kycDetails = useSelector(getKycDetails);
    const apiProgress = useSelector(getApiProgress);

    useEffect(() => {
        if (isOpen && customerId) {
            dispatch(fetchKycDetails({ customerId }));
        }
    }, [isOpen, customerId, dispatch]);

    const handleClose = () => setIsOpen(false);

    const data = kycDetails?.data || {};
    const isLoading = kycDetails?.isLoading;
    const isFetching = isLoading || !!apiProgress[ACTION_TYPES.FETCH_KYC_DETAILS];

    const isGovernment = data.companyType === 'GOVERNMENT' || data.customerType === 'GOVERNMENT';

    const basicFields = [
        { label: t('customerType'), value: data.companyType || data.customerType },
        { label: t('nameOfOrgOrCompany'), value: data.customerName || data.organizationName || data.companyName },
        ...(isGovernment ? [
            { label: t('department'), value: data.departmentTag },
            { label: t('subDepartment'), value: data.subdeptTag }
        ] : []),
        { label: t('contactPerson'), value: data.contactPerson || data.contactName },
        { label: t('mobileNumber'), value: data.mobile || data.mobileNumber },
        { label: t('emailId'), value: data.email || data.emailId },
        { label: t('pinCode'), value: data.pincode || data.pinCode },
        { label: t('locationAddress'), value: data.address || data.location || data.installationAddress || data.companyLocation, fullWidth: true }
    ];

    const panFields = [
        { label: t('panNumber'), value: data.pan || data.panNumber }
    ];

    const hasGst = !!data.gstin;
    const gstin = data.gstin || '';

    const gstFields = [
        { label: t('gstIn'), value: hasGst ? t('yes') : t('no') },
        ...(hasGst ? [
            { label: t('gstin'), value: gstin },
            { label: t('taxPayerType'), value: data.taxPayerType },
            { label: t('legalNameOfBusiness'), value: data.legalName },
            { label: t('tradeName'), value: data.tradeName },
            { label: t('serviceDescription'), value: data.serviceDescription },
            { label: t('sacCode'), value: data.sac }
        ] : [])
    ];

    return (
        <Popup
            isOpen={isOpen}
            title={t('verified')}
            titleMain={t('customer')}
            size="xl"
            closeButton
            onOpenChange={setIsOpen}
        >
            <Box px={2} pb={4} mt={-2} maxH="70vh" overflowY="auto">
                {isFetching ? (
                    <HStack justify="center" py={8}>
                        <Spinner size="md" color="#8D0247" />
                    </HStack>
                ) : (
                    <>
                        <style>{`.kyc-accordion button { cursor: pointer; }`}</style>
                        <Accordion defaultValue={['step1']} allowMultiple className="kyc-accordion">
                            <AccordionItem title={t('basicDetails')} name="step1" value="step1" gridRemove={true}>
                                <FieldGrid fields={basicFields} />
                            </AccordionItem>
                            <AccordionItem title={t('panDetails')} name="step2" value="step2" gridRemove={true}>
                                <FieldGrid fields={panFields} />
                            </AccordionItem>
                            <AccordionItem title={t('gstDetails')} name="step3" value="step3" gridRemove={true}>
                                <FieldGrid fields={gstFields} />
                            </AccordionItem>
                        </Accordion>
                    </>
                )}
                <HStack justify="flex-end" mt={4}>
                    <Button variant="outline" borderColor="#8D0247" color="#8D0247" px={6} py={2} h="38px" borderRadius="full" onClick={handleClose}>
                        <BsXCircle style={{ marginRight: '6px', width: '18px', height: '18px' }} /> {t('close')}
                    </Button>
                </HStack>
            </Box>
        </Popup>
    );
};

export default CorporateVerifiedCustomerPopup;
