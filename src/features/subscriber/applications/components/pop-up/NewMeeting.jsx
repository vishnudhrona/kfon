import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Flex, FormController, Icons, Popup, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import { LocationInput } from '@/components/custom';
import { DATE_FORMAT } from '@/constants/date';
import { dayjs } from '@/utils/dateUtils';
import { isKerala } from '@/utils/geocodeUtils';
import usePlacesAutocomplete from '@/utils/usePlacesAutocomplete';
import { allowOnlyDigits } from '@/utils/validationUtils';

import { saveMeeting } from '../../actions';
const { BsXCircle } = Icons;

const NewMeeting = ({ open, setOpen, selectedEnquiryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const today = dayjs().startOf('day').toDate();
  const enquiryDate = selectedEnquiryId?.enquiryDate
    ? dayjs(selectedEnquiryId.enquiryDate).startOf('day').toDate()
    : today;
  const { predictions, search, setPredictions } = usePlacesAutocomplete();

  const validationSchema = yup.object().shape({
    meetingConducted: yup.string().required(t('validations.required', { 0: t('meetingConducted') })),
    remarks: yup.string().when('meetingConducted', {
      is: 'no',
      then: (schema) => schema.required(t('validations.required', { 0: t('remarks') })),
      otherwise: (schema) => schema.notRequired()
    }),
    meetingDate: yup.string().when('meetingConducted', {
      is: 'yes',
      then: (schema) => schema.required(t('validations.required', { 0: t('meetingDate') })),
      otherwise: (schema) => schema.notRequired()
    }),
    contactPersonName: yup.string().when('meetingConducted', {
      is: 'yes',
      then: (schema) => schema.required(t('validations.required', { 0: t('contactPersonName') })),
      otherwise: (schema) => schema.notRequired()
    }),
    contactNumber: yup.string().when('meetingConducted', {
      is: 'yes',
      then: (schema) =>
        schema
          .required(t('validations.required', { 0: t('contactNumber') }))
          .min(10, t('validations.invalidDigits', { 0: t('contactNumber'), 1: 10 }))
          .max(10, t('validations.invalidDigits', { 0: t('contactNumber'), 1: 10 })),
      otherwise: (schema) => schema.notRequired()
    }),
    meetingLocation: yup.string().when('meetingConducted', {
      is: 'yes',
      then: (schema) => schema.required(t('validations.required', { 0: t('meetingLocation') })),
      otherwise: (schema) => schema.notRequired()
    })
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      meetingConducted: 'yes',
      remarks: '',
      meetingDate: '',
      contactPersonName: '',
      contactNumber: '',
      meetingLocation: '',
      latitude: '',
      longitude: ''
    }
  });

  const meetingConducted = watch('meetingConducted');

  const handleClose = (isOpen) => {
    setOpen(isOpen);
  };

  const handleMapSelect = (loc) => {
    setValue('meetingLocation', loc.fullAddress || '', { shouldValidate: true });
    setValue('latitude', loc.lat ? String(loc.lat) : '');
    setValue('longitude', loc.lng ? String(loc.lng) : '');
  };

  const handlePlaceClick = async (item) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    const { results } = await geocoder.geocode({ placeId: item.place_id });
    if (!results?.length) return;
    const result = results[0];
    const loc = result.geometry.location;
    const addressComponents = result.address_components ?? [];
    const stateComponent = addressComponents.find((c) => c.types.includes('administrative_area_level_1'));
    const state = stateComponent?.long_name ?? '';

    setPredictions([]);

    if (!isKerala(state)) {
      setError('meetingLocation', { type: 'manual', message: t('locationOutsideKerala') });
      return;
    }

    clearErrors('meetingLocation');
    setValue('meetingLocation', result.formatted_address, { shouldValidate: true });
    setValue('latitude', String(loc.lat()));
    setValue('longitude', String(loc.lng()));
  };

  const onSubmit = (data) => {
    dispatch(
      saveMeeting({
        customerEnquiryId: selectedEnquiryId.enquiryId,
        remarks: data.remarks,
        date: data.meetingDate ? dayjs(data.meetingDate).format(DATE_FORMAT.DATE_YYYYMMDD) : '',
        contactPerson: data.contactPersonName,
        contactMobile: data.contactNumber,
        location: data.meetingLocation,
        lat: data.latitude,
        log: data.longitude,
        disabled: false,
        conducted: data.meetingConducted === 'yes'
      })
    );
    handleClose(false);
  };

  return (
    <Popup
      title={t('add')}
      titleMain={t('meetingStatus')}
      isOpen={open}
      onOpenChange={handleClose}
      size='lg'
      closeOnInteractOutside={false}
    >
      <Box as='form' onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1 }} borderRadius='lg' spacing={6} px={4} gap={3}>
          <FormController
            control={control}
            name='meetingConducted'
            labelName={t('meetingConducted')}
            required
            type='radio'
            items={[
              { label: t('yes'), value: 'yes' },
              { label: t('no'), value: 'no' }
            ]}
            errors={errors}
            onChange={(e) => {
              setValue('meetingConducted', e);
              trigger();
            }}
          />

          <FormController
            control={control}
            name='remarks'
            labelName={t('description')}
            type='textArea'
            placeholder={t('enter', { 0: t('description') })}
            required={meetingConducted === 'no'}
            rows={5}
            maxLength={500}
            errors={errors}
          />

          {meetingConducted === 'yes' && (
            <>
              <FormController
                control={control}
                name='meetingDate'
                labelName={t('meetingDate')}
                required
                type='date'
                placeholder='DD-MM-YYYY'
                disablePortal={true}
                minDate={enquiryDate}
                maxDate={today}
                errors={errors}
              />

              <FormController
                control={control}
                name='contactPersonName'
                labelName={t('contactPersonName')}
                required
                type='text'
                placeholder={t('enterName')}
                maxLength={100}
                errors={errors}
              />

              <FormController
                control={control}
                name='contactNumber'
                labelName={t('contactNumber')}
                required
                type='text'
                placeholder={t('enterContactNumber')}
                onKeyDown={allowOnlyDigits}
                maxLength={10}
                errors={errors}
              />

              <LocationInput
                name='meetingLocation'
                label={t('meetingLocation')}
                required
                error={errors.meetingLocation?.message}
                placeholder={t('enterAddress')}
                value={watch('meetingLocation')}
                predictions={predictions}
                onPredictionClick={handlePlaceClick}
                onClearPredictions={() => setPredictions([])}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('meetingLocation', value);
                  search(value);
                  setValue('latitude', '');
                  setValue('longitude', '');
                  clearErrors('meetingLocation');
                }}
                onSelect={handleMapSelect}
                setError={setError}
                clearErrors={clearErrors}
                mapTitle={t('meetingLocation')}
                initialLat={watch('latitude')}
                initialLng={watch('longitude')}
                hideMapAddon
              />
            </>
          )}
        </SimpleGrid>

        <Flex w='full' justify='flex-end' pb={5} pr={5} gap={3} mt='6'>
          <Button
            variant='outline'
            onClick={() => handleClose(false)}
            colorScheme='pink'
            borderColor='#8D0247'
            color='#8D0247'
            h='47px'
            px='18px'
            borderRadius='48px'
            fontSize='18px'
            fontWeight='400'
          >
            <BsXCircle style={{ marginRight: '6px', width: '24px', height: '24px' }} /> {t('cancel')}
          </Button>
          <Button
            type='submit'
            variant='solid'
            colorScheme='pink'
            bg='#8D0247'
            h='47px'
            px='18px'
            borderRadius='48px'
            fontSize='18px'
            fontWeight='400'
          >
            {t('done')} <Icons.BsArrowRightCircle style={{ marginLeft: '6px', width: '24px', height: '24px' }} />
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

export default NewMeeting;
