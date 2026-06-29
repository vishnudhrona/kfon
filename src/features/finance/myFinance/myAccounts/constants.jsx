export const STATE_REDUCER_KEY = 'my-accounts';

// Helper functions that return columns with translated headers
export const getVisibleColumnsAccountTopupReceiptDetails = (t) => [
  { accessorKey: 'dateTime', header: t('dateTime') },
  { accessorKey: 'transType', header: t('transactionType') },
  { accessorKey: 'amount', header: t('amount') },
  { accessorKey: 'reference', header: t('reference') }
];

export const getVisibleColumnsSubscriberAdvancedTopupVoucher = (t) => [
  { accessorKey: 'slNo', header: t('slNo') },
  { accessorKey: 'receiptDate', header: t('receiptDate') },
  { accessorKey: 'voucherNo', header: t('voucherNo') },
  { accessorKey: 'username', header: t('username') },
  { accessorKey: 'particulars', header: t('particulars') },
  { accessorKey: 'grossAmount', header: t('grossAmount') },
  { accessorKey: 'package', header: t('package') },
  { accessorKey: 'packageFee', header: t('packageFee') }
];

export const getVisibleColumnsTransferredToSubscriber = (t) => [
  { accessorKey: 'financeRef', header: t('financeRef') },
  { accessorKey: 'date', header: t('date') },
  { accessorKey: 'amount', header: t('amount') },
  { accessorKey: 'username', header: t('username') },
  { accessorKey: 'subscriberId', header: t('subscriberId') }
];

export const getVisibleColumnsRevenue = (t) => [
  { accessorKey: 'date', header: t('date') },
  { accessorKey: 'groupId', header: t('groupId') },
  { accessorKey: 'username', header: t('username') },
  { accessorKey: 'connectionType', header: t('connectionType') },
  { accessorKey: 'revenue', header: t('revenue') },
  { accessorKey: 'lnpShare', header: t('lnpShare') },
  { accessorKey: 'tds', header: t('tds') },
  { accessorKey: 'netRevenueshare', header: t('netRevenueshare') },
  { accessorKey: 'disburseStatus', header: t('disburseStatus') },
  { accessorKey: 'description', header: t('description') }
];

export const getVisibleColumnsGstWallet = (t) => [
  { accessorKey: 'slNo', header: t('slNo') },
  { accessorKey: 'createDate', header: t('createDate') },
  { accessorKey: 'bssInvoiceNo', header: t('bssInvoiceNo') },
  { accessorKey: 'cause', header: t('cause') },
  { accessorKey: 'gstAmount', header: t('gstAmount') },
  { accessorKey: 'approvedAmount', header: t('approvedAmount') },
  { accessorKey: 'balanceAmount', header: t('balanceAmount') },
  { accessorKey: 'approvedOn', header: t('approvedOn') },
  { accessorKey: 'type', header: t('type') }
];

export const getVisibleColumnsFinanceTransactions = (t) => [
  { accessorKey: 'txnNo', header: t('txnNo') },
  { accessorKey: 'date', header: t('date') },
  { accessorKey: 'description', header: t('description') },
  { accessorKey: 'subscriberName', header: t('subscriberName') },
  { accessorKey: 'subscriberId', header: t('subscriberId') },
  { accessorKey: 'connectionType', header: t('connectionType') },
  { accessorKey: 'amount', header: t('amount') },
  { accessorKey: 'openingBalance', header: t('openingBalance') },
  { accessorKey: 'closingBalance', header: t('closingBalance') }
];

export const getVisibleColumnsSubscriberFinance = (t) => [
  { accessorKey: 'date', header: t('date') },
  { accessorKey: 'amount', header: t('amount') },
  { accessorKey: 'description', header: t('description') }
];

export const getVisibleColumnsDisbursementDetails = (t) => [
  { accessorKey: 'date', header: t('date') },
  { accessorKey: 'cause', header: t('cause') },
  { accessorKey: 'amount', header: t('amount') }
];

export const getVisibleColumnsSubscriberInvoice = (t) => [
  { accessorKey: 'slNo', header: t('slNo') },
  { accessorKey: 'receiptDate', header: t('receiptDate') },
  { accessorKey: 'receiptReference', header: t('receiptReference') },
  { accessorKey: 'grossAmount', header: t('grossAmount') },
  { accessorKey: 'username', header: t('username') },
  { accessorKey: 'invoiceNo', header: t('invoiceNo') }
];

export const getVisibleColumnsMonthlyLnpInvoice = (t) => [
  { accessorKey: 'month', header: t('month') },
  { accessorKey: 'status', header: t('status') },
  { accessorKey: 'revenue', header: t('revenue') },
  { accessorKey: 'lnpShare', header: t('lnpShare') },
  { accessorKey: 'revenueshareInvoicing', header: t('revenueshareInvoicing') },
  { accessorKey: 'acquisitionInvoicing', header: t('acquisitionInvoicing') },
  { accessorKey: 'quantityRevenueInvoicing', header: t('quantityRevenueInvoicing') },
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
  { accessorKey: 'view', header: t('view') },
  { accessorKey: 'invoiceNo', header: t('invoiceNo') }
];

export const getVisibleColumnsOnlineTransactionHistory = (t) => [
  { accessorKey: 'orderTime', header: t('orderTime') },
  { accessorKey: 'orderAmount', header: t('orderAmount') },
  { accessorKey: 'bssReference', header: t('bssReference') },
  { accessorKey: 'bssStatus', header: t('bssStatus') },
  { accessorKey: 'txnReference', header: t('txnReference') },
  { accessorKey: 'responseMessage', header: t('responseMessage') },
  { accessorKey: 'paymentGateway', header: t('paymentGateway') }
];

export const getVisibleColumnsSubscriberOnlineRecharge = (t) => [
  { accessorKey: 'slNo', header: t('slNo') },
  { accessorKey: 'orderTime', header: t('orderTime') },
  { accessorKey: 'subscriberId', header: t('subscriberId') },
  { accessorKey: 'username', header: t('username') },
  { accessorKey: 'orderAmount', header: t('orderAmount') },
  { accessorKey: 'billingReference', header: t('billingReference') },
  { accessorKey: 'billingStatus', header: t('billingStatus') },
  { accessorKey: 'txnReference', header: t('txnReference') },
  { accessorKey: 'paymentGateway', header: t('paymentGateway') },
  { accessorKey: 'billingResponse', header: t('billingResponse') }
];

export const paymentGatewayUrls = {
  hdfc: 'https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction',
  ikm: 'https://demo.ikmpgapi.kerala.gov.in/api/v1/pgtransactionb2breq_sec'
};
