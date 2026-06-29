import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, Box, Button, FormController, Icons, useForm } from '@kfonbss/bss-ui-components';
import { useLocation, useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { errorToast } from '@/components/custom/Toast';
import { sendOtp } from '@/features/common/actions';
import VerifyOtpPopUp from '@/features/common/components/VerifyOtpPopUp';
import { getOtpDetails } from '@/features/common/selectors';
import { actions as commonActions } from '@/features/common/slice';
import { stripExtraSpaces } from '@/utils/validationUtils';

import { fetchOnboardingPostoffice, submitOnboardingBasicDetails } from '../action';
import { getBasicDetails, getPostoffice } from '../selector';
import { partnerBasicDetailsSchema } from '../validation';

const { BsCheckCircle } = Icons;

const OnboardingFormStep1 = ({
  submitFormData,
  formData,
  sendOtpValue,
  resetOtpValue,
  otpDetails,
  fetchPostoffice,
  postofficeValue,
  showSaveButton = true,
  isActive,
  isDisabled = false,
  onSaveSuccess,
  onBeforeSave
}) => {
  const { t } = useTranslation();
  const { enquiryId } = useParams({ strict: false });
  const location = useLocation();
  const locationState = location.state || {};

  const [open, setOpen] = useState(false);
  const [verifiedNumbers, setVerifiedNumbers] = useState(() => new Set());

  const getInitialValues = useCallback(() => {
    const rawData = Array.isArray(formData) ? formData[0] : formData;
    const data = rawData?.basicDetails || rawData;
    const isFromLNPPartners = !!rawData?.partnerCompanyName;

    let matchingPostOffice =
      typeof data?.postOffice === 'string'
        ? data.postOffice.length > 30
          ? ''
          : { name: data.postOffice }
        : data?.postOffice || '';

    const partnerPostOfficeId =
      rawData?.postOfficeId ||
      rawData?.partnerPostOffice ||
      (typeof data?.postOffice === 'string' ? data?.postOffice : null);

    if (postofficeValue?.length > 0 && partnerPostOfficeId) {
      const po = postofficeValue.find(
        (po) => po.id === partnerPostOfficeId || po.uuid === partnerPostOfficeId || po.name === partnerPostOfficeId
      );
      if (po) matchingPostOffice = po;
    }

    return {
      companyName: data?.companyName || rawData?.partnerCompanyName || '',
      keyContactName: data?.keyContactName || rawData?.partnerName || '',
      email: data?.email || rawData?.partnerEmail || '',
      keyContactNumber: data?.keyContactNumber || rawData?.partnerMobile || '',
      alternatePhone: data?.alternatePhone || rawData?.partnerPhone || '',
      addressLine1: data?.addressLine1 || rawData?.partnerAddress || '',
      addressLine2: data?.addressLine2 || '',
      pinCode: data?.pinCode || rawData?.partnerPincode || '',
      postOffice: matchingPostOffice,
      city: data?.city || rawData?.partnerCity || '',
      district: data?.district || matchingPostOffice?.district || '',
      locationType: data?.locationType === 0 ? 'urban' : data?.locationType === 1 ? 'rural' : data?.locationType || '',
      agreementType: data?.agreementType ? data.agreementType.trim() : isFromLNPPartners ? 'LNP' : ''
    };
  }, [formData, postofficeValue]);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(partnerBasicDetailsSchema(t)),
    mode: 'onChange',
    defaultValues: getInitialValues()
  });

  const watchedPostOffice = watch('postOffice');
  const mobileNumber = watch('keyContactNumber');

  const isMobileNumberVerified = verifiedNumbers.has(String(mobileNumber));

  const mobileNumberRef = useRef(mobileNumber);
  useEffect(() => {
    mobileNumberRef.current = mobileNumber;
  }, [mobileNumber]);

  useEffect(() => {
    if (otpDetails?.verified) {
      const verified = mobileNumberRef.current;
      if (verified) {
        setVerifiedNumbers((prev) => new Set([...prev, String(verified)]));
      }
      resetOtpValue();
    }
  }, [otpDetails?.verified, resetOtpValue]);

  const handleVerify = async () => {
    const isValid = await trigger('keyContactNumber');
    if (isValid) {
      sendOtpValue({ mobile: mobileNumber });
      setOpen(true);
    }
  };

  const prevFormDataRef = useRef(null);

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      if (formData !== prevFormDataRef.current) {
        reset(getInitialValues());
        prevFormDataRef.current = formData;
        const raw = Array.isArray(formData) ? formData[0] : formData;
        const saved = raw?.basicDetails || raw;
        const savedMobile = saved?.keyContactNumber || raw?.partnerMobile;
        if (savedMobile) {
          setVerifiedNumbers((prev) => new Set([...prev, String(savedMobile)]));
        }
      }
    }
  }, [formData, reset, getInitialValues]);

  const lastFetchedPincodeRef = useRef(null);

  const handlePincodeChange = (e) => {
    const value = e?.target?.value !== undefined ? e.target.value : e;
    if (typeof value !== 'string') return;

    setValue('pinCode', value, { shouldValidate: true });
    setValue('district', '');
    setValue('postOffice', '');
    clearErrors('pinCode');

    if (value?.length === 6) {
      lastFetchedPincodeRef.current = value;
      fetchPostoffice({
        pincode: Number(value),
        onSuccess: (data) => {
          if (data?.length === 0) {
            setError('pinCode', {
              type: 'manual',
              message: t('validations.enterProperKeralaPincode')
            });
          }
        }
      });
    } else {
      lastFetchedPincodeRef.current = null;
    }
  };

  useEffect(() => {
    if (!isActive) return;
    const currentPincode = getValues('pinCode');
    if (currentPincode?.length === 6 && currentPincode !== lastFetchedPincodeRef.current) {
      lastFetchedPincodeRef.current = currentPincode;
      fetchPostoffice({
        pincode: Number(currentPincode),
        onSuccess: (data) => {
          if (data?.length === 0) {
            setError('pinCode', {
              type: 'manual',
              message: t('validations.enterProperKeralaPincode')
            });
          }
        }
      });
    }
  }, [isActive, fetchPostoffice, getValues, setError, t]);

  useEffect(() => {
    if (watchedPostOffice?.district) {
      setValue('district', watchedPostOffice.district);
    }
  }, [watchedPostOffice, setValue]);

  useEffect(() => {
    if (postofficeValue?.length > 0) {
      const districts = [...new Set(postofficeValue.map((po) => po.district).filter(Boolean))];
      if (districts.length === 1) {
        setValue('district', districts[0], { shouldValidate: true });
      }
    }
  }, [postofficeValue, setValue]);

  useEffect(() => {
    if (postofficeValue?.length > 0 && formData) {
      const rawData = Array.isArray(formData) ? formData[0] : formData;
      const partnerPostOfficeId = rawData?.postOfficeId || rawData?.partnerPostOffice;
      const currentPostOffice = getValues('postOffice');

      if (partnerPostOfficeId && (!currentPostOffice || !currentPostOffice.id)) {
        const matchingPostOffice = postofficeValue.find(
          (po) => po.id === partnerPostOfficeId || po.uuid === partnerPostOfficeId || po.name === partnerPostOfficeId
        );

        if (matchingPostOffice) {
          setValue('postOffice', matchingPostOffice);
          if (matchingPostOffice.district) {
            setValue('district', matchingPostOffice.district);
          }
        }
      }
    }
  }, [postofficeValue, formData, setValue, getValues]);

  const onSubmit = (data) => {
    if (onBeforeSave && !onBeforeSave()) return;
    const existingId = formData?.id;
    const postOfficeName = data?.postOffice?.name || data?.postOffice;
    const districtId = data?.postOffice?.districtId;
    const districtName = data?.postOffice?.district || data?.district;
    const latitude = locationState.partnerLatitude ?? locationState.agnpLatitude ?? null;
    const longitude = locationState.partnerLongitude ?? locationState.agnpLongitude ?? null;

    const payload = {
      ...data,
      alternatePhone: Number(data?.alternatePhone),
      keyContactNumber: Number(data?.keyContactNumber),
      locationType: data?.locationType === 'urban' ? 0 : 1,
      pinCode: data?.pinCode,
      postOffice: postOfficeName,
      districtId: districtId,
      district: districtName,
      enquiryId,
      id: existingId,
      ...(latitude != null && { latitude }),
      ...(longitude != null && { longitude }),
      onSuccess: onSaveSuccess
    };

    if (!isMobileNumberVerified) {
      errorToast({ description: t('otpVerificationPending') });
      return;
    }
    submitFormData(payload);
  };

  return (
    <>
      <AccordionItem
        title={t('basicDetails')}
        name={'Step1'}
        value={'step1'}
        onSubmit={handleSubmit(onSubmit)}
        saveButton={showSaveButton}
        buttonValue={t('save')}
      >
        <FormController
          placeholder={t('enter', { 0: t('companyName') })}
          labelName={t('companyName')}
          name='companyName'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
          onInput={stripExtraSpaces}
        />

        <FormController
          placeholder={t('enter', { 0: t('managerName') })}
          labelName={t('managerName')}
          name='keyContactName'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
          onInput={stripExtraSpaces}
        />

        <FormController
          placeholder={t('enter', { 0: t('email') })}
          labelName={t('email')}
          name='email'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        <Box position='relative' w='full'>
          <FormController
            placeholder={t('enter', { 0: t('mobileNumber') })}
            labelName={t('mobileNumber')}
            name='keyContactNumber'
            control={control}
            errors={errors}
            maxLength={10}
            required
            isVerified={isMobileNumberVerified}
            disabled={isDisabled}
            paddingRight={!isDisabled ? (isMobileNumberVerified ? '40px' : '80px') : '16px'}
          />
          {!isDisabled && (
            <Box position='absolute' right='16px' top='37px' zIndex={2} display='flex' alignItems='center'>
              {isMobileNumberVerified ? (
                <BsCheckCircle boxSize={7} color='green.500' />
              ) : (
                <Button
                  variant='unstyled'
                  color='primary.500'
                  h='24px'
                  minW='auto'
                  onClick={() => handleVerify()}
                  fontSize='14px'
                  fontWeight='600'
                >
                  {t('verify')}
                </Button>
              )}
            </Box>
          )}
        </Box>

        <FormController
          placeholder={t('enter', { 0: t('alternateContactNumber') })}
          labelName={t('alternateContactNumber')}
          name='alternatePhone'
          control={control}
          errors={errors}
          maxLength={10}
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('addressLine1') })}
          labelName={t('addressLine1')}
          name='addressLine1'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('addressLine2') })}
          labelName={t('addressLine2')}
          name='addressLine2'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('pinCode') })}
          labelName={t('pinCode')}
          name='pinCode'
          control={control}
          errors={errors}
          type='text'
          maxLength={6}
          required
          disabled={isDisabled}
          onInput={handlePincodeChange}
        />
        <FormController
          placeholder={t('choose', { 0: t('postOffice') })}
          labelName={t('postOffice')}
          name='postOffice'
          control={control}
          errors={errors}
          type='select'
          items={postofficeValue}
          required
          isDisabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('district') })}
          labelName={t('district')}
          name='district'
          control={control}
          errors={errors}
          disabled
          required
        />

        <FormController
          placeholder={t('enter', { 0: t('cityOrTown') })}
          labelName={t('cityOrTown')}
          name='city'
          control={control}
          errors={errors}
          required
          disabled={isDisabled}
        />
        <FormController
          labelName={t('locationType')}
          name='locationType'
          errors={errors}
          control={control}
          type='radio'
          required
          disabled={isDisabled}
          items={[
            { label: t('urban'), value: 'urban' },
            { label: t('rural'), value: 'rural' }
          ]}
        />

        <FormController
          labelName={t('agreementType')}
          name='agreementType'
          errors={errors}
          control={control}
          type='radio'
          required
          disabled
          items={[
            { label: t('lnp'), value: 'LNP' },
            { label: t('agnp'), value: 'AGNP' }
          ]}
        />
      </AccordionItem>

      <VerifyOtpPopUp open={open} setOpen={setOpen} mobileNumber={mobileNumber} />
    </>
  );
};

const mapStateToProps = (state) => ({
  otpDetails: getOtpDetails(state),
  postofficeValue: getPostoffice(state),
  formData: getBasicDetails(state)
});

const mapDispatchToProps = {
  submitFormData: submitOnboardingBasicDetails,
  sendOtpValue: sendOtp,
  resetOtpValue: commonActions.resetOtpDetails,
  fetchPostoffice: fetchOnboardingPostoffice
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingFormStep1);
