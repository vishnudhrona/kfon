import { useNavigate, useRouteContext, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { STORAGE_KEYS } from '@/constants';
import { actions as paginationActions } from '@/features/others/Pagination/slice';

import {
  downloadEnquiryCSV,
  fetchEnquiryStatuses,
  fetchEnquirySummary,
  fetchEwsEnquiryList,
  fetchSubscriberByEnquiryId
} from '../actions';
import { EwsActions, RetailActions } from '../components/EnquiryListActions';
import EwsEnquiryCard from '../components/EwsEnquiryCard';
import { ENQUIRY_TABLE_KEY, EWS_ENQUIRY_TABLE_KEY } from '../constants';
import { getEnquiryStatusList, getEnquirySummary, getEwsEnquiryList } from '../selectors';
import { actions } from '../slice';
import useEnquiryFilterConfig from './useEnquiryFilterConfig';
import { clearAllFormStorage } from './useFormPersistence';

const CAF_ROUTES = {
  N_KYC: { HOME: '/app/subscribers/home-connection', SME: '/app/subscribers/sme-connection' },
  E_KYC: {
    HOME: '/app/subscribers/ekyc-home-connection',
    SME: '/app/subscribers/ekyc-sme-connection',
    EWS: '/app/subscribers/ekyc-ews-connection'
  }
};

const resolveCAFRoute = (kycType, subType) => CAF_ROUTES[kycType]?.[subType] ?? '/app/subscribers/home-connection';

const normalizeEnquiryRow = (val) => ({
  trackingId: val?.trackingId,
  enquiryId: val?.enquiryId || val?.id,
  mobile: val?.mobile || val?.mobileNumber,
  email: val?.email,
  enquiryDate: val?.createdAt,
  pincode: val?.pincode,
  latitude: val?.latitude,
  longitude: val?.longitude,
  address: val?.address || val?.installationAddress?.addressLine1 || val?.permanentAddress?.addressLine1 || ''
});

const useEnquiryList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const { overrideFetchAction, overrideDataSelector } = useRouteContext({ strict: false });

  const [open, setOpen] = useState(false);
  const [newEnquiryOpen, setNewEnquiryOpen] = useState(false);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [dispositionOpen, setDispositionOpen] = useState(false);
  const [assignToOpen, setAssignToOpen] = useState(false);
  const [assignToLNPOpen, setAssignToLNPOpen] = useState(false);
  const [feasibilityOpen, setFeasibilityOpen] = useState(false);
  const [forwardPlusOpen, setForwardPlusOpen] = useState(false);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const enquiryStatusList = useSelector(getEnquiryStatusList);
  const selectedType = search?.type === 'EWS' ? 'EWS' : 'RETAIL';
  const isEwsSelected = selectedType === 'EWS';
  const selectedForwardType = search?.forwardType ?? 'inbox';

  const handleForwardTypeChange = useCallback(
    (val) => {
      if (val === selectedForwardType) return;
      navigate({ search: (prev) => ({ ...prev, forwardType: val }), replace: true });
    },
    [navigate, selectedForwardType]
  );

  useEffect(() => {
    dispatch(fetchEnquiryStatuses());
  }, [dispatch]);

  useEffect(() => {
    if (isEwsSelected) {
      setShowStats(false);
      dispatch(paginationActions.setFilter({ key: EWS_ENQUIRY_TABLE_KEY, data: { enquiryType: 'EWS' } }));
    }
  }, [isEwsSelected, dispatch]);

  const handleRowAction = useCallback(
    (val, type) => {
      setSelectedEnquiryId(normalizeEnquiryRow(val));
      if (type === 'MEETING') {
        setMeetingOpen(true);
      } else if (type === 'DISPOSITION') {
        setDispositionOpen(true);
      } else if (type === 'ASSIGN_TO' || type === 'ASSIGN_TO_FE') {
        setAssignToOpen(true);
      } else if (type === 'ASSIGN_TO_LNP') {
        setAssignToLNPOpen(true);
      } else if (type === 'FORWARD_PLUS') {
        setForwardPlusOpen(true);
      } else if (type === 'CHECK_FEASIBILITY') {
        setFeasibilityOpen(true);
      } else if (type === 'CAF') {
        clearAllFormStorage();
        dispatch(actions.clearApplicationState());
        localStorage.removeItem(STORAGE_KEYS.FORM_COMPLETION_STATUS);
        sessionStorage.setItem(
          STORAGE_KEYS.ENQUIRY_DATA,
          JSON.stringify({
            enquiryId: val?.enquiryId,
            trackingId: val?.trackingId,
            cusName: val?.name,
            cusMobile: val?.mobile,
            cusEmail: val?.email,
            enquiryCafStatus: val?.enquiryCafStatus,
            latitude: val?.latitude,
            longitude: val?.longitude,
            cusConnType: val?.cusConnType
          })
        );

        // PARTIAL: subscriber record exists → fetch to restore Redux state,
        //   derive route from API response (kycType + type), navigate directly
        // COMPLETED + REJECTED: CAF was filled then rejected → treat as partially
        //   filled, restore & navigate to the form instead of the new-application popup
        // PENDING / null: fresh start → show popup to select connection/subscription type
        const isRejectedCompleted =
          val?.enquiryCafStatus === 'COMPLETED' && val?.enquiryStatus?.toUpperCase() === 'REJECTED';
        if (val?.enquiryCafStatus === 'PARTIAL' || isRejectedCompleted) {
          dispatch(
            fetchSubscriberByEnquiryId({
              enquiryId: val?.enquiryId,
              onSuccess: (data) => {
                const kycType = data?.basicDetail?.kycType;
                const subType = data?.basicDetail?.type;
                const route = resolveCAFRoute(kycType, subType);
                navigate({
                  to: route,
                  search: { enquiryId: val?.enquiryId },
                  state: { trackingId: val?.trackingId, partial: true }
                });
              },
              onError: () =>
                navigate({
                  to: '/app/subscribers/home-connection',
                  search: { enquiryId: val?.enquiryId },
                  state: { trackingId: val?.trackingId, partial: true }
                })
            })
          );
        } else {
          setOpen(true);
        }
      } else if (type === 'VERIFY') {
        dispatch(actions.clearApplicationState());
        sessionStorage.setItem('verifyEnquiryId', val?.enquiryId);
        dispatch(
          fetchSubscriberByEnquiryId({
            enquiryId: val?.enquiryId,
            onSuccess: () => navigate({ to: '/app/subscribers/verify-subscriber' }),
            onError: () => navigate({ to: '/app/subscribers/verify-subscriber' })
          })
        );
      } else if (type === 'VIEW') {
        dispatch(actions.clearApplicationState());
        sessionStorage.setItem('viewEnquiryId', val?.enquiryId);
        dispatch(
          fetchSubscriberByEnquiryId({
            enquiryId: val?.enquiryId,
            onSuccess: () => navigate({ to: '/app/subscribers/view-subscriber' }),
            onError: () => navigate({ to: '/app/subscribers/view-subscriber' })
          })
        );
      } else {
        setOpen(true);
      }
    },
    [dispatch, navigate]
  );

  const handleDownloadCSV = useCallback(() => {
    dispatch(downloadEnquiryCSV());
  }, [dispatch]);

  const statusItems = useMemo(
    () => enquiryStatusList?.map((item) => ({ id: item.code, name: item.name })) || [],
    [enquiryStatusList]
  );

  const TYPE_ITEMS = useMemo(
    () => [
      { value: 'RETAIL', label: t('retail') },
      { value: 'EWS', label: t('ews') }
    ],
    [t]
  );

  const { retailFilterConfig, ewsFilterConfig } = useEnquiryFilterConfig({ statusItems, TYPE_ITEMS });

  const handleApplyFilters = useCallback(
    (filterValues, proceed) => {
      const { enquiryType, ...rest } = filterValues;
      if (enquiryType && enquiryType !== selectedType) {
        navigate({ search: { ...search, type: enquiryType }, replace: true });
      }
      proceed({ filteredValues: rest });
    },
    [navigate, search, selectedType]
  );

  const listConfig = useMemo(
    () =>
      isEwsSelected
        ? {
            dataSelector: getEwsEnquiryList,
            fetchAction: fetchEwsEnquiryList,
            tableKey: EWS_ENQUIRY_TABLE_KEY,
            filterConfig: ewsFilterConfig,
            params: { forwardType: selectedForwardType },
            CardComponent: EwsEnquiryCard,
            mapData: (item) => item,
            onApplyFilters: handleApplyFilters,
            actions: {
              onRowAction: handleRowAction,
              component: <EwsActions expandAll={expandAll} setExpandAll={setExpandAll} />
            }
          }
        : {
            dataSelector: overrideDataSelector ?? getEnquirySummary,
            fetchAction: overrideFetchAction ?? fetchEnquirySummary,
            tableKey: ENQUIRY_TABLE_KEY,
            filterConfig: retailFilterConfig,
            params: { forwardType: selectedForwardType },
            isOutbox: selectedForwardType === 'outbox',
            onApplyFilters: handleApplyFilters,
            actions: {
              onRowAction: handleRowAction,
              component: (
                <RetailActions
                  expandAll={expandAll}
                  setExpandAll={setExpandAll}
                  onToggleStats={() => setShowStats((prev) => !prev)}
                  onDownloadCSV={handleDownloadCSV}
                  onNewEnquiry={() => setNewEnquiryOpen(true)}
                />
              )
            }
          },
    [
      expandAll,
      ewsFilterConfig,
      handleApplyFilters,
      handleDownloadCSV,
      handleRowAction,
      isEwsSelected,
      overrideDataSelector,
      overrideFetchAction,
      retailFilterConfig,
      selectedForwardType
    ]
  );

  return {
    selectedType,
    isEwsSelected,
    selectedForwardType,
    showStats,
    expandAll,
    listConfig,
    open,
    setOpen,
    newEnquiryOpen,
    setNewEnquiryOpen,
    meetingOpen,
    setMeetingOpen,
    dispositionOpen,
    setDispositionOpen,
    assignToOpen,
    setAssignToOpen,
    assignToLNPOpen,
    setAssignToLNPOpen,
    feasibilityOpen,
    setFeasibilityOpen,
    forwardPlusOpen,
    setForwardPlusOpen,
    selectedEnquiryId,
    handleForwardTypeChange
  };
};

export default useEnquiryList;
