import { Box, Flex, Grid, Icons, Image, Spinner, Text } from '@kfonbss/bss-ui-components';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { fileStorageViewUrl } from '@/features/common/actions';

import BasicDetailsCard from './BasicDetailsCard';

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

const RowCell = ({ label, value, type, fileId, onOpen, isEven }) => {
  const bg = isEven ? ROW_BG_EVEN : ROW_BG_ODD;
  return (
    <Flex bg={bg} px={4} py={3} align='center' minH='52px' h='full'>
      <Text w='40%' fontSize='sm' color={LABEL_COLOR} flexShrink={0} lineHeight='1.4' pr={2}>
        {label}
      </Text>
      <Box flex={1} minW={0}>
        {type === 'viewOnly' ? (
          <ViewLink fileId={fileId} title={label} onOpen={onOpen} />
        ) : type === 'valueAndView' ? (
          <Flex align='center' gap={2} flexWrap='wrap'>
            <Text fontSize='sm' color={VALUE_COLOR} wordBreak='break-all' overflowWrap='anywhere' minW={0} flex={1}>
              {value || '-'}
            </Text>
            <ViewLink fileId={fileId} title={label} onOpen={onOpen} />
          </Flex>
        ) : (
          <Text fontSize='sm' color={VALUE_COLOR} wordBreak='break-all' overflowWrap='anywhere'>
            {value || '-'}
          </Text>
        )}
      </Box>
    </Flex>
  );
};

const RowPair = ({ left, right, isEven, onOpen, isLast }) => (
  <>
    <Box
      overflow='hidden'
      borderRight={`1px solid ${BORDER_COLOR}`}
      borderBottom={isLast ? 'none' : `1px solid ${BORDER_COLOR}`}
    >
      <RowCell {...left} isEven={isEven} onOpen={onOpen} />
    </Box>
    <Box overflow='hidden' borderBottom={isLast ? 'none' : `1px solid ${BORDER_COLOR}`}>
      {right ? (
        <RowCell {...right} isEven={isEven} onOpen={onOpen} />
      ) : (
        <Flex bg={isEven ? ROW_BG_EVEN : ROW_BG_ODD} px={4} py={3} minH='52px' h='full' />
      )}
    </Box>
  </>
);

const SectionBlock = ({ title, rows, onOpen }) => (
  <Box mb={6} border={`1px solid ${BORDER_COLOR}`} borderRadius='md' overflow='hidden'>
    <Box px={4} py={4} borderBottom={'1px solid ' + BORDER_COLOR} bg='gray.50'>
      <Text fontSize='lg' fontWeight='semibold'>
        {title}
      </Text>
    </Box>
    <Grid templateColumns='1fr 1fr' alignItems='stretch'>
      {rows.map((row, i) => (
        <RowPair
          key={i}
          left={row.left}
          right={row.right}
          isEven={i % 2 === 0}
          onOpen={onOpen}
          isLast={i === rows.length - 1}
        />
      ))}
    </Grid>
  </Box>
);

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
          color={MAROON}
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

/**
 * @param {object} props
 * @param {object} props.prepopulatedData
 * @param {Array}  props.basicFields       - field descriptors for BasicDetailsCard
 * @param {object} [props.photo]           - { src } passed to BasicDetailsCard
 * @param {boolean} [props.showSupportingDocs=true]
 * @param {React.ReactNode} props.footer   - action buttons row
 * @param {React.ReactNode} [props.children] - extra popups/modals rendered after DocPreviewPopup
 */
