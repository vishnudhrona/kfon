import { Box, Button, Icons, Menu } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FilterIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { mapObjectValues } from '@/utils/commonUtils';

import { assignEnquiry, downloadEnquiryListCsv, fetchAssignToUsers, fetchEnquiryList } from '../action';
import { DARKFIBER_COLUMNS, NOT_UPDATED } from '../constants';
import { getEnquiryList } from '../selector';
import AssignToModal from './AssignToModal';

const DarkEnquiryList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ForwardArrowIcon } = Icons;
  const [selectedEnquiries, setSelectedEnquiries] = useState([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const assignToUsers = useSelector((state) => state.darkFiber?.assignToUsers?.data || []);

  useEffect(() => {
    dispatch(fetchAssignToUsers());
  }, [dispatch]);

  const columns = useMemo(() => {
    const baseColumns = mapObjectValues(DARKFIBER_COLUMNS, t, ['header']);

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
                    value='add-company-profile'
                    px={4}
                    py={2}
                    cursor='pointer'
                    _hover={{ bg: 'gray.100' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `/app/darkfiber/enquiry-list/company-profile/${row.requestId}` });
                    }}
                  >
                    {row.companyProfile === NOT_UPDATED ? t('addCompanyProfile') : t('editCompanyProfile')}
                  </Menu.Item>
                  <Menu.Item
                    value='add-dark-fiber-details'
                    px={4}
                    py={2}
                    cursor='pointer'
                    _hover={{ bg: 'gray.100' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: `/app/darkfiber/enquiry-list/enquiry-details/${row.requestId}` });
                    }}
                  >
                    {row.darkFiberDetails === NOT_UPDATED ? t('addDarkFiberDetails') : t('updateDarkFiberDetails')}
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
          checked={selectedEnquiries.includes(row.requestId)}
          onChange={(e) => {
            e.stopPropagation();
            const id = row.requestId;
            if (selectedEnquiries.includes(id)) {
              setSelectedEnquiries((prev) => prev.filter((item) => item !== id));
            } else {
              setSelectedEnquiries((prev) => [...prev, id]);
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
  }, [t, selectedEnquiries, navigate]);

  const actions = (
    <Box display='flex' gap='10px'>
      <Button variant={'outline'} borderRadius='md' height='40px'>
        <FilterIcon />
        {t('filter')}
      </Button>
      <CsvDownloadBtn onClick={() => dispatch(downloadEnquiryListCsv())} />
    </Box>
  );

  const footerActions = (
    <Button
      variant={'solid'}
      height={'40px'}
      colorScheme='purple'
      onClick={() => setIsAssignModalOpen(true)}
      isDisabled={selectedEnquiries.length === 0}
    >
      {t('assignTo')} <ForwardArrowIcon />
    </Button>
  );

  const handleAssignSubmit = (data) => {
    dispatch(
      assignEnquiry({
        ...data,
        enquiryIds: selectedEnquiries,
        onSuccess: () => {
          setIsAssignModalOpen(false);
          setSelectedEnquiries([]);
        }
      })
    );
  };

  return (
    <>
      <Box position='relative'>
        <GenericPageTable
          fetchAction={fetchEnquiryList}
          tableKey={SERVER_SIDE_TABLE_KEYS.DARK_FIBER_ENQUIRY_LIST}
          dataSelector={getEnquiryList}
          columns={columns}
          actions={actions}
          footerActions={footerActions}
        />
        <AssignToModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          onSubmit={handleAssignSubmit}
          users={assignToUsers}
        />
      </Box>
    </>
  );
};

export default DarkEnquiryList;
