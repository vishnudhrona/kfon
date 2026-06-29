import { Box, Headline, Table } from '@kfonbss/bss-ui-components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { REPORTS_TABLE_CONFIG } from '../constants';

const ReportsTable = ({ configKey, fetchAction, selector }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const reportData = useSelector(selector);
  const config = REPORTS_TABLE_CONFIG[configKey] || REPORTS_TABLE_CONFIG.DEFAULT;

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
      header: t(col.header) // Ensure translation keys exist or fallback to key
    })) || [];

  return (
    <Box p='20px'>
      <Headline headName={t(config.title)} bgColor='background.text_bg' />
      <Box mt='20px'>
        {/* Assuming Table supports pagination or just rendering list */}
        <Table
          headerColor='table_header.primary'
          columns={translatedColumns}
          data={tableData}
          isLoading={false} // Add loading state if available from selector
        />
      </Box>
    </Box>
  );
};

export default ReportsTable;
