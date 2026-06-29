import { yupResolver } from '@hookform/resolvers/yup';
import { Box, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import _ from 'lodash-es';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { ACTION_TYPES as COMMON_API_ACTION_TYPES, fetchPostOfice } from '@/features/common/actions';
import { getPostOffice } from '@/features/common/selectors';
import { actions as commonActions } from '@/features/common/slice';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { ACTION_TYPES as COMMON_ACTION_TYPES, sendOtpForForms } from '@/features/public/common/actions';
import OtpPopup from '@/features/public/common/components/OtpPopup';
import SuccessPopup from '@/features/public/common/components/SuccessPopup';
import { STATE_REDUCER_KEY as COMMON_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import { getLoginDetails } from '@/features/public/pages/login/selector';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';

import { ACTION_TYPES, fetchAgnpEnquiryByMobile } from '../action';
import { formatAGNPEnquiryRequest } from '../helpers';
import { getAgnpEmailEnquiryData, getAgnpEnquiryDataPopupOpen, getAgnpMobileEnquiryData, getAgnpSubscriberSubmitDetails } from '../selector';
import { actions as enquirySliceActions } from '../slice';
import { AGNPSchema } from '../validations';
import AGNPEnquiryDataPopup from './AGNPEnquiryDataPopup';
import EnquiryFormFooter from './EnquiryFormFooter';
import PartnerEnquiryCommonFields from './PartnerEnquiryCommonFields';

const FIELD_NAMES = {
  companyName: 'agnpName',
  contactName: 'contactName',
  mobile: 'mobileNumber',
  altMobile: 'altMobileNumber',
  landline: 'landline',
  email: 'email',
  fullAddress: 'fullAddress',
  location: 'location'
};

const AGNPEnquiry = ({ radioSelector, isPopup, onCancel, loggedIn }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuccessOpen = useSelector((s) => s[COMMON_KEY].successPopupOpen);
  const agnpMobileEnquiryData = useSelector(getAgnpMobileEnquiryData);
  const agnpEmailEnquiryData = useSelector(getAgnpEmailEnquiryData);
  const agnpEnquiryDataPopupOpen = useSelector(getAgnpEnquiryDataPopupOpen);
  const otpPopupOpen = useSelector((state) => state[COMMON_KEY].otpPopupOpen);
  const loginDetails = useSelector(getLoginDetails);
  const isLoggedIn = !!loginDetails?.data?.token;

  const apiProgress = useSelector(getApiProgress);
  const isSendingOtp = apiProgress[COMMON_ACTION_TYPES.SEND_OTP_FORMS] || false;
  const isSubmitting = apiProgress[ACTION_TYPES.SAVE_AGNP_ENQUIRY_SUBMIT] || false;

  const { predictions, search, setPredictions } = usePlacesAutocomplete();

  const DEFAULT_VALUES = {
    circle: null,
    agnpName: '',
    associatedIsp: 'no',
    contactName: '',
    mobileNumber: '',
    altMobileNumber: '',
    landline: '',
    email: '',
    fullAddress: '',
    location: '',
    latitude: '',
    longitude: '',
    pincode: '',
    postOffice: '',
    district: '',
    districtId: ''
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
    clearErrors,
    watch
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onSubmit',
    resolver: yupResolver(AGNPSchema(t))
  });

  const postOfficeMaster = useSelector(getPostOffice);
  const agnpSavedDetails = useSelector(getAgnpSubscriberSubmitDetails);

  const postOffice = watch('postOffice');
  const pincode = watch('pincode');

  useEffect(() => {
    if (postOffice && !_.isEmpty(postOfficeMaster)) {
      const selectedPostOffice = postOfficeMaster?.find(
        (item) =>
          item?.id === postOffice ||
          item?.value === postOffice ||
          item?.postOffice === postOffice ||
          (typeof postOffice === 'object' && item?.id === postOffice?.id)
      );
      if (selectedPostOffice) {
        setValue('district', selectedPostOffice?.district, { shouldValidate: true });
        setValue('districtId', selectedPostOffice?.districtId);
      }
    }
  }, [postOffice, postOfficeMaster, setValue]);

  useEffect(() => {
    return () => {
      dispatch(commonSliceActions.setSuccessPopupOpen(false));
      dispatch(commonSliceActions.setOtpPopupOpen(false));
    };
  }, [dispatch]);

  const onSubmit = (formValues) => {
    dispatch(sendOtpForForms(formatAGNPEnquiryRequest(formValues)));
  };

  const handleFormSubmit = (e) => {
    let hasConflict = false;
    if (agnpMobileEnquiryData) {
      setError('mobileNumber', { type: 'manual', message: t('partnerEnquiryAlreadyExists') });
      hasConflict = true;
    }
    if (agnpEmailEnquiryData) {
      setError('email', { type: 'manual', message: t('partnerEnquiryAlreadyExistsWithEmail') });
      hasConflict = true;
    }
    if (hasConflict) {
      e.preventDefault();
      return;
    }
    handleSubmit(onSubmit)(e);
  };

  const handleSuccessClose = (val) => {
    dispatch(commonSliceActions.setSuccessPopupOpen(val));
    if (!val) reset(DEFAULT_VALUES);
  };

  const pincodeChange = (e) => {
    const value = e?.target?.value;
    setValue('postOffice', '');
    setValue('district', '');
    setValue('districtId', '');
    clearErrors('pincode');
    if (value?.length === 6) {
      dispatch(fetchPostOfice({ pincode: value }));
    } else {
      dispatch(commonActions.clearPostOffice());
    }
  };

  const isFetchingPostOffice = apiProgress[COMMON_API_ACTION_TYPES.FETCH_POSTOFFICE] || false;

  useEffect(() => {
    if (!isFetchingPostOffice && pincode?.length === 6 && Array.isArray(postOfficeMaster) && postOfficeMaster.length === 0) {
      setError('pincode', { type: 'manual', message: t('noPostOfficeFound') });
    }
  }, [postOfficeMaster, isFetchingPostOffice, pincode, setError, t]);

  const handleSelect = (loc) => {
    setValue('latitude', loc.lat || '');
    setValue('longitude', loc.lng || '');
    setValue('location', loc.fullAddress || '', { shouldValidate: true });
  };

  const handlePlaceClick = async (item) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    const { results } = await geocoder.geocode({ placeId: item.place_id });
    if (!results?.length) return;
    const result = results[0];
    const loc = result.geometry.location;
    setValue('latitude', loc.lat().toString());
    setValue('longitude', loc.lng().toString());
    setValue('location', result.formatted_address, { shouldValidate: true });
    setPredictions([]);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    clearErrors('mobileNumber');
    dispatch(enquirySliceActions.setAgnpMobileEnquiryData(null));
    if (value && value.length === 10) dispatch(fetchAgnpEnquiryByMobile({ mobileNumber: value }));
  };

  const handleEmailChange = () => {
    clearErrors('email');
    dispatch(enquirySliceActions.setAgnpEmailEnquiryData(null));
  };

  const handleEnquiryPopupClose = () => {
    dispatch(enquirySliceActions.setAgnpEnquiryDataPopupOpen(false));
  };

  useEffect(() => {
    if (agnpEnquiryDataPopupOpen) {
      if (agnpMobileEnquiryData) setError('mobileNumber', { type: 'manual', message: t('partnerEnquiryAlreadyExists') });
      if (agnpEmailEnquiryData) setError('email', { type: 'manual', message: t('partnerEnquiryAlreadyExistsWithEmail') });
    }
  }, [agnpEnquiryDataPopupOpen, agnpMobileEnquiryData, agnpEmailEnquiryData, setError, t]);

  const watchedEmail = watch('email');

  useEffect(() => {
    if (!watchedEmail || watchedEmail.trim() === '') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail)) return;
    const timer = setTimeout(() => dispatch(fetchAgnpEnquiryByMobile({ email: watchedEmail })), 600);
    return () => clearTimeout(timer);
  }, [watchedEmail, dispatch]);

  return (
    <Box
      bg='white'
      borderRadius={loggedIn ? '' : '12px'}
      p={loggedIn ? 0 : { base: '24px 16px', md: '32px 24px', xl: '40px 32px' }}
      boxShadow={loggedIn ? '' : '0 4px 18px rgba(0,0,0,0.08)'}
    >
      {radioSelector}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          columnGap={{ base: 4, md: 8, xl: 10 }}
          rowGap={{ base: 6, md: 8 }}
        >
          <PartnerEnquiryCommonFields
            control={control}
            errors={errors}
            watch={watch}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
            postOfficeMaster={postOfficeMaster}
            predictions={predictions}
            onPredictionClick={handlePlaceClick}
            onClearPredictions={() => setPredictions([])}
            names={FIELD_NAMES}
            labels={{
              companyName: t('agnpName'),
              altMobile: 'altMobileNumber',
              location: t('location'),
              contactSection: t('contactDetails')
            }}
            showGeographicDivider
            onMobileChange={handleMobileChange}
            onEmailChange={handleEmailChange}
            onPincodeChange={pincodeChange}
            onLocationSearch={search}
            onLocationSelect={handleSelect}
          />
        </SimpleGrid>
        <EnquiryFormFooter
          isPopup={isPopup}
          loggedIn={loggedIn}
          onCancel={onCancel}
          isSendingOtp={isSendingOtp}
          isSubmitting={isSubmitting}
        />
      </form>
      <SuccessPopup
        isOpen={isSuccessOpen}
        setIsOpen={handleSuccessClose}
        message={`${t('successMsgOne')} ${agnpSavedDetails?.trackingId} ${t('successMsgTwo')}`}
        onDone={() => {
          handleSuccessClose(false);
          navigate({ to: isLoggedIn ? '/app/partners/enquiry-list' : '/' });
        }}
      />
      <OtpPopup isOpen={otpPopupOpen} setIsOpen={(val) => dispatch(commonSliceActions.setOtpPopupOpen(val))} />
      <AGNPEnquiryDataPopup
        isOpen={agnpEnquiryDataPopupOpen}
        setIsOpen={handleEnquiryPopupClose}
        mobileEnquiryData={agnpMobileEnquiryData}
        emailEnquiryData={agnpEmailEnquiryData}
      />
    </Box>
  );
};

export default AGNPEnquiry;
