export const STATE_REDUCER_KEY = 'ticket-key';
export const KEY_BACKSPACE = 'Backspace';
export const DASHBOARD_CARDS = {
  // ------------------------------
  // TOP LARGE CARDS (2) - FTTH Stats
  // ------------------------------
  top: [
    {
      id: 'new_today',
      title: 'New',
      highlight: 'Activations',
      subtitle: 'Today',
      value: 0,
      growth: 102,
      bg: '#FFEDF6',
      color: '#8D0247',
      large: true,
      icon: 'ActivationToday'
    },
    {
      id: 'new_last_day',
      title: 'New',
      highlight: 'Activations',
      subtitle: 'Last Day',
      value: 0,
      growth: 102,
      bg: '#EDFFFF',
      color: '#027F8D',
      large: true,
      icon: 'ActivationLastDay'
    }
  ],

  // ------------------------------
  // DARK FIBER STATS - TOP CARDS (2)
  // ------------------------------
  darkFiberTop: [
    {
      id: 'total_enquiry_count',
      title: 'total',
      highlight: 'enquiry',
      subtitle: 'count',
      value: 0,
      growth: 102,
      bg: '#FFEDF6',
      color: '#8D0247',
      large: true,
      icon: 'ActivationToday'
    },
    {
      id: 'total_customers',
      title: '',
      highlight: 'total',
      subtitle: 'customers',
      value: 0,
      growth: 102,
      bg: '#EDFFFF',
      color: '#027F8D',
      large: true,
      icon: 'ActivationLastDay'
    }
  ],

  // ------------------------------
  // DARK FIBER STATS - ROW 2 (4 CARDS)
  // ------------------------------
  darkFiberRow2: [
    {
      id: 'dark_fiber_mou',
      title: 'Dark ',
      highlight: 'Fiber',
      subtitle: 'mou',
      value: 0,
      growth: 102,
      bg: '#FFEDF6',
      color: '#8D0247',
      icon: 'ActivationCurrentMonth'
    },
    {
      id: 'total_enquiry_in_kms',
      title: 'total',
      highlight: 'enquiry',
      subtitle: 'inKms',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'ActiveRetailSubscriber'
    },
    {
      id: 'total_delivered_qty_in_kms',
      title: 'total',
      highlight: 'delivered',
      subtitle: 'qtyInKms',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'ActiveBplSubscribers'
    },
    {
      id: 'total_revenue_generated',
      title: 'total',
      highlight: 'revenue',
      subtitle: 'generated',
      value: 0,
      growth: 102,
      bg: '#EFFFFB',
      color: '#02748D',
      icon: 'ActiveBplPhase2Subscribers'
    }
  ],

  // ------------------------------
  // ENTERPRISE-PRIVATE STATS - TOP CARDS (2)
  // ------------------------------
  enterprisePrivateTop: [
    {
      id: 'ep_total_enquiries',
      title: 'total',
      highlight: 'enquires',
      subtitle: 'countAsOnDate',
      value: 0,
      growth: 102,
      bg: '#FFEDF6',
      color: '#8D0247',
      large: true,
      icon: 'ActivationToday'
    },
    {
      id: 'ep_enquiries_responded',
      title: '',
      highlight: 'enquiries',
      subtitle: 'responded',
      value: 0,
      growth: 102,
      bg: '#EDFFFF',
      color: '#027F8D',
      large: true,
      icon: 'ActivationLastDay'
    }
  ],

  // ------------------------------
  // ENTERPRISE-PRIVATE STATS - ROW 2 (4 CARDS)
  // ------------------------------
  enterprisePrivateRow2: [
    {
      id: 'ep_customer_created',
      title: '',
      highlight: 'customer',
      subtitle: 'created',
      value: 0,
      growth: 102,
      bg: '#FFEDF6',
      color: '#8D0247',
      icon: 'ActivationCurrentMonth'
    },
    {
      id: 'ep_proposal_issued',
      title: '',
      highlight: 'proposal',
      subtitle: 'issued',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'ActiveRetailSubscriber'
    },
    {
      id: 'ep_po_received',
      title: '',
      highlight: 'po',
      subtitle: 'received',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'ActiveBplSubscribers'
    },
    {
      id: 'ep_total_circuits',
      title: '',
      highlight: 'total',
      subtitle: 'circuitsLocations',
      value: 0,
      growth: 102,
      bg: '#EFFFFB',
      color: '#02748D',
      icon: 'ActiveBplPhase2Subscribers'
    }
  ],

  // ------------------------------
  // ENTERPRISE-PRIVATE STATS - ROW 3 (3 CARDS)
  // ------------------------------
  enterprisePrivateRow3: [
    {
      id: 'ep_total_service_delivered',
      title: 'total',
      highlight: 'service',
      subtitle: 'delivered',
      value: 0,
      growth: 102,
      bg: '#DEFFF1',
      color: '#028D20',
      icon: 'ActiveSubscribers'
    },
    {
      id: 'ep_total_billing_started',
      title: 'total',
      highlight: 'billing',
      subtitle: 'started',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'PendingKYC'
    },
    {
      id: 'ep_total_revenue_generated',
      title: 'total',
      highlight: 'revenue',
      subtitle: 'generated',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'KYCReceivedToday'
    }
  ],

  // ------------------------------
  // ENTERPRISE-GOVERNMENT STATS - TOP CARDS (2)
  // ------------------------------
  enterpriseGovernmentTop: [
    {
      id: 'eg_total_enquiries',
      title: 'total',
      highlight: 'enquires',
      subtitle: 'countAsOnDate',
      value: 0,
      growth: 102,
      bg: '#FFEDF6',
      color: '#8D0247',
      large: true,
      icon: 'ActivationToday'
    },
    {
      id: 'eg_enquiries_responded',
      title: '',
      highlight: 'enquiries',
      subtitle: 'responded',
      value: 0,
      growth: 102,
      bg: '#EDFFFF',
      color: '#027F8D',
      large: true,
      icon: 'ActivationLastDay'
    }
  ],

  // ------------------------------
  // ENTERPRISE-GOVERNMENT STATS - ROW 2 (4 CARDS)
  // ------------------------------
  enterpriseGovernmentRow2: [
    {
      id: 'eg_customer_created',
      title: '',
      highlight: 'customer',
      subtitle: 'created',
      value: 0,
      growth: 102,
      bg: '#FFEDF6',
      color: '#8D0247',
      icon: 'ActivationCurrentMonth'
    },
    {
      id: 'eg_proposal_issued',
      title: '',
      highlight: 'proposal',
      subtitle: 'issued',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'ActiveRetailSubscriber'
    },
    {
      id: 'eg_po_received',
      title: '',
      highlight: 'po',
      subtitle: 'received',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'ActiveBplSubscribers'
    },
    {
      id: 'eg_total_circuits',
      title: '',
      highlight: 'total',
      subtitle: 'circuitsLocations',
      value: 0,
      growth: 102,
      bg: '#EFFFFB',
      color: '#02748D',
      icon: 'ActiveBplPhase2Subscribers'
    }
  ],

  // ------------------------------
  // ENTERPRISE-GOVERNMENT STATS - ROW 3 (3 CARDS)
  // ------------------------------
  enterpriseGovernmentRow3: [
    {
      id: 'eg_total_service_delivered',
      title: 'total',
      highlight: 'service',
      subtitle: 'delivered',
      value: 0,
      growth: 102,
      bg: '#DEFFF1',
      color: '#028D20',
      icon: 'ActiveSubscribers'
    },
    {
      id: 'eg_total_billing_started',
      title: 'total',
      highlight: 'billing',
      subtitle: 'started',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'PendingKYC'
    },
    {
      id: 'eg_total_revenue_generated',
      title: 'total',
      highlight: 'revenue',
      subtitle: 'generated',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'KYCReceivedToday'
    }
  ],

  // ------------------------------
  // ROW 2 — 4 CARDS
  // ------------------------------
  row2: [
    {
      id: 'new_month',
      title: 'New',
      highlight: 'Activations',
      subtitle: 'Current Month',
      value: 0,
      growth: 102,
      bg: '#FFEFF2',
      color: '#8D0247',
      icon: 'ActivationCurrentMonth'
    },
    {
      id: 'active_retail',
      title: 'Active',
      highlight: 'Retail',
      subtitle: 'Subscribers',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'ActiveRetailSubscriber'
    },
    {
      id: 'active_bpl1',
      title: 'Active',
      highlight: 'BPL',
      subtitle: 'Subscribers-Phase 1',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'ActiveBplSubscribers'
    },
    {
      id: 'active_bpl2',
      title: 'Active',
      highlight: 'BPL',
      subtitle: 'Subscribers-Phase 2',
      value: 0,
      growth: 102,
      bg: '#EFFFFB',
      color: '#02748D',
      icon: 'ActiveBplPhase2Subscribers'
    },
    {
      id: 'total_active',
      title: 'Total',
      highlight: 'Active',
      subtitle: 'Subscribers',
      value: 0,
      growth: 102,
      bg: '#DEFFF1',
      color: '#028D20',
      icon: 'ActiveSubscribers'
    },
    {
      id: 'pending_kyc',
      title: 'Pending',
      highlight: 'KYC',
      subtitle: 'Count',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'PendingKYC'
    },
    {
      id: 'kyc_today',
      title: 'KYCs',
      highlight: 'Received',
      subtitle: 'Today',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'KYCReceivedToday'
    },
    {
      id: 'kyc_month',
      title: 'KYCs',
      highlight: 'Received',
      subtitle: 'Current Month',
      value: 0,
      growth: 102,
      bg: '#FFF1DE',
      color: '#F5612A',
      icon: 'KYCReceivedCurrentMonth'
    }
  ],
  // ------------------------------
  // SECTION OF 12 CARDS
  // ------------------------------
  section12: [
    {
      id: 'total_lnp',
      title: 'Total',
      highlight: 'LNPs',
      subtitle: 'On Boarded',
      value: 0,
      growth: 102,
      bg: '#FFEFF2',
      color: '#8D0247',
      icon: 'TotalLNPOnBoarded'
    },
    {
      id: 'total_frc',
      title: 'Total',
      highlight: 'FRC',
      subtitle: 'Payments',
      value: 0,
      growth: 102,
      bg: '#FFF1DE',
      color: '#F5612A',
      icon: 'TotalFRCPayments'
    },
    {
      id: 'total_links',
      title: 'Total',
      highlight: 'Links',
      subtitle: 'Established',
      value: 0,
      growth: 102,
      bg: '#EFFFFB',
      color: '#02748D',
      icon: 'NMSPortal'
    },
    {
      id: 'churn_recovery_today',
      title: 'Churn',
      highlight: 'Recovery',
      subtitle: 'Today',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'ChurnRecoveryToday'
    },

    {
      id: 'churn_recovery_this_month',
      title: 'Churn',
      highlight: 'Recovery',
      subtitle: 'This Month',
      value: 0,
      growth: 102,
      bg: '#FFF1DE',
      color: '#F5612A',
      icon: 'ChurnRecoveryThisMonth'
    },
    {
      id: 'subscribers_churned_date',
      title: 'Subscribers',
      highlight: 'Churned',
      subtitle: 'As On Date',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'SubscribersChurnedDate'
    },
    {
      id: 'active_lnp_count',
      title: 'Active',
      highlight: 'LNPs',
      subtitle: 'Count',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'ActiveLNPCount'
    },
    {
      id: 'frc_pending',
      title: 'FRC',
      highlight: 'Pending',
      subtitle: 'Subscriber Count',
      value: 0,
      growth: 102,
      bg: '#FFF1DE',
      color: '#F5612A',
      icon: 'FRCPendingSubscriber'
    },
    {
      id: 'ltop_10_lnps',
      title: 'Top 10',
      highlight: 'LNPs',
      subtitle: 'Subscriberwise',
      value: 0,
      growth: 102,
      bg: '#FFEFF2',
      color: '#8D0247',
      icon: 'Top10LNPSubscribers'
    },
    {
      id: 'top10_lnp_business',
      title: 'Top 10',
      highlight: 'LNPs',
      subtitle: 'Businesswise',
      value: 0,
      growth: 102,
      bg: '#FFF1DE',
      color: '#F5612A',
      icon: 'Top10LNPBusinesswise'
    },
    {
      id: 'ltop_10_lnps',
      title: 'LNPs',
      highlight: 'Enquiry',
      subtitle: 'Count(As on Date)',
      value: 0,
      growth: 102,
      bg: '#EFFFFB',
      color: '#02748D',
      icon: 'LNPEnquiryCountDate'
    },
    {
      id: 'ltop_10_lnps',
      title: 'LNPs',
      highlight: 'Enquiry',
      subtitle: 'Count Today',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'ActiveBplPhase2Subscribers'
    },
    {
      id: 'subscriber_enquiry_asdate',
      title: 'Subscriber',
      highlight: 'Enquiry',
      subtitle: 'Count (As on Date)',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'SubscriberEnquiryDate'
    },
    {
      id: 'subscriber_enquiry_today',
      title: 'Subscriber',
      highlight: 'Enquiry',
      subtitle: 'Count Today',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'SubscriberEnquiryToday'
    }
  ],

  // ------------------------------
  // SECTION OF 8 CARDS
  // ------------------------------
  section8: [
    {
      id: 'ftth_dashboard',
      title: 'FTTH',
      highlight: 'Dashboard',
      subtitle: '',
      value: 0,
      growth: 102,
      bg: '#FFF1DE',
      color: '#F5612A',
      icon: 'FTTHDashboard'
    },
    {
      id: 'lnp_onboarding',
      title: 'LNP',
      highlight: 'Onboarding',
      subtitle: 'Dashboard',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'LNPOnboardingDashboard'
    },
    {
      id: 'nms_portal',
      title: 'NMS',
      highlight: 'Portal',
      subtitle: '',
      value: 0,
      growth: 102,
      bg: '#FFEFF2',
      color: '#8D0247',
      icon: 'NMSPortal'
    },
    {
      id: 'serviceable_pincodes',
      title: 'Serviceable',
      highlight: 'Pincodes',
      subtitle: '',
      value: 0,
      growth: 102,
      bg: '#FDF8DC',
      color: '#C58C10',
      icon: 'ServicablePincodes'
    },
    {
      id: 'serviceable_postoffices',
      title: 'Serviceable',
      highlight: 'Post Offices',
      subtitle: '',
      value: 0,
      growth: 102,
      bg: '#F3EFFF',
      color: '#5E36EF',
      icon: 'ActiveBplPhase2Subscribers'
    },
    {
      id: 'online_subs',
      title: 'Click here to view',
      highlight: 'Online Subscribers',
      subtitle: '',
      value: 0,
      growth: 102,
      bg: '#FFF1DE',
      color: '#F5612A',
      icon: 'KYCReceivedCurrentMonth'
    }
  ]
};

