import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, FormController, useForm } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';

import { allowOnlyDigits, allowOnlyPanChars, allowOnlyServiceDescriptionChars } from '@/utils/validationUtils';

import { searchOnboardingGstDetails, submitOnboardingKycGstDetails } from '../action';
import { GSTIN_REGEX, YES_KEY } from '../constants';
import { getBasicDetails, getGstDetails, getGstSearchFailed, getKycGstInformation } from '../selector';
import { actions as onboardingActions } from '../slice';
import { kycGstDetails } from '../validation';

const OnboardingFormStep4 = ({
  submitFormdata,
  kycGstInformation,
  basicDetails,
  getGstDetails,
  gstDetailsResponse,
  gstSearchFailed,
  showSaveButton = false,
  isDisabled = false,
  onSaveSuccess,
  onBeforeSave
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [panNumber, setPanNumber] = useState();
  const lastSearchedGstinRef = useRef(kycGstInformation?.gstin || '');
  const lastKycKeyRef = useRef('');
  const gstSearchTriggeredRef = useRef(false);

  const { id } = useParams({ strict: false });
  const onboardingId = basicDetails?.id || id;

  const getInitialValues = useCallback(() => {
    const data = kycGstInformation || {};
    const gstin = data?.gstin || '';

    let gstParts = {
      stateCode: '32',
      panId: '',
      businessType: '',
      businessCode: 'Z',
      checkDigit: ''
    };

    if (gstin && gstin.length === 15) {
      gstParts = {
        stateCode: gstin.substring(0, 2),
        panId: gstin.substring(2, 12),
        businessType: gstin.substring(12, 13),
        businessCode: gstin.substring(13, 14),
        checkDigit: gstin.substring(14, 15)
      };
    }

    return {
      pan: data?.pan || '',
      aadhaarNumber: data?.aadhaarNumber || '',
      gstInformation:
        typeof data?.gstInformation === 'boolean' ? (data.gstInformation ? 'Yes' : 'No') : data?.gstin ? 'Yes' : 'No',
      gstin: gstin,
      serviceDescription: data?.serviceDescription || '',
      sac: data?.sac || '',
      taxPayerType: data?.taxPayerType || '',
      legalName: data?.legalName || '',
      tradeName: data?.tradeName || '',
      ...gstParts
    };
  }, [kycGstInformation]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(kycGstDetails(t)),
    mode: 'onChange',
    defaultValues: getInitialValues()
  });

  useEffect(() => {
    if (kycGstInformation) {
      const kycKey = `${kycGstInformation.pan}|${kycGstInformation.aadhaarNumber}|${kycGstInformation.gstin}|${kycGstInformation.taxPayerType}|${kycGstInformation.legalName}|${kycGstInformation.tradeName}|${kycGstInformation.serviceDescription}|${kycGstInformation.sac}|${kycGstInformation.gstInformation}`;
      if (kycKey === lastKycKeyRef.current) return;
      lastKycKeyRef.current = kycKey;
      if (kycGstInformation.gstin) {
        lastSearchedGstinRef.current = kycGstInformation.gstin;
      }
      reset(getInitialValues());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kycGstInformation]);

  const watchGstInformation = watch('gstInformation');
  const watchPanNumber = watch('pan');
  const watchGstin = watch('gstin');

  useEffect(() => {
    if (watchGstin && GSTIN_REGEX.test(watchGstin) && watchGstin !== lastSearchedGstinRef.current) {
      lastSearchedGstinRef.current = watchGstin;
      gstSearchTriggeredRef.current = true;
      getGstDetails({ gstin: watchGstin });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchGstin]);

  useEffect(() => {
    if (watchGstInformation === YES_KEY) {
      setPanNumber(watchPanNumber);
    }
  }, [watchGstInformation, watchPanNumber]);

  useEffect(() => {
    dispatch(onboardingActions.setOnboardingFormDetails({ gstEnabled: watchGstInformation === YES_KEY }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchGstInformation]);

  useEffect(() => {
    if (!gstSearchTriggeredRef.current) return;
    if (gstDetailsResponse?.data) {
      const { dty, lgnm, tradeNam } = gstDetailsResponse.data;
      setValue('taxPayerType', dty || '');
      setValue('legalName', lgnm || '');
      setValue('tradeName', tradeNam || '');
    } else if (gstSearchFailed) {
      setValue('taxPayerType', '');
      setValue('legalName', '');
      setValue('tradeName', '');
    }
  }, [gstDetailsResponse, gstSearchFailed, setValue]);

  const onSubmit = (data) => {
    if (onBeforeSave && !onBeforeSave()) return;
    const isGstEnabled = data?.gstInformation === YES_KEY;
    const payload = {
      pan: data?.pan.toUpperCase(),
      aadhaarNumber: data?.aadhaarNumber,
      gstInformation: isGstEnabled,
      onSuccess: onSaveSuccess
    };
    submitFormdata({
      ...payload,
      ...(isGstEnabled && {
        gstin: data?.gstin,
        serviceDescription: data?.serviceDescription,
        sac: data?.sac,
        taxPayerType: data?.taxPayerType,
        legalName: data?.legalName,
        tradeName: data?.tradeName
      }),
      id: onboardingId
    });
  };

  return (
    <>
      <AccordionItem
        title={t('kycGstInformation')}
        name={'Step4'}
        value={'step4'}
        onSubmit={handleSubmit(onSubmit)}
        saveButton={showSaveButton}
        buttonValue={t('save')}
      >
        <FormController
          placeholder={t('enter', { 0: t('panNumber') })}
          labelName={t('panNumber')}
          name='pan'
          textTransform='uppercase'
          control={control}
          errors={errors}
          onKeyDown={allowOnlyPanChars}
          maxLength={10}
          required
          disabled={isDisabled}
        />

        <FormController
          placeholder={t('enter', { 0: t('aadhaarNumber') })}
          labelName={t('aadhaarNumber')}
          name='aadhaarNumber'
          control={control}
          errors={errors}
          onKeyDown={allowOnlyDigits}
          maxLength={12}
          required
          disabled={isDisabled}
        />

        <FormController
          labelName={t('gstInformation')}
          name='gstInformation'
          errors={errors}
          control={control}
          type='radio'
          required
          disabled={isDisabled}
          items={[
            { label: t('yes'), value: 'Yes' },
            { label: t('no'), value: 'No' }
          ]}
        />

        {watchGstInformation === YES_KEY && (
          <>
            <FormController
              placeholder={t('enter', { 0: t('gstin') })}
              labelName={t('gstin')}
              name='gstin'
              control={control}
              errors={errors}
              panNumber={panNumber}
              setValue={setValue}
              watch={watch}
              type='gstInput'
              required
              disabled={isDisabled}
            />

            <FormController
              placeholder={t('enter', { 0: t('serviceDescription') })}
              labelName={t('serviceDescription')}
              name='serviceDescription'
              control={control}
              errors={errors}
              onKeyDown={allowOnlyServiceDescriptionChars}
              required
              disabled={isDisabled}
            />

            <FormController
              placeholder={t('enter', { 0: t('sacCode') })}
              labelName={t('sacCode')}
              name='sac'
              control={control}
              errors={errors}
              onKeyDown={allowOnlyDigits}
              required
              maxLength={6}
              disabled={isDisabled}
            />

            <FormController
              placeholder={t('enter', { 0: t('taxPayerType') })}
              labelName={t('taxPayerType')}
              name='taxPayerType'
              control={control}
              errors={errors}
              disabled
              required
            />

            <FormController
              placeholder={t('enter', { 0: t('legalBusinessName') })}
              labelName={t('legalBusinessName')}
              name='legalName'
              control={control}
              errors={errors}
              disabled
              required
            />

            <FormController
              placeholder={t('enter', { 0: t('tradeName') })}
              labelName={t('tradeName')}
              name='tradeName'
              control={control}
              errors={errors}
              disabled
              required
            />
          </>
        )}
      </AccordionItem>
    </>
  );
};

const mapStateToProps = (state) => ({
  gstDetailsResponse: getGstDetails(state),
  gstSearchFailed: getGstSearchFailed(state),
  kycGstInformation: getKycGstInformation(state),
  basicDetails: getBasicDetails(state)
});

const mapDispatchToProps = {
  submitFormdata: submitOnboardingKycGstDetails,
  getGstDetails: searchOnboardingGstDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingFormStep4);
