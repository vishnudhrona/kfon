import { Button, Icons } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CustomLoaderProvider from '@/components/custom/CustomLoaderProvider';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';

import { ACTION_TYPES, fetchProposalRevisions } from '../action';
import { CORPORATE_KEYS, getRevisedProposalColumns } from '../constants';
import { revisionDetailsRoute } from '../routes';
import { getTableData } from '../selector';

const RevisedProposalList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { FilterIcon } = Icons;
  const { proposalId } = useParams({ strict: false });
  const apiProgress = useSelector(getApiProgress);
  const isLoading = !!apiProgress[ACTION_TYPES.FETCH_PROPOSAL_REVISIONS];

  useEffect(() => {
    if (proposalId) {
      dispatch(fetchProposalRevisions({ proposalId }));
    }
  }, [dispatch, proposalId]);

  const columns = useMemo(() => {
    const baseColumns = getRevisedProposalColumns();

    return baseColumns.map((col) => {
      if (col.accessor === 'proposalName') {
        return {
          ...col,
          cell: (row) => (
            <Button
              variant='link'
              as='a'
              fontWeight='bold'
              color='primary.500'
              p={0}
              onClick={() => {
                navigate({
                  to: revisionDetailsRoute.to,
                  params: { proposalId, revisionId: row.slNo },
                  state: { headerTitle: 'revisedProposalDetails' }
                });
              }}
            >
              {row.proposalName}
            </Button>
          )
        };
      }
      return col;
    });
  }, [navigate, proposalId]);

  const filters = (
    <Button variant='outline' borderRadius='md' height='40px'>
      <FilterIcon />
      {t('filter')}
    </Button>
  );

  return (
    <CustomLoaderProvider isLoading={isLoading}>
      <>
        <GenericPageTable
          tableKey={CORPORATE_KEYS.PROPOSAL_REVISIONS}
          dataSelector={getTableData(CORPORATE_KEYS.PROPOSAL_REVISIONS)}
          fetchAction={(params) => fetchProposalRevisions({ ...params, proposalId })}
          filters={filters}
          columns={columns}
        />
      </>
    </CustomLoaderProvider>
  );
};

export default RevisedProposalList;
