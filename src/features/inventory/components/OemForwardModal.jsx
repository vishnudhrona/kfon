import {
  Box,
  Button,
  FormController,
  HStack,
  Input,
  InputGroup,
  Popup,
  Spinner,
  Text,
  useForm,
  VStack
} from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { SearchIcon } from '@/components/custom';
import { validation } from '@/utils/validationUtils';

import { fetchAllRoles, fetchUsersByRoleId, submitOemForward } from '../actions';
import { getAllRoles, getUsersByRoleId } from '../selectors';
import ModalActionButtons from './ModalActionButtons';

const INITIAL_COLORS = ['#F1DEEC', '#DFCDE5', '#F3E2C8', '#FEEFC3', '#FCEBB6'];

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const getInitialColor = (index) => INITIAL_COLORS[index % INITIAL_COLORS.length];

const OemForwardModal = ({ isOpen, onClose, onSuccess, device, note, attachment }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pleaseSelect } = validation(t);

  const roles = useSelector(getAllRoles) || [];
  const roleUsers = useSelector(getUsersByRoleId) || [];
  const isUsersLoading = false;

  const [selectedUserId, setSelectedUserId] = useState('');
  const [userError, setUserError] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const { control, watch, handleSubmit } = useForm({ defaultValues: { roleId: '' } });

  const watchedRole = watch('roleId');
  const watchedRoleId = watchedRole?.id ?? watchedRole;

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllRoles());
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (watchedRoleId) {
      setSelectedUserId('');
      dispatch(fetchUsersByRoleId({ roleId: watchedRoleId }));
    }
  }, [watchedRoleId, dispatch]);

  const handleClose = () => {
    setSelectedUserId('');
    setUserError('');
    setUserSearch('');
    onClose();
  };

  const onSubmit = () => {
    if (!selectedUserId) {
      setUserError(pleaseSelect('user'));
      return;
    }
    setUserError('');

    dispatch(
      submitOemForward({
        type: 'REQUEST',
        deviceId: device?.slNo,
        note,
        attachment,
        forwardUserId: selectedUserId,
        onSuccess
      })
    );
  };

  const filteredUsers = userSearch
    ? roleUsers.filter((u) =>
        (u.empName ?? u.username ?? u.userName ?? u.name ?? '').toLowerCase().includes(userSearch.toLowerCase())
      )
    : roleUsers;

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={(e) => {
        if (!e.open) handleClose();
      }}
      title={t('forward')}
      closeButton={false}
      initialFocusEl={null}
      width='720px'
      maxWidth='720px'
      borderRadius='12px'
    >
      <Box px={4} pb={4} pt={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align='stretch'>
          <FormController
            name='roleId'
            labelName={t('role')}
            type='select'
            items={roles.map((r) => ({ id: r.id, name: r.roleName || r.name || r.id }))}
            placeholder={t('choose', { 0: t('role') })}
            control={control}
            errors={{}}
            required
          />

          <Box border='1px solid #E5E7EB' borderRadius='12px' p={3} bg='#F9FAFB'>
            <InputGroup startElement={<SearchIcon color='gray.400' width='4' height='6' />} width='100%' mb={3}>
              <Input
                height='40px'
                placeholder={t('search')}
                borderRadius='md'
                bg='white'
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </InputGroup>

            <Box maxH='280px' overflowY='auto'>
              {isUsersLoading ? (
                <HStack justify='center' py={6}>
                  <Spinner size='md' color='primary.500' />
                </HStack>
              ) : filteredUsers.length === 0 ? (
                <Text fontSize='sm' color='gray.400' textAlign='center' py={4}>
                  {watchedRoleId ? t('noRecordsFound') : t('selectRoleFirst')}
                </Text>
              ) : (
                <VStack align='stretch' spacing={2}>
                  {filteredUsers.map((u, idx) => {
                    const userId = u.userId ?? u.id;
                    const isSelected = selectedUserId === userId;
                    const name = u.empName ?? u.username ?? u.userName ?? u.name ?? '';
                    const designation = u.designation ?? u.roleName ?? '';
                    const district = u.district ?? '';
                    const roleInfo = [designation, district].filter(Boolean).join(', ');

                    return (
                      <HStack
                        key={userId ?? idx}
                        py={3}
                        px={3}
                        bg={isSelected ? '#E3EFE8' : 'white'}
                        borderRadius='md'
                        justify='space-between'
                        align='center'
                      >
                        <HStack spacing={3}>
                          <Box
                            w='40px'
                            h='40px'
                            borderRadius='full'
                            bg={getInitialColor(idx)}
                            display='flex'
                            alignItems='center'
                            justifyContent='center'
                          >
                            <Text fontWeight='semibold' color='#C2A060'>
                              {getInitials(name)}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontWeight='semibold' fontSize='md' color='gray.800'>
                              {name}
                            </Text>
                            <Text fontSize='sm' color={isSelected ? 'teal.700' : 'gray.500'}>
                              {roleInfo}
                            </Text>
                          </Box>
                        </HStack>
                        <Button
                          bg={isSelected ? 'primary.500' : 'transparent'}
                          color={isSelected ? 'white' : 'primary.500'}
                          border='1px solid'
                          borderColor='primary.500'
                          size='sm'
                          h='35px'
                          borderRadius='md'
                          w={isSelected ? '120px' : '90px'}
                          _hover={{ bg: isSelected ? 'primary.600' : 'rgba(141, 2, 71, 0.04)' }}
                          onClick={() => setSelectedUserId(isSelected ? '' : userId)}
                        >
                          {isSelected ? t('selected') : t('select')}
                        </Button>
                      </HStack>
                    );
                  })}
                </VStack>
              )}
            </Box>

            {userError && (
              <Text fontSize='xs' color='red.500' mt={2}>
                {userError}
              </Text>
            )}
          </Box>
        </VStack>

        <ModalActionButtons onClose={handleClose} submitLabel='submit' />
        </form>
      </Box>
    </Popup>
  );
};

export default OemForwardModal;
