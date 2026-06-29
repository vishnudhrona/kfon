export const STATE_REDUCER_KEY = 'my-finance';

// Helper functions that return columns with translated headers
export const getVisibleColumnsFranchiseeCorporateInvoices = (t) => [
  { accessorKey: 'partnerName', header: t('partner') },
  { accessorKey: 'partnerCompanyName', header: t('partnerCompanyName') },
  { accessorKey: 'workorderId', header: t('workorderId') },
  { accessorKey: 'customerName', header: t('customerName') },
  { accessorKey: 'invoiceApprovedStatus', header: t('invoiceApprovedStatus') },
  { accessorKey: 'revenue', header: t('revenue') },
  { accessorKey: 'lnpShare', header: t('lnpShare') },
  { accessorKey: 'netShare', header: t('netShare') },
  { accessorKey: 'sgstUgst', header: t('sgstUgst') },
  { accessorKey: 'cgst', header: t('cgst') },
  { accessorKey: 'igst', header: t('igst') },
  { accessorKey: 'totalGst', header: t('totalGst') },
  { accessorKey: 'cgstTds', header: t('cgstTds') },
  { accessorKey: 'sgstTds', header: t('sgstTds') },
  { accessorKey: 'netPayable', header: t('netPayable') },
  { accessorKey: 'viewStatus', header: t('viewStatus') },
  { accessorKey: 'viewInvoice', header: t('viewInvoice') }
];

export const getVisibleColumnsOtcApproval = (t) => [
  { accessorKey: 'partnerId', header: t('partnerId') },
  { accessorKey: 'companyName', header: t('company') },
  { accessorKey: 'workorderId', header: t('workorderId') },
  { accessorKey: 'locationName', header: t('locationName') },
  { accessorKey: 'customerInvoice', header: t('customerInvoice') },
  { accessorKey: 'customerName', header: t('customerName') },
  { accessorKey: 'invoiceApprovedStatus', header: t('invoiceApprovedStatus') },
  { accessorKey: 'otcRevenue', header: t('otcRevenue') },
  { accessorKey: 'dot', header: t('dot') },
  { accessorKey: 'agr', header: t('agr') },
  { accessorKey: 'lnpShare', header: t('lnpShare') },
  { accessorKey: 'commission', header: t('commission') },
  { accessorKey: 'netShare', header: t('netShare') },
  { accessorKey: 'sgstUgst', header: t('sgstUgst') },
  { accessorKey: 'cgst', header: t('cgst') },
  { accessorKey: 'igst', header: t('igst') },
  { accessorKey: 'totalGst', header: t('totalGst') },
  { accessorKey: 'invoiceValue', header: t('invoiceValue') },
  { accessorKey: 'invoiceDate', header: t('invoiceDate') },
  { accessorKey: 'tds', header: t('tds') },
  { accessorKey: 'cgstTds', header: t('cgstTds') },
  { accessorKey: 'sgstTds', header: t('sgstTds') },
  { accessorKey: 'netPayable', header: t('netPayable') },
  { accessorKey: 'viewStatus', header: t('viewStatus') },
  { accessorKey: 'viewInvoice', header: t('viewInvoice') }
];

export const getVisibleColumnsSubscriberDetails = (t) => [
  { accessorKey: 'slNo', header: t('slNo') },
  { accessorKey: 'username', header: t('username') },
  { accessorKey: 'workorder', header: t('workorder') },
  { accessorKey: 'package', header: t('package') },
  { accessorKey: 'activationDate', header: t('activationDate') },
  { accessorKey: 'subscriberIpAddress', header: t('subscriberIpAddress') },
  { accessorKey: 'subnetMask', header: t('subnetMask') },
  { accessorKey: 'wanId', header: t('wanId') },
  { accessorKey: 'circuitDetails', header: t('circuitDetails') }
];

export const getVisibleColumnsLnpPartnerFinance = (t) => [
  { accessorKey: 'partnerId', header: t('partnerId') },
  { accessorKey: 'partnerName', header: t('partnerName') },
  { accessorKey: 'workorderNo', header: t('workorderNo') },
  { accessorKey: 'amount', header: t('amount') },
  { accessorKey: 'cause', header: t('cause') },
  { accessorKey: 'type', header: t('type') },
  { accessorKey: 'updatedOn', header: t('updatedOn') }
];

export const getVisibleColumnsDisbursement = (t) => [
  { accessorKey: 'slNo', header: t('slNo') },
  { accessorKey: 'date', header: t('date') },
  { accessorKey: 'amount', header: t('amount') },
  { accessorKey: 'shareType', header: t('shareType') },
  { accessorKey: 'partnerId', header: t('partnerId') },
  { accessorKey: 'partner', header: t('partner') },
  { accessorKey: 'slNo2', header: t('slNo') },
  { accessorKey: 'panNo', header: t('panNo') }
];

