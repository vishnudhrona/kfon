import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Icons, Popup, useForm, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { BsXCircle } from '@/components/custom';
import { validation } from '@/utils/validationUtils';

import { assignSubscriberEnquiry, fetchSubscriberForwardUsers } from '../../actions';
import { getSubscriberForwardUsers } from '../../selectors';

const { ForwardArrowIcon } = Icons;

const assignSchema = (t) => {
  const msg = validation(t);
  return yup.object({
    user: yup
      .mixed()
      .required(msg.required('user'))
      .test('has-id', msg.required('user'), (value) => !!value?.userId),
    remarks: yup.string()
  });
};

const SubscriberForwardPlusPopup = ({ open, setOpen, selectedEnquiryId, forwardType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const forwardUsers = useSelector(getSubscriberForwardUsers);

  useEffect(() => {
    dispatch(fetchSubscriberForwardUsers());
  }, [dispatch]);

  const userItems = useMemo(
    () =>
      forwardUsers.map((u) => ({
        id: u.seatId,
        seatId: u.seatId,
        seatName: u.seatName,
        userId: u.userId,
        username: u.username,
        name: `${u.empname} ( ${u.designation ?? ''} ${u.username} )`
      })),
    [forwardUsers]
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(assignSchema(t)),
    defaultValues: { user: '', remarks: '' }
  });

  const onClose = () => setOpen(false);

  useEffect(() => {
    if (open) reset({ user: '', remarks: '' });
  }, [open, reset]);

  const onSubmit = (formData) => {
    if (!selectedEnquiryId?.enquiryId) return;

    const { seatId, seatName, userId, username } = formData.user;
    dispatch(
      assignSubscriberEnquiry({
        enquiryId: selectedEnquiryId.enquiryId,
        seatId,
        seatName,
        userId,
        username,
        type: forwardType?.toUpperCase(),
        remarks: formData.remarks,
        forwardType,
        onSuccess: onClose
      })
    );
  };

  return (
    <Popup title={t('forwardPlus')} isOpen={open} onClose={onClose} size='md'>
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
    </Popup>
  );
};

export default SubscriberForwardPlusPopup;
