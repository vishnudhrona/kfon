import { Box, Button, Flex, Grid, Icons, Image, Popup, Spinner, Text } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Close, LocationViewPopup } from '@/components/custom';
import ConfirmPopup from '@/components/custom/ConfirmPopup';
import { PERMISSIONS } from '@/constants/permissions';
import { fileStorageViewUrl } from '@/features/common/actions';
import { usePageActions } from '@/hooks/usePageActions';

import UpdatePartnerDetailsPopup from './UpdatePartnerDetailsPopup';
import UpdatePopPopup from './UpdatePopPopup';

const { BsXCircle } = Icons;
const MAROON = '#8d0247';
const ROW_BG_EVEN = '#ffffff';
const ROW_BG_ODD = '#f9f9f9';
const LABEL_COLOR = '#555555';
const VALUE_COLOR = '#333333';
const BORDER_COLOR = '#e2e8f0';

const isPdf = (contentType, url) => contentType === 'application/pdf' || /\.pdf(\?.*)?$/i.test(url || '');

const ExternalLinkIcon = () => (
  <svg
    width='13'
    height='13'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    style={{ display: 'inline', verticalAlign: 'middle' }}
  >
    <path d='M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6' />
    <polyline points='15,3 21,3 21,9' />
    <line x1='10' y1='14' x2='21' y2='3' />
  </svg>
);

const ViewLink = ({ fileId, title, onOpen }) => {
  const { t } = useTranslation();
  if (!fileId)
    return (
      <Text fontSize='sm' color={VALUE_COLOR}>
        -
      </Text>
    );
  return (
    <Flex
      as='button'
      align='center'
      gap='4px'
      color={MAROON}
      fontSize='sm'
      fontWeight='medium'
      cursor='pointer'
      border='none'
      background='none'
      p='0'
      onClick={() => onOpen(fileId, title)}
    >
      {t('view')}
      <ExternalLinkIcon />
    </Flex>
  );
};

const RowCell = ({
  label,
  value,
  highlight,
  type,
  fileId,
  onOpen,
  onAddServiceArea,
  onViewServiceArea,
  onViewLocation,
  onEditPop,
  onViewPop,
  canEditPop,
  isEven,
  isLast,
  canAddServiceArea
}) => {
  const { t } = useTranslation();
  const bg = isEven ? ROW_BG_EVEN : ROW_BG_ODD;

  return (
    <Flex
      bg={bg}
      px={4}
      py={3}
      align='center'
      minH='52px'
      h='full'
      borderBottom={isLast ? 'none' : `1px solid ${BORDER_COLOR}`}
    >
      <Text w='40%' fontSize='sm' color={LABEL_COLOR} flexShrink={0} lineHeight='1.4' pr={2}>
        {label}
      </Text>
      <Box flex={1} minW={0}>
        {type === 'serviceableArea' ? (
          <Flex gap={2} align='center' flexWrap='wrap' justifyContent='space-between'>
            {canAddServiceArea && (
              <Button
                variant='outline'
                size='sm'
                borderColor={MAROON}
                color={MAROON}
                borderRadius='full'
                onClick={onAddServiceArea}
                _hover={{ bg: 'transparent' }}
                fontSize='xs'
                px={3}
                h='30px'
              >
                {t('addServiceArea')}
              </Button>
            )}
            <Flex
              as='button'
              align='center'
              gap='4px'
              color={MAROON}
              fontSize='sm'
              fontWeight='medium'
              cursor='pointer'
              border='none'
              background='none'
              p='0'
              onClick={onViewServiceArea}
            >
              {t('view')}
              <ExternalLinkIcon />
            </Flex>
          </Flex>
        ) : type === 'pop' ? (
          <Flex gap={2} align='center' flexWrap='wrap' justifyContent='space-between'>
            {canEditPop && (
              <Button
                variant='outline'
                size='sm'
                borderColor={MAROON}
                color={MAROON}
                borderRadius='full'
                onClick={onEditPop}
                _hover={{ bg: 'transparent' }}
                fontSize='xs'
                px={3}
                h='30px'
              >
                {t('updatePopDetails')}
              </Button>
            )}
            <Flex
              as='button'
              align='center'
              gap='4px'
              color={MAROON}
              fontSize='sm'
              fontWeight='medium'
              cursor='pointer'
              border='none'
              background='none'
              p='0'
              onClick={onViewPop}
            >
              {t('view')}
              <ExternalLinkIcon />
            </Flex>
          </Flex>
        ) : type === 'valueAndView' ? (
          <Flex align='center' gap={2} flexWrap='wrap'>
            <Text
              fontSize='sm'
              color={highlight ? MAROON : VALUE_COLOR}
              fontWeight={highlight ? 'semibold' : 'normal'}
              wordBreak='break-all'
              overflowWrap='anywhere'
              minW={0}
              flex={1}
            >
              {value || '-'}
            </Text>
            <ViewLink fileId={fileId} title={label} onOpen={onOpen} />
          </Flex>
        ) : type === 'valueAndLocation' ? (
          <Flex align='center' gap={2} flexWrap='wrap'>
            <Text fontSize='sm' color={VALUE_COLOR} wordBreak='break-all' overflowWrap='anywhere' minW={0} flex={1}>
              {value || '-'}
            </Text>
            {onViewLocation && (
              <Flex
                as='button'
                align='center'
                gap='4px'
                color={MAROON}
                fontSize='sm'
                fontWeight='medium'
                cursor='pointer'
                border='none'
                background='none'
                p='0'
                onClick={onViewLocation}
              >
                {t('view')}
                <ExternalLinkIcon />
              </Flex>
            )}
          </Flex>
        ) : type === 'viewOnly' ? (
          <ViewLink fileId={fileId} title={label} onOpen={onOpen} />
        ) : (
          <Text
            fontSize='sm'
            color={highlight ? MAROON : VALUE_COLOR}
            fontWeight={highlight ? 'semibold' : 'normal'}
            wordBreak='break-all'
            overflowWrap='anywhere'
          >
            {value || '-'}
          </Text>
        )}
      </Box>
    </Flex>
  );
};