export const getVisibleColumnsLnpSummaryLocation = (t) => [
  { accessorKey: 'lnpId', header: t('lnpId') },
  { accessorKey: 'lnp', header: t('lnp') },
  { accessorKey: 'agnpId', header: t('agnpId') },
  { accessorKey: 'agnpName', header: t('agnpName') },
  { accessorKey: 'invoiceNo', header: t('invoiceNo') },
  { accessorKey: 'workorderId', header: t('workorderId') },
  { accessorKey: 'locationInvoice', header: t('locationInvoice') },
  { accessorKey: 'customerName', header: t('customerName') },
  { accessorKey: 'locationName', header: t('locationName') },
  { accessorKey: 'package', header: t('package') },
  { accessorKey: 'revenueFromSubscriber', header: t('revenueFromSubscriber') },
  { accessorKey: 'dot', header: t('dot') },
  { accessorKey: 'agr', header: t('agr') },
  { accessorKey: 'ud', header: t('ud') },
  { accessorKey: 'agnpRevenueShare', header: t('agnpRevenueShare') },
  { accessorKey: 'lnpRevenueShare', header: t('lnpRevenueShare') },
  { accessorKey: 'sgstUgst', header: t('sgstUgst') },
  { accessorKey: 'cgst', header: t('cgst') },
  { accessorKey: 'igst', header: t('igst') },
  { accessorKey: 'totalGst', header: t('totalGst') },
  { accessorKey: 'totalInvoiceValue', header: t('totalInvoiceValue') },
  { accessorKey: 'tds', header: t('tds') },
  { accessorKey: 'sgstTds', header: t('sgstTds') },
  { accessorKey: 'cgstTds', header: t('cgstTds') },
  { accessorKey: 'netPayable', header: t('netPayable') },
  { accessorKey: 'invoiceDate', header: t('invoiceDate') }
];

export const getVisibleColumnsLnpCreditNotes = (t) => [
  { accessorKey: 'partner', header: t('partner') },
  { accessorKey: 'partnerCompanyName', header: t('partnerCompanyName') },
  { accessorKey: 'workorderId', header: t('workorderId') },
  { accessorKey: 'customerName', header: t('customerName') },
  { accessorKey: 'invoiceApprovedStatus', header: t('invoiceApprovedStatus') },
  { accessorKey: 'revenue', header: t('revenue') },
  { accessorKey: 'lnpShare', header: t('lnpShare') },
  { accessorKey: 'netShare', header: t('netShare') },
  { accessorKey: 'sgstUgst', header: t('sgstUgst') },
  { accessorKey: 'cgst', header: t('cgst') },
  { accessorKey: 'igst', header: t('igst') },
  { accessorKey: 'totalGst', header: t('totalGst') },
  { accessorKey: 'invoiceValue', header: t('invoiceValue') },
  { accessorKey: 'invoiceDate', header: t('invoiceDate') },
  { accessorKey: 'tds', header: t('tds') },
  { accessorKey: 'cgstTds', header: t('cgstTds') },
  { accessorKey: 'sgstTds', header: t('sgstTds') },
  { accessorKey: 'netPayable', header: t('netPayable') },
  { accessorKey: 'viewInvoice', header: t('viewInvoice') }
];

export const getVisibleColumnsLnpCumulativeSummary = (t) => [
  { accessorKey: 'lnpId', header: t('lnpId') },
  { accessorKey: 'lnp', header: t('lnp') },
  { accessorKey: 'agnpId', header: t('agnpId') },
  { accessorKey: 'agnpName', header: t('agnpName') },
  { accessorKey: 'invoiceNo', header: t('invoiceNo') },
  { accessorKey: 'workorderId', header: t('workorderId') },
  { accessorKey: 'locationInvoice', header: t('locationInvoice') },
  { accessorKey: 'customerName', header: t('customerName') },
  { accessorKey: 'locationName', header: t('locationName') },
  { accessorKey: 'package', header: t('package') },
  { accessorKey: 'revenueFromSubscriber', header: t('revenueFromSubscriber') },
  { accessorKey: 'dot', header: t('dot') },
  { accessorKey: 'agr', header: t('agr') },
  { accessorKey: 'lnpRevenueShare', header: t('lnpRevenueShare') },
  { accessorKey: 'sgstUgst', header: t('sgstUgst') },
  { accessorKey: 'cgst', header: t('cgst') },
  { accessorKey: 'igst', header: t('igst') },
  { accessorKey: 'totalGst', header: t('totalGst') },
  { accessorKey: 'totalInvoiceValue', header: t('totalInvoiceValue') },
  { accessorKey: 'tds', header: t('tds') },
  { accessorKey: 'sgstTds', header: t('sgstTds') },
  { accessorKey: 'cgstTds', header: t('cgstTds') }
];
