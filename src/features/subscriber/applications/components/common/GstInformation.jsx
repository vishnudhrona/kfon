import { yupResolver } from '@hookform/resolvers/yup';
import { AccordionItem, FormController, useForm } from '@kfonbss/bss-ui-components';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { searchGstDetails } from '@/features/common/actions';
import { getGstDetails } from '@/features/common/selectors';
import { GSTIN_REGEX } from '@/features/onboarding/constants';

import { updateGstInformation } from '../../actions';
import { TAXPAYER_TYPE } from '../../constants';
import { getPrepopulatedData, getSubscriberId } from '../../selectors';
import { gstInformationValidationSchema } from '../../validation';

const GstInformation = ({ onBeforeSave, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const subscriberId = useSelector(getSubscriberId);
  const gstDetailsResponse = useSelector(getGstDetails);
  const prepopulatedData = useSelector(getPrepopulatedData);

  const validationSchema = useMemo(() => gstInformationValidationSchema(t), [t]);

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      gstRegistration: 'no'
    },
    reValidateMode: 'onBlur'
  });

  const prefilledGstRef = useRef(null);

  useEffect(() => {
    if (prepopulatedData?.gstInformation) {
      // Create a unique key for the prepopulated data to know if we already initialized from it
      const currentGstStr = JSON.stringify(prepopulatedData.gstInformation);
      if (prefilledGstRef.current === currentGstStr) return;
      prefilledGstRef.current = currentGstStr;

      const { gstNumber, pan, taxPayerType, legalBusinessName, tradeName, isGstAdded } =
        prepopulatedData.gstInformation;
      setValue('gstRegistration', isGstAdded ? 'yes' : 'no');
      if (isGstAdded) {
        if (gstNumber) setValue('gstin', gstNumber);
        if (pan) setValue('panNumber', pan);
        if (taxPayerType) setValue('taxPayerType', taxPayerType);
        if (legalBusinessName) setValue('legalName', legalBusinessName);
        if (tradeName) setValue('tradeName', tradeName);
      }
    }
  }, [prepopulatedData, setValue]);

  const gstRequired = watch('gstRegistration');

  const onSubmit = useCallback(
    (data) => {
      if (onBeforeSave && !onBeforeSave()) return;
      const isGstAdded = data.gstRegistration === 'yes';
      const payload = {
        legalBusinessName: data.legalName,
        tradeName: data.tradeName,
        gstNumber: data.gstin,
        pan: data.panNumber,
        taxPayerType: data.taxPayerType?.toUpperCase(),
        gstStatus: isGstAdded ? 'ACTIVE' : 'IN_ACTIVE',
        gstAdded: isGstAdded,
        gstInProofCopy: data.gstInProofCopy,
        applicationFormCopy: data.applicationFormCopy,
        lut: data.lut,
        onSuccess
      };
      dispatch(updateGstInformation(payload));
    },
    [onBeforeSave, dispatch, onSuccess]
  );

  const isDisabled = !subscriberId;

  const panNumber = watch('panNumber');

  const watchGstin = watch('gstin');
  const lastSearchedGstinRef = useRef('');
  const searchFiredRef = useRef(false);

  useEffect(() => {
    if (watchGstin && GSTIN_REGEX.test(watchGstin) && watchGstin !== lastSearchedGstinRef.current) {
      lastSearchedGstinRef.current = watchGstin;
      searchFiredRef.current = true;
      dispatch(searchGstDetails({ gstin: watchGstin }));
    }
  }, [dispatch, watchGstin]);

  useEffect(() => {
    if (gstDetailsResponse) {
      const { dty, lgnm, tradeNam } = gstDetailsResponse;
      setValue('taxPayerType', dty?.toUpperCase(), { shouldValidate: true });
      setValue('legalName', lgnm, { shouldValidate: true });
      setValue('tradeName', tradeNam, { shouldValidate: true });
    } else if (searchFiredRef.current) {
      setValue('taxPayerType', '', { shouldValidate: true });
      setValue('legalName', '', { shouldValidate: true });
      setValue('tradeName', '', { shouldValidate: true });
    }
  }, [gstDetailsResponse, setValue]);

  return (
    <AccordionItem
      title={t('gstInformation')}
      name={'gstInformation'}
      value={'GstInformation'}
      isDisabled={isDisabled}
      onSubmit={handleSubmit(onSubmit)}
      saveButton={true}
      buttonValue={t('saveAndContinue')}
    >
      <FormController
        labelName={t('gstInformationToBeAdded')}
        name='gstRegistration'
        control={control}
        errors={errors}
        type='radio'
        required
        items={[
          { label: t('yes'), value: 'yes' },
          { label: t('no'), value: 'no' }
        ]}
      />

      {gstRequired === 'yes' && (
        <>
          <FormController
            placeholder={t('panNumber')}
            labelName={t('panNumber')}
            name='panNumber'
            control={control}
            errors={errors}
            required
          />

          <FormController
            labelName={t('gstIn')}
            name='gstin'
            control={control}
            errors={errors}
            type='gstInput'
            required
            panNumber={panNumber}
          />

          <FormController
            placeholder={t('taxPayerType')}
            labelName={t('taxPayerType')}
            name='taxPayerType'
            control={control}
            errors={errors}
            disabled
            required
          />

          <FormController
            placeholder={t('legalName')}
            labelName={t('legalName')}
            name='legalName'
            control={control}
            errors={errors}
            disabled
            required
          />

          <FormController
            placeholder={t('tradeName')}
            labelName={t('tradeName')}
            name='tradeName'
            control={control}
            errors={errors}
            disabled
            required
          />

          <FormController
            placeholder={t('gstInProofCopy')}
            labelName={t('gstInProofCopy')}
            name='gstInProofCopy'
            control={control}
            errors={errors}
            type='file'
            ctaText={false}
            required
          />

          <FormController
            placeholder={t('applicationFormCopy')}
            labelName={t('applicationFormCopy')}
            name='applicationFormCopy'
            control={control}
            errors={errors}
            type='file'
            ctaText={false}
            required
          />

          {gstDetailsResponse?.dty === TAXPAYER_TYPE && (
            <FormController
              placeholder={t('lut')}
              labelName={t('lut')}
              name='lut'
              control={control}
              type='file'
              errors={errors}
              ctaText={false}
              required
            />
          )}
        </>
      )}
    </AccordionItem>
  );
};

export default GstInformation;
