import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, FormController, useForm } from '@kfonbss/bss-ui-components';
import { useRouterState, useSearch } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { allowOnlyAlphaNumeric, allowOnlyDigits, transformUppercaseAlphaNumeric } from '@/utils/validationUtils';

import { fetchPartnerList, submitBasicDetails, updateBasicDetails } from '../../actions';
import { getPartnerList, getPrepopulatedData, getSubscriberId } from '../../selectors';
import { basicDetailsValidationSchema } from '../../validation';
import { BASIC_DETAILS_FORM_CONSTANTS, CONNECTION_TYPES } from './constants';

const BasicDetails = ({ connectionType = CONNECTION_TYPES.HOME_CONNECTION, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { enquiryId: searchEnqId } = useSearch({ strict: false });
  const routerState = useRouterState();
  const isPartial = routerState.location.state?.partial;
  const subscriberId = useSelector(getSubscriberId);
  const appliedOnlineEnqId = sessionStorage.getItem(STORAGE_KEYS.APPLIED_ONLINE_ENQ_ID);

  const isSme = connectionType === CONNECTION_TYPES.SME_CONNECTION;

  const partnerList = useSelector(getPartnerList);
  const hasPartners = partnerList?.length > 0;

  const validationSchema = useMemo(
    () => basicDetailsValidationSchema(t, connectionType, hasPartners),
    [t, connectionType, hasPartners]
  );

  const { fieldLabels: commonLabels, fieldOptions } = BASIC_DETAILS_FORM_CONSTANTS;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      [commonLabels.applicationFormNo]: '',
      [commonLabels.applicantName]: '',
      [commonLabels.companyName]: '',
      [commonLabels.dateOfBirth]: '',
      [commonLabels.mobileNo]: '',
      [commonLabels.alternateContactNumber]: '',
      [commonLabels.contactPerson]: '',
      [commonLabels.emailAddress]: '',
      [commonLabels.gender]: '',
      lnpPartnerId: '',
      isMsme: false
    },
    resolver: yupResolver(validationSchema)
  });

  // Use keys directly since we are using a simplified constants structure
  const basicDetails = commonLabels;

  const prepopulatedData = useSelector(getPrepopulatedData);

  const sessionEnquiryData = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.ENQUIRY_DATA) || 'null');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const data = prepopulatedData?.basicDetail ?? sessionEnquiryData;
    if (!data) return;

    if (data.applicationFormNumber) {
      setValue(basicDetails.applicationFormNo, data.applicationFormNumber);
    }
    if (isSme) {
      setValue(basicDetails.companyName, data.applicantName || data.cusName);
      setValue(basicDetails.mobileNo, data.mobileNumber || data.cusMobile);
      setValue(basicDetails.emailAddress, data.emailAddress || data.cusEmail);
      setValue(basicDetails.contactPerson, data.applicantName || data.cusName);
      setValue('isMsme', !!data.isMsme);
    } else {
      setValue(basicDetails.applicantName, data.applicantName || data.cusName);
      setValue(basicDetails.mobileNo, data.mobileNumber || data.cusMobile);
      setValue(basicDetails.emailAddress, data.emailAddress || data.cusEmail);
      if (data.dateOfBirth) setValue(basicDetails.dateOfBirth, data.dateOfBirth);
      if (data.gender) setValue(basicDetails.gender, data.gender);
    }
  }, [prepopulatedData, sessionEnquiryData, setValue, basicDetails, isSme]);

  // Fetch the partners (assigned LNP users) available to the current user
  useEffect(() => {
    dispatch(fetchPartnerList());
  }, [dispatch]);

  // Restore a previously chosen partner, else auto-select the single available one
  useEffect(() => {
    if (!partnerList?.length) return;
    const prefilledId = prepopulatedData?.basicDetail?.lnpPartnerId;
    if (prefilledId) {
      const match = partnerList.find((partner) => partner.id === prefilledId);
      if (match) {
        setValue('lnpPartnerId', match, { shouldValidate: true });
        return;
      }
    }
    if (partnerList.length === 1) {
      setValue('lnpPartnerId', partnerList[0], { shouldValidate: true });
    }
  }, [partnerList, prepopulatedData, setValue]);

  const onSubmit = (data) => {
    let finalEnqId = searchEnqId || appliedOnlineEnqId;
    if (!finalEnqId || finalEnqId === 'null' || finalEnqId === 'undefined') {
      finalEnqId = prepopulatedData?.basicDetail?.appliedOnlineEnqId || sessionEnquiryData?.enquiryId || null;
    }
    const latitude = sessionEnquiryData?.latitude || prepopulatedData?.basicDetail?.latitude || '';
    const longitude = sessionEnquiryData?.longitude || prepopulatedData?.basicDetail?.longitude || '';

    const base = {
      kycType: 'N_KYC',
      appliedOnlineEnqId: finalEnqId,
      latitude: String(latitude),
      longitude: String(longitude),
      // Only send lnpPartnerId when partners are available; avoids clobbering on PATCH
      ...(hasPartners && { lnpPartnerId: data.lnpPartnerId?.id || data.lnpPartnerId || null })
    };

    const cusConnType = sessionEnquiryData?.cusConnType || prepopulatedData?.basicDetail?.cusConnType;
    const homeType = cusConnType === 'BPL' ? 'BPL' : 'HOME';

    const payload = isSme
      ? {
          ...base,
          type: 'SME',
          applicationFormNumber: data.applicationFormNumber,
          companyName: data.companyName,
          mobileNumber: data.mobileNumber,
          alternateContactNumber: data.alternateContactNumber,
          contactPerson: data.contactPerson,
          emailAddress: data.emailAddress,
          isMsme: !!data.isMsme
        }
      : {
          ...base,
          type: homeType,
          applicationFormNumber: data.applicationFormNumber,
          applicantName: data.applicantName,
          dateOfBirth: data.dateOfBirth,
          mobileNumber: data.mobileNumber,
          emailAddress: data.emailAddress,
          gender: data.gender
        };

    // PATCH if subscriber record already exists, POST otherwise
    if (subscriberId || isPartial) {
      dispatch(updateBasicDetails({ ...payload, onSuccess }));
    } else {
      dispatch(submitBasicDetails({ ...payload, onSuccess }));
    }
  };

  return (
    <AccordionItem
      title={t(BASIC_DETAILS_FORM_CONSTANTS.title)}
      name={'BasicDetails'}
      value={'BasicDetails'}
      onSubmit={handleSubmit(onSubmit)}
      saveButton={true}
      buttonValue={t('saveAndContinue')}
    >
      <FormController
        placeholder={t('enter', { 0: t(basicDetails.applicationFormNo) })}
        labelName={t(basicDetails.applicationFormNo)}
        name={basicDetails.applicationFormNo}
        control={control}
        errors={errors}
        required
        maxLength={25}
        handleKeyDown={allowOnlyAlphaNumeric}
        onInput={transformUppercaseAlphaNumeric}
      />

      {hasPartners && (
        <FormController
          placeholder={t('choose', { 0: t(basicDetails.partner) })}
          labelName={t(basicDetails.partner)}
          name='lnpPartnerId'
          type='select'
          items={partnerList}
          control={control}
          errors={errors}
          isDisabled={partnerList.length === 1}
          required
        />
      )}

      {isSme ? (
        <FormController
          placeholder={t('enter', { 0: t(basicDetails.companyName) })}
          labelName={t(basicDetails.companyName)}
          name={basicDetails.companyName}
          control={control}
          errors={errors}
          required
        />
      ) : (
        <FormController
          placeholder={t('enter', { 0: t(basicDetails.applicantName) })}
          labelName={t(basicDetails.applicantName)}
          name={basicDetails.applicantName}
          control={control}
          errors={errors}
          required
        />
      )}

      {isSme && (
        <FormController labelName={t('msme')} name='isMsme' type='checkbox' control={control} errors={errors} />
      )}

      {isSme && (
        <FormController
          placeholder={t('enter', { 0: t(basicDetails.contactPerson) })}
          labelName={t(basicDetails.contactPerson)}
          name={basicDetails.contactPerson}
          control={control}
          errors={errors}
          required
        />
      )}
      <FormController
        placeholder={t('enter', { 0: t(basicDetails.dateOfBirth) })}
        labelName={t(basicDetails.dateOfBirth)}
        name={basicDetails.dateOfBirth}
        control={control}
        errors={errors}
        type='date'
        required
        disableFuture
      />

      <FormController
        placeholder={t('enter', { 0: t(basicDetails.mobileNo) })}
        labelName={t(basicDetails.mobileNo)}
        name={basicDetails.mobileNo}
        control={control}
        errors={errors}
        onKeyDown={allowOnlyDigits}
        maxLength={10}
        required
      />

      {isSme && (
        <FormController
          placeholder={t('enter', { 0: t(basicDetails.alternateContactNumber) })}
          labelName={t(basicDetails.alternateContactNumber)}
          name={basicDetails.alternateContactNumber}
          control={control}
          errors={errors}
          onKeyDown={allowOnlyDigits}
          maxLength={10}
          required
        />
      )}

      <FormController
        placeholder={t('enter', { 0: t(basicDetails.emailAddress) })}
        labelName={t(basicDetails.emailAddress)}
        name={basicDetails.emailAddress}
        control={control}
        errors={errors}
        required
      />

      <FormController
        labelName={t(basicDetails.gender)}
        name={basicDetails.gender}
        control={control}
        errors={errors}
        type='radio'
        required
        items={[
          { label: t(fieldOptions.gender.male), value: 'MALE' },
          { label: t(fieldOptions.gender.female), value: 'FEMALE' },
          { label: t(fieldOptions.gender.others), value: 'OTHERS' }
        ]}
      />
    </AccordionItem>
  );
};

export default BasicDetails;
