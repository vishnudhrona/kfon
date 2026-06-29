import { yupResolver } from '@hookform/resolvers/yup';
import { Box, FormController, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
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
import { formatFibreKmInput, stripNonDigits } from '@/utils/validationUtils';

import { ACTION_TYPES, fetchLnpEnquiryByMobile } from '../action';
import { formatLNPEnquiryRequest } from '../helpers';
import {
  getLnpEmailEnquiryData,
  getLnpEnquiryDataPopupOpen,
  getLnpMobileEnquiryData,
  getLnpSubscriberSubmitDetails
} from '../selector';
import { actions as enquirySliceActions } from '../slice';
import { LNPSchema } from '../validations';
import EnquiryFormFooter from './EnquiryFormFooter';
import LNPEnquiryDataPopup from './LNPEnquiryDataPopup';
import PartnerEnquiryCommonFields from './PartnerEnquiryCommonFields';

const FIELD_NAMES = {
  companyName: 'partnerCompanyName',
  contactName: 'partnerContactName',
  mobile: 'partnerMobileNumber',
  altMobile: 'landline',
  landline: 'landlineNumber',
  email: 'partnerEmail',
  fullAddress: 'partnerFullAddress',
  location: 'partnerLocation'
};

const LNPEnquiry = ({ radioSelector, isPopup, onCancel, loggedIn }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSuccessOpen = useSelector((s) => s[COMMON_KEY].successPopupOpen);
  const otpPopupOpen = useSelector((state) => state[COMMON_KEY].otpPopupOpen);
  const lnpMobileEnquiryData = useSelector(getLnpMobileEnquiryData);
  const lnpEmailEnquiryData = useSelector(getLnpEmailEnquiryData);
  const lnpEnquiryDataPopupOpen = useSelector(getLnpEnquiryDataPopupOpen);
  const loginDetails = useSelector(getLoginDetails);
  const isLoggedIn = !!loginDetails?.data?.token;

  const apiProgress = useSelector(getApiProgress);
  const isSendingOtp = apiProgress[COMMON_ACTION_TYPES.SEND_OTP_FORMS] || false;
  const isSubmitting = apiProgress[ACTION_TYPES.SAVE_LNP_ENQUIRY_SUBMIT] || false;

  const { predictions, search, setPredictions } = usePlacesAutocomplete();

  const DEFAULT_VALUES = {
    circle: null,
    partnerCompanyName: '',
    associatedIsp: 'no',
    partnerContactName: '',
    partnerMobileNumber: '',
    landline: '',
    landlineNumber: '',
    partnerEmail: '',
    partnerFullAddress: '',
    partnerLocation: '',
    latitude: '',
    longitude: '',
    pincode: '',
    postOffice: null,
    district: null,
    existingCableTVSubscribers: '',
    existingInternetSubscribers: '',
    fibreKm: '',
    createdBy: 'WEB',
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
    mode: 'onSubmit',
    resolver: yupResolver(LNPSchema(t)),
    defaultValues: DEFAULT_VALUES
  });

  const postOfficeMaster = useSelector(getPostOffice);
  const lnpSavedDetails = useSelector(getLnpSubscriberSubmitDetails);

  const postOffice = watch('postOffice');
  const pincode = watch('pincode');

  useEffect(() => {
    if (!_.isEmpty(postOffice)) {
      setValue('district', postOffice?.district, { shouldValidate: true });
      setValue('districtId', postOffice?.districtId);
    }
  }, [postOffice, setValue]);

  useEffect(() => {
    return () => {
      dispatch(commonSliceActions.setSuccessPopupOpen(false));
      dispatch(commonSliceActions.setOtpPopupOpen(false));
    };
  }, [dispatch]);

  const handleSuccessClose = (val) => {
    dispatch(commonSliceActions.setSuccessPopupOpen(val));
    if (!val) {
      reset(DEFAULT_VALUES);
    }
  };

  const pincodeChange = (e) => {
    const value = e?.target?.value;
    setValue('postOffice', null);
    setValue('district', null);
    setValue('districtId', '');
    clearErrors('pincode');
    // Kerala pincodes are in the range 670000–695999; reject anything outside that
    if (value?.length === 6 && /^6[7-9]\d{4}$/.test(value)) {
      dispatch(fetchPostOfice({ pincode: value }));
    } else if (value?.length === 6) {
      setError('pincode', { type: 'manual', message: t('invalidPinCode') });
      dispatch(commonActions.clearPostOffice());
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

  const onSubmit = (formValues) => {
    const formattedData = formatLNPEnquiryRequest(formValues);
    dispatch(sendOtpForForms(formattedData));
  };

  const handleFormSubmit = (e) => {
    let hasConflict = false;
    if (lnpMobileEnquiryData) {
      setError('partnerMobileNumber', { type: 'manual', message: t('partnerEnquiryAlreadyExists') });
      hasConflict = true;
    }
    if (lnpEmailEnquiryData) {
      setError('partnerEmail', { type: 'manual', message: t('partnerEnquiryAlreadyExistsWithEmail') });
      hasConflict = true;
    }
    if (hasConflict) {
      e.preventDefault();
      return;
    }
    handleSubmit(onSubmit)(e);
  };

  const handleSelect = (loc) => {
    setValue('latitude', loc.lat || '');
    setValue('longitude', loc.lng || '');
    setValue('partnerLocation', loc.fullAddress || '', { shouldValidate: true });
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
    setValue('partnerLocation', result.formatted_address, { shouldValidate: true });
    setPredictions([]);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    clearErrors('partnerMobileNumber');
    dispatch(enquirySliceActions.setLnpMobileEnquiryData(null));
    if (value && value.length === 10) dispatch(fetchLnpEnquiryByMobile({ mobileNumber: value }));
  };

  const handleEmailChange = () => {
    clearErrors('partnerEmail');
    dispatch(enquirySliceActions.setLnpEmailEnquiryData(null));
  };

  const handleEnquiryPopupClose = () => {
    dispatch(enquirySliceActions.setLnpEnquiryDataPopupOpen(false));
  };

  useEffect(() => {
    if (lnpEnquiryDataPopupOpen) {
      if (lnpMobileEnquiryData)
        setError('partnerMobileNumber', { type: 'manual', message: t('partnerEnquiryAlreadyExists') });
      if (lnpEmailEnquiryData)
        setError('partnerEmail', { type: 'manual', message: t('partnerEnquiryAlreadyExistsWithEmail') });
    }
  }, [lnpEnquiryDataPopupOpen, lnpMobileEnquiryData, lnpEmailEnquiryData, setError, t]);

  const watchedEmail = watch('partnerEmail');

  useEffect(() => {
    if (!watchedEmail || watchedEmail.trim() === '') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail)) return;
    const timer = setTimeout(() => dispatch(fetchLnpEnquiryByMobile({ email: watchedEmail })), 600);
    return () => clearTimeout(timer);
  }, [watchedEmail, dispatch]);

  return (
    <Box
      bg='white'
      borderRadius={loggedIn ? '' : '12px'}
      p={loggedIn ? 0 : { base: '16px', md: '24px', xl: '32px' }}
      boxShadow={loggedIn ? '' : '0 4px 18px rgba(0,0,0,0.08)'}
    >
      {radioSelector}
      <form onSubmit={handleFormSubmit}>
        <SimpleGrid columns={{ base: 1, md: 3 }} rowGap={8} columnGap={10} alignItems='flex-start'>
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
              companyName: t('partnercompanyName'),
              altMobile: 'altMobileNumber',
              location: t('partnerLocation'),
              contactSection: t('personalInformation')
            }}
            locationMapTitle={t('selectPartnerLocation')}
            onMobileChange={handleMobileChange}
            onEmailChange={handleEmailChange}
            onPincodeChange={pincodeChange}
            onLocationSearch={search}
            onLocationSelect={handleSelect}
          />

          <FormController
            labelName={t('existingCableTVSubscribers')}
            name='existingCableTVSubscribers'
            placeholder={t('enter', { 0: t('existingCableTVSubscribers') })}
            control={control}
            errors={errors}
            maxLength={6}
            inputMode='numeric'
            onInput={stripNonDigits}
            required
          />
          <FormController
            labelName={t('existingInternetSubscribers')}
            name='existingInternetSubscribers'
            placeholder={t('enter', { 0: t('existingInternetSubscribers') })}
            control={control}
            errors={errors}
            maxLength={6}
            inputMode='numeric'
            onInput={stripNonDigits}
            required
          />
          <FormController
            labelName={t('fibreKm')}
            name='fibreKm'
            placeholder={t('enter', { 0: t('fibreKm') })}
            control={control}
            errors={errors}
            inputMode='decimal'
            onInput={formatFibreKmInput}
            required
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
        message={`${t('successMsgOne')} ${lnpSavedDetails?.trackingId} ${t('successMsgTwo')}`}
        onDone={() => {
          dispatch(commonSliceActions.setSuccessPopupOpen(false));
          navigate({ to: isLoggedIn ? '/app/partners/enquiry-list' : '/' });
        }}
      />
      <OtpPopup isOpen={otpPopupOpen} setIsOpen={(val) => dispatch(commonSliceActions.setOtpPopupOpen(val))} />
      <LNPEnquiryDataPopup
        isOpen={lnpEnquiryDataPopupOpen}
        setIsOpen={handleEnquiryPopupClose}
        mobileEnquiryData={lnpMobileEnquiryData}
        emailEnquiryData={lnpEmailEnquiryData}
      />
    </Box>
  );
};

export default LNPEnquiry;
