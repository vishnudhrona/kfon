import { Box, Button, Icons, Menu } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FilterIcon } from '@/components/custom';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { mapObjectValues } from '@/utils/commonUtils';

import { fetchProposalList } from '../action';
import { PROPOSAL_LIST_COLUMNS } from '../constants';
import { getProposalList } from '../selector';

const { ForwardArrowIcon } = Icons;

const ProposalList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedProposals, setSelectedProposals] = useState([]);

  const columns = useMemo(() => {
    const baseColumns = mapObjectValues(PROPOSAL_LIST_COLUMNS, t, ['header']);

    const mappedColumns = baseColumns.map((col) => {
      if (col.accessor === 'action') {
        return {
          ...col,
          cell: (row) => (
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
              <Menu.Trigger asChild>
                <Button
                  variant='ghost'
                  minW='auto'
                  p={0}
                  _hover={{ bg: 'transparent' }}
                  _active={{ bg: 'transparent' }}
                  _focus={{ boxShadow: 'none', border: 'none' }}
                >
                  <Icons.ThreeDotActionIcon />
                </Button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content bg='white' borderRadius='md' boxShadow='lg' py={2} zIndex={100} minW='160px'>
                  <Menu.Item
                    value='update-po'
                    px={4}
                    py={2}
                    cursor='pointer'
                    _hover={{ bg: 'gray.100' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `../proposal-details/${row.proposalId}` });
                    }}
                  >
                    {t('updatePO')}
                  </Menu.Item>
                  <Menu.Item
                    value='revise'
                    px={4}
                    py={2}
                    cursor='pointer'
                    _hover={{ bg: 'gray.100' }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {t('revise')}
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>
          )
        };
      }
      return col;
    });

    const selectionColumn = {
      accessor: 'selection',
      header: (
        <input
          type='checkbox'
          style={{
            accentColor: 'var(--chakra-colors-primary-500)',
            width: '18px',
            height: '18px',
            cursor: 'pointer'
          }}
        />
      ),
      cell: (row) => (
        <input
          type='checkbox'
          checked={selectedProposals.includes(row.proposalId)}
          onChange={(e) => {
            e.stopPropagation();
            const id = row.proposalId;
            if (selectedProposals.includes(id)) {
              setSelectedProposals((prev) => prev.filter((item) => item !== id));
            } else {
              setSelectedProposals((prev) => [...prev, id]);
            }
          }}
          style={{
            accentColor: 'var(--chakra-colors-primary-500)',
            width: '18px',
            height: '18px',
            cursor: 'pointer'
          }}
        />
      )
    };

    return [selectionColumn, ...mappedColumns];
  }, [t, selectedProposals, navigate]);

  const actions = (
    <Box display='flex' gap='10px'>
      <Button variant={'outline'} borderRadius='md' height='40px'>
        <FilterIcon />
        {t('filter')}
      </Button>
    </Box>
  );

  const footerActions = (
    <>
      <Button variant='outline' h='10' px='6' borderRadius='full' onClick={() => navigate({ to: '..' })}>
        <ForwardArrowIcon style={{ transform: 'rotate(180deg)', marginRight: '8px' }} /> {t('back')}
      </Button>

      <Button type='submit' h='10' px='6' borderRadius='full' colorScheme='purple'>
        {t('createGroup')}
        <ForwardArrowIcon style={{ marginLeft: '8px' }} />
      </Button>
    </>
  );

  return (
    <>
      <Box position='relative'>
        <GenericPageTable
          fetchAction={fetchProposalList}
          tableKey={SERVER_SIDE_TABLE_KEYS.DARK_FIBER_PROPOSAL_LIST}
          dataSelector={getProposalList}
          columns={columns}
          actions={actions}
          footerActions={footerActions}
        />
      </Box>
    </>
  );
};

export default ProposalList;
