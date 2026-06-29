import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormController, HStack, Popup, SimpleGrid, useForm } from '@kfonbss/bss-ui-components';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Close, Save } from '@/components/custom';

import { createUserSubmit, fetchDesignation, resetUserRoleForm, updateUserSubmit } from '../action';
import { EMPLOYEE_TITLE_OPTIONS } from '../constants';
import { getDesignation } from '../selector';
import { createUserValidation } from '../validation';

const CreateUser = ({ open, setOpen, createUserSubmit, updateUserSubmit, user, resetUserRoleForm, fetchDesignation, getDesignationData }) => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    resolver: yupResolver(createUserValidation(t)),
    mode: 'onTouched'
  });

  const sortedDesignations = useMemo(() => {
    return getDesignationData ? [...getDesignationData].sort((a, b) => (a.name || '').localeCompare(b.name || '')) : [];
  }, [getDesignationData]);

  useEffect(() => {
    if (user && (user?.userId || user?.id)) {
      reset({
        title: EMPLOYEE_TITLE_OPTIONS.find((item) => item.value === user?.empTitle) || null,
        employeeName: user?.empName,
        emailId: user?.email,
        mobileNumber: user?.mobile,
        designation: getDesignationData?.find((item) => item.name === user.designationName) || (user.designationName || user.designation ? { name: user.designationName || user.designation } : null),
        userName: user?.username,
        active: user?.active ? 'active' : 'inactive',
        remarks: user?.remarks
      });
    } else {
      reset({
        title: null,
        employeeName: '',
        emailId: '',
        mobileNumber: '',
        designation: null,
        userName: '',
        active: 'active',
        remarks: ''
      });
    }
  }, [user, reset, getDesignationData]);

  useEffect(() => {
    fetchDesignation();
  }, [fetchDesignation]);

  const onSubmit = (data) => {
    const payload = {
      empName: data.employeeName,
      empTitle: data.title?.value,
      email: data.emailId,
      mobile: data.mobileNumber,
      designationId: data.designation?.id,
      userType: 'EMPLOYEE',
      username: data.userName,
      remarks: data.remarks,
      active: data?.active === 'active' ? true : false,
      onSuccess: () => {
        setOpen(false);
        reset();
        resetUserRoleForm();
      }
    };

    if (user && (user?.userId || user?.id)) {
      updateUserSubmit({ ...payload, id: user?.userId || user?.id });
    } else {
      createUserSubmit(payload);
    }
  };

  return (
    <Popup title={user && (user?.userId || user?.id) ? t('updateUser') : t('createUser')} size='xl' isOpen={open} onOpenChange={setOpen} placement='center'>
      <Box as={'form'} alignItems='stretch' gap={5} p={6} onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={2} rowGap={5} columnGap={14} mb={5}>
          <FormController
            placeholder={t('enter', { 0: t('title') })}
            labelName={t('employeeTitle')}
            name='title'
            control={control}
            errors={errors}
            minLength={3}
            maxLength={100}
            type='select'
            items={EMPLOYEE_TITLE_OPTIONS}
            required
          />  

          <FormController
            placeholder={t('enter', { 0: t('employeeName') })}
            labelName={t('employeeName')}
            name='employeeName'
            control={control}
            errors={errors}
            minLength={3}
            maxLength={100}
            required
            handleKeyDown={(e) => {
              const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
              const isAlpha = /^[a-zA-Z]$/.test(e.key);
              const isSpace = e.key === ' ';
              const isDot = e.key === '.';

              if (!allowedKeys.includes(e.key) && !isAlpha && !isSpace && !isDot) {
                e.preventDefault();
                return;
              }

              const val = e.target.value;
              const selectionStart = e.target.selectionStart;

              if ((isSpace || isDot) && selectionStart === 0) {
                e.preventDefault();
                return;
              }

              if (isDot && val.includes('.')) {
                e.preventDefault();
                return;
              }

              if (isSpace && val.charAt(selectionStart - 1) === ' ') {
                e.preventDefault();
                return;
              }
            }}
          />

          <FormController
            placeholder={t('enter', { 0: t('emailId') })}
            labelName={t('employeeEmailId')}
            name='emailId'
            control={control}
            errors={errors}
            minLength={3}
            maxLength={100}
            required
          />

          <FormController
            placeholder={t('enter', { 0: t('mobileNumber') })}
            labelName={t('employeeMobileNumber')}
            name='mobileNumber'
            control={control}
            errors={errors}
            required
            maxLength={10}
            handleKeyDown={(e) => {
              const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
              if (!allowedKeys.includes(e.key) && !/^\d$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />

          <FormController
            placeholder={t('enter', { 0: t('designation') })}
            labelName={t('designation')}
            name='designation'
            control={control}
            errors={errors}
            minLength={3}
            maxLength={100}
            type='select'
            items={sortedDesignations}
            required
          />



          <FormController
            placeholder={t('enter', { 0: t('userName') })}
            labelName={t('userName')}
            name='userName'
            control={control}
            errors={errors}
            minLength={3}
            maxLength={100}
            disabled={user && (user?.userId || user?.id)}
            required
          />

          <FormController
            labelName={t('status')}
            name='active'
            control={control}
            errors={errors}
            type="radio"
            items={[
              { label: t('active'), value: 'active' },
              { label: t('inactive'), value: 'inactive' }
            ]}
            required
          />

        </SimpleGrid>

        <FormController
          placeholder={t('enter', { 0: t('remarks') })}
          labelName={t('remarks')}
          name='remarks'
          control={control}
          errors={errors}
          type='textArea'
          size='lg'
          resize={'vertical'}
          minLength={5}
          maxLength={100}
          required
        />

        <HStack justifyContent={'flex-end'} mt={8}>
          <Button
            variant='outline'
            onClick={() => {
              setOpen(false);
              reset();
              resetUserRoleForm();
            }}
          >
            <Close />
            {t('close')}
          </Button>

          <Button type='submit'>
            {user && (user?.userId || user?.id) ? t('update') : t('submit')}
            <Save />
          </Button>
        </HStack>
      </Box>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  getDesignationData: getDesignation(state)
});

const mapDispatchToProps = {
  createUserSubmit: createUserSubmit,
  updateUserSubmit: updateUserSubmit,
  resetUserRoleForm: resetUserRoleForm,
  fetchDesignation: fetchDesignation
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
