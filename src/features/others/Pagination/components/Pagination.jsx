import { connect, useSelector } from 'react-redux';

import PaginationComponent from '@/components/custom/Pagination';
import { selectorWithKey } from '@/utils/commonUtils';

import { ITEMS_PER_PAGE } from '../constants';
import { getServerSidePaginationDetails, getServerSidePaginationResponse } from '../selectors';
import { actions as sliceActions } from '../slice';

const mapDispatchToProps = (dispatch) => ({
  setPageNumber: (data) => dispatch(sliceActions.setPagination(data))
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.prop,
    ...ownProps
  };
};

const ServerSidePagination = ({ tableKey, siblingCount = 5, onPageChange, setPageNumber }) => {
  const { page, size } = selectorWithKey(useSelector(getServerSidePaginationDetails), tableKey) || {};
  const { totalElements } = selectorWithKey(useSelector(getServerSidePaginationResponse), tableKey) || {};

  return (
    totalElements > 0 && (
      <PaginationComponent
        page={page + 1}
        onPageChange={(details) => {
          const newSize = details.size || size;
          setPageNumber({ key: tableKey, data: { page: details.page, size: newSize } });
          if (onPageChange) {
            onPageChange({ key: tableKey, page: details.page, size: newSize });
          }
        }}
        totalEntries={totalElements}
        totalPages={Math.ceil(totalElements / size)}
        itemsPerPage={size}
        siblingCount={siblingCount}
        itemsPerPageOptions={ITEMS_PER_PAGE}
      />
    )
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerSidePagination);
