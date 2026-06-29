import { Flex, Tabs, Text } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import SuccessPopup from '@/features/public/common/components/SuccessPopup';
import { STATE_REDUCER_KEY as COMMON_KEY } from '@/features/public/common/constants';
import { actions as commonSliceActions } from '@/features/public/common/slice';
import { actions as enquiryFormActions } from '@/features/public/pages/enquiryForms/slice';

import HomeEnquiry from './Home';

const EnquiryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState('home');
  const { type } = useParams({ from: '/enquiry/$type' });
  const isSuccessOpen = useSelector((s) => s[COMMON_KEY].successPopupOpen);
  useEffect(() => {
    setTabValue(type);
  }, [type]);

  const handleSuccessClose = (val) => {
    dispatch(commonSliceActions.setSuccessPopupOpen(val));

    if (!val) {
      if (type === 'home') {
        dispatch(enquiryFormActions.clearHomeSubscriberDraft());
      }

      if (type === 'corporate' || type === 'government') {
        dispatch(enquiryFormActions.clearCorporateSubscriberDraft());
      }
    }
  };

  return (
    <Flex
      w='100%'
      maxW='780px' // 👈 keeps desktop design
      mt={{ base: 6, md: 20 }} // 👈 smaller top margin on mobile
      px={{ base: 4, md: 0 }} // 👈 mobile side padding
      textAlign='center'
      flexDirection='column'
      alignItems='center'
      gap={{ base: '16px', md: '26px' }}
    >
      <Text fontSize={{ base: '24px', md: '32px' }} fontWeight={600}>
        Get WiFi Connection
      </Text>

      <Text fontSize={{ base: '14px', md: '18px' }}>Please fill in the fields below to get WiFi connection</Text>
      <Tabs.Root
        value={tabValue}
        variant='plain'
        w={'full'}
        onValueChange={({ value }) => {
          navigate({
            to: '/enquiry/$type',
            params: { type: value }
          });
        }}
      >
        <Tabs.List
          pos={'relative'}
          rounded='full'
          bg={'white'}
          display={'flex'}
          mx={'auto'}
          w={'fit-content'}
          p={'4px'}
        >
          <Tabs.Trigger value='home'>Home</Tabs.Trigger>
          {/* <Tabs.Trigger value='corporate'>Corporate</Tabs.Trigger>
          <Tabs.Trigger value='government'>Government</Tabs.Trigger> */}

          <Tabs.Indicator rounded='l2' bg={'table_header.primary'} borderRadius={'full'} />
        </Tabs.List>

        <Tabs.Content value='home'>
          <HomeEnquiry />
        </Tabs.Content>
      </Tabs.Root>
      <SuccessPopup
        isOpen={isSuccessOpen}
        setIsOpen={handleSuccessClose}
        message={`${t('successMsgOne')} ${t('successMsgTwo')}`}
      />
    </Flex>
  );
};

export default EnquiryForm;
