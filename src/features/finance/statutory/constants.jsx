export const STATE_REDUCER_KEY = 'statutory';

export const STATUTORY_TABLE_CONFIG = {
  REVENUE_CONTROL: {
    title: 'revenueControlReport',
    columns: [
      { accessor: 'partnerId', header: 'partnerId' },
      { accessor: 'company', header: 'company' },
      { accessor: 'lnpOpenBal', header: 'lnpOpenBal' },
      { accessor: 'lnpTopup', header: 'lnpTopup' },
      { accessor: 'lnpShare', header: 'lnpShare' },
      { accessor: 'ontRevenue', header: 'ontRevenue' },
      { accessor: 'subTopupOnline', header: 'subTopupOnline' },
      { accessor: 'lnpShareOnline', header: 'lnpShareOnline' },
      { accessor: 'receiptFromKNOFEWS', header: 'receiptFromKNOFEWS' },
      { accessor: 'lnpPaymentOnline', header: 'lnpPaymentOnline' },
      { accessor: 'gstWallet', header: 'gstWallet' },
      { accessor: 'gstDisbursed', header: 'gstDisbursed' },
      { accessor: 'gstReverted', header: 'gstReverted' },
      { accessor: 'transferToLNP', header: 'transferToLNP' },
      { accessor: 'transferFromLNP', header: 'transferFromLNP' },
      { accessor: 'reversalAdjustment', header: 'reversalAdjustment' },
      { accessor: 'subscriberTransferOnline', header: 'subscriberTransferOnline' },
      { accessor: 'lnpCloseBal', header: 'lnpCloseBal' },
      { accessor: 'subClBal', header: 'subClBal' },
      { accessor: 'revenuePartnerRecharge', header: 'revenuePartnerRecharge' }
    ]
  },
  GSTR2A_PARTNERS: {
    title: 'gstr2aPartners',
    columns: [
      { accessor: 'slNo', header: 'slNo' },
      { accessor: 'partnerId', header: 'partnerId' },
      { accessor: 'partnerName', header: 'partnerName' },
      { accessor: 'partnerType', header: 'partnerType' },
      { accessor: 'lnpInvoiceDate', header: 'lnpInvoiceDate' },
      { accessor: 'bssInvoiceNo', header: 'bssInvoiceNo' },
      { accessor: 'lnpInvoiceNo', header: 'lnpInvoiceNo' },
      { accessor: 'bssGstinNo', header: 'bssGstinNo' },
      { accessor: 'taxableValue', header: 'taxableValue' },
      { accessor: 'sgstUgst', header: 'sgstUgst' },
      { accessor: 'cgst', header: 'cgst' },
      { accessor: 'totalGst', header: 'totalGst' },
      { accessor: 'invoiceValue', header: 'invoiceValue' },
      { accessor: 'kfonFinanceApprovalStatus', header: 'kfonFinanceApprovalStatus' },
      { accessor: 'dateOfGstDocumentSubmittedByLnp', header: 'dateOfGstDocumentSubmittedByLnp' },
      { accessor: 'dateOfApprovalByKfonFinance', header: 'dateOfApprovalByKfonFinance' },
      { accessor: 'approvedGstAmount', header: 'approvedGstAmount' },
      { accessor: 'gstr2aStatus', header: 'gstr2aStatus' }
    ]
  },
  GSTR1_RETAIL_CORPORATE: {
    title: 'gstr1RetailCorporate',
    columns: [
      { accessor: 'gstState', header: 'gstState' },
      { accessor: 'serviceType', header: 'serviceType' },
      { accessor: 'category', header: 'category' },
      { accessor: 'documentType', header: 'documentType' },
      { accessor: 'gstin', header: 'gstin' },
      { accessor: 'userName', header: 'userName' },
      { accessor: 'documentNo', header: 'documentNo' },
      { accessor: 'documentDate', header: 'documentDate' },
      { accessor: 'taxableValue', header: 'taxableValue' },
      { accessor: 'cgst', header: 'cgst' },
      { accessor: 'sgst', header: 'sgst' },
      { accessor: 'igst', header: 'igst' },
      { accessor: 'totalGst', header: 'totalGst' },
      { accessor: 'documentValue', header: 'documentValue' },
      { accessor: 'type', header: 'type' }
    ]
  },
  SUB_INVOICE_B2B: {
    title: 'subInvoiceB2B',
    columns: [
      { accessor: 'receiptDate', header: 'receiptDate' },
      { accessor: 'receiptReference', header: 'receiptReference' },
      { accessor: 'invoiceNo', header: 'invoiceNo' },
      { accessor: 'username', header: 'username' },
      { accessor: 'particulars', header: 'particulars' },
      { accessor: 'package', header: 'package' },
      { accessor: 'serviceStartDate', header: 'serviceStartDate' },
      { accessor: 'serviceEndDate', header: 'serviceEndDate' },
      { accessor: 'packageFee', header: 'packageFee' },
      { accessor: 'cgst', header: 'cgst' },
      { accessor: 'sgstUgst', header: 'sgstUgst' },
      { accessor: 'igst', header: 'igst' },
      { accessor: 'gst', header: 'gst' },
      { accessor: 'grossAmount', header: 'grossAmount' },
      { accessor: 'taxpayerType', header: 'taxpayerType' }
    ]
  },
  DEFAULT: {
    title: 'report',
    columns: []
  }
};