const ApplicationDetailView = ({
  prepopulatedData,
  basicFields,
  photo,
  showSupportingDocs = true,
  footer,
  children
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [popup, setPopup] = useState({ open: false, url: '', contentType: '', title: '' });
  const [popupLoading, setPopupLoading] = useState(false);

  const openDoc = useCallback(
    (fileId, title = '') => {
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
    },
    [dispatch]
  );

  const closeDoc = () => setPopup({ open: false, url: '', contentType: '', title: '' });

  const permanentAddress = prepopulatedData.permanentAddress || {};
  const installationAddress = prepopulatedData.installationAddress || {};
  const subscriberDetail = prepopulatedData.subscriberDetail || {};
  const deviceDetail = prepopulatedData.deviceDetail || {};
  const supportingDocument = prepopulatedData.supportingDocument || {};
  const gstInformation = prepopulatedData.gstInformation || {};

  const optionalDocs = [
    supportingDocument.applicationFormUrl && {
      label: t('applicationForm'),
      type: 'viewOnly',
      fileId: supportingDocument.applicationFormUrl
    },
    supportingDocument.panCardUrl && { label: t('panCard'), type: 'viewOnly', fileId: supportingDocument.panCardUrl },
    supportingDocument.gstCertificateUrl && {
      label: t('gstCertificate'),
      type: 'viewOnly',
      fileId: supportingDocument.gstCertificateUrl
    },
    supportingDocument.lutCertificateUrl && {
      label: t('lutCertificate'),
      type: 'viewOnly',
      fileId: supportingDocument.lutCertificateUrl
    }
  ].filter(Boolean);

  const optionalDocRows = [];
  for (let i = 0; i < optionalDocs.length; i += 2) {
    optionalDocRows.push({ left: optionalDocs[i], right: optionalDocs[i + 1] || null });
  }

  return (
    <Box>
      <Box mb={6}>
        <BasicDetailsCard
          title={t('basicDetails')}
          columns={3}
          photo={photo}
          fields={basicFields}
        />
      </Box>

      <SectionBlock
        title={t('permanentAddressDetails')}
        onOpen={openDoc}
        rows={[
          {
            left: { label: t('doorNoApartment'), value: permanentAddress.doorNo },
            right: { label: t('streetLocalityName'), value: permanentAddress.streetName }
          },
          {
            left: { label: t('city'), value: permanentAddress.city },
            right: { label: t('pincode'), value: permanentAddress.pincode }
          },
          {
            left: { label: t('district'), value: permanentAddress.districtName },
            right: { label: t('postOfficeName'), value: permanentAddress.postOfficeName }
          },
          {
            left: { label: t('locationType'), value: permanentAddress.locationType },
            right: { label: t('localBodyType'), value: permanentAddress.localBodyTypeName }
          },
          {
            left: { label: t('corporationMunicipalityName'), value: permanentAddress.corporationMunicipalityName },
            right: null
          }
        ]}
      />

      <SectionBlock
        title={t('installationAddressDetails')}
        onOpen={openDoc}
        rows={[
          {
            left: { label: t('doorNoApartment'), value: installationAddress.doorNo },
            right: { label: t('streetLocalityName'), value: installationAddress.streetName }
          },
          {
            left: { label: t('city'), value: installationAddress.city },
            right: { label: t('pincode'), value: installationAddress.pincode }
          },
          {
            left: { label: t('district'), value: installationAddress.districtName },
            right: { label: t('postOfficeName'), value: installationAddress.postOfficeName }
          },
          {
            left: { label: t('locationType'), value: installationAddress.locationType },
            right: { label: t('localBodyType'), value: installationAddress.localBodyTypeName }
          },
          {
            left: { label: t('corporationMunicipalityName'), value: installationAddress.corporationMunicipalityName },
            right: null
          }
        ]}
      />

      <SectionBlock
        title={t('subscriptionDetails')}
        onOpen={openDoc}
        rows={[
          {
            left: { label: t('planType'), value: subscriberDetail.planType },
            right: { label: t('desiredUserName'), value: subscriberDetail.username }
          },
          { left: { label: t('selectedPackage'), value: subscriberDetail.packageName }, right: null }
        ]}
      />

      <SectionBlock
        title={t('deviceDetails')}
        onOpen={openDoc}
        rows={[
          {
            left: { label: t('deviceProvider'), value: deviceDetail.deviceProviderName },
            right: { label: t('selectDevice'), value: deviceDetail.deviceName }
          },
          {
            left: { label: t('deviceType'), value: deviceDetail.deviceType },
            right: { label: t('vlanID'), value: deviceDetail.vlanId }
          },
          {
            left: { label: t('deviceMake'), value: deviceDetail.deviceMake },
            right: { label: t('deviceModel'), value: deviceDetail.deviceModel }
          },
          {
            left: { label: t('macAddress'), value: deviceDetail.deviceMacAddress },
            right: { label: t('oltType'), value: deviceDetail.oltType }
          },
          {
            left: { label: t('oltDevice'), value: deviceDetail.oltDeviceName },
            right: { label: t('ponPortNumber'), value: deviceDetail.ponportNumberName }
          },
          { left: { label: t('ontPosition'), value: deviceDetail.ontPosition }, right: null }
        ]}
      />

      {showSupportingDocs && (
        <SectionBlock
          title={t('supportingDocuments')}
          onOpen={openDoc}
          rows={[
            {
              left: { label: t('residenceProofType'), value: supportingDocument.residenceProofType },
              right: { label: t('residenceProofNo'), value: supportingDocument.residenceProofNo }
            },
            {
              left: { label: t('residenceProof'), type: 'viewOnly', fileId: supportingDocument.residenceProofUrl },
              right: { label: t('identityProofType'), value: supportingDocument.identityProofType }
            },
            {
              left: { label: t('identityProofNo'), value: supportingDocument.identityProofNo },
              right: { label: t('identityProof'), type: 'viewOnly', fileId: supportingDocument.identityProofUrl }
            },
            ...optionalDocRows
          ]}
        />
      )}

      {gstInformation.isGstAdded && (
        <SectionBlock
          title={t('gstInformation')}
          onOpen={openDoc}
          rows={[
            {
              left: { label: t('legalBusinessName'), value: gstInformation.legalBusinessName },
              right: { label: t('tradeName'), value: gstInformation.tradeName }
            },
            {
              left: { label: t('gstNumber'), value: gstInformation.gstNumber },
              right: { label: t('pan'), value: gstInformation.pan }
            },
            {
              left: { label: t('taxPayerType'), value: gstInformation.taxPayerType },
              right: { label: t('gstStatus'), value: gstInformation.gstStatus }
            }
          ]}
        />
      )}

      <Flex justify='flex-end' mt={6} pb={4} gap={3}>
        {footer}
      </Flex>

      <DocPreviewPopup popup={popup} loading={popupLoading} onClose={closeDoc} />
      {children}
    </Box>
  );
};

export default ApplicationDetailView;
