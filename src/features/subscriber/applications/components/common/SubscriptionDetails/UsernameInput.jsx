import { Box, Controller, Icons, Input, InputGroup, Text } from '@kfonbss/bss-ui-components';
import { debounce } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { checkUsernameAvailability } from '@/features/common/actions';
import { getCheckUsernameAvailability } from '@/features/common/selectors';
import { actions as commonActions } from '@/features/common/slice';
import { isUsernameFormatValid, USERNAME_MAX_LENGTH } from '@/utils/validationUtils';

import { USERNAME_CHECK_DEBOUNCE_MS } from '../../../constants';
import { BASIC_DETAILS_FORM, PRE_TEXT } from '../constants';

const { BsCheckCircle, BsXCircle } = Icons;

const sanitizeUsername = (val) =>
  val
    .replace(/^\s+/, '')
    .replace(/[^a-zA-Z0-9._@]/g, '')
    .slice(0, USERNAME_MAX_LENGTH);

const UsernameInput = ({ control, setValue, desiredUsername, setDesiredUsername }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const usernameAvailability = useSelector(getCheckUsernameAvailability);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const lastCheckedRef = useRef(desiredUsername || '');
  const hasUserInteractedRef = useRef(false);

  useEffect(() => {
    if (!hasUserInteractedRef.current) {
      lastCheckedRef.current = desiredUsername || '';
    }
  }, [desiredUsername]);

  const triggerAvailabilityCheck = (username) => {
    lastCheckedRef.current = username;
    setIsCheckingAvailability(true);
    dispatch(checkUsernameAvailability({ username: `${PRE_TEXT}${username}` }));
  };

  const triggerRef = useRef(triggerAvailabilityCheck);
  triggerRef.current = triggerAvailabilityCheck;

  const debouncedCheckAvailability = useRef(
    debounce((username) => triggerRef.current(username), USERNAME_CHECK_DEBOUNCE_MS)
  ).current;

  useEffect(() => {
    return () => debouncedCheckAvailability.cancel();
  }, [debouncedCheckAvailability]);

  useEffect(() => {
    if (usernameAvailability !== null) {
      setIsCheckingAvailability(false);
    }
  }, [usernameAvailability]);

  const handleUsernameChange = (e, fieldOnChange) => {
    const value = sanitizeUsername(e.target.value);
    if (value === desiredUsername) return;
    hasUserInteractedRef.current = true;
    setDesiredUsername(value);
    fieldOnChange(value);
    if (isUsernameFormatValid(value)) {
      debouncedCheckAvailability(value);
    } else {
      debouncedCheckAvailability.cancel();
      dispatch(commonActions.clearUsernameAvailability());
    }
  };

  const handleUsernameBlur = (fieldOnBlur) => {
    fieldOnBlur();
    setValue('desiredUserName', desiredUsername);
    debouncedCheckAvailability.cancel();
    if (!isUsernameFormatValid(desiredUsername)) {
      dispatch(commonActions.clearUsernameAvailability());
      return;
    }
    if (desiredUsername === lastCheckedRef.current) return;
    triggerAvailabilityCheck(desiredUsername);
  };

  const showAvailability =
    isUsernameFormatValid(desiredUsername) && !isCheckingAvailability && usernameAvailability !== null;

  return (
    <Box>
      <Text mb={2} fontSize='sm' fontWeight='medium'>
        {t(BASIC_DETAILS_FORM.fieldLabels.subscriptionDetails.desiredUserName)}{' '}
        <Text as='span' color='red.500'>
          *
        </Text>
      </Text>
      <Controller
        name='desiredUserName'
        control={control}
        render={({ field, fieldState }) => (
          <>
            <InputGroup
              startAddon={<Text>{PRE_TEXT}</Text>}
              startAddonProps={{
                bg: 'gray.100',
                color: 'gray.600',
                fontWeight: 'medium',
                display: 'flex',
                alignItems: 'center',
                px: 3
              }}
            >
              <Box position='relative' w='full'>
                <Input
                  placeholder={t('enter', {
                    0: t(BASIC_DETAILS_FORM.fieldLabels.subscriptionDetails.desiredUserName)
                  })}
                  value={desiredUsername || ''}
                  onChange={(e) => handleUsernameChange(e, field.onChange)}
                  onBlur={() => handleUsernameBlur(field.onBlur)}
                  maxLength={USERNAME_MAX_LENGTH}
                  pr={10}
                />
                {isCheckingAvailability && (
                  <Box position='absolute' right={3} top='50%' transform='translateY(-50%)'>
                    <Text fontSize='sm' color='gray.500'>
                      {t('checkingAvailability')}
                    </Text>
                  </Box>
                )}
                {showAvailability && (
                  <Box position='absolute' right={3} top='50%' transform='translateY(-50%)'>
                    {usernameAvailability ? (
                      <BsCheckCircle color='green' size={20} />
                    ) : (
                      <BsXCircle color='red' size={20} />
                    )}
                  </Box>
                )}
              </Box>
            </InputGroup>
            {fieldState.error && (
              <Text mt={1} fontSize='12px' color='red.500'>
                {fieldState.error.message}
              </Text>
            )}
            {!fieldState.error && showAvailability && (
              <Text mt={1} fontSize='sm' color={usernameAvailability ? 'green.600' : 'red.600'}>
                {usernameAvailability ? t('usernameAvailable') : t('usernameTaken')}
              </Text>
            )}
          </>
        )}
      />
    </Box>
  );
};

export default UsernameInput;