const RowPair = ({
  left,
  right,
  bg,
  isEven,
  onOpen,
  onAddServiceArea,
  onViewServiceArea,
  onViewLocation,
  onEditPop,
  onViewPop,
  canEditPop,
  isFirst,
  isLast,
  canAddServiceArea
}) => {
  const colBoxProps = {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `1px solid ${BORDER_COLOR}`,
    borderRight: `1px solid ${BORDER_COLOR}`,
    ...(isFirst && {
      borderTop: `1px solid ${BORDER_COLOR}`,
      borderTopLeftRadius: 'md',
      borderTopRightRadius: 'md'
    }),
    ...(isLast && {
      borderBottom: `1px solid ${BORDER_COLOR}`,
      borderBottomLeftRadius: 'md',
      borderBottomRightRadius: 'md'
    })
  };

  return (
    <>
      <Box {...colBoxProps}>
        {left.render ? (
          left.render(bg)
        ) : (
          <RowCell
            {...left}
            isEven={isEven}
            isLast={isLast}
            onOpen={onOpen}
            onAddServiceArea={onAddServiceArea}
            onViewServiceArea={onViewServiceArea}
            onViewLocation={onViewLocation}
            canAddServiceArea={canAddServiceArea}
            onEditPop={onEditPop}
            onViewPop={onViewPop}
            canEditPop={canEditPop}
          />
        )}
      </Box>
      <Box {...colBoxProps}>{right && <RowCell {...right} isEven={isEven} isLast={isLast} onOpen={onOpen} />}</Box>
    </>
  );
};

