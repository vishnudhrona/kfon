import { Box, Headline, Table } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { CARD_TABLE_CONFIG } from '../constants';
import { getDashBoardData } from '../selector';

const DashboardTable = () => {
  const { t } = useTranslation();
  const { cardId } = useParams({ from: '/app/dashboard/details/$cardId' });
  const dashboardData = useSelector(getDashBoardData);

  const config = CARD_TABLE_CONFIG[cardId] || CARD_TABLE_CONFIG.DEFAULT;
  // Assuming the data list is available in the dashboardData under the cardId.
  // We might need to adjust this accessor based on the actual API response structure.
  const tableData = dashboardData?.[cardId]?.tableData || [];

  const translatedColumns = config.columns.map((col) => ({
    ...col,
    header: t(col.header)
  }));

  return (
    <>
      <Headline headName={t(config.title)} bgColor='background.text_bg' />
      <Box mt='20px'>
        <Table headerColor='table_header.primary' columns={translatedColumns} data={tableData} />
      </Box>
    </>
  );
};

export default DashboardTable;
