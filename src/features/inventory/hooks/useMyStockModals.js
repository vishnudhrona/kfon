import { useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  submitDeviceConditionUpdate,
  submitMapDevice,
  submitReplaceDevice,
  submitReturnToOem,
  submitStockTransfer,
  submitUnmapDevice,
  submitUpdateDeviceDetails
} from '../actions';

export const useMyStockModals = (lnpContext = null) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [isReturnOemModalOpen, setIsReturnOemModalOpen] = useState(false);
  const [isMapDeviceModalOpen, setIsMapDeviceModalOpen] = useState(false);
  const [isUnmapDeviceModalOpen, setIsUnmapDeviceModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [isUpdateDeviceModalOpen, setIsUpdateDeviceModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isBulkTransferModalOpen, setIsBulkTransferModalOpen] = useState(false);
  const [deviceToTransfer, setDeviceToTransfer] = useState(null);
  const [bulkDeviceIds, setBulkDeviceIds] = useState([]);
  const [bulkDeviceItems, setBulkDeviceItems] = useState([]);

  const handleOpenTransferModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsTransferModalOpen(true);
  }, []);

  const handleOpenConditionModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsConditionModalOpen(true);
  }, []);

  const handleOpenReturnOemModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsReturnOemModalOpen(true);
  }, []);

  const handleOpenMapDeviceModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsMapDeviceModalOpen(true);
  }, []);

  const handleOpenReplacementModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsReplacementModalOpen(true);
  }, []);

  const handleOpenUpdateDeviceModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsUpdateDeviceModalOpen(true);
  }, []);

  const handleOpenUnmapDeviceModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsUnmapDeviceModalOpen(true);
  }, []);

  const handleOpenNotesModal = useCallback((device) => {
    setDeviceToTransfer(device);
    setIsNotesModalOpen(true);
  }, []);

  const handleOpenBulkTransferModal = useCallback((deviceIds, deviceItems = []) => {
    setBulkDeviceIds(deviceIds);
    setBulkDeviceItems(deviceItems);
    setIsBulkTransferModalOpen(true);
  }, []);

  const handleTransferSubmit = useCallback(
    (data) => {
      dispatch(
        submitStockTransfer({
          deviceIds: [data.device.detailsId],
          userId: lnpContext ? lnpContext.userId : data.person?.id || null,
          username: lnpContext ? lnpContext.userName : (data.person?.name ?? null),
          remarks: data.remark1,
          name: data.handedOverName,
          mobileNumber: data.handedOverMobile,
          ...(lnpContext && { requestId: lnpContext.requestId }),
          ...(lnpContext && {
            onSuccess: () => navigate({ to: '/app/inventory/stock-management', search: { tab: 'transferredList' } })
          })
        })
      );
      setIsTransferModalOpen(false);
    },
    [dispatch, lnpContext, navigate]
  );

  const handleBulkTransferSubmit = useCallback(
    (data) => {
      dispatch(
        submitStockTransfer({
          deviceIds: bulkDeviceIds,
          userId: lnpContext ? lnpContext.userId : data.person?.id || null,
          username: lnpContext ? lnpContext.userName : (data.person?.name ?? null),
          remarks: data.remark1,
          name: data.handedOverName,
          mobileNumber: data.handedOverMobile,
          ...(lnpContext && { requestId: lnpContext.requestId }),
          ...(lnpContext && {
            onSuccess: () => navigate({ to: '/app/inventory/stock-management', search: { tab: 'transferredList' } })
          })
        })
      );
      setIsBulkTransferModalOpen(false);
      setBulkDeviceIds([]);
      setBulkDeviceItems([]);
    },
    [dispatch, bulkDeviceIds, lnpContext, navigate]
  );

  const handleConditionSubmit = useCallback(
    (data) => {
      dispatch(
        submitDeviceConditionUpdate({
          detailsId: data.device.detailsId,
          date: new Date(data.date).toISOString(),
          condition: data.condition,
          remarks: data.remark
        })
      );
      setIsConditionModalOpen(false);
    },
    [dispatch]
  );

  const handleReturnOemSubmit = useCallback(
    (data) => {
      dispatch(
        submitReturnToOem({
          file: data.attachments?.[0] ?? null,
          request: {
            deviceId: data.device.detailsId,
            handoverName: data.handedOverName,
            mobileNumber: data.handedOverMobile,
            remarks: data.remark
          }
        })
      );
      setIsReturnOemModalOpen(false);
    },
    [dispatch]
  );

  const handleMapDeviceSubmit = useCallback(
    (data) => {
      dispatch(
        submitMapDevice({
          detailsId: data.device.detailsId,
          mappedTo: data.deviceMappedTo,
          popId: data.popId,
          popName: data.popName,
          // nocName: data.nocName,
          // location: data.location,
          ipAddress: data.deviceIpAddress,
          portNumber: data.portNumber,
          remark: data.remark
        })
      );
    },
    [dispatch]
  );

  const handleUnmapDeviceSubmit = useCallback(
    (data) => {
      dispatch(
        submitUnmapDevice({
          detailsId: data.device.detailsId
        })
      );
    },
    [dispatch]
  );

  const handleReplacementSubmit = useCallback(
    (data) => {
      const { device, distanceInKm, ...deviceFields } = data;
      dispatch(
        submitReplaceDevice({
          deviceId: device.detailsId,
          ...deviceFields,
          ...(distanceInKm !== undefined && { sfpDistance: String(distanceInKm) })
        })
      );
    },
    [dispatch]
  );

  const handleUpdateDeviceSubmit = useCallback(
    (data) => {
      const { device, distanceInKm, ...deviceFields } = data;
      dispatch(
        submitUpdateDeviceDetails({
          deviceId: device.detailsId,
          ...deviceFields,
          ...(distanceInKm !== undefined && { sfpDistance: String(distanceInKm) })
        })
      );
      setIsUpdateDeviceModalOpen(false);
    },
    [dispatch]
  );

  return {
    states: {
      isTransferModalOpen,
      setIsTransferModalOpen,
      isConditionModalOpen,
      setIsConditionModalOpen,
      isReturnOemModalOpen,
      setIsReturnOemModalOpen,
      isMapDeviceModalOpen,
      setIsMapDeviceModalOpen,
      isUnmapDeviceModalOpen,
      setIsUnmapDeviceModalOpen,
      isReplacementModalOpen,
      setIsReplacementModalOpen,
      isUpdateDeviceModalOpen,
      setIsUpdateDeviceModalOpen,
      isNotesModalOpen,
      setIsNotesModalOpen,
      isBulkTransferModalOpen,
      setIsBulkTransferModalOpen,
      deviceToTransfer,
      setDeviceToTransfer,
      bulkDeviceIds,
      bulkDeviceItems
    },
    actions: {
      handleOpenTransferModal,
      handleOpenConditionModal,
      handleOpenReturnOemModal,
      handleOpenMapDeviceModal,
      handleOpenReplacementModal,
      handleOpenUpdateDeviceModal,
      handleOpenUnmapDeviceModal,
      handleOpenNotesModal,
      handleOpenBulkTransferModal,
      handleTransferSubmit,
      handleConditionSubmit,
      handleReturnOemSubmit,
      handleMapDeviceSubmit,
      handleUnmapDeviceSubmit,
      handleReplacementSubmit,
      handleUpdateDeviceSubmit,
      handleBulkTransferSubmit
    }
  };
};
