import { Popup } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Button, HStack, OtpInput, Text } from '@/components/custom';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { API_ACTION_TYPES, verifyOntAcknowledgement } from '../../actions';

const OntAcknowledgementOtpPopup = ({ isOpen, onClose, subscriberId, otpRefId, onSuccess }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const isVerifying = useSelector((state) => !!getApiProgress(state)[API_ACTION_TYPES.VERIFY_ONT_ACKNOWLEDGEMENT]);

  const handleClose = () => {
    setOtp('');
    setOtpError('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError(t('invalidOtp', { defaultValue: 'Invalid OTP' }));
      return;
    }
    setOtpError('');
    dispatch(
      verifyOntAcknowledgement({
        id: subscriberId,
        otp,
        otpRefId,
        onSuccess: () => {
          handleClose();
          if (onSuccess) onSuccess();
        }
      })
    );
  };

  return (
    <Popup
      isOpen={isOpen}
      onOpenChange={handleClose}
      title={t('ontAcknowledgementOtp')}
      closeButton
      closeOnInteractOutside={false}
      size='sm'
    >
      <Box p={5} as='form' onSubmit={handleSubmit} display='flex' flexDir='column' gap='24px'>
        <Box display='flex' flexDir='column' gap='8px'>
          <Text fontSize='14px' fontWeight={500}>
            {t('enterOtp')}
          </Text>
          <Text fontSize='13px' color='gray.500'>
            {t('enterOntAcknowledgementOtp')}
          </Text>
          <OtpInput
            length={6}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              setOtpError('');
            }}
            error={otpError}
            autoFocus
          />
          {otpError && (
            <Text fontSize='12px' color='red.500'>
              {otpError}
            </Text>
          )}
        </Box>

        <HStack mt='8px' justify='flex-end' gap={3}>
          <Button variant='outline' onClick={handleClose} type='button'>
            {t('cancel')}
          </Button>
          <Button variant='solid' type='submit' loading={isVerifying}>
            {t('verify')}
          </Button>
        </HStack>
      </Box>
    </Popup>
  );
};

export default OntAcknowledgementOtpPopup;
