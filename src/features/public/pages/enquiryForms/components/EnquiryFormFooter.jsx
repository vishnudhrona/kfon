import { Box, Button, Flex, Text } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TickIcon } from '@/assets/svg';

import TrackEnquiryPopup from './TrackEnquiryPopup';

const EnquiryFormFooter = ({ isPopup, loggedIn, onCancel, isSendingOtp, isSubmitting }) => {
  const { t } = useTranslation();
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  return (
    <>
      <Flex justifyContent={loggedIn ? 'flex-end' : 'center'} mt='40px' gap={4}>
        {isPopup && (
          <Button
            variant='outline'
            w={{ base: '100%', md: 'auto' }}
            px='10'
            py='3'
            borderRadius='full'
            fontSize='18px'
            fontWeight='normal'
            onClick={onCancel}
          >
            {t('close')}
          </Button>
        )}
        <Button
          type='submit'
          w={{ base: '100%', md: 'auto' }}
          px='10'
          py='3'
          borderRadius='full'
          bg='#8B1538'
          color='white'
          fontSize='18px'
          fontWeight='normal'
          _hover={{ bg: '#6D1028' }}
          loading={isSendingOtp || isSubmitting}
          disabled={isSendingOtp || isSubmitting}
        >
          {t('generateOTP')}
          <TickIcon />
        </Button>
      </Flex>

      {!loggedIn && (
        <Box mt={5} textAlign='center'>
          <Text textTransform='capitalize' fontSize='1rem' color='#292929'>
            {t('alreadyHaveABooking')}
            <span
              style={{
                color: '#8B1538',
                marginLeft: '8px',
                fontWeight: 500,
                fontSize: '18px',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 10
              }}
              onClick={() => {
                console.log('Track enquiry clicked');
                setIsTrackOpen(true);
              }}
            >
              {t('trackHere')}
            </span>
          </Text>
        </Box>
      )}

      <TrackEnquiryPopup isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} />
    </>
  );
};

export default EnquiryFormFooter;
