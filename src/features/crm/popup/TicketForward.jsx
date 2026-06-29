import { yupResolver } from '@hookform/resolvers/yup';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormController,
  HStack,
  Popup,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { debounce, get } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';

import { TickTrueIcon } from '@/components/custom';
import SearchInput from '@/components/custom/SearchInput';
import { fetchRoleUsers } from '@/features/corporate/action';
import { getForwardRoleUsers } from '@/features/corporate/selector';
import { fetchPartnerList } from '@/features/finance/revenueShare/action';
import { getPartnerLnpList } from '@/features/finance/revenueShare/selector';
import { fetchUsersByRoleId } from '@/features/inventory/actions';
import { getUsersByRoleId } from '@/features/inventory/selectors';
import { fetchAllRole } from '@/features/user-role/action';
import { getAllRole } from '@/features/user-role/selector';

import {
  closedTicketNotification,
  fetchPreviousEmployee,
  fetchRoleByTicketId,
  fetchRoleName,
  fetchUpdateState,
  forwardTicket,
  returnTicket,
  returnToCustodian
} from '../action';
import { CLOSED, LNP, REOPEN, RETURN, UPDATE_STATE_OPTIONS } from '../constants';
import { getPreviousEmployee, getRoleByTicketId, getUpdateState } from '../selector';
import { ticketForwardValidation } from '../validation';

