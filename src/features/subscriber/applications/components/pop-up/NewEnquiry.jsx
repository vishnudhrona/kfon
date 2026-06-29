import { Popup } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STATE_REDUCER_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import { actions as enquirySliceActions } from '@/features/public/pages/enquiryForms/slice';

import CreateHomeEnquiryForm from './CreateHomeEnquiryForm';

const NewEnquiry = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formKey, setFormKey] = useState(0);

  const isSuccessOpen = useSelector((s) => s[STATE_REDUCER_KEY].successPopupOpen);
  const otpPopupOpen = useSelector((s) => s[STATE_REDUCER_KEY].otpPopupOpen);

  const handleClose = () => {
    dispatch(commonSliceActions.clearAll());
    dispatch(enquirySliceActions.setHomeSubcriberSubmitDetails({}));
    setFormKey((k) => k + 1);
    setOpen(false);
  };

  // Suppress the auto-close on success — OtpView shows tracking ID inline instead
  useEffect(() => {
    if (isSuccessOpen) {
      dispatch(commonSliceActions.setSuccessPopupOpen(false));
    }
  }, [isSuccessOpen, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(commonSliceActions.clearAll());
      dispatch(enquirySliceActions.setHomeSubcriberSubmitDetails({}));
    };
  }, [dispatch]);

  return (
    <Popup
      isOpen={open}
      closeButton={true}
      onOpenChange={handleClose}
      title={otpPopupOpen ? t('verifyYour') : t('create')}
      titleMain={otpPopupOpen ? t('mobileNumber') : t('retailEnquiry')}
      size='lg'
      closeOnInteractOutside={false}
    >
      <CreateHomeEnquiryForm key={formKey} onCancel={handleClose} />
    </Popup>
  );
};

export default NewEnquiry;
