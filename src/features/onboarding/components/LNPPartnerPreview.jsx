import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Icons, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Close, DetailSummaryCard, Save } from '@/components/custom';

import { fetchLnpPartnerStatusDropdown, fetchPartnerEnquiry, updateLnpPartner } from '../action';
import { getLnpPartnerStatusOptions, getonboardingFormDetails } from '../selector';
import { partnerPreviewUpdate } from '../validation';

const LNPPartnerPreview = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams({ strict: false });
  const reduxData = useSelector(getonboardingFormDetails);

  const data = useMemo(() => location.state || reduxData || {}, [location.state, reduxData]);

  const statusOptions = useSelector(getLnpPartnerStatusOptions);

  useEffect(() => {
    dispatch(fetchLnpPartnerStatusDropdown({ type: 'lnp' }));
  }, [dispatch]);

  useEffect(() => {
    if (!location.state && id) {
      dispatch(fetchPartnerEnquiry({ enquiryId: id }));
    }
  }, [dispatch, id, location.state]);

  const filteredStatusOptions = useMemo(() => {
    if (!Array.isArray(statusOptions)) return [];
    const allowed = ['open', 'approved', 'rejected'];
    return statusOptions.filter((opt) => allowed.includes(opt?.name?.toLowerCase()));
  }, [statusOptions]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(partnerPreviewUpdate(t)),
    defaultValues: {
      status: data.status || '',
      remarks: data.remarks || ''
    }
  });

  useEffect(() => {
    if (data) {
      reset({
        status: data.status || '',
        remarks: data.remarks || ''
      });
    }
  }, [data, reset]);

  const transformedData = {
    ...data,
    partnerAssocAnyOtherIspText: data.partnerAssocAnyOtherIsp === 'yes' ? t('yes') : t('no'),
    trackingId: data.trackingId || data.id || '-'
    // createdBy: 'LNP'
  };

  const config = {
    header: {
      badge: {
        key: 'trackingId',
        label: t('ID'),
        bg: '#FFDE74',
        textColor: 'black'
      },
      title: {
        key: 'partnerName',
        style: { color: '#2D3748' }
      },
      fields: [
        { isSeparator: true },
        { key: 'partnerLocation', label: '', color: '#5C6E93' },
        { isSeparator: true },
        {
          key: 'partnerMobile',
          label: '',
          icon: Icons.MobileNewIcon,
          iconStyle: { fontSize: '13px', width: '23px', height: '23px' }
        },
        { isSeparator: true },
        {
          key: 'partnerEmail',
          label: '',
          icon: Icons.NewEmailIcon,
          iconStyle: { fontSize: '13px', width: '23px', height: '23px' }
        }
      ],
      meta: [
        { key: 'createdDt', label: 'appliedDate' }
        // { key: 'createdBy', label: 'createdBy' }
      ]
    },
    body: {
      fields: [
        { key: 'partnerPhone', label: 'phone', labelStyle: { fontWeight: 'bold', color: '#515151' } },
        { isSeparator: true },
        { key: 'partnerAddress', label: 'address', labelStyle: { fontWeight: 'bold', color: '#515151' } },
        { isSeparator: true },
        { key: 'partnerCity', label: 'city', labelStyle: { fontWeight: 'bold', color: '#515151' } },
        { isSeparator: true },
        { key: 'partnerPincode', label: 'pincode', labelStyle: { fontWeight: 'bold', color: '#515151' } },
        { isSeparator: true },
        {
          key: 'partnerAssocAnyOtherIspText',
          label: 'currentlyAssociatedWithAnyOtherISP?',
          labelStyle: { fontWeight: 'bold', color: '#515151' }
        }
      ]
    }
  };

  const onSubmit = async (formData) => {
    if (!data.enquiryId) {
      return;
    }

    dispatch(
      updateLnpPartner({
        enquiryId: data?.enquiryId,
        statusId: formData?.status?.id,
        remarks: formData?.remarks
      })
    );

    navigate({ to: '/app/partners/list' });
  };

  return (
    <Box>
      <Box mb={6}>
        <DetailSummaryCard data={transformedData} config={config} />
      </Box>

      <Box p='6' bg='white' borderRadius='md' boxShadow='sm'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} gap='10' align='stretch'>
            <Box width='50%'>
              <FormController
                type='select'
                control={control}
                name='status'
                labelName={t('status')}
                placeholder={t('selectAnOption')}
                items={filteredStatusOptions}
                errors={errors}
                required
              />
            </Box>

            <FormController
              type='textArea'
              control={control}
              name='remarks'
              labelName={t('remarks')}
              placeholder={t('enterRemarks')}
              errors={errors}
              required
              rows={4}
            />

            <Box display='flex' justifyContent='flex-end' mt={4}>
              <Button
                variant='outline'
                mr={3}
                onClick={() => navigate({ to: '/app/partners/on-board-lnps/to-be-verified' })}
              >
                {t('back')}
                <Close />
              </Button>
              <Button type='submit' colorScheme='primary' size='md'>
                {t('submit')}
                <Save />
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default LNPPartnerPreview;