const TicketForward = ({
  isOpen,
  setIsOpen,
  updateState,
  fetchUpdateState,
  ticketId,
  forwardTicket,
  fetchPartnerList,
  partnerList,
  returnTicket,
  fetchRoleUsers,
  fetchUsersByRoleId,
  getUsersByRoleId,
  returnToCustodian,
  closedTicketNotification,
  fetchRoleByTicketId,
  roleByTicketId,
  fetchPreviousEmployee,
  previousEmployee,
  note,
  fileId,
  visibility
}) => {
    
  const pendingUserIdRef = useRef(null);

  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const user = useSelector((state) => get(state['authentication'], 'loginDetails.data'));

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(ticketForwardValidation(t))
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSearchQuery('');
    }
  }, [isOpen, reset]);

  const type = watch('type');
  const selectedUser = watch('selectedUser');
  const action = watch('action');
  const status = watch('status');

  useEffect(() => {
    setValue('type', null);
    setValue('selectedUser', null);
    pendingUserIdRef.current = null;
  }, [action?.code, setValue]);

  useEffect(() => {
    if (ticketId) {
      fetchPreviousEmployee({ ticketId: ticketId });
    }
  }, [ticketId, fetchPreviousEmployee]);

  useEffect(() => {
    if (action?.code === RETURN && previousEmployee?.length > 0 && roleByTicketId?.length > 0) {
      const prev = previousEmployee[0];
      const matchedRole = roleByTicketId.find((r) => r.id === prev.roleId || r.name === prev.roleName);
      if (matchedRole) {
        setValue('type', matchedRole, { shouldValidate: true });
        pendingUserIdRef.current = prev.userId;
      }
    }
  }, [action?.code, previousEmployee, roleByTicketId, setValue]);

  useEffect(() => {
    if (pendingUserIdRef.current && getUsersByRoleId?.length > 0) {
      const matchedUser = getUsersByRoleId.find((u) => u.id === pendingUserIdRef.current);
      if (matchedUser) {
        setValue('selectedUser', matchedUser, { shouldValidate: true });
        pendingUserIdRef.current = null;
      }
    }
  }, [getUsersByRoleId, setValue]);

  const filteredStatusOptions = useMemo(() => {
    return UPDATE_STATE_OPTIONS.filter((option) => option.label !== REOPEN && option.label !== 'UNASSIGNED');
  }, []);

  const filteredUpdateState = useMemo(() => {
    if (previousEmployee?.length === 0) {
      return updateState?.filter((option) => option.code !== RETURN);
    }
    return updateState;
  }, [updateState, previousEmployee]);

  const filteredRoleByTicketId = useMemo(() => {
    if (!roleByTicketId) return [];
    return roleByTicketId.filter((role) => role.name !== user?.username);
  }, [roleByTicketId, user?.username]);

  useEffect(() => {
    if (ticketId) {
      fetchRoleByTicketId({ ticketId: ticketId });
    }
    fetchRoleUsers();
    fetchUpdateState();
  }, [ticketId, fetchRoleByTicketId, fetchRoleUsers, fetchUpdateState]);

  useEffect(() => {
    if (type?.value === LNP) {
      fetchPartnerList({ type: LNP });
    } else if (type) {
      fetchRoleName({ roleName: type?.name });
      fetchUsersByRoleId({ roleId: type?.id });
    }
  }, [type, fetchPartnerList, fetchUsersByRoleId]);

  const handleSearch = useMemo(
    () =>
      debounce((e) => {
        setSearchQuery(e.target.value);
      }, 500),
    []
  );

  const filteredRoleNames =
    type?.value === LNP
      ? partnerList
          ?.filter((partner) => partner?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()))
          ?.map((p) => ({ ...p, name: p.displayName }))
      : getUsersByRoleId?.filter(
          (role) =>
            (role?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              role?.code?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            role?.id !== user?.userId
        );

  const onSubmit = (data) => {
    let payload = {};
    if (action?.code === RETURN) {
      payload = {
        ticketId: ticketId,
        status: 'RETURNED',
        state: data?.status?.label,
        note: note,
        fileIds: fileId,
        visibility: visibility,
        onSuccess: () => setIsOpen(false)
      };

      returnTicket(payload);
    } else if (status?.label === CLOSED) {
      payload = {
        ticketId: ticketId,
        status: data?.status?.label,
        note: note,
        fileIds: fileId,
        visibility: visibility,
        onSuccess: () => setIsOpen(false)
      };
      returnToCustodian(payload);
      closedTicketNotification(ticketId);
    } else {
      payload = {
        status: data?.status?.label,
        action: data?.action?.code,
        type: data?.type?.value,
        assignedToName: data?.selectedUser?.name,
        assignedToUser: type?.value === LNP ? data?.selectedUser?.userId : data?.selectedUser?.id,
        ticketId: ticketId,
        note: note,
        fileIds: fileId,
        visibility: visibility,
        onSuccess: () => setIsOpen(false)
      };
      forwardTicket(payload);
    }
  };
  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={
        <HStack fontSize='24px' fontWeight='600'>
          <Text>{t('forward')}</Text>
          <Text color='#FD1C7A'>{t('ticket')}</Text>
        </HStack>
      }
      size={'md'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack align={'stretch'} px={5} gap={3}>
          <FormController
            placeholder={t('enter', { 0: t('updateStatus') })}
            labelName={t('status')}
            name='status'
            control={control}
            errors={errors}
            type='select'
            items={filteredStatusOptions}
            required
          />

          {status?.label !== CLOSED && (
            <>
              <FormController
                placeholder={t('choose', { 0: t('action') })}
                labelName={t('action')}
                name='action'
                control={control}
                errors={errors}
                type='select'
                options={filteredUpdateState}
                required
              />

              <FormController
                placeholder={t('choose', { 0: t('category') })}
                labelName={t('category')}
                name='type'
                control={control}
                errors={errors}
                type='select'
                options={filteredRoleByTicketId}
                required
              />

              {type && (
                <Box bg={'#F8F8F8'} borderRadius={'12px'} p={3} mt={2}>
                  <SearchInput
                    placeholder={t('search')}
                    onChange={handleSearch}
                    width={'full'}
                    border={'1px solid #DEE4ED'}
                    height={'40px'}
                    bg={'white'}
                  />
                  <Box height={'200px'} overflow={'auto'}>
                    {filteredRoleNames?.map((value, index) => (
                      <Flex
                        key={index}
                        justifyContent={'space-between'}
                        mt={5}
                        bg={selectedUser?.id === value?.id ? 'rgba(255, 222, 116, 0.33)' : ''}
                        borderRadius={'lg'}
                        p={2}
                        cursor={'pointer'}
                        onClick={() => setValue('selectedUser', value, { shouldValidate: true })}
                        _hover={{ bg: selectedUser?.id === value?.id ? 'rgba(255, 222, 116, 0.33)' : 'gray.100' }}
                      >
                        <Flex alignItems={'center'}>
                          <Avatar.Root
                            bg={selectedUser?.id === value?.id ? 'white' : '#F3E2C8'}
                            color={'#bb8d43ff'}
                            size='md'
                            mr={3}
                          >
                            <Avatar.Fallback name={value?.name} />
                          </Avatar.Root>
                          <Box flex='1'>
                            <Text fontSize='16px' fontWeight='600'>
                              {value?.code}({value?.name})
                            </Text>
                            <Text fontSize='12px' color='gray.500'>
                              {value?.nameInLocal}
                            </Text>
                          </Box>
                        </Flex>
                        <Button
                          mt={1}
                          height={'34px'}
                          borderRadius={'lg'}
                          bg={selectedUser?.id === value.id && '#FFDE74'}
                          color={selectedUser?.id === value.id ? 'black' : 'primary.500'}
                          variant={'outline'}
                          border={selectedUser?.id === value.id && 'none'}
                          pointerEvents={'none'}
                        >
                          {selectedUser?.id === value.id ? (
                            <>
                              <TickTrueIcon color={'black'} />
                              {t('selected')}
                            </>
                          ) : (
                            t('btnSelect')
                          )}
                        </Button>
                      </Flex>
                    ))}
                  </Box>
                  {errors?.selectedUser && (
                    <Text color='red.500' fontSize='sm'>
                      {errors.selectedUser.message}
                    </Text>
                  )}
                </Box>
              )}
            </>
          )}

          <Flex gap={2} justifyContent={'flex-end'} mt={5}>
            <Button variant={'outline'} height={'40px'} onClick={() => setIsOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type='submit' height={'40px'}>
              {t('submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </Popup>
  );
};

const mapStateToProps = (state) => ({
  updateState: getUpdateState(state),
  partnerList: getPartnerLnpList(state),
  allRoles: getAllRole(state),
  roleUsers: getForwardRoleUsers(state),
  getUsersByRoleId: getUsersByRoleId(state),
  roleByTicketId: getRoleByTicketId(state),
  previousEmployee: getPreviousEmployee(state)
});

const mapDispatchToProps = {
  fetchUpdateState,
  fetchRoleName,
  forwardTicket,
  fetchPartnerList,
  returnTicket,
  fetchAllRole,
  fetchRoleUsers,
  fetchUsersByRoleId,
  returnToCustodian,
  closedTicketNotification,
  fetchRoleByTicketId,
  fetchPreviousEmployee
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketForward);
