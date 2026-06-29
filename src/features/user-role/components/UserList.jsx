import { Button, Tooltip } from '@kfonbss/bss-ui-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { CirclePlusIcon } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import CustomEditIcon from '@/components/custom/CustomEditIcon';
import GenericPageTable from '@/components/custom/GenericPageTable';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { mapObjectValues } from '@/utils/commonUtils';

import { downloadUserListCsv, fetchUserList } from '../action';
import { VISIBLE_COLUMNS_USER_LIST } from '../constants';
import CreateUser from '../pop-up/CreateUser';
import { getTableData } from '../selector';

const UserList = ({ downloadCsv }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);

  const csvDownloadClick = () => {
    downloadCsv();
  };

  const columns = useMemo(() => {
    const dataColumns = mapObjectValues(VISIBLE_COLUMNS_USER_LIST, t, ['header']).map((col) => {
      if (col.accessor === 'active') {
        return {
          ...col,
          cell: (row) => (
            <span style={{ color: row?.active ? '#16a34a' : '#dc2626' }}>
              {row?.active ? t('active') : t('inactive')}
            </span>
          )
        };
      }
      if (col.accessor === 'roles') {
        return {
          ...col,
          cell: (row) => {
            const roleNames = row?.roles?.map((r) => r.roleName).filter(Boolean) || [];
            if (roleNames.length === 0) return '-';
            if (roleNames.length <= 2) {
              return roleNames.join(', ');
            }
            const displayed = roleNames.slice(0, 2).join(', ') + '...';
            const tooltipContent = roleNames.join(', ');
            return (
              <Tooltip content={tooltipContent} contentProps={{ bg: 'gray.100', color: 'black' }}>
                <span style={{ cursor: 'pointer' }}>
                  {displayed}
                </span>
              </Tooltip>
            );
          }
        };
      }
      if (col.accessor === 'pincodes') {
        return {
          ...col,
          cell: (row) => {
            const pinCodes = row?.pincodes?.map((p) => typeof p === 'object' ? p?.pincode : p).filter(Boolean) || [];
            if (pinCodes.length === 0) return '-';
            if (pinCodes.length <= 3) {
              return pinCodes.join(', ');
            }
            const displayed = pinCodes.slice(0, 3).join(', ') + '...';
            const tooltipContent = pinCodes.join(', ');
            return (
              <Tooltip content={tooltipContent} contentProps={{ bg: 'gray.100', color: 'black' }}>
                <span style={{ cursor: 'pointer' }}>
                  {displayed}
                </span>
              </Tooltip>
            );
          }
        };
      }
      if (col.accessor === 'districtMaps') {
        return {
          ...col,
          cell: (row) => {
            const districtNames = row?.districtMaps?.map((d) => d.districtName).filter(Boolean) || [];
            if (districtNames.length === 0) return '-';
            if (districtNames.length <= 3) {
              return districtNames.join(', ');
            }
            const displayed = districtNames.slice(0, 3).join(', ') + '...';
            const tooltipContent = districtNames.join(', ');
            return (
              <Tooltip content={tooltipContent} contentProps={{ bg: 'gray.100', color: 'black' }}>
                <span style={{ cursor: 'pointer' }}>
                  {displayed}
                </span>
              </Tooltip>
            );
          }
        };
      }
      return col;
    });
    return [
      { header: 'Sl.NO', accessor: 'slNo' },
      ...dataColumns,
      {
        header: t('action'),
        accessor: 'action',
        cell: (row) => (
          <CustomEditIcon onClick={() => { setUser(row); setOpen(true); }} />
        )
      }
    ];
  }, [t]);

  const actions = (
    <>
      <CsvDownloadBtn onClick={csvDownloadClick} minimal />
      <Button
        variant={'outline'}
        borderRadius='lg'
        h='10'
        onClick={() => {
          setUser(null);
          setOpen(true);
        }}
      >
        <CirclePlusIcon />
        {t('createUser')}
      </Button>
    </>
  );

  return (
    <>
      <GenericPageTable
        dataSelector={getTableData('userList')}
        fetchAction={fetchUserList}
        columns={columns}
        actions={actions}
        tableKey={SERVER_SIDE_TABLE_KEYS.USER_LIST_TABLE}
      />

      <CreateUser open={open} setOpen={setOpen} user={user} />
    </>
  );
};

const mapDispatchToProps = {
  downloadCsv: downloadUserListCsv
};

export default connect(null, mapDispatchToProps)(UserList);
