import OemNotesModal from './OemNotesModal';
import StockConditionModal from './StockConditionModal';
import StockMapDeviceModal from './StockMapDeviceModal';
import StockReplacementModal from './StockReplacementModal';
import StockReturnOemModal from './StockReturnOemModal';
import StockTransferModal from './StockTransferModal';
import StockUnmapDeviceModal from './StockUnmapDeviceModal';
import StockUpdateDeviceModal from './StockUpdateDeviceModal';

const MyStockModals = ({ states, actions, lnpContext = null }) => {
  const {
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
  } = states;

  const {
    handleTransferSubmit,
    handleConditionSubmit,
    handleReturnOemSubmit,
    handleMapDeviceSubmit,
    handleUnmapDeviceSubmit,
    handleReplacementSubmit,
    handleUpdateDeviceSubmit,
    handleBulkTransferSubmit
  } = actions;

  return (
    <>
      <StockTransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSubmit={handleTransferSubmit}
        device={deviceToTransfer}
        isTransferredStock={false}
        lnpContext={lnpContext}
      />

      {isConditionModalOpen && deviceToTransfer && (
        <StockConditionModal
          isOpen={isConditionModalOpen}
          onClose={() => setIsConditionModalOpen(false)}
          onSubmit={handleConditionSubmit}
          device={deviceToTransfer}
        />
      )}

      {isReturnOemModalOpen && deviceToTransfer && (
        <StockReturnOemModal
          isOpen={isReturnOemModalOpen}
          onClose={() => setIsReturnOemModalOpen(false)}
          onSubmit={handleReturnOemSubmit}
          device={deviceToTransfer}
        />
      )}

      {isMapDeviceModalOpen && deviceToTransfer && (
        <StockMapDeviceModal
          isOpen={isMapDeviceModalOpen}
          onClose={() => setIsMapDeviceModalOpen(false)}
          onSubmit={handleMapDeviceSubmit}
          device={deviceToTransfer}
        />
      )}

      {isUnmapDeviceModalOpen && deviceToTransfer && (
        <StockUnmapDeviceModal
          isOpen={isUnmapDeviceModalOpen}
          onClose={() => setIsUnmapDeviceModalOpen(false)}
          onSubmit={handleUnmapDeviceSubmit}
          device={deviceToTransfer}
        />
      )}

      {isReplacementModalOpen && deviceToTransfer && (
        <StockReplacementModal
          isOpen={isReplacementModalOpen}
          onClose={() => setIsReplacementModalOpen(false)}
          onSubmit={handleReplacementSubmit}
          device={deviceToTransfer}
        />
      )}

      {isUpdateDeviceModalOpen && deviceToTransfer && (
        <StockUpdateDeviceModal
          isOpen={isUpdateDeviceModalOpen}
          onClose={() => setIsUpdateDeviceModalOpen(false)}
          onSubmit={handleUpdateDeviceSubmit}
          device={deviceToTransfer}
        />
      )}

      {isBulkTransferModalOpen && (
        <StockTransferModal
          isOpen={isBulkTransferModalOpen}
          onClose={() => setIsBulkTransferModalOpen(false)}
          onSubmit={handleBulkTransferSubmit}
          device={null}
          isTransferredStock={false}
          bulkDeviceCount={bulkDeviceIds.length}
          bulkDevices={bulkDeviceItems}
          lnpContext={lnpContext}
        />
      )}

      {isNotesModalOpen && deviceToTransfer && (
        <OemNotesModal
          isOpen={isNotesModalOpen}
          onClose={() => {
            setIsNotesModalOpen(false);
            setDeviceToTransfer(null);
          }}
          device={deviceToTransfer}
          deviceId={deviceToTransfer.detailsId}
        />
      )}
    </>
  );
};

export default MyStockModals;
