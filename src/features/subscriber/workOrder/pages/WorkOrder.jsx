import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, Grid, Icons, useForm } from '@kfonbss/bss-ui-components';
import dayjs from 'dayjs';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { dropdownRequired, validation } from '@/utils/validationUtils';

import { createWorkOrder, fetchEwsPackages, fetchWorkOrderList } from '../actions';
import WorkOrderCardList from '../components/WorkOrderCardList';
import { VALIDITY_OPTIONS, WORK_ORDER_TABLE_KEY } from '../constants';
import { getEwsPackages } from '../selectors';

const { BsCheckCircle } = Icons;

const validationSchema = (t) => {
  const v = validation(t);
  return yup.object({
    noOfCustomers: yup
      .number()
      .typeError(v.required('noOfCustomers'))
      .positive(v.minValue('noOfCustomers', 1))
      .integer(v.required('noOfCustomers'))
      .max(100000000, v.maxValue('noOfCustomers', 10))
      .required(v.required('noOfCustomers')),
    serviceStartDate: yup.string().required(v.required('serviceStartDate')),
    validityInMonths: dropdownRequired(v.pleaseSelect('validityInMonths')),
    packageId: dropdownRequired(v.pleaseSelect('packages')),
    remarks: yup.string().required(v.required('remarks'))
  });
};

const WorkOrder = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ewsPackages = useSelector(getEwsPackages);

  const packageItems = (Array.isArray(ewsPackages) ? ewsPackages : []).map((pkg) => {
    const detailString = [
      pkg.speedProfile ? `${pkg.speedProfile} Mbps` : '',
      pkg.validity ? `${pkg.validity} Days` : '',
      pkg.renewalFee ? `₹${pkg.renewalFee}` : ''
    ]
      .filter(Boolean)
      .join(' | ');

    return {
      id: pkg.id,
      name: (pkg.packageName || pkg.packageCode || pkg.name || '') + (detailString ? ` (${detailString})` : '')
    };
  });

  useEffect(() => {
    dispatch(fetchEwsPackages());
  }, [dispatch]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      noOfCustomers: '',
      serviceStartDate: '',
      validityInMonths: '',
      serviceEndDate: '',
      packageId: '',
      remarks: ''
    },
    resolver: yupResolver(validationSchema(t))
  });

  const serviceStartDate = watch('serviceStartDate');
  const validityInMonths = watch('validityInMonths');

  useEffect(() => {
    const months = validityInMonths?.id ?? Number(validityInMonths);
    if (serviceStartDate && months) {
      const endDate = dayjs(serviceStartDate).add(months, 'month').format('YYYY-MM-DD');
      setValue('serviceEndDate', endDate);
    } else {
      setValue('serviceEndDate', '');
    }
  }, [serviceStartDate, validityInMonths, setValue]);

  const onSubmit = useCallback(
    (values) => {
      dispatch(
        createWorkOrder({
          cusCount: Number(values.noOfCustomers),
          packageUuid: values.packageId?.id,
          packageName: values.packageId?.name,
          validity: values.validityInMonths?.id ?? Number(values.validityInMonths),
          serviceSdate: values.serviceStartDate,
          serviceEdate: values.serviceEndDate,
          remarks: values.remarks,
          onSuccess: () => {
            reset();
            dispatch(fetchWorkOrderList({ key: WORK_ORDER_TABLE_KEY, size: 10 }));
          }
        })
      );
    },
    [dispatch, reset]
  );

  return (
    <Box display='flex' flexDirection='column' h='calc(100vh - 120px)' overflow='hidden'>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
        <FormController
          labelName={t('noOfCustomers')}
          name='noOfCustomers'
          placeholder={t('enter', { 0: t('noOfCustomers') })}
          control={control}
          errors={errors}
          required
          type='number'
          handleKeyDown={(e) => {
            if (['e', 'E', '+', '-', '.'].includes(e.key)) {
              e.preventDefault();
            }
            const currentLength = String(e.target.value).replace('.', '').length;
            if (currentLength >= 10 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
              e.preventDefault();
            }
          }}
        />

        <FormController
          labelName={t('packages')}
          name='packageId'
          type='select'
          items={packageItems}
          placeholder={t('choose', { 0: t('packages') })}
          control={control}
          errors={errors}
          required
        />

        <FormController
          labelName={t('validityInMonths')}
          name='validityInMonths'
          type='select'
          items={VALIDITY_OPTIONS}
          placeholder={t('choose', { 0: t('validityInMonths') })}
          control={control}
          errors={errors}
          required
        />

        <FormController
          labelName={t('serviceStartDate')}
          name='serviceStartDate'
          type='date'
          control={control}
          errors={errors}
          required
        />

        <FormController
          labelName={t('serviceEndDate')}
          name='serviceEndDate'
          type='date'
          control={control}
          errors={errors}
          disabled
        />

        <FormController
          labelName={t('remarks')}
          name='remarks'
          placeholder={t('enter', { 0: t('remarks') })}
          control={control}
          errors={errors}
          required
          type='textarea'
        />
      </Grid>

      <Box mt={4} display='flex' justifyContent='flex-end'>
        <Button
          type='submit'
          width='fit-content'
          h='10'
          px='4'
          py='2'
          variant={'solid'}
          onClick={handleSubmit(onSubmit)}
        >
          {t('createWorkorder')}
          <BsCheckCircle />
        </Button>
      </Box>

      {/* Work Order List */}
      <Box flex={1} minH={0} display='flex' flexDirection='column'>
        <WorkOrderCardList />
      </Box>
    </Box>
  );
};

export default WorkOrder;
