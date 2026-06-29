import { Button } from '@kfonbss/bss-ui-components';
import { useSearch } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import PermissionGuard from '@/components/common/PermissionGuard';
import { CustomCheckbox } from '@/components/custom';
import GenericCardPage from '@/components/custom/GenericCardPage';
import { PERMISSIONS } from '@/constants/permissions';
import { SERVER_SIDE_TABLE_KEYS } from '@/constants/server_table';
import { usePageActions } from '@/hooks/usePageActions';

import { approveOrRejectStock, fetchStockDetailsList } from '../actions';
import { STOCK_STATUS_OPTIONS } from '../constants';
import { useDeviceDropdowns } from '../hooks/useDeviceDropdowns';
import { getTableData } from '../selectors';
import StockApproveRejectPopup from './StockApproveRejectPopup';
import StockDetailsCard from './StockDetailsCard';

const APPROVE = 'APPROVE';

const STATUS_FILTER_ITEMS = Object.values(STOCK_STATUS_OPTIONS).map(({ value, label }) => ({
  id: value,
  name: label
}));

const TABLE_KEY = SERVER_SIDE_TABLE_KEYS.STOCK_DETAILS_LIST;
const selectTableData = getTableData(TABLE_KEY);

const StockPoDetails = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { poNo } = useSearch({ strict: false });
  const { hasPermission } = usePageActions();
  const { deviceTypes, deviceMakes, deviceCategories, deviceModels, deviceVendors } = useDeviceDropdowns();

  const [dialog, setDialog] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const listData = useSelector(selectTableData);
  const rows = useMemo(() => listData?.data || [], [listData]);

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

  const staticParams = useMemo(() => ({ poNo }), [poNo]);

  const handleConfirm = () => {
    const isBulk = dialog?.bulk;
    const deviceIds = isBulk ? Array.from(selectedIds) : [dialog.row.detailsId];
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

  const CardComponent = useCallback(
    ({ data: item }) => (
      <StockDetailsCard
        data={item}
        selectedIds={selectedIds}
        toggleRow={toggleRow}
        hasPermission={hasPermission}
        openDialog={openDialog}
      />
    ),
    [selectedIds, toggleRow, hasPermission, openDialog]
  );

  const actions = (
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
  );

  return (
    <>
      <GenericCardPage
        dataSelector={selectTableData}
        fetchAction={fetchStockDetailsList}
        tableKey={TABLE_KEY}
        columns={[]}
        CardComponent={CardComponent}
        filterConfig={filterConfig}
        actions={actions}
        searchPrefix={selectAllCheckbox}
        externalFilters={staticParams}
      />

      <StockApproveRejectPopup
        dialog={dialog ? { ...dialog, selectedIds } : null}
        rows={rows}
        onConfirm={handleConfirm}
        onClose={closeDialog}
      />
    </>
  );
};

export default StockPoDetails;
