import {
  Box,
  Button,
  FormController,
  HStack,
  Icons,
  Input,
  InputGroup,
  Text,
  VStack
} from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { SearchIcon } from '@/components/custom';

import { getForwardInitialColor, getInitials } from './notesUtils';

const ForwardPanel = ({
  forwardControl,
  roles,
  roleUsers,
  forwardUserSearch,
  onForwardUserSearchChange,
  forwardSelectedUserId,
  onForwardUserSelect,
  forwardUserError,
  watchedRoleId
}) => {
  const { t } = useTranslation();

  const filteredUsers = forwardUserSearch
    ? roleUsers.filter((u) =>
        (u.empName ?? u.username ?? u.userName ?? u.name ?? '').toLowerCase().includes(forwardUserSearch.toLowerCase())
      )
    : roleUsers;

  return (
    <Box
      flex={1}
      border='1px solid #E7E7E7'
      borderRadius='12px'
      bg='white'
      h='381px'
      overflow='hidden'
      display='flex'
      flexDirection='column'
      p={3}
    >
      <FormController
        name='roleId'
        labelName={t('role')}
        type='select'
        items={roles.map((r) => ({ id: r.id, name: r.roleName || r.name || r.id }))}
        placeholder={t('choose', { 0: t('role') })}
        control={forwardControl}
        errors={{}}
        required
      />

      <Box
        border='1px solid #E5E7EB'
        borderRadius='12px'
        p={3}
        bg='#F9FAFB'
        mt={3}
        flex={1}
        overflow='hidden'
        display='flex'
        flexDirection='column'
      >
        <InputGroup startElement={<SearchIcon color='gray.400' width='4' height='6' />} width='100%' mb={3}>
          <Input
            height='40px'
            placeholder={t('search')}
            borderRadius='md'
            bg='white'
            value={forwardUserSearch}
            onChange={(e) => onForwardUserSearchChange(e.target.value)}
          />
        </InputGroup>

        <Box flex={1} overflowY='auto'>
          {filteredUsers.length === 0 ? (
            <Text fontSize='sm' color='gray.400' textAlign='center' py={4}>
              {watchedRoleId ? t('noRecordsFound') : t('selectRoleFirst')}
            </Text>
          ) : (
            <VStack align='stretch' spacing={2}>
              {filteredUsers.map((u, idx) => {
                const userId = u.userId ?? u.id;
                const isSelected = forwardSelectedUserId === userId;
                const name = u.empName ?? u.username ?? u.userName ?? u.name ?? '';
                const designation = u.designation ?? u.roleName ?? '';
                const district = u.district ?? '';
                const roleInfo = [designation, district].filter(Boolean).join(', ');

                return (
                  <HStack
                    key={userId ?? idx}
                    py={3}
                    px={3}
                    bg={isSelected ? '#FFFBEB' : 'white'}
                    borderRadius='md'
                    justify='space-between'
                    align='center'
                    cursor='pointer'
                    onClick={() => onForwardUserSelect(isSelected ? '' : userId)}
                  >
                    <HStack spacing={3}>
                      <Box
                        w='40px'
                        h='40px'
                        borderRadius='full'
                        bg={getForwardInitialColor(idx)}
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
                        <Text fontSize='sm' color='primary.500'>
                          {roleInfo}
                        </Text>
                      </Box>
                    </HStack>
                    <Button
                      bg={isSelected ? '#FFDE74' : 'transparent'}
                      color={isSelected ? '#1A1A1A' : 'primary.500'}
                      border='1px solid'
                      borderColor={isSelected ? '#FFDE74' : 'primary.500'}
                      size='sm'
                      h='35px'
                      borderRadius='md'
                      w={isSelected ? '120px' : '90px'}
                      _hover={{ bg: isSelected ? '#F5D060' : 'rgba(141, 2, 71, 0.04)' }}
                    >
                      {isSelected ? (
                        <HStack spacing={1}>
                          <Icons.TickTrueIcon color={'black'} boxSize={4} sx={{ '& path': { stroke: '#1A1A1A' } }} />
                          <Text>{t('selected')}</Text>
                        </HStack>
                      ) : (
                        t('select')
                      )}
                    </Button>
                  </HStack>
                );
              })}
            </VStack>
          )}
        </Box>

        {forwardUserError && (
          <Text fontSize='xs' color='red.500' mt={2}>
            {forwardUserError}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default ForwardPanel;
