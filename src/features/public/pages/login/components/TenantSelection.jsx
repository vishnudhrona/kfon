import { Box, Button, HStack, Icons, Input, InputGroup, Text, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { ForwardSvg, NormalBackSvg } from '@/assets/svg';
import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchStates } from '../action';
import { getSelectedTenant, getStates } from '../selector';
import { actions as loginActions } from '../slice';

const { SearchIcon, BsCheckCircle } = Icons;

function TenantSelection() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const states = useSelector(getStates);
  const selectedTenant = useSelector(getSelectedTenant);
  const apiProgress = useSelector(getApiProgress);
  const isLoading = !!apiProgress[ACTION_TYPES.FETCH_STATES];

  // The alphabetic `code` field (e.g. "KL", "PY") is the unique tenant
  // identifier that the backend expects as `X-Tenant-ID` / `tenantId`,
  // so use it as the row key as well.
  const getItemCode = (item) => item?.code || item?.tenantCode || item?.id || item?.stateId;

  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState(getItemCode(selectedTenant) ?? null);

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    const code = getItemCode(selectedTenant);
    if (code) setActiveId(code);
  }, [selectedTenant]);

  const filtered = useMemo(() => {
    const list = Array.isArray(states) ? states : [];
    if (!query.trim()) return list;
    const q = query.trim().toLowerCase();
    return list.filter((s) => (s?.name || s?.stateName || '').toLowerCase().includes(q));
  }, [states, query]);

  const handleSelect = (item) => {
    setActiveId(getItemCode(item));
    dispatch(loginActions.setSelectedTenant(item));
  };

  const handleContinue = () => {
    if (!activeId) return;
    const picked = (Array.isArray(states) ? states : []).find(
      (s) => getItemCode(s) === activeId
    );
    if (picked) dispatch(loginActions.setSelectedTenant(picked));
    navigate({ to: '/auth/login' });
  };

  const handleBack = () => {
    dispatch(loginActions.clearSelectedTenant());
    navigate({ to: '/' });
  };

  return (
    <Box display='flex' flexDir='column'>
      <Text
        fontSize={{ base: '28px', md: '36px' }}
        fontWeight={700}
        textAlign='center'
        color='black'
        m='0 0 8px'
      >
        {t('chooseYourCircle', { defaultValue: 'Choose Your Circle' })}
      </Text>
      <Text
        fontSize='14px'
        color='#6B7280'
        textAlign='center'
        mb='24px'
      >
        {t('chooseCircleSubtitle', {
          defaultValue: 'Select your state to continue with the login'
        })}
      </Text>
      <InputGroup
        startAddon={SearchIcon ? <SearchIcon boxSize='18px' color='#8D0247' /> : null}
        startAddonProps={{ padding: '0 0 0 14px', bg: 'transparent', border: 'none' }}
        bg='white'
        border='1px solid'
        borderColor='gray.200'
        borderRadius='12px'
        h='48px'
        mb='16px'
      >
        <Input
          placeholder={t('searchState', { defaultValue: 'Search state' })}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          border='none'
          outline='none'
          h='48px'
          focusBorderColor='transparent'
          _focus={{ boxShadow: 'none', borderColor: 'transparent', outline: 'none' }}
          _focusVisible={{ boxShadow: 'none', borderColor: 'transparent', outline: 'none' }}
          _hover={{ borderColor: 'transparent' }}
        />
      </InputGroup>

      <CustomLoaderProvider isLoading={isLoading}>
        <Box
          border='1px solid'
          borderColor='gray.200'
          borderRadius='12px'
          overflow='hidden'
          bg='white'
          maxH='320px'
          overflowY='auto'
        >
          {filtered.length === 0 && !isLoading ? (
            <Box py='40px' textAlign='center'>
              <Text fontSize='14px' color='#6B7280'>
                {t('noStatesFound', { defaultValue: 'No states found' })}
              </Text>
            </Box>
          ) : (
            <VStack spacing={0} align='stretch'>
              {filtered.map((item, idx) => {
                const code = getItemCode(item);
                const name = item.name ?? item.stateName ?? '-';
                const isActive = activeId === code;
                return (
                  <Box
                    key={code ?? idx}
                    as='button'
                    type='button'
                    onClick={() => handleSelect(item)}
                    px='20px'
                    py='14px'
                    textAlign='left'
                    cursor='pointer'
                    bg={isActive ? '#8D0247' : 'white'}
                    color={isActive ? 'white' : '#232F50'}
                    transition='background 0.15s ease'
                    _hover={!isActive ? { bg: '#FDF2F8' } : undefined}
                    borderTop={idx > 0 ? '1px solid' : 'none'}
                    borderColor='gray.100'
                  >
                    <HStack justify='space-between' align='center'>
                      <Text fontSize='15px' fontWeight={isActive ? 600 : 500}>
                        {name}
                      </Text>
                      {isActive && BsCheckCircle && <BsCheckCircle boxSize='18px' />}
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </Box>
      </CustomLoaderProvider>

      <Box mt='28px'>
        <Button
          type='button'
          onClick={handleContinue}
          variant='solid'
          width='full'
          disabled={!activeId}
        >
          {t('continue', { defaultValue: 'Continue' })}
          <ForwardSvg />
        </Button>
        <Button
          width='full'
          mt='20px'
          color='black'
          textAlign='center'
          variant='unstyled'
          p={0}
          onClick={handleBack}
        >
          <NormalBackSvg /> {t('back')}
        </Button>
      </Box>
    </Box>
  );
}

export default TenantSelection;
