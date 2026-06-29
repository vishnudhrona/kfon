export const FINANCE_ROUTES = {
  // ── Recharge ──────────────────────────────────────────────────────────────
  FINANCE_ONLINE_TOPUP: { label: 'menu.onlineTopUp', path: '/app/finance/online-top-up', icon: '' },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  REVENU_DASHBOARD: { label: 'menu.revenueDashboard', path: '/app/finance/dashboard/revenue-share', icon: '' },

  // ── My Finance (group headers) ─────────────────────────────────────────────
  MY_FINANCE: { label: 'menu.myFinance', path: '/app/myfinance/franchisee-corporate-invoices', icon: '' },

  // My Finance > My Accounts (group header)
  MY_ACCOUNTS: { label: 'menu.myAccounts', path: '/app/finance/account-topup-receipt-details', icon: '' },

  // My Finance > My Accounts (clickable items)
  ACCOUNT_TOP_UP_RECEIPT_DETAILS: {
    label: 'menu.accountTopUpReceiptDetails',
    path: '/app/finance/account-topup-receipt-details',
    icon: ''
  },
  SUBSCRIBER_ADVANCED_TOP_UP_VOUCHER: {
    label: 'menu.subscriberAdvancedTopupVoucher',
    path: '/app/finance/subscriber-advanced-topup-voucher',
    icon: ''
  },
  TRANSFERRED_TO_SUBSCRIBER: {
    label: 'menu.transferredToSubscriber',
    path: '/app/finance/transferred-to-subscriber',
    icon: ''
  },
  REVENUE: { label: 'menu.revenue', path: '/app/finance/revenue', icon: '' },
  GST_WALLET: { label: 'menu.gstWallet', path: '/app/finance/gst-wallet', icon: '' },
  FINANCE_TRANSACTIONS: { label: 'menu.financeTransactions', path: '/app/finance/finance-transactions', icon: '' },
  MY_ACCOUNTS_SUBSCRIBER_FINANCE: {
    label: 'menu.myAccountsSubscriberFinance',
    path: '/app/finance/subscriber-finance',
    icon: ''
  },
  MY_ACCOUNTS_DISBURSEMENT: {
    label: 'menu.myAccountsDisbursement',
    path: '/app/finance/disbursement-details',
    icon: ''
  },
  SUBSCRIBER_INVOICE: { label: 'menu.subscriberInvoice', path: '/app/finance/subscriber-invoice', icon: '' },
  MONTHLY_LNP_INVOICE: { label: 'menu.monthlyLnpInvoice', path: '/app/finance/monthly-lnp-invoice', icon: '' },
  ONLINE_TRANSACTION_HISTORY: {
    label: 'menu.onlineTransactionHistory',
    path: '/app/finance/online-transaction-history',
    icon: ''
  },
  MY_ACCOUNTS_SUBSCRIBER_ONLINE_RECHARGE: {
    label: 'menu.myAccountsSubscriberOnlineRecharge',
    path: '/app/finance/subscriber-online-recharge',
    icon: ''
  },

  // My Finance > Corporate (clickable items)
  INVICE_APPROVAL: { label: 'menu.invoiceApproval', path: '/app/myfinance/franchisee-corporate-invoices', icon: '' },
  OTC_APPROVAL: { label: 'menu.otcApproval', path: '/app/myfinance/otc-approval', icon: '' },
  SUBSCRIBER_DETAILS: { label: 'menu.subscriberDetails', path: '/app/myfinance/subscriber-details', icon: '' },
  LNP_PARTNER_FINANCE: { label: 'menu.lnpPartnerFinance', path: '/app/myfinance/lnp-partner-finance', icon: '' },
  DISBURSEMENT: { label: 'menu.disbursement', path: '/app/myfinance/disbursement', icon: '' },
  LNP_SUMMARY_LOCATION: { label: 'menu.lnpSummaryLocation', path: '/app/myfinance/lnp-summary-location', icon: '' },
  LNP_CREDIT_NOTES_CORPORATE: {
    label: 'menu.lnpCreditNotesCorporate',
    path: '/app/myfinance/lnp-credit-notes',
    icon: ''
  },
  LNP_CUMULATIVE_SUMMARY: {
    label: 'menu.lnpCumulativeSummary',
    path: '/app/myfinance/lnp-cumulative-summary',
    icon: ''
  },

  // ── Accounts (group headers) ───────────────────────────────────────────────
  ACCOUNTS: { label: 'menu.accounts', path: '/app/finance/accounts/partner-accounts/balance', icon: '' },
  PARTNER_FINANCE: {
    label: 'menu.partnerFinance',
    path: '/app/finance/accounts/partner-accounts/balance',
    icon: 'FinanceDemandReportIcon'
  },
  SUBSCRIBER: {
    label: 'menu.subscriber',
    path: '/app/finance/accounts/subscriber-accounts/account',
    icon: 'SubscriberFinanceReportIcon'
  },
  EXPENSE_REPORT: {
    label: 'menu.expenseReports',
    path: '/app/finance/accounts/expense-reports',
    icon: 'FinanceDemandReportIcon'
  },
  EXPENSE_REPORT_DASHBOARD: {
    label: 'menu.expenseReportsDashboard',
    path: '/app/finance/accounts/expense-reports'
  },
  EXPENSE_REPORT_LNP_RETAIL: {
    label: 'menu.expenseReportsLnpRetail',
    path: '/app/finance/accounts/expense-reports/lnp-retail'
  },
  EXPENSE_REPORT_LNP_ENTERPRISE: {
    label: 'menu.expenseReportsLnpEnterprise',
    path: '/app/finance/accounts/expense-reports/lnp-enterprise'
  },
  EXPENSE_REPORT_AGNP_ENTERPRISE: {
    label: 'menu.expenseReportsAgnpEnterprise',
    path: '/app/finance/accounts/expense-reports/agnp-enterprise'
  },
  EXPENSE_REPORT_MSP_REVENUE: {
    label: 'menu.expenseReportsMspRevenue',
    path: '/app/finance/accounts/expense-reports/msp-revenue'
  },
  EXPENSE_REPORT_VAS_PROVIDER: {
    label: 'menu.expenseReportsVasProvider',
    path: '/app/finance/accounts/expense-reports/vas-provider'
  },
  EXPENSE_REPORT_PARTNERS_INCENTIVES: {
    label: 'menu.expenseReportsPartnersIncentives',
    path: '/app/finance/accounts/expense-reports/partners-incentives'
  },
  EXPENSE_REPORT_INCENTIVES_SUMMARY: {
    label: 'menu.expenseReportsIncentivesSummary',
    path: '/app/finance/accounts/expense-reports/incentives-summary'
  },
  EXPENSE_REPORT_PARTNER_GST_REFUND: {
    label: 'menu.expenseReportsPartnerGstRefund',
    path: '/app/finance/accounts/expense-reports/partner-gst-refund'
  },
  EXPENSE_REPORT_REVENUE_CONTROL: {
    label: 'menu.expenseReportsRevenueControl',
    path: '/app/finance/accounts/expense-reports/revenue-control'
  },

  // Accounts > Partners (clickable items)
  PARTNER_ACCOUNT_BALANCE: {
    label: 'menu.partnerAccountBalance',
    path: '/app/finance/accounts/partner-accounts/balance',
    icon: ''
  },
  PARTNER_ACCOUNT_TOP_UP_RECEIPT: {
    label: 'menu.partnerAccountTopUpReceipt',
    path: '/app/finance/accounts/partner-accounts/topup-receipt',
    icon: ''
  },
  PARTNER_ACCOUNT_DISBURSMENT: {
    label: 'menu.partnerAccountDisbursement',
    path: '/app/finance/accounts/partner-accounts/disbursement',
    icon: ''
  },
  PARTNER_FINANCE_DETAILS: {
    label: 'menu.partnerFinanceDetails',
    path: '/app/finance/accounts/partner-accounts/finance'
  },

  SUBSCRIBER_ONLINE_RECHARGE: {
    label: 'menu.subscriberOnlineRecharge',
    path: '/app/finance/accounts/partner-accounts/subscriber-recharge',
    icon: ''
  },
  CORPORATE_SUBSCRIBER_ONLINE_RECHARGE: {
    label: 'menu.corporateSubscriberOnlineRecharge',
    path: '/app/finance/accounts/partner-accounts/corporate-recharge',
    icon: ''
  },
  LNP_ONLINE_RECHARGE: {
    label: 'menu.lnpOnlineRecharge',
    path: '/app/finance/accounts/partner-accounts/lnp-recharge',
    icon: ''
  },
  LNP_PARTNER_FINANCE_CORPORATE: {
    label: 'menu.lnpPartnerFinanceCorporate',
    path: '/app/finance/accounts/partner-accounts/lnp-corporate',
    icon: ''
  },
  AGNP_PARTNER_FINANCE_CORPORATE: {
    label: 'menu.agnpPartnerFinanceCorporate',
    path: '/app/finance/accounts/partner-accounts/agnp-corporate',
    icon: ''
  },
  PARTNER_ONE_PLUS_ONE_REPORT: {
    label: 'menu.partnerOnePlusOneReport',
    path: '/app/finance/accounts/partner-accounts/one-plus-one',
    icon: ''
  },

  // Accounts > Subscriber (clickable items)
  SUBSCRIBER_ACCOUNTS: {
    label: 'menu.subscriberAccounts',
    path: '/app/finance/accounts/subscriber-accounts/account',
    icon: ''
  },
  SUBSCRIBER_FINANCE: {
    label: 'menu.subscriberFinance',
    path: '/app/finance/accounts/subscriber-accounts/finance',
    icon: ''
  },
  SUBSCRIBER_RENEWAL: {
    label: 'menu.subscriberRenewal',
    path: '/app/finance/accounts/subscriber-accounts/renewal',
    icon: ''
  },
  SUBSCRIBER_PARTNER_TRANSFER: {
    label: 'menu.subscriberPartnerTransfer',
    path: '/app/finance/accounts/subscriber-accounts/partner-transfer',
    icon: ''
  },

  // ── Invoices (group headers) ───────────────────────────────────────────────
  INVOICES: { label: 'menu.invoices', path: '/app/finance/invoices/lnp-retail-invoice', icon: '' },
  INVOICE: { label: 'menu.invoice', path: '/app/finance/invoices/lnp-retail-invoice', icon: '' },
  REPORTS: { label: 'menu.invoiceReports', path: '/app/finance/invoices/reports/lnp-summary-details', icon: '' },
  REVENUE_REPORT: {
    label: 'menu.revenueReports',
    path: '/app/finance/invoice/revenue-report',
    icon: 'FinanceDemandReportIcon'
  },
  REVENUE_REPORT_DASHBOARD: {
    label: 'menu.revenueReportsDashboard',
    path: '/app/finance/invoice/revenue-report'
  },
  REVENUE_REPORT_ALL: {
    label: 'menu.revenueReportsAll',
    path: '/app/finance/invoice/revenue-report/all'
  },
  REVENUE_REPORT_INVOICE_REVENUE: {
    label: 'menu.revenueReportsInvoiceRevenue',
    path: '/app/finance/invoice/revenue-report/invoice-wise-revenue'
  },
  REVENUE_REPORT_CREDIT_NOTE: {
    label: 'menu.revenueReportsCreditNote',
    path: '/app/finance/invoice/revenue-report/credit-notes-customer'
  },
  REVENUE_REPORT_BY_SEGMENT: {
    label: 'menu.revenueReportsBySegment',
    path: '/app/finance/invoice/revenue-report/by-segment'
  },
  REVENUE_REPORT_BY_CUSTOMER: {
    label: 'menu.revenueReportsByCustomer',
    path: '/app/finance/invoice/revenue-report/by-customer'
  },

  // Invoices > Invoice (clickable items)
  LNP_RETAIL_INVOICE: { label: 'menu.lnpRetailInvoice', path: '/app/finance/invoices/lnp-retail-invoice', icon: '' },
  MSP_BU_OE_INVOICE: { label: 'menu.mspBuOeInvoice', path: '/app/finance/invoices/msp-buo-invoice', icon: '' },
  AGNP_RETAIL_INVOICE: { label: 'menu.agnpRetailInvoice', path: '/app/finance/invoices/topup-receipt', icon: '' },
  LNP_CORPORATE_INVOICE: {
    label: 'menu.lnpCorporateInvoice',
    path: '/app/finance/invoices/lnp-corporate-invoice',
    icon: ''
  },
  AGNP_CORPORATE_INVOICE: {
    label: 'menu.agnpCorporateInvoice',
    path: '/app/finance/invoices/agnp-corporate-invoice',
    icon: ''
  },
  SUBSCRIBER_INVOICE_REPORTS: {
    label: 'menu.subscriberInvoiceReports',
    path: '/app/finance/invoices/subscriber-invoice',
    icon: ''
  },
  ONT_PURCHASE_INVOICE: { label: 'menu.ontPurchaseInvoice', path: '/app/finance/invoices/ont-purchase', icon: '' },
  SUBSCRIBER_BPL_INVOICE: {
    label: 'menu.subscriberBplInvoice',
    path: '/app/finance/invoices/subscriber-bpl-invoice',
    icon: ''
  },
  EO_SUBSCRIBER_INVOICE: {
    label: 'menu.eoSubscriberInvoice',
    path: '/app/finance/invoices/subscriber-eo-invoice',
    icon: ''
  },
  LNP_CORPORATE_OTC_INVOICE: {
    label: 'menu.lnpCorporateOtcInvoice',
    path: '/app/finance/invoices/lnp-corporate-otc-invoice',
    icon: ''
  },
  MSP_CORPORATE_INVOICE: {
    label: 'menu.mspCorporateInvoice',
    path: '/app/finance/invoices/msp-corporate-invoice',
    icon: ''
  },
  OTT_PROVIDER_INVOICE: {
    label: 'menu.ottProviderInvoice',
    path: '/app/finance/invoices/ott-provider-invoice',
    icon: ''
  },

  // Invoices > Reports (clickable items)
  LNP_SUMMARY_DETAILS: {
    label: 'menu.lnpSummaryDetails',
    path: '/app/finance/invoices/reports/lnp-summary-details',
    icon: ''
  },
  LNP_SUMMARY_CORPORATE: {
    label: 'menu.lnpSummaryCorporate',
    path: '/app/finance/invoices/reports/lnp-summary-corporate',
    icon: ''
  },
  GSTIN_STATUS_LNP: { label: 'menu.gstinStatusLnp', path: '/app/finance/invoices/reports/gstin-status-lnp', icon: '' },
  SUBSCRIBER_SUMMARY_DETAILS: {
    label: 'menu.subscriberSummaryDetails',
    path: '/app/finance/invoices/reports/subscriber-summary-details',
    icon: ''
  },
  LNP_SPECIAL_INCENTIVE: {
    label: 'menu.lnpSpecialIncentive',
    path: '/app/finance/invoices/reports/lnp-special-incentive',
    icon: ''
  },
  AGNP_SUMMARY: { label: 'menu.agnpSummary', path: '/app/finance/invoices/reports/agnp-summary', icon: '' },
  INVOICE_AGEING_REPORT: {
    label: 'menu.invoiceWiseAgeingReport',
    path: '/app/finance/invoices/reports/invoice-wise-ageing-report',
    icon: ''
  },
  INVOICE_PAYMENT_REPORT: {
    label: 'menu.invoicePaymentReport',
    path: '/app/finance/invoices/reports/invoice-payment-report',
    icon: ''
  },
  RETENTION_INCENTIVE_REPORT: {
    label: 'menu.retentionIncentiveReport',
    path: '/app/finance/invoices/reports/retention-incentive-report',
    icon: ''
  },
  CORPORATE_CUSTOMER_PAYMENT: {
    label: 'menu.corporateCustomerPayment',
    path: '/app/finance/invoices/reports/corporate-customer-payment',
    icon: ''
  },
  CORPORATE_INVOICE_PAYMENT: {
    label: 'menu.corporateInvoicePayment',
    path: '/app/finance/invoices/reports/corporate-invoice-payment',
    icon: ''
  },

  // ── Accounts > Wallet Reports (group header + clickable items) ────────────
  WALLET_REPORTS: {
    label: 'menu.walletReports',
    path: '/app/finance/accounts/wallet-reports/lnp',
    icon: 'WalletReportIcon'
  },
  LNP_WALLET_REPORT: { label: 'menu.lnpWallet', path: '/app/finance/accounts/wallet-reports/lnp', icon: '' },
  SUBSCRIBER_WALLET_REPORT: {
    label: 'menu.subscriberWallet',
    path: '/app/finance/accounts/wallet-reports/subscriber',
    icon: ''
  },
  AGNP_WALLET_REPORT: { label: 'menu.agnpWallet', path: '/app/finance/accounts/wallet-reports/agnp', icon: '' },

  // ── Accounts > GST Reports (group header + clickable items) ───────────────
  GST_REPORTS: { label: 'menu.gstReports', path: '/app/finance/accounts/gst-reports/gstr2a', icon: 'WalletReportIcon' },
  GSTR_2A_REFUND_REPORT: { label: 'menu.gstr2aRefund', path: '/app/finance/accounts/gst-reports/gstr2a', icon: '' },
  GSTR_1_REPORT: { label: 'menu.gstr1Report', path: '/app/finance/accounts/gst-reports/gstr1', icon: '' },
  B2B_INVOICES_REPORT: { label: 'menu.b2bInvoices', path: '/app/finance/accounts/gst-reports/b2b', icon: '' },

  // ── Accounts > Recharge Reports (group header + clickable items) ──────────
  RECHARGE_REPORTS: {
    label: 'menu.rechargeReports',
    path: '/app/finance/accounts/recharge-reports/subscriber',
    icon: 'SubscriberReportIcon'
  },
  SUBSCRIBER_ONLINE_RECHARGE_REPORTS: {
    label: 'menu.subscriberOnlineRechargeReports',
    path: '/app/finance/accounts/recharge-reports/subscriber',
    icon: ''
  },
  PARTNER_WALLET_RECHARGE_REPORTS: {
    label: 'menu.partnerWalletRechargeReports',
    path: '/app/finance/accounts/recharge-reports/partner',
    icon: ''
  },
  RECHARGE_INSIGHTS_REPORTS: {
    label: 'menu.rechargeInsightsReports',
    path: '/app/finance/accounts/recharge-reports/insights',
    icon: ''
  },

  // ── Statutory (group headers) ──────────────────────────────────────────────
  STATUTORY: { label: 'menu.statutory', path: '/app/finance/statutory/revenue-control', icon: '' },
  STATUTORY_REPORTS: { label: 'menu.statutoryReports', path: '/app/finance/statutory/revenue-control', icon: '' },

  // Statutory > Statutory Reports (clickable items)
  REVENUE_CONTROL_REPORT: {
    label: 'menu.revenueControlReport',
    path: '/app/finance/statutory/revenue-control',
    icon: ''
  },
  GSTR2A_PARRTNERS_REPORT: {
    label: 'menu.gstr2aPartnersReport',
    path: '/app/finance/statutory/gstr2a-partners',
    icon: ''
  },
  GSTR1_RETAIL_CORPORATE_REPORT: {
    label: 'menu.gstr1RetailCorporateReport',
    path: '/app/finance/statutory/gstr1-retail-corporate',
    icon: ''
  },
  SUB_INVOICE_B2B_RETAIL_REPORT: {
    label: 'menu.subInvoiceB2bRetailReport',
    path: '/app/finance/statutory/sub-invoice-b2b',
    icon: ''
  },
  SUB_INVOICE_B2C_RETAIL_REPORT: {
    label: 'menu.subInvoiceB2cRetailReport',
    path: '/app/finance/statutory/sub-invoice-b2c-retails',
    icon: ''
  },
  SUB_INVOICE_B2B_CORPORATE_REPORT: {
    label: 'menu.subInvoiceB2bCorporateReport',
    path: '/app/finance/statutory/sub-invoice-b2b-corporate',
    icon: ''
  },
  SUB_INVOICE_B2C_CORPORATE_REPORT: {
    label: 'menu.subInvoiceB2cCorporateReport',
    path: '/app/finance/statutory/sub-invoice-b2c-corporate',
    icon: ''
  },
  NLD_REPORT: { label: 'menu.nldReport', path: '/app/finance/statutory/nld-report', icon: '' },
  AGR_REPORT: { label: 'menu.agrReport', path: '/app/finance/statutory/agr-report', icon: '' }
};
