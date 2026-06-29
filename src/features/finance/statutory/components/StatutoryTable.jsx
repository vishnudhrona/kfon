import { Box, Headline, Table } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STATUTORY_TABLE_CONFIG } from '../constants';

const StatutoryTable = ({ configKey, fetchAction, selector }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const reportData = useSelector(selector);
  const config = STATUTORY_TABLE_CONFIG[configKey] || STATUTORY_TABLE_CONFIG.DEFAULT;

  useEffect(() => {
    if (fetchAction) {
      dispatch(fetchAction());
    }
  }, [dispatch, fetchAction]);

  const tableData = reportData?.data?.content || reportData?.data || [];

  // Handle columns translation
  const translatedColumns =
    config?.columns?.map((col) => ({
      ...col,
      header: t(col.header)
    })) || [];

  return (
    <Box p='20px'>
      <Headline headName={t(config.title)} bgColor='background.text_bg' />
      <Box mt='20px'>
        <Table headerColor='table_header.primary' columns={translatedColumns} data={tableData} isLoading={false} />
      </Box>
    </Box>
  );
};

export default StatutoryTable;