export const LNP_DASHBOARD_CARDS = {
  TOP_CARDS: [
    {
      id: 'current_category',
      titleKey: 'currentCategory',
      value: 'RUBY',
      iconBg: '#8D0247',
      bgIconColor: '#FFF5F5',
      subTextKey: ''
    },
    {
      id: 'next_category',
      titleKey: 'nextCategory',
      value: 'GOLD',
      iconBg: '#F0AC00',
      bgIconColor: '#FFFFF0',
      subTextKey: 'goldCategoryReq'
    },
    {
      id: 'active_home_subscribers',
      titleKey: 'activeHomeSubscribers',
      value: '178',
      iconBg: '#33CCCC',
      bgIconColor: '#E6FFFA',
      subTextKey: ''
    },
    {
      id: 'active_ews_subscribers',
      titleKey: 'activeEwsSubscribers',
      value: '15',
      iconBg: '#AFCA62',
      bgIconColor: '#F0FFF4',
      subTextKey: ''
    }
  ],
  SECOND_ROW_CARDS: [
    {
      id: 'new_applications',
      titleKey: 'newApplications',
      value: '29',
      iconBg: '#0062BE',
      bgIconColor: '#EBF8FF'
    },
    {
      id: 'new_activation',
      titleKey: 'newActivation',
      value: '0',
      iconBg: '#5856D6',
      bgIconColor: '#EBF4FF'
    },
    {
      id: 'validity_end_7_days',
      titleKey: 'validityEnd7Days',
      value: '1',
      iconBg: '#AF52DE',
      bgIconColor: '#FAF5FF'
    },
    {
      id: 'kyc_to_be_submitted',
      titleKey: 'kycToBeSubmitted',
      value: '241',
      iconBg: '#FFCC00',
      bgIconColor: '#FFFFF0'
    },
    {
      id: 'active_corporate_subscribers',
      titleKey: 'activeCorporateSubscribers',
      value: '54',
      iconBg: '#D72D2E',
      bgIconColor: '#FFF5F5'
    }
  ],
  THIRD_ROW_CARDS: [
    {
      id: 'account_balance',
      titleKey: 'accountBalance',
      value: '40,473.77',
      icon: 'Accountbalance',
      boxSize: '32px'
    },
    {
      id: 'current_revenue',
      titleKey: 'currentRevenue',
      value: '34,4986.00',
      icon: 'CurrentRevenue',
      boxSize: '32px'
    },
    {
      id: 'last_month_retail_revenue',
      titleKey: 'lastMonthRetailRevenue',
      value: '56,806.50',
      icon: 'LastMonthRevenue',
      boxSize: '32px'
    },
    {
      id: 'last_month_corporate_revenue',
      titleKey: 'lastMonthCorporateRevenue',
      value: '0',
      icon: 'LastMonthCorporateRevenue',
      boxSize: '32px'
    },
    {
      id: 'govt_corporate_transferred_amount',
      titleKey: 'govtCorporateTransferredAmount',
      value: '0',
      icon: 'GovtCorporateTransferAmount',
      boxSize: '32px'
    }
  ],
  FOURTH_ROW_CARDS: [
    {
      id: 'subscriber_recharge_current_month',
      titleKey: 'subscriberRechargeCurrentMonth',
      value: '21',
      icon: 'SuscriberRechargeCurrentMonth',
      boxSize: '32px'
    },
    {
      id: 'gst_account_balance',
      titleKey: 'gstAccountBalance',
      value: '86445.79',
      icon: 'GSTAccountBalance',
      boxSize: '32px'
    },
    {
      id: 'nms_portal',
      titleKey: 'nmsPortal',
      value: '',
      icon: 'LNPNMSPortal',
      boxSize: '32px',
      isLink: true
    },
    {
      id: 'my_leads',
      titleKey: 'myLeads',
      value: '182',
      icon: 'MyLeads',
      boxSize: '32px'
    },
    {
      id: 'online_subscriber_list',
      titleKey: 'onlineSubscriberList',
      value: '',
      icon: 'OnlineSubscriberList',
      boxSize: '32px',
      isLink: true
    }
  ]
};

