import { Pagination } from '@kfonbss/bss-ui-components';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const PaginationComponent = ({ page = 1, totalPages = 1, itemsPerPage = 10, totalEntries = 0, onPageChange }) => {
  const { t } = useTranslation();

  const pageDataDetails = useMemo(() => {
    if (totalEntries === 0) return t('noRecordsFound');
    const firstRow = (page - 1) * itemsPerPage + 1;
    const lastRow = Math.min(page * itemsPerPage, totalEntries);
    return `${t('showing')} ${firstRow}-${lastRow} ${t('of')} ${totalEntries} ${t('entries')}`;
  }, [page, itemsPerPage, totalEntries, t]);

  return (
    <Pagination
      onPageChange={onPageChange}
      page={page}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      totalEntries={totalEntries}
      pageDataDetails={pageDataDetails}
      displayRecords={t('displayRecords')}
    />
  );
};

export default PaginationComponent;
