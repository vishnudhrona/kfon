import { Button, Icons } from '@kfonbss/bss-ui-components';

const { CopyFrontIcon, CopyBackIcon } = Icons;
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import PermissionGuard from '@/components/common/PermissionGuard';
import { CirclePlusIcon, CustomCheckbox, IconToggle } from '@/components/custom';
import CsvDownloadBtn from '@/components/custom/CsvDownloadBtn';
import GenericCardPage from '@/components/custom/GenericCardPage';
import { MENU_KEYS, PERMISSIONS } from '@/constants/permissions';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { usePageActions } from '@/hooks/usePageActions';

import { API_ACTION_TYPES, approveOrRejectStock, fetchStockByPoNo, fetchStockDetailsList } from '../actions';
import { STOCK_STATUS_OPTIONS } from '../constants';
import { useDeviceDropdowns } from '../hooks/useDeviceDropdowns';
import { getStockByPoNo, getTableData } from '../selectors';
import StockApproveRejectPopup from './StockApproveRejectPopup';
import StockDetailsCard from './StockDetailsCard';
import StockPoGroupCard from './StockPoGroupCard';

const APPROVE = 'APPROVE';

const STATUS_FILTER_ITEMS = Object.values(STOCK_STATUS_OPTIONS).map(({ value, label }) => ({
  id: value,
  name: label
}));