export const CARD_TABLE_CONFIG = {
  new_today: {
    title: 'newActivationsToday',
    columns: [
      { header: 'hash', accessor: 'id' },
      { header: 'subscriberId', accessor: 'subscriberId' },
      { header: 'username', accessor: 'username' },
      { header: 'packageName', accessor: 'packageName' },
      { header: 'registrationDate', accessor: 'registrationDate' },
      { header: 'mobileNoText', accessor: 'mobile' },
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'partnerCompany', accessor: 'partnerCompany' },
      { header: 'district', accessor: 'district' },
      { header: 'frcDate', accessor: 'frcDate' }
    ]
  },
  new_last_day: {
    title: 'newActivationsLastDay',
    columns: [
      { header: 'hash', accessor: 'id' },
      { header: 'subscriberId', accessor: 'subscriberId' },
      { header: 'username', accessor: 'username' },
      { header: 'packageName', accessor: 'packageName' },
      { header: 'registrationDate', accessor: 'registrationDate' },
      { header: 'mobileNoText', accessor: 'mobile' },
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'partnerCompany', accessor: 'partnerCompany' },
      { header: 'district', accessor: 'district' },
      { header: 'frcDate', accessor: 'frcDate' }
    ]
  },
  new_month: {
    title: 'newActivationsCurrentMonth',
    columns: [
      { header: 'hash', accessor: 'id' },
      { header: 'subscriberId', accessor: 'subscriberId' },
      { header: 'username', accessor: 'username' },
      { header: 'packageName', accessor: 'packageName' },
      { header: 'registrationDate', accessor: 'registrationDate' },
      { header: 'mobileNoText', accessor: 'mobile' },
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'partnerCompany', accessor: 'partnerCompany' },
      { header: 'district', accessor: 'district' },
      { header: 'frcDate', accessor: 'frcDate' }
    ]
  },
  active_retail: {
    title: 'activeRetailSubscribers',
    columns: [
      { header: 'id', accessor: 'id' },
      { header: 'username', accessor: 'username' },
      { header: 'package', accessor: 'package' },
      { header: 'expiryDate', accessor: 'expiryDate' },
      { header: 'contactNo', accessor: 'contactNo' },
      { header: 'email', accessor: 'email' },
      { header: 'franchisee', accessor: 'franchisee' },
      { header: 'registrationDate', accessor: 'registrationDate' },
      { header: 'planSpeed', accessor: 'planSpeed' }
    ]
  },
  active_bpl1: {
    title: 'activeBplSubscribersPhase1',
    columns: [
      { header: 'id', accessor: 'id' },
      { header: 'username', accessor: 'username' },
      { header: 'activationDateNoSpace', accessor: 'activationDate' },
      { header: 'expiryDateNoSpace', accessor: 'expiryDate' },
      { header: 'plan', accessor: 'plan' },
      { header: 'district', accessor: 'district' },
      { header: 'constituency', accessor: 'constituency' }
    ]
  },
  active_bpl2: {
    title: 'activeBplSubscribersPhase2',
    columns: [
      { header: 'id', accessor: 'id' },
      { header: 'username', accessor: 'username' },
      { header: 'package', accessor: 'package' },
      { header: 'expiryDate', accessor: 'expiryDate' },
      { header: 'contactNo', accessor: 'contactNo' },
      { header: 'email', accessor: 'email' },
      { header: 'franchisee', accessor: 'franchisee' },
      { header: 'registrationDate', accessor: 'registrationDate' },
      { header: 'planSpeed', accessor: 'planSpeed' }
    ]
  },
  pending_kyc: {
    title: 'pendingKycCount',
    columns: [
      { header: 'slno', accessor: 'id' },
      { header: 'appliedDate', accessor: 'appliedDate' },
      { header: 'status', accessor: 'status' },
      { header: 'nextStatus', accessor: 'nextStatus' },
      { header: 'formNo', accessor: 'formNo' },
      { header: 'cafType', accessor: 'cafType' },
      { header: 'applicantName', accessor: 'applicantName' },
      { header: 'franchisee', accessor: 'franchisee' },
      { header: 'franchiseeId', accessor: 'franchiseeId' },
      { header: 'district', accessor: 'district' },
      { header: 'packageName', accessor: 'packageName' },
      { header: 'kycType', accessor: 'kycType' }
    ]
  },
  kyc_today: {
    title: 'kycReceivedToday',
    columns: [
      { header: 'slno', accessor: 'id' },
      { header: 'appliedDate', accessor: 'appliedDate' },
      { header: 'status', accessor: 'status' },
      { header: 'nextStatus', accessor: 'nextStatus' },
      { header: 'formNo', accessor: 'formNo' },
      { header: 'cafType', accessor: 'cafType' },
      { header: 'applicantName', accessor: 'applicantName' },
      { header: 'franchisee', accessor: 'franchisee' },
      { header: 'franchiseeId', accessor: 'franchiseeId' },
      { header: 'district', accessor: 'district' },
      { header: 'packageName', accessor: 'packageName' },
      { header: 'kycType', accessor: 'kycType' }
    ]
  },
  kyc_month: {
    title: 'kycReceivedCurrentMonth',
    columns: [
      { header: 'slno', accessor: 'id' },
      { header: 'appliedDate', accessor: 'appliedDate' },
      { header: 'status', accessor: 'status' },
      { header: 'nextStatus', accessor: 'nextStatus' },
      { header: 'formNo', accessor: 'formNo' },
      { header: 'cafType', accessor: 'cafType' },
      { header: 'applicantName', accessor: 'applicantName' },
      { header: 'franchisee', accessor: 'franchisee' },
      { header: 'franchiseeId', accessor: 'franchiseeId' },
      { header: 'district', accessor: 'district' },
      { header: 'packageName', accessor: 'packageName' },
      { header: 'kycType', accessor: 'kycType' }
    ]
  },
  total_lnp: {
    title: 'totalLnpOnBoarded',
    columns: [
      { header: 'sno', accessor: 'id' },
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'companyName', accessor: 'companyName' },
      { header: 'feName', accessor: 'feName' },
      { header: 'contact', accessor: 'contact' },
      { header: 'locationCategory', accessor: 'locationCategory' },
      { header: 'district', accessor: 'district' },
      { header: 'agreementNo', accessor: 'agreementNo' },
      { header: 'gstin', accessor: 'gstin' },
      { header: 'partnerType', accessor: 'partnerType' }
    ]
  },
  total_frc: {
    title: 'totalFrcPayments',
    columns: [
      { header: 'sno', accessor: 'id' },
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'companyName', accessor: 'companyName' },
      { header: 'feName', accessor: 'feName' },
      { header: 'contact', accessor: 'contact' },
      { header: 'locationCategory', accessor: 'locationCategory' },
      { header: 'district', accessor: 'district' },
      { header: 'agreementNo', accessor: 'agreementNo' },
      { header: 'gstin', accessor: 'gstin' },
      { header: 'partnerType', accessor: 'partnerType' }
    ]
  },
  total_links: {
    title: 'totalLinksEstablished',
    columns: [
      { header: 'sno', accessor: 'id' },
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'companyName', accessor: 'companyName' },
      { header: 'feName', accessor: 'feName' },
      { header: 'contact', accessor: 'contact' },
      { header: 'locationCategory', accessor: 'locationCategory' },
      { header: 'district', accessor: 'district' },
      { header: 'agreementNo', accessor: 'agreementNo' },
      { header: 'gstin', accessor: 'gstin' },
      { header: 'partnerType', accessor: 'partnerType' }
    ]
  },
  churn_recovery_today: {
    title: 'churnRecoveryToday',
    columns: [
      { header: 'sno', accessor: 'id' },
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'companyName', accessor: 'companyName' },
      { header: 'feName', accessor: 'feName' },
      { header: 'contact', accessor: 'contact' },
      { header: 'locationCategory', accessor: 'locationCategory' },
      { header: 'district', accessor: 'district' },
      { header: 'agreementNo', accessor: 'agreementNo' },
      { header: 'gstin', accessor: 'gstin' },
      { header: 'partnerType', accessor: 'partnerType' }
    ]
  },
  churn_recovery_this_month: {
    title: 'churnRecoveryThisMonth',
    columns: [
      { header: 'slNoNoDot', accessor: 'id' },
      { header: 'subscriberId', accessor: 'subscriberId' },
      { header: 'username', accessor: 'username' },
      { header: 'mobileNoText', accessor: 'mobileNo' },
      { header: 'email', accessor: 'email' },
      { header: 'plan', accessor: 'plan' },
      { header: 'dateOfRecharge', accessor: 'dateOfRecharge' },
      { header: 'daysSinceInactive', accessor: 'daysSinceInactive' },
      { header: 'district', accessor: 'district' },
      { header: 'partnerName', accessor: 'partnerName' },
      { header: 'partnerId', accessor: 'partnerId' }
    ]
  },
  ltop_10_lnps: {
    title: 'top10LnpsSubscriberwise',
    columns: [
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'partnerName', accessor: 'partnerName' },
      { header: 'city', accessor: 'city' },
      { header: 'district', accessor: 'district' },
      { header: 'subscribersCount', accessor: 'subscribersCount' }
    ]
  },
  top10_lnp_business: {
    title: 'top10LnpsBusinesswise',
    columns: [
      { header: 'partnerId', accessor: 'partnerId' },
      { header: 'partnerName', accessor: 'partnerName' },
      { header: 'city', accessor: 'city' },
      { header: 'district', accessor: 'district' },
      { header: 'revenueAmount', accessor: 'revenueAmount' }
    ]
  },
  subscribers_churned_date: {
    title: 'subscribersChurnedAsOnDate',
    columns: [
      { header: 'slNoNoDot', accessor: 'id' },
      { header: 'subscriberId', accessor: 'subscriberId' },
      { header: 'username', accessor: 'username' },
      { header: 'mobileNoText', accessor: 'mobileNo' },
      { header: 'email', accessor: 'email' },
      { header: 'plan', accessor: 'plan' },
      { header: 'dateOfChurn', accessor: 'dateOfChurn' },
      { header: 'daysSinceInactive', accessor: 'daysSinceInactive' },
      { header: 'district', accessor: 'district' },
      { header: 'partnerName', accessor: 'partnerName' },
      { header: 'partnerId', accessor: 'partnerId' }
    ]
  },
  subscriber_enquiry_today: {
    title: 'subscriberEnquiryCountToday',
    columns: [
      { header: 'ids', accessor: 'id' },
      { header: 'status', accessor: 'status' },
      { header: 'subStatus', accessor: 'subStatus' },
      { header: 'bdeName', accessor: 'bdeName' },
      { header: 'reassignedBde', accessor: 'reassignedBde' },
      { header: 'reference', accessor: 'reference' },
      { header: 'partner', accessor: 'partner' },
      { header: 'leadSource', accessor: 'leadSource' },
      { header: 'name', accessor: 'name' },
      { header: 'mobile', accessor: 'mobile' },
      { header: 'district', accessor: 'district' },
      { header: 'pincode', accessor: 'pincode' },
      { header: 'connType', accessor: 'connType' },
      { header: 'trackingId', accessor: 'trackingId' },
      { header: 'submitted', accessor: 'submitted' }
    ]
  },
  ftth_dashboard: {
    title: 'ftthDashboard',
    columns: [
      { header: 'slNoNoDot', accessor: 'id' },
      { header: 'district', accessor: 'district' },
      { header: 'newActivationsToday', accessor: 'newActivationsToday' },
      { header: 'newActivationsMtd', accessor: 'newActivationsMtd' },
      { header: 'newActivationsQtd', accessor: 'newActivationsQtd' },
      { header: 'newActivationsYtd', accessor: 'newActivationsYtd' },
      { header: 'newActivationsAod', accessor: 'newActivationsAod' }
    ]
  },
  lnp_onboarding: {
    title: 'lnpOnboardingDashboard',
    columns: [
      { header: 'slNoNoDot', accessor: 'id' },
      { header: 'district', accessor: 'district' },
      { header: 'totalLnpEnquiries', accessor: 'totalLnpEnquiries' },
      { header: 'agreementSignoff', accessor: 'agreementSignoff' },
      { header: 'paymentDone', accessor: 'paymentDone' },
      { header: 'linkEstablished', accessor: 'linkEstablished' }
    ]
  },
  serviceable_pincodes: {
    title: 'serviceablePincodes',
    columns: [
      { header: 'sno', accessor: 'id' },
      { header: 'pincode', accessor: 'pincode' }
    ]
  },
  serviceable_postoffices: {
    title: 'serviceablePostOffices',
    columns: [
      { header: 'sno', accessor: 'id' },
      { header: 'postOfficeName', accessor: 'postOfficeName' }
    ]
  },
  online_subs: {
    title: 'onlineSubscribers',
    columns: [
      { header: 'slNoNoDot', accessor: 'id' },
      { header: 'sessionId', accessor: 'sessionId' },
      { header: 'username', accessor: 'username' },
      { header: 'mac', accessor: 'mac' },
      { header: 'framedIp', accessor: 'framedIp' },
      { header: 'startTime', accessor: 'startTime' },
      { header: 'totalTime', accessor: 'totalTime' },
      { header: 'uploadMb', accessor: 'uploadMb' },
      { header: 'downloadMb', accessor: 'downloadMb' },
      { header: 'totalMb', accessor: 'totalMb' },
      { header: 'nasPort', accessor: 'nasPort' }
    ]
  },
  DEFAULT: {
    title: 'details',
    columns: [
      { header: 'id', accessor: 'id' },
      { header: 'name', accessor: 'name' },
      { header: 'status', accessor: 'status' },
      { header: 'date', accessor: 'date' }
    ]
  }
};

