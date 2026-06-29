import { Box, Headline, Preview, VStack } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { fetchGstDetails } from '../action';
import { getGstDetailsData } from '../selector';

const Gstdetails = ({ gstData }) => {
  const { t } = useTranslation();

  useEffect(() => {
    gstData();
  }, [gstData]);

  return (
    <VStack alignItems='stretch' gap={4}>
      <Headline headName={t('gstDetails')} />
      <Box mt={1}>
        <Preview />
      </Box>
    </VStack>
  );
};

const mapStateToProps = (state) => ({
  gstDetails: getGstDetailsData(state)
});

const mapDispatchToProps = {
  gstData: fetchGstDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(Gstdetails);
