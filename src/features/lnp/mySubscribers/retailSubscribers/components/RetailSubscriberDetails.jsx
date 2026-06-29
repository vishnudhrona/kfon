import { Box, Grid, Headline, Preview, Text, VStack } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getSubscriptionGridData, ONT_GRID_DATA, SUBSCRIBER_PERSONAL_DETAILS } from '../constants';
import RetailSubscriberPopup from './RetailSubscriberPopup';

const RetailSubscriberDetails = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [changePackage, setChangePackage] = useState(true);
  const [topUpPackage, setTopUpPackage] = useState(true);
  const [ottRecharge, setOTTRecharge] = useState(true);

  return (
    <>
      <Headline headName={t('subscriberDetails')} bgColor='background.text_bg' />

      <Box borderRadius={'12px'} border={'1px solid #CDCDCD'} bg={'#F5F6FA'} padding={'36px'}>
        <Grid templateColumns={'repeat(3, 1fr)'} templateRows={'repeat(2, 1fr)'} rowGap={'36px'}>
          {SUBSCRIBER_PERSONAL_DETAILS.map(({ label, data }) => {
            return (
              <VStack alignItems={'start'}>
                <Text color={'272727'} mb={'8px'} fontSize={'14px'} lineHeight={'14px'}>
                  {t(label)}
                </Text>
                <Text fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
                  {data}
                </Text>
              </VStack>
            );
          })}
        </Grid>
      </Box>

      <Text color={'272727'} fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
        {t('subscriptionData')}
      </Text>

      <Box>
        <Preview data={getSubscriptionGridData({ setChangePackage, setTopUpPackage, setOTTRecharge, setIsOpen })} />
      </Box>

      <Text color={'272727'} fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
        {t('ontDeviceDetails')}
      </Text>

      <Box>
        <Preview data={ONT_GRID_DATA} />
      </Box>

      <RetailSubscriberPopup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isChangePackage={changePackage}
        topUpPackage={topUpPackage}
        ottRecharge={ottRecharge}
      />
    </>
  );
};

export default RetailSubscriberDetails;
