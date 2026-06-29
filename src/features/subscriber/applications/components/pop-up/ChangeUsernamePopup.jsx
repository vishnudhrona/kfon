import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Controller, Flex, Icons, Input, InputGroup, Popup, Text, useForm } from '@kfonbss/bss-ui-components';
import { debounce } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { checkUsernameAvailability } from '@/features/common/actions';
import { getCheckUsernameAvailability } from '@/features/common/selectors';
import { actions as commonActions } from '@/features/common/slice';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { isUsernameFormatValid, USERNAME_MAX_LENGTH } from '@/utils/validationUtils';

import { API_ACTION_TYPES, changeUsername } from '../../actions';
import { USERNAME_CHECK_DEBOUNCE_MS } from '../../constants';
import { changeUsernameSchema } from '../../validation';
import { PRE_TEXT } from '../common/constants';

const { BsCheckCircle, BsXCircle } = Icons;

// Editable part only — the fixed PRE_TEXT prefix lives in the input addon, not the value.
const sanitizeUsername = (val) =>
  val.replace(/^\s+/, '').replace(/[^a-zA-Z0-9._@]/g, '').slice(0, USERNAME_MAX_LENGTH);

// currentUsername arrives prefixed (e.g. 'bss.abc'); only the part after the first '.' is editable.
const toSuffix = (full) => {
  const u = full || '';
  const i = u.indexOf('.');
  return i === -1 ? u : u.slice(i + 1);
};

const ChangeUsernamePopup = ({ isOpen, onClose, subscriberId, currentUsername }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentSuffix = toSuffix(currentUsername);
  const validationSchema = useMemo(() => changeUsernameSchema(t), [t]);
  const isSaving = useSelector((state) => !!getApiProgress(state)[API_ACTION_TYPES.CHANGE_USERNAME]);
  const availability = useSelector(getCheckUsernameAvailability); // null=unknown, true=available, false=taken
  const [checking, setChecking] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { username: currentSuffix }
  });

  const usernameValue = watch('username');

  const triggerCheck = useRef((suffix) => {
    setChecking(true);
    dispatch(checkUsernameAvailability({ username: `${PRE_TEXT}${suffix}` }));
  });
  const debouncedCheck = useRef(debounce((suffix) => triggerCheck.current(suffix), USERNAME_CHECK_DEBOUNCE_MS)).current;

  useEffect(() => () => debouncedCheck.cancel(), [debouncedCheck]);

  useEffect(() => {
    if (availability !== null) setChecking(false);
  }, [availability]);

  // Run availability check as the user types (skip if unchanged from current)
  useEffect(() => {
    if (!isOpen) return;
    if (!usernameValue || usernameValue === currentSuffix || !isUsernameFormatValid(usernameValue)) {
      debouncedCheck.cancel();
      dispatch(commonActions.clearUsernameAvailability());
      setChecking(false);
      return;
    }
    setChecking(true);
    debouncedCheck(usernameValue);
  }, [usernameValue, currentSuffix, isOpen, debouncedCheck, dispatch]);

  useEffect(() => {
    if (isOpen) {
      reset({ username: currentSuffix });
      dispatch(commonActions.clearUsernameAvailability());
    }
  }, [isOpen, currentSuffix, reset, dispatch]);

  const handleClose = () => {
    reset();
    dispatch(commonActions.clearUsernameAvailability());
    onClose();
  };

  const onSubmit = ({ username }) => {
    dispatch(changeUsername({ id: subscriberId, username: `${PRE_TEXT}${username}`, onSuccess: handleClose }));
  };

  const unchanged = usernameValue === currentSuffix;
  const showStatus = isUsernameFormatValid(usernameValue) && !unchanged && !checking && availability !== null;
  const saveDisabled = unchanged || checking || availability === false || !isUsernameFormatValid(usernameValue);

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={handleClose}
      title={t('changeUsername')}
      closeButton
      closeOnInteractOutside={false}
      size='sm'
    >
      <Box as='form' onSubmit={handleSubmit(onSubmit)} p={5} display='flex' flexDir='column' gap='16px'>
        <Box>
          <Text mb={2} fontSize='sm' fontWeight='medium'>
            {t('username')}{' '}
            <Text as='span' color='red.500'>
              *
            </Text>
          </Text>
          <Controller
            name='username'
            control={control}
            render={({ field }) => (
              <InputGroup
                startAddon={<Text>{PRE_TEXT}</Text>}
                startAddonProps={{ bg: 'gray.100', color: 'gray.600', fontWeight: 'medium', display: 'flex', alignItems: 'center', px: 3 }}
              >
                <Input
                  placeholder={t('enterUsername')}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(sanitizeUsername(e.target.value))}
                  onBlur={field.onBlur}
                  maxLength={USERNAME_MAX_LENGTH}
                />
              </InputGroup>
            )}
          />
          {errors.username && (
            <Text mt={1} fontSize='12px' color='red.500'>
              {errors.username.message}
            </Text>
          )}
        </Box>

        {checking && (
          <Text fontSize='sm' color='gray.500'>
            {t('checkingAvailability')}
          </Text>
        )}
        {showStatus && (
          <Flex align='center' gap={1.5} color={availability ? 'green.600' : 'red.600'}>
            {availability ? <BsCheckCircle boxSize='16px' /> : <BsXCircle boxSize='16px' />}
            <Text fontSize='sm'>{availability ? t('usernameAvailable') : t('usernameTaken')}</Text>
          </Flex>
        )}

        <Flex justify='flex-end' gap={3} mt={2}>
          <Button variant='outline' type='button' onClick={handleClose}>
            {t('cancel')}
          </Button>
          <Button variant='solid' type='submit' loading={isSaving} disabled={saveDisabled}>
            {t('save')}
          </Button>
        </Flex>
      </Box>
    </Popup>
  );
};

export default ChangeUsernamePopup;