const StockDetailsList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const isGroupedByPo = search.groupBy === 'pono';
  const { hasPermission } = usePageActions();
  const { deviceTypes, deviceMakes, deviceCategories, deviceModels, deviceVendors } = useDeviceDropdowns();
  const [dialog, setDialog] = useState(null); // { row, actionType } | { bulk: true, actionType }
  const [selectedIds, setSelectedIds] = useState(new Set());
  const isConfirming = useSelector((state) => !!getApiProgress(state)?.[API_ACTION_TYPES.APPROVE_OR_REJECT_STOCK]);
  const isPoFetching = useSelector((state) => !!getApiProgress(state)?.[API_ACTION_TYPES.FETCH_STOCK_BY_PONO]);

  const toggleGroupByPo = useCallback(() => {
    navigate({
      search: (prev) => ({ ...prev, groupBy: isGroupedByPo ? undefined : 'pono' })
    });
  }, [navigate, isGroupedByPo]);

  const listData = useSelector(getTableData(SERVER_SIDE_TABLE_KEYS.STOCK_DETAILS_LIST));
  const rows = useMemo(() => listData?.data || [], [listData]);
  const activePoNo = dialog?.poGroup ? dialog.poNo : null;
  const poRows = useSelector(getStockByPoNo(activePoNo));

  const openDialog = useCallback((row, actionType) => setDialog({ row, actionType }), []);
  const closeDialog = () => setDialog(null);

  const toggleRow = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectableRows = useMemo(() => rows.filter((r) => r.status === 'STOCK_ENTERED'), [rows]);

  const toggleAll = useCallback(() => {
    if (selectedIds.size === selectableRows.length && selectableRows.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableRows.map((r) => r.detailsId)));
    }
  }, [selectedIds.size, selectableRows]);

  const allSelected = selectableRows.length > 0 && selectedIds.size === selectableRows.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const filterConfig = useMemo(
    () => [
      {
        name: 'stockStatus',
        label: 'status',
        type: 'select',
        placeholder: 'selectStatus',
        items: STATUS_FILTER_ITEMS
      },
      {
        name: 'deviceType',
        label: 'deviceType',
        type: 'select',
        placeholder: 'selectDeviceType',
        items: deviceTypes,
        valueKey: 'name'
      },
      {
        name: 'deviceCategory',
        label: 'deviceCategory',
        type: 'select',
        placeholder: 'selectDeviceCategory',
        items: deviceCategories,
        valueKey: 'name'
      },
      {
        name: 'deviceMake',
        label: 'deviceMake',
        type: 'select',
        placeholder: 'selectDeviceMake',
        items: deviceMakes,
        valueKey: 'name'
      },
      {
        name: 'vendorName',
        label: 'deviceVendor',
        type: 'select',
        placeholder: 'selectDeviceVendor',
        items: deviceVendors,
        valueKey: 'name'
      },
      {
        name: 'deviceModel',
        label: 'deviceModel',
        type: 'select',
        placeholder: 'selectDeviceModel',
        items: deviceModels,
        valueKey: 'name'
      }
    ],
    [deviceTypes, deviceCategories, deviceMakes, deviceVendors, deviceModels]
  );

  const openPoDialog = useCallback(
    (item, actionType) => {
      setDialog({ poGroup: true, poNo: item.poNo, actionType });
      dispatch(fetchStockByPoNo({ poNo: item.poNo }));
    },
    [dispatch]
  );

  const CardComponent = useCallback(
    ({ data: item }) =>
      isGroupedByPo ? (
        <StockPoGroupCard data={item} hasPermission={hasPermission} openDialog={openPoDialog} />
      ) : (
        <StockDetailsCard
          data={item}
          selectedIds={selectedIds}
          toggleRow={toggleRow}
          hasPermission={hasPermission}
          openDialog={openDialog}
        />
      ),
    [isGroupedByPo, selectedIds, toggleRow, hasPermission, openDialog, openPoDialog]
  );

  const handleConfirm = () => {
    const isBulk = dialog?.bulk;
    const isPoGroup = dialog?.poGroup;
    let deviceIds;
    if (isPoGroup) {
      deviceIds = poRows.map((r) => r.detailsId);
    } else if (isBulk) {
      deviceIds = Array.from(selectedIds);
    } else {
      deviceIds = [dialog.row.detailsId];
    }
    dispatch(
      approveOrRejectStock({
        deviceIds,
        action: dialog.actionType,
        remarks: '',
        onSuccess: () => {
          if (isBulk) setSelectedIds(new Set());
          closeDialog();
          dispatch(fetchStockDetailsList({ ...staticParams }));
        }
      })
    );
  };

  const selectAllCheckbox =
    selectableRows.length > 0 ? (
      <CustomCheckbox checked={someSelected ? 'indeterminate' : allSelected} onCheckedChange={toggleAll} />
    ) : null;

  const staticParams = useMemo(() => (isGroupedByPo ? { groupBy: 'pono' } : {}), [isGroupedByPo]);

  const actions = (
    <>
      <PermissionGuard action={PERMISSIONS.STOCK_LIST.APPROVE_REJECT} condition={selectedIds.size > 0}>
        <Button
          borderRadius='md'
          variant='outline'
          height='40px'
          onClick={() => setDialog({ bulk: true, actionType: APPROVE })}
        >
          {t('approveSelected')} ({selectedIds.size})
        </Button>
      </PermissionGuard>
      <CsvDownloadBtn minimal />
      <IconToggle
        activeIndex={isGroupedByPo ? 1 : 0}
        onChange={(i) => {
          if ((i === 1) !== isGroupedByPo) toggleGroupByPo();
        }}
        ariaLabels={[t('listView'), t('groupByPoNo')]}
        icons={[CopyBackIcon, CopyFrontIcon]}
      />
      <PermissionGuard action={PERMISSIONS.INVENTORY.ADD_STOCK} menuKey={MENU_KEYS.ADD_STOCK}>
        <Link to='/app/inventory/add-device'>
          <Button variant='outline' borderRadius='md' height='40px'>
            <CirclePlusIcon />
            {t('addStock')}
          </Button>
        </Link>
      </PermissionGuard>
    </>
  );

  return (
    <>
      <GenericCardPage
        dataSelector={getTableData(SERVER_SIDE_TABLE_KEYS.STOCK_DETAILS_LIST)}
        fetchAction={fetchStockDetailsList}
        tableKey={SERVER_SIDE_TABLE_KEYS.STOCK_DETAILS_LIST}
        columns={[]}
        CardComponent={CardComponent}
        filterConfig={filterConfig}
        actions={actions}
        searchPrefix={selectAllCheckbox}
        externalFilters={staticParams}
      />

      <StockApproveRejectPopup
        dialog={dialog ? { ...dialog, selectedIds } : null}
        rows={dialog?.poGroup ? poRows : rows}
        onConfirm={handleConfirm}
        onClose={closeDialog}
        isLoading={isConfirming || isPoFetching}
      />
    </>
  );
};

export default StockDetailsList;
