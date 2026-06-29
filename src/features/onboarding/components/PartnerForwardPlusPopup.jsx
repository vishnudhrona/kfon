import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Icons, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { BsXCircle } from '@/components/custom';
import { validation } from '@/utils/validationUtils';

import { assignEnquiry, fetchPartnerForwardUsers } from '../action';
import { getPartnerForwardUsers } from '../selector';

const { ForwardArrowIcon } = Icons;

const assignSchema = (t) => {
  const msg = validation(t);
  return yup.object({
    user: yup
      .mixed()
      .required(msg.required('user'))
      .test('has-id', msg.required('user'), (value) => !!value?.seatId),
    remarks: yup.string()
  });
};

const PartnerForwardPlusPopup = ({ data, onClose, partnerType = 'lnp', forwardType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const forwardSteps = useSelector(getPartnerForwardUsers);

  const nextStep = forwardSteps?.[0];

  useEffect(() => {
    if (!data?.enquiryId) return;
    dispatch(
      fetchPartnerForwardUsers({
        onboardingType: partnerType?.toUpperCase(),
        enquiryId: data.enquiryId
      })
    );
  }, [dispatch, data?.enquiryId, partnerType]);

  const userItems = useMemo(
    () =>
      (nextStep?.users || []).map((u) => ({
        id: u.seatId,
        seatId: u.seatId,
        seatName: u.seatName,
        userId: u.userId,
        username: u.username,
        name: [u.empName, u.designation].filter(Boolean).join(' — ')
      })),
    [nextStep]
  );

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(assignSchema(t)),
    defaultValues: { user: '', remarks: '' }
  });

  const onSubmit = (formData) => {
    if (!data?.enquiryId) return;

    const { seatId, seatName, userId, username } = formData.user;
    dispatch(
      assignEnquiry({
        enquiryId: data.enquiryId,
        seatId,
        seatName,
        userId,
        username,
        remarks: formData.remarks,
        nextStepCode: nextStep?.nextStepCode,
        type: partnerType?.toUpperCase(),
        forwardType,
        onSuccess: onClose
      })
    );
  };

  return (
    <Box p={5} pt={0} bg='white'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} gap={3} align='stretch'>
          <FormController
            type='select'
            control={control}
            name='user'
            labelName={t('user')}
            placeholder={t('choose', { 0: t('user') })}
            items={userItems}
            errors={errors}
            required
          />

          <FormController
            type='textArea'
            control={control}
            name='remarks'
            labelName={t('remarks')}
            placeholder={t('enterRemarks')}
            errors={errors}
            rows={4}
          />

          <Box display='flex' justifyContent='flex-end' gap={3}>
            <Button variant='outline' size='md' onClick={onClose}>
              <BsXCircle />
              {t('cancel')}
            </Button>
            <Button type='submit' colorScheme='primary' size='md'>
              {t('forwardPlus')}
              <ForwardArrowIcon />
            </Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
};

export default PartnerForwardPlusPopup;
