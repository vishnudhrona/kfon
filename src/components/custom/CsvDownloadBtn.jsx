import { Box,Button, Icons } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const { DownloadCsv } = Icons;

export default function CsvDownloadBtn(props) {
  const { onClick } = props;
  const { label } = props;
  const { t } = useTranslation();
  return (
    <Button variant='outline' borderRadius='lg' height='40px' onClick={onClick}>
      <DownloadCsv />
      <Box as="span" ml={1} display={{ base: 'none', '2xl': 'inline' }}>
        {label || t('downloadCSV')}
      </Box>
    </Button>
  );
}
