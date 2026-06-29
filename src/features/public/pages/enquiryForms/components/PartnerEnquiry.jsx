import { Box, FormController, useForm } from '@kfonbss/bss-ui-components';
import { useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import AGNPEnquiry from './AGNPEnquiry';
import LNPEnquiry from './LNPEnquiry';

const PartnerEnquiry = ({ isPopup, onCancel }) => {
  const { t } = useTranslation();
  const search = useSearch({ strict: false });

  const { control, watch } = useForm({
    defaultValues: {
      partnerType: search?.type === 'agnp' ? 'agnp' : 'lnp'
    }
  });

  const partnerType = watch('partnerType');

  const radioSelector = (
    <Box mb='32px'>
      {!isPopup && (
        <Box
          bg='#F5F6FA'
          p={{ base: '24px 16px', md: '32px 24px', xl: '30px 32px' }}
          textAlign='center'
          mb='32px'
          borderRadius='12px'
        >
          <Box fontSize={{ base: '24px', md: '36px', xl: '32px' }} fontWeight='600' lineHeight='1.2' mb='8px'>
            {t('partnerEnquiry')}
          </Box>
          <Box fontSize={{ base: '14px', md: '20px' }} color='#000000' fontWeight='400'>
            {t('pleaseFillPartnerEnquiry')}
          </Box>
        </Box>
      )}
      <Box w={{ base: '100%', md: '400px' }}>
        <FormController
          labelName={t('selectPartnerType')}
          name='partnerType'
          type='radio'
          items={[
            { value: 'lnp', label: t('lnp') },
            { value: 'agnp', label: t('agnp') }
          ]}
          control={control}
        />
      </Box>
    </Box>
  );

  const childProps = { radioSelector, loggedIn: isPopup, onCancel };

  return (
    <Box
      w='100%'
      bg={isPopup ? 'transparent' : '#F5F6FA'}
      minH={isPopup ? 'auto' : '100vh'}
      p={isPopup ? 0 : { base: '16px', md: '40px', xl: '55px' }}
    >
      <Box w='100%' maxW='1800px' mx='auto'>
        {partnerType === 'agnp' ? <AGNPEnquiry {...childProps} /> : <LNPEnquiry {...childProps} />}
      </Box>
    </Box>
  );
};

export default PartnerEnquiry;
