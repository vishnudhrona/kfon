import { Box, Grid, Headline, Preview, Text, VStack } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

import { LOCATION_DETAILS_PREVIEW_DATA, LOCATION_INVOICE_DATA } from '../constants';

const LocationDetails = () => {
  const { t } = useTranslation();

  return (
    <>
      <Headline headName={t('locationDetails')} bgColor='background.text_bg' />

      <Box my={'24px'}>
        <Preview data={LOCATION_DETAILS_PREVIEW_DATA} />
      </Box>

      <Box borderRadius={'12px'} border={'1px solid #CDCDCD'} bg={'#F5F6FA'}>
        <Grid templateColumns={'repeat(3, 1fr)'} templateRows={'repeat(2, 1fr)'} gap={'36px'} padding={'36px'}>
          {LOCATION_INVOICE_DATA.map(({ label, date, data }) => {
            return (
              <VStack alignItems={'start'}>
                <Text color={'272727'} mb={'8px'} fontSize={'14px'} lineHeight={'14px'}>
                  {label}
                </Text>
                <Text fontSize={'16px'} lineHeight={'16px'} fontWeight={600}>
                  {date}
                </Text>
                <Text color={'333'} fontSize={'14px'} lineHeight={'14px'}>
                  {data}
                </Text>
              </VStack>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default LocationDetails;
