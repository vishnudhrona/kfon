import { Box, FormController } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { LocationInput } from '@/components/custom';
import { allowOnlyAlphaWithDot, stripExtraSpaces, stripLeadingSpaces, stripNonDigits, stripNonDigitsAndHyphens, stripTrailingSpaces } from '@/utils/validationUtils';

import CircleSelect from './CircleSelect';
import SectionDivider from './SectionDivider';

const PartnerEnquiryCommonFields = ({
  control,
  errors,
  watch,
  setValue,
  setError,
  clearErrors,
  postOfficeMaster,
  predictions,
  onPredictionClick,
  onClearPredictions,
  names,
  labels,
  showGeographicDivider = false,
  locationMapTitle,
  onMobileChange,
  onEmailBlur,
  onEmailChange,
  onPincodeChange,
  onLocationSearch,
  onLocationSelect
}) => {
  const { t } = useTranslation();

  return (
    <>
      <FormController
        labelName={labels.companyName}
        name={names.companyName}
        placeholder={t('enter', { 0: labels.companyName })}
        control={control}
        errors={errors}
        required
        maxLength={50}
        onInput={stripExtraSpaces}
      />
      <FormController
        labelName={t('associatedWithISP')}
        name='associatedIsp'
        type='radio'
        items={[
          { value: 'yes', label: t('yes') },
          { value: 'no', label: t('no') }
        ]}
        control={control}
        errors={errors}
      />
      <FormController
        labelName={t('contactName')}
        name={names.contactName}
        placeholder={t('enter', { 0: t('contactName') })}
        control={control}
        errors={errors}
        required
        maxLength={50}
        onKeyDown={allowOnlyAlphaWithDot}
        onInput={stripExtraSpaces}
      />
      <Box gridColumn='1 / -1'>
        <SectionDivider title={labels.contactSection} />
      </Box>
      <FormController
        labelName={t('mobileNumber')}
        name={names.mobile}
        placeholder={t('enter', { 0: t('mobileNumber') })}
        control={control}
        errors={errors}
        required
        maxLength={10}
        inputMode='numeric'
        pattern='[0-9]*'
        onInput={stripNonDigits}
        handleChange={onMobileChange}
      />
      <FormController
        labelName={t(labels.altMobile)}
        name={names.altMobile}
        placeholder={t('enter', { 0: t(labels.altMobile) })}
        control={control}
        errors={errors}
        maxLength={10}
        inputMode='numeric'
        pattern='[0-9]*'
        onInput={stripNonDigits}
      />
      <FormController
        labelName={t('landLineNumber')}
        name={names.landline}
        placeholder={t('enter', { 0: t('landLineNumber') })}
        control={control}
        errors={errors}
        maxLength={13}
        onInput={stripNonDigitsAndHyphens}
      />
      <FormController
        labelName={t('email')}
        name={names.email}
        placeholder={t('enter', { 0: t('email') })}
        control={control}
        errors={errors}
        required
        type='email'
        maxLength={100}
        onInput={stripLeadingSpaces}
        onBlur={(e) => {
          stripTrailingSpaces(e);
          setValue(names.email, e.target.value);
          onEmailBlur?.(e);
        }}
        handleChange={onEmailChange}
      />
      <FormController
        labelName={t('fullAddress')}
        name={names.fullAddress}
        placeholder={t('enter', { 0: t('fullAddress') })}
        control={control}
        errors={errors}
        required
        maxLength={300}
        onInput={stripExtraSpaces}
      />
      <CircleSelect control={control} errors={errors} setValue={setValue} />
      <LocationInput
        name={names.location}
        label={labels.location}
        required
        error={errors[names.location]?.message}
        placeholder={t('enter', { 0: labels.location })}
        value={watch(names.location)}
        predictions={predictions}
        onPredictionClick={onPredictionClick}
        onClearPredictions={onClearPredictions}
        onChange={(e) => {
          const value = e.target.value;
          setValue(names.location, value);
          onLocationSearch(value);
          setValue('latitude', '');
          setValue('longitude', '');
        }}
        onSelect={onLocationSelect}
        mapTitle={locationMapTitle}
        initialLat={watch('latitude')}
        initialLng={watch('longitude')}
        setError={setError}
        clearErrors={clearErrors}
        errorField={names.location}
      />
      {showGeographicDivider && (
        <Box gridColumn='1 / -1'>
          <SectionDivider title={t('geographicInformation')} />
        </Box>
      )}
      <FormController
        labelName={t('pinCode')}
        name='pincode'
        placeholder={t('enter', { 0: t('pinCode') })}
        control={control}
        errors={errors}
        required
        minLength={6}
        maxLength={6}
        inputMode='numeric'
        onInput={stripNonDigits}
        handleChange={onPincodeChange}
      />
      <FormController
        labelName={t('postOffice')}
        name='postOffice'
        type='select'
        items={postOfficeMaster}
        placeholder={t('choose', { 0: t('postOffice') })}
        control={control}
        errors={errors}
        required
      />
      <FormController
        labelName={t('district')}
        name='district'
        placeholder={t('district')}
        control={control}
        errors={errors}
        required
        readOnly
      />
    </>
  );
};

export default PartnerEnquiryCommonFields;
