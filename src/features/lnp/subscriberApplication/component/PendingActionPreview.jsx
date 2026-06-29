import { Box, CustomTablePreview, Headline } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const PendingActionPreview = () => {
  const { t } = useTranslation();
  return (
    <>
      <Box>
        <Headline headName={`${t('kycDetails')} #`} editButton={true} />
      </Box>
      <Box>
        <CustomTablePreview />
      </Box>
    </>
  );
};

export default PendingActionPreview;