const DocPreviewPopup = ({ popup, loading, onClose }) => {
  if (!popup.open) return null;
  return (
    <Box
      position='fixed'
      top='0'
      left='0'
      right='0'
      bottom='0'
      bg='blackAlpha.700'
      zIndex='9999'
      display='flex'
      alignItems='center'
      justifyContent='center'
      onClick={onClose}
    >
      <Box
        position='relative'
        bg='white'
        borderRadius='xl'
        p={4}
        maxW='95vw'
        maxH='95vh'
        w='800px'
        overflow='auto'
        onClick={(e) => e.stopPropagation()}
      >
        <Box
          position='absolute'
          top='8px'
          right='8px'
          w='28px'
          h='28px'
          bg='white'
          borderRadius='full'
          display='flex'
          alignItems='center'
          justifyContent='center'
          cursor='pointer'
          color='primary.500'
          zIndex={1}
          onClick={onClose}
        >
          <BsXCircle size={12} />
        </Box>
        <Box display='flex' justifyContent='center' alignItems='center' minH='300px' w='100%'>
          {loading || !popup.url ? (
            <Spinner size='lg' color='primary.500' />
          ) : isPdf(popup.contentType, popup.url) ? (
            <iframe
              src={popup.url}
              width='100%'
              height='700px'
              style={{ border: 'none', borderRadius: '8px', display: 'block' }}
              title={popup.title}
            />
          ) : (
            <Image src={popup.url} maxW='100%' maxH='70vh' objectFit='contain' borderRadius='md' display='block' />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export const ServiceAreaPopup = ({ isOpen, onClose, serviceAreas }) => {
  const { t } = useTranslation();
  const areas = Array.isArray(serviceAreas) ? serviceAreas : [];

  return (
    <Popup title={t('serviceAreas')} isOpen={isOpen} onClose={onClose} size='lg'>
      <Box px={5} pb={5}>
        {areas.length === 0 ? (
          <Text fontSize='sm' color={LABEL_COLOR}>
            {t('noDataFound') || 'No service areas found.'}
          </Text>
        ) : (
          <Box border={`1px solid ${BORDER_COLOR}`} borderRadius='md' overflow='hidden'>
            <Flex bg={MAROON} px={4} py={2}>
              <Text flex={1} fontSize='xs' fontWeight='semibold' color='white'>
                {t('pinCode')}
              </Text>
              <Text flex={1} fontSize='xs' fontWeight='semibold' color='white'>
                {t('postOffice')}
              </Text>
              <Text w='60px' fontSize='xs' fontWeight='semibold' color='white'>
                {t('status') || 'Status'}
              </Text>
            </Flex>
            {areas.map((area, i) => (
              <Flex
                key={area.serviceId || i}
                bg={i % 2 === 0 ? ROW_BG_EVEN : ROW_BG_ODD}
                px={4}
                py={2}
                borderTop={i === 0 ? 'none' : `1px solid ${BORDER_COLOR}`}
              >
                <Text flex={1} fontSize='sm' color={VALUE_COLOR}>
                  {area.pinCode || '-'}
                </Text>
                <Text flex={1} fontSize='sm' color={VALUE_COLOR}>
                  {area.postOfficeName || '-'}
                </Text>
                <Text w='60px' fontSize='sm' color={area.isActive ? 'green.600' : 'red.500'}>
                  {area.isActive ? t('active') || 'Active' : t('inactive') || 'Inactive'}
                </Text>
              </Flex>
            ))}
          </Box>
        )}
        <Flex justify='flex-end' mt={4}>
          <Button variant='outline' onClick={onClose}>
            <Close />
            {t('close')}
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

const ViewPopPopup = ({ isOpen, onClose, primaryPop, additionalPops }) => {
  const { t } = useTranslation();
  const primary = primaryPop?.name ?? primaryPop ?? null;
  const additional = (Array.isArray(additionalPops) ? additionalPops : []).map((p) => p?.name ?? p);

  return (
    <Popup title={t('popName')} isOpen={isOpen} onClose={onClose} size='md'>
      <Box px={5} pb={5}>
        {!primary ? (
          <Text fontSize='sm' color={LABEL_COLOR}>
            {t('noDataFound')}
          </Text>
        ) : (
          <Box border={`1px solid ${BORDER_COLOR}`} borderRadius='md' overflow='hidden'>
            <Flex bg={MAROON} px={4} py={2} gap={3}>
              <Text w='120px' fontSize='xs' fontWeight='semibold' color='white' flexShrink={0}>
                {t('type')}
              </Text>
              <Text flex={1} fontSize='xs' fontWeight='semibold' color='white'>
                {t('popName')}
              </Text>
            </Flex>
            <Flex px={4} py={2} bg={ROW_BG_EVEN} gap={3}>
              <Text w='120px' fontSize='sm' color={LABEL_COLOR} flexShrink={0}>
                {t('primaryPop')}
              </Text>
              <Text flex={1} fontSize='sm' color={VALUE_COLOR}>
                {primary}
              </Text>
            </Flex>
            {additional.map((pop, i) => (
              <Flex
                key={i}
                px={4}
                py={2}
                bg={i % 2 === 0 ? ROW_BG_ODD : ROW_BG_EVEN}
                borderTop={`1px solid ${BORDER_COLOR}`}
                gap={3}
              >
                <Text w='120px' fontSize='sm' color={LABEL_COLOR} flexShrink={0}>
                  {t('additionalPop')}
                </Text>
                <Text flex={1} fontSize='sm' color={VALUE_COLOR}>
                  {pop}
                </Text>
              </Flex>
            ))}
          </Box>
        )}
        <Flex justify='flex-end' mt={4}>
          <Button variant='outline' onClick={onClose}>
            <Close />
            {t('close')}
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

const PartnerDetailPreview = ({ detailedData, onAddServiceArea, onViewServiceArea, onResetPassword, onBack }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [popup, setPopup] = useState({ open: false, url: '', contentType: '', title: '' });
  const [popupLoading, setPopupLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditLinkDetailsOpen, setIsEditLinkDetailsOpen] = useState(false);
  const [isEditPopOpen, setIsEditPopOpen] = useState(false);
  const [isViewPopOpen, setIsViewPopOpen] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);

  const { hasPermission } = usePageActions();
  const canEdit = hasPermission(PERMISSIONS.PARTNERS.EDIT_PARTNER_DETAIL);

  if (!detailedData) return null;

  const {
    basicDetails = {},
    agreementDetails = {},
    bankDetails = {},
    kycGstInformation = {},
    supportingDocuments = {},
    linkEstablishmentStatus,
    linkType,
    frcReceived,
    frcPaymentDate,
    reasonForNotLinkDelivery,
    briefReason,
    additionalPops = []
  } = detailedData;

  const companyAddress = [basicDetails?.addressLine1, basicDetails?.addressLine2].filter(Boolean).join(', ') || '-';
  const locationType = basicDetails?.locationType === 0 ? 'Urban' : basicDetails?.locationType === 1 ? 'Rural' : '-';

  const openDoc = (fileId, title = '') => {
    setPopupLoading(true);
    setPopup({ open: true, url: '', contentType: '', title });
    dispatch(
      fileStorageViewUrl({
        fileId,
        onSuccess: ({ url, contentType }) => {
          setPopupLoading(false);
          setPopup({ open: true, url, contentType: contentType || '', title });
        },
        onError: () => setPopupLoading(false)
      })
    );
  };

  const closeDoc = () => setPopup({ open: false, url: '', contentType: '', title: '' });

  const handleConfirmResetPassword = () => {
    setConfirmOpen(false);
    onResetPassword?.();
  };

  const rows = [
    // Row 1
    {
      left: {
        label: t('partnerId'),
        render: (bg) => (
          <Flex bg={bg} px={4} py={3} align='center' minH='52px' h='full' borderBottom={`1px solid ${BORDER_COLOR}`}>
            <Text w='40%' fontSize='sm' color={LABEL_COLOR} flexShrink={0} pr={2}>
              {t('partnerId')}
            </Text>
            <Flex flex={1} minW={0} align='center' justify='space-between' flexWrap='wrap' gap={2}>
              <Text fontSize='sm' color={MAROON} fontWeight='semibold' wordBreak='break-all' overflowWrap='anywhere'>
                {basicDetails?.partnerId || '-'}
              </Text>
              {canEdit && (
                <Button
                  size='xs'
                  variant='outline'
                  borderColor={MAROON}
                  color={MAROON}
                  borderRadius='full'
                  onClick={() => setConfirmOpen(true)}
                  _hover={{ bg: 'transparent' }}
                  fontSize='xs'
                  px={3}
                >
                  {t('resetPassword')}
                </Button>
              )}
            </Flex>
          </Flex>
        )
      },
      right: {
        label: t('aadharNumber'),
        value: kycGstInformation?.aadhaarNumber,
        type: 'valueAndView',
        fileId: supportingDocuments?.aadhaarCopy
      }
    },
    // Row 2
    {
      left: { label: t('companyName'), value: basicDetails?.companyName, highlight: true },
      right: {
        label: t('gstinNo'),
        value: kycGstInformation?.gstin,
        type: 'valueAndView',
        fileId: supportingDocuments?.gstRegistrationDocument
      }
    },
    // Row 3
    {
      left: { label: t('partnerType'), value: basicDetails?.agreementType },
      right: { label: t('sacNo'), value: kycGstInformation?.sac }
    },
    // Row 4
    {
      left: {
        label: t('cableTVLicense/CompanyRegistrationNo'),
        value: agreementDetails?.companyRegistrationNo,
        type: 'valueAndView',
        fileId: supportingDocuments?.cableTvLicenseOrCompanyRegCert
      },
      right: { label: t('taxPayerType'), value: kycGstInformation?.taxPayerType }
    },
    // Row 5
    {
      left: {
        label: t('companyAddress'),
        value: companyAddress,
        ...(basicDetails?.latitude && basicDetails?.longitude && { type: 'valueAndLocation' })
      },
      right: { label: t('legalNameOfBusiness'), value: kycGstInformation?.legalName }
    },
    // Row 6
    {
      left: { label: t('district'), value: basicDetails?.district },
      right: { label: t('tradeNameOfBusiness'), value: kycGstInformation?.tradeName }
    },
    // Row 7
    {
      left: { label: t('city'), value: basicDetails?.city },
      right: {
        label: t('panNumber'),
        value: kycGstInformation?.pan,
        type: 'valueAndView',
        fileId: supportingDocuments?.panCardSupportingDocument
      }
    },
    // Row 8
    {
      left: { label: t('postOffice'), value: basicDetails?.postOffice },
      right: { label: t('bankAccountHolderName'), value: bankDetails?.bankAcHolderName }
    },
    // Row 9
    {
      left: { label: t('pinCode'), value: basicDetails?.pinCode },
      right: { label: t('bankAccountType'), value: bankDetails?.bankAcType }
    },
    // Row 10
    {
      left: { label: t('contactPerson'), value: basicDetails?.keyContactName },
      right: { label: t('ifscCode'), value: bankDetails?.bankIfsc }
    },
    // Row 11
    {
      left: { label: t('phone'), value: basicDetails?.keyContactNumber },
      right: { label: t('bankName'), value: bankDetails?.bankName }
    },
    // Row 12
    {
      left: { label: t('alternatePhone'), value: basicDetails?.alternatePhone },
      right: { label: t('bankBranch'), value: bankDetails?.bankBranch }
    },
    // Row 13
    {
      left: { label: t('email'), value: basicDetails?.email },
      right: { label: t('bankAccountNo'), value: bankDetails?.bankAcNo }
    },
    // Row 14
    {
      left: { label: t('locationType'), value: locationType },
      right: { label: t('bankDetailsProof'), type: 'viewOnly', fileId: supportingDocuments?.cancelledChequeCopy }
    },
    // Row 15
    {
      left: { label: t('vlanID'), value: basicDetails?.vlanId },
      right: { label: t('linkEstablishmentStatus'), value: linkEstablishmentStatus }
    },
    // Row 16
    {
      left: { label: t('serviceableArea'), type: 'serviceableArea' },
      right: { label: t('linkType'), value: linkType }
    },
    // Row 17
    {
      left: { label: t('popName'), type: 'pop' },
      right: { label: t('dateOfLinkEstablishment'), value: agreementDetails?.dateOfLinkEstablishment }
    },
    // Row 18
    {
      left: { label: t('popPinCode'), value: agreementDetails?.popPinCode },
      right: { label: t('frcReceived'), value: frcReceived }
    },
    // Row 19
    {
      left: { label: t('oltProvider'), value: agreementDetails?.oltProvider },
      right: { label: t('frcPaymentDate'), value: frcPaymentDate }
    },
    // Row 20
    {
      left: { label: t('companyNature'), value: agreementDetails?.companyNature },
      right: { label: t('reasonForNotLinkDelivery'), value: reasonForNotLinkDelivery }
    },
    // Row 21
    {
      left: { label: t('agreementNumber'), value: agreementDetails?.agreementNumber },
      right: { label: t('briefReason'), value: briefReason }
    },
    // Row 22
    {
      left: {
        label: t('agreementDate'),
        value: agreementDetails?.agreementDate,
        type: 'valueAndView',
        fileId: supportingDocuments?.agreementCopy
      },
      right: { label: t('rconvergeAgreementNo'), value: agreementDetails?.rconvergeAgreementNo }
    },
    // Row 23
    {
      left: { label: t('brasIp'), value: agreementDetails?.brasIp },
      right: { label: t('rconvergeAgreementType'), value: agreementDetails?.rconvergeAgreementType }
    },
    // Row 24
    {
      left: { label: t('switchIp'), value: bankDetails?.switchIp },
      right: {
        label: t('lastRenewedRconvergeAgreementDate'),
        value: agreementDetails?.lastRenewedRconvergeAgreementDate
      }
    },
    // Row 25
    {
      left: { label: t('interface'), value: bankDetails?.interface },
      right: { label: t('portNo'), value: bankDetails?.portNo }
    },
    // Row 26
    {
      left: { label: t('portSpeed'), value: bankDetails?.portSpeed },
      right: null
    }
  ];

  return (
    <Box>
      <Grid templateColumns='1fr 1fr' columnGap={3} alignItems='stretch'>
        {rows.map((row, i) => {
          const isEven = i % 2 === 0;
          const bg = isEven ? ROW_BG_EVEN : ROW_BG_ODD;
          return (
            <RowPair
              key={i}
              left={row.left}
              right={row.right}
              bg={bg}
              isEven={isEven}
              onOpen={openDoc}
              onAddServiceArea={onAddServiceArea}
              onViewServiceArea={onViewServiceArea}
              onViewLocation={() => setShowLocationMap(true)}
              onEditPop={() => setIsEditPopOpen(true)}
              onViewPop={() => setIsViewPopOpen(true)}
              canEditPop={canEdit}
              isFirst={i === 0}
              isLast={i === rows.length - 1}
              canAddServiceArea={canEdit}
            />
          );
        })}
      </Grid>

      <Flex justify='flex-end' mt={6} pb={4} gap={3}>
        {canEdit && (
          <Button variant='outline' onClick={() => setIsEditLinkDetailsOpen(true)} _hover={{ bg: 'transparent' }}>
            {t('editLinkDetails')}
          </Button>
        )}
        <Button variant='outline' borderColor={MAROON} color={MAROON} onClick={onBack} _hover={{ bg: 'transparent' }}>
          {t('back')}
        </Button>
      </Flex>

      <UpdatePartnerDetailsPopup
        isOpen={isEditLinkDetailsOpen}
        onClose={() => setIsEditLinkDetailsOpen(false)}
        id={basicDetails?.id}
        agreementDetails={{
          ...agreementDetails,
          linkEstablishmentStatus,
          linkType,
          frcReceived,
          frcPaymentDate,
          reasonForNotLinkDelivery,
          briefReason
        }}
      />

      <UpdatePopPopup
        isOpen={isEditPopOpen}
        onClose={() => setIsEditPopOpen(false)}
        id={basicDetails?.id}
        currentPrimaryPop={agreementDetails?.popName}
        currentAdditionalPops={additionalPops}
      />

      <ViewPopPopup
        isOpen={isViewPopOpen}
        onClose={() => setIsViewPopOpen(false)}
        primaryPop={agreementDetails?.popName}
        additionalPops={additionalPops}
      />

      <DocPreviewPopup popup={popup} loading={popupLoading} onClose={closeDoc} />

      <LocationViewPopup
        isOpen={showLocationMap}
        onClose={() => setShowLocationMap(false)}
        latitude={basicDetails?.latitude}
        longitude={basicDetails?.longitude}
        address={companyAddress}
        title={t('company')}
        titleMain={t('address')}
      />

      <ConfirmPopup
        isConfirmOpen={confirmOpen}
        handleClose={() => setConfirmOpen(false)}
        handleConfirm={handleConfirmResetPassword}
        title='resetPassword'
        content={
          t('confirmSendOtpTo', { mobile: basicDetails?.keyContactNumber }) ||
          `Are you sure you want to send OTP to ${basicDetails?.keyContactNumber}?`
        }
      />
    </Box>
  );
};

export default PartnerDetailPreview;