export const TAB_NAMES = {
  FTTH: 'FTTH Stats',
  DARK_FIBER: 'Dark Fiber Stats',
  ENTERPRISE_PRIVATE: 'Enterprise-Private Stats',
  ENTERPRISE_GOVT: 'Enterprise-Government Stats'
};

export const TABS = [TAB_NAMES.FTTH, TAB_NAMES.DARK_FIBER, TAB_NAMES.ENTERPRISE_PRIVATE, TAB_NAMES.ENTERPRISE_GOVT];

export const TICKET_LIST_COLUMNS = [
  { accessor: 'ticketId', header: 'TicketID' },
  { accessor: 'createdBy', header: 'Created By' },
  { accessor: 'assigned', header: 'Assigned' },
  { accessor: 'assignedTo', header: 'Assigned to' },
  { accessor: 'ticketCategory', header: 'Ticket Category' },
  { accessor: 'ticketSubCategory', header: 'Ticket Sub Category' },
  { accessor: 'subject', header: 'Subject' },
  { accessor: 'complaintThrough', header: 'Complaint Through' },
  { accessor: 'callCenterNumber', header: 'Call Center Number' },
  { accessor: 'status', header: 'Status' },
  { accessor: 'submittedDate', header: 'Submitted Date' },
  { accessor: 'updatedDate', header: 'Updated Date' }
];
