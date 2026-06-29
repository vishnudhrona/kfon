import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiChevronDown, FiDownload, FiSearch } from 'react-icons/fi';

import DetailedReportView from './DetailedReportView';
import RevenueReportsDashboard from './RevenueReportsDashboard';
import { BREAKDOWN_FIELDS, C, DATA, DETAIL_FIELDS, fmtINRFull, SCHEMAS, T } from './RevenueReportsShared';

const PATH_TO_CODE = {
  all: 'REVENUE_ALL',
  'all-reports': 'REVENUE_ALL',
  br11: 'REVENUE_BR11',
  br27: 'REVENUE_BR27',
  'invoice-wise-revenue': 'REVENUE_BR11',
  'credit-notes-customer': 'REVENUE_BR27',
  'by-segment': 'REVENUE_BY_SEGMENT',
  'by-customer': 'REVENUE_BY_CUSTOMER'
};

const CODE_TO_PATH = {
  REVENUE_ALL: 'all-reports',
  REVENUE_BR11: 'invoice-wise-revenue',
  REVENUE_BR27: 'credit-notes-customer',
  REVENUE_BY_SEGMENT: 'by-segment',
  REVENUE_BY_CUSTOMER: 'by-customer'
};

export default function RevenueReports() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  // Compute activeReport based on URL parameter or fallback
  const reportIdParam = params.reportId ? params.reportId.toLowerCase() : null;
  const activeReport = reportIdParam && PATH_TO_CODE[reportIdParam] ? PATH_TO_CODE[reportIdParam] : 'dashboard';

  const getHeaderMeta = () => {
    if (activeReport === 'dashboard') {
      return {
        title: t('menu.revenueReport.dashboardTitle', 'Revenue Analytics Dashboard'),
        desc: t(
          'menu.revenueReport.dashboardDesc',
          'Master invoice register · credit-note adjustments · net realisation'
        ),
        code: null
      };
    }
    if (activeReport === 'REVENUE_ALL') {
      return {
        title: t('menu.revenueReport.allReportsTitle', 'All Revenue Reports'),
        desc: t('menu.revenueReport.allReportsDesc', 'Revenue document streams loaded into this dashboard'),
        code: null
      };
    }
    if (activeReport === 'REVENUE_BY_SEGMENT') {
      return {
        title: t('menu.revenueReport.bySegmentTitle', 'By Customer Segment'),
        desc: t(
          'menu.revenueReport.bySegmentDesc',
          'Revenue split across Government, Private and Home Subscriber segments'
        ),
        code: null
      };
    }
    if (activeReport === 'REVENUE_BY_CUSTOMER') {
      return {
        title: t('menu.revenueReport.topCustomersTitle', 'Top Customers'),
        desc: t('menu.revenueReport.topCustomersDesc', 'Unique customer accounts · ranked by gross invoiced value'),
        code: null
      };
    }

    // Invoice-wise Revenue or Credit Notes — Customer detailed views
    const isBr11 = activeReport === 'REVENUE_BR11';
    return {
      title: isBr11
        ? t('menu.revenueReport.br11Title', 'Invoice-wise Revenue')
        : t('menu.revenueReport.br27Title', 'Credit Notes — Customer'),
      desc: isBr11
        ? t(
            'menu.revenueReport.br11Desc',
            'Master invoice register — Enterprise, Retail & Special Events with GST decomposition'
          )
        : t('menu.revenueReport.br27Desc', 'Customer refunds and adjustments against issued invoices'),
      code: isBr11
        ? t('menu.revenueReport.invoiceRevenueChip', 'Inv. Revenue')
        : t('menu.revenueReport.creditNoteChip', 'Credit Notes')
    };
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [pageNum, setPageNum] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2600);
  };

  const exportCSV = (filename, headers, keys, data) => {
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        keys
          .map((k) => {
            const val = row[k] ?? '';
            const stringVal = typeof val === 'object' ? JSON.stringify(val) : String(val);
            if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
              return `"${stringVal.replace(/"/g, '""')}"`;
            }
            return stringVal;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportConsolidated = () => {
    // Export consolidated statistics of the streams
    const headers = [
      'Metric',
      'Invoices Issued',
      'Credit Notes',
      'Net Revenue',
      'Government',
      'Private & Corporate',
      'Home Subscribers',
      'GST Component'
    ];
    const keys = ['metric', 'invoices', 'cns', 'net', 'gov', 'private', 'home', 'gst'];
    const data = [
      {
        metric: 'Consolidated Revenue metrics (INR)',
        invoices: T.totalInv.val,
        cns: T.cnTotal,
        net: T.net,
        gov: (T.byCustType.Government || {}).val || 0,
        private: (T.byCustType.Private || {}).val || 0,
        home: (T.byCustType['Home Subscriber'] || {}).val || 0,
        gst: T.totalInv.gst
      }
    ];
    exportCSV('KFON_Revenue_Consolidated_Summary.csv', headers, keys, data);
    showToast(t('menu.revenueReport.toastConsolidatedDownloaded', 'Consolidated Summary CSV downloaded'));
  };

  const handleExportCustomersList = () => {
    const headers = [
      'Rank',
      'Customer Name',
      'Customer Segment',
      'Invoices Count',
      'Taxable (INR)',
      'Gross Value (INR)'
    ];
    const keys = ['rank', 'name', 'custType', 'count', 'taxable', 'val'];
    const data = T.topCustomers.map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      custType: c.custType || '—',
      count: c.count,
      taxable: c.taxable,
      val: c.val
    }));
    exportCSV('KFON_Top_Customers_List.csv', headers, keys, data);
    showToast(t('menu.revenueReport.toastCustomersDownloaded', 'Top Customers CSV downloaded'));
  };

  const handleExportReport = (key, filteredOnly) => {
    const schema = SCHEMAS[key];
    const headers = schema.map((c) => c.label);
    const keys = schema.map((c) => c.k);
    let rows = DATA[key];

    if (filteredOnly && searchQuery) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v ?? '')
            .toLowerCase()
            .includes(q)
        )
      );
    }

    exportCSV(`KFON_Revenue_${key}_Report.csv`, headers, keys, rows);
    showToast(`Downloaded ${key} CSV`);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => -d);
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const renderCellContent = (row, col) => {
    const v = row[col.k];
    const fmt = col.fmt;

    if (fmt === 'mono') {
      return (
        <Text fontSize='12px' color={C.inkSoft}>
          {v ?? '—'}
        </Text>
      );
    }
    if (fmt === 'doc') {
      const isCn = v === 'CN';
      return (
        <Box
          display='inline-flex'
          px='6px'
          py='2px'
          borderRadius='4px'
          bg={isCn ? C.roseSoft : C.mintSoft}
          color={isCn ? C.roseDeep : C.mintDeep}
          fontSize='9.5px'
          fontWeight='800'
        >
          {isCn ? 'CN' : 'INV'}
        </Box>
      );
    }
    if (fmt === 'rev') {
      let bg = C.infoSoft;
      let color = C.infoDeep;
      if (v === 'Enterprise') {
        bg = C.lavenderSoft;
        color = C.lavenderDeep;
      } else if (v === 'Retail') {
        bg = C.roseSoft;
        color = C.roseDeep;
      } else if (v === 'Special Events') {
        bg = C.amberSoft;
        color = C.amberDeep;
      }
      return (
        <Box
          display='inline-flex'
          px='8px'
          py='2px'
          borderRadius='6px'
          bg={bg}
          color={color}
          fontSize='10px'
          fontWeight='800'
        >
          {v ?? '—'}
        </Box>
      );
    }
    if (fmt === 'custcell' || fmt === 'custcell27') {
      return (
        <Text fontWeight='800' color={C.ink} fontSize='13px' lineHeight='1.2'>
          {v || (fmt === 'custcell' ? t('menu.revenueReport.retailFTTH', '(Retail FTTH subscriber)') : '—')}
        </Text>
      );
    }
    if (fmt === 'cust') {
      let bg = C.infoSoft;
      let color = C.infoDeep;
      if (v === 'Government') {
        bg = C.tealSoft;
        color = C.tealDeep;
      } else if (v === 'Private') {
        bg = C.infoSoft;
        color = C.infoDeep;
      } else if (v === 'Home Subscriber' || v === 'Home') {
        bg = C.roseSoft;
        color = C.roseDeep;
      }
      return (
        <Box
          display='inline-flex'
          px='8px'
          py='2px'
          borderRadius='100px'
          bg={bg}
          color={color}
          fontSize='10px'
          fontWeight='800'
        >
          {v ?? '—'}
        </Box>
      );
    }
    if (fmt === 'gst') {
      if (!v) return <Text>—</Text>;
      return (
        <Box
          display='inline-flex'
          px='8px'
          py='2.5px'
          borderRadius='4px'
          bg={C.slateSoft}
          color={C.slateDeep}
          fontSize='10px'
          fontWeight='700'
        >
          {v}
        </Box>
      );
    }
    if (fmt === 'inr') {
      if (v == null || v === '') return <Text textAlign='right'>—</Text>;
      const isTotal = col.total;
      const isNeg = col.neg || (activeReport === 'REVENUE_BR27' && col.k === 'cnValue');
      const color = isTotal ? C.rose : isNeg ? C.coralDeep : C.ink;
      return (
        <Text textAlign='right' fontWeight='800' fontSize={isTotal ? '14px' : '13px'} color={color}>
          {isNeg && v > 0 ? '-' : ''}₹{fmtINRFull(Math.abs(v))}
        </Text>
      );
    }

    return <Text fontSize='12.5px'>{v ?? ''}</Text>;
  };

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim();
      if (!q) return;
      // Search inside BR11 or BR27
      for (const k of ['REVENUE_BR11', 'REVENUE_BR27']) {
        const idx = DATA[k].findIndex((r) =>
          Object.values(r).some((v) =>
            String(v ?? '')
              .toLowerCase()
              .includes(q.toLowerCase())
          )
        );
        if (idx >= 0) {
          navigate({ to: `/app/finance/invoice/revenue-report/${CODE_TO_PATH[k]}` });
          setSearchQuery('');
          break;
        }
      }
    }
  };

  const headerMeta = getHeaderMeta();

  // Combine schemas & fields for detailed report rendering
  const metaObj =
    activeReport === 'REVENUE_BR11' || activeReport === 'REVENUE_BR27'
      ? {
          code: headerMeta.code,
          title: headerMeta.title,
          fields: DETAIL_FIELDS[activeReport],
          breakdowns: BREAKDOWN_FIELDS[activeReport]
        }
      : null;

  return (
    <Box bg={C.paper} minH='100vh' p='16px 20px 32px'>
      {/* Title & Action controls Row */}
      <Flex justify='space-between' align='center' mb='20px' flexWrap='wrap' gap='14px'>
        <Box>
          <Text fontSize='28px' color={C.maroon800} fontWeight='400' letterSpacing='-0.5px' mb='2px'>
            {headerMeta.title}
          </Text>
          <Text fontSize='13px' color={C.inkSoft} fontWeight='600' display='flex' alignItems='center' gap='8px'>
            {headerMeta.code && (
              <Box
                display='inline-flex'
                px='8px'
                py='2px'
                borderRadius='6px'
                bg={C.yellowBg}
                color={C.maroon800}
                fontWeight='800'
                fontSize='11px'
              >
                {headerMeta.code}
              </Box>
            )}
            <Text as='span'>{headerMeta.desc}</Text>
          </Text>
        </Box>

        <Flex align='center' gap='10px' flexWrap='wrap'>
          {/* Global Search Input */}
          {(activeReport === 'dashboard' || activeReport === 'REVENUE_ALL') && (
            <Flex
              align='center'
              gap='8px'
              bg='white'
              border='1px solid'
              borderColor={C.line}
              borderRadius='100px'
              px='12px'
              h='36px'
              w='240px'
            >
              <FiSearch size={14} color={C.inkSoft} />
              <Box
                as='input'
                placeholder={t('menu.revenueReport.searchPlaceholder', 'Search registers…')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleGlobalSearch}
                border='none'
                outline='none'
                fontSize='12px'
                bg='transparent'
                w='100%'
              />
            </Flex>
          )}

          {/* Period selection pill */}
          <Flex
            as='button'
            align='center'
            gap='8px'
            px='14px'
            h='36px'
            borderRadius='100px'
            bg={C.yellowBg}
            border='1px solid'
            borderColor={C.yellow}
            color={C.maroon800}
            fontSize='11.5px'
            fontWeight='800'
            cursor='pointer'
          >
            <Box w='6px' h='6px' borderRadius='50%' bg={C.mint} />
            <Text>FY 25-26</Text>
            <FiChevronDown size={11} />
          </Flex>

          {/* Export Action / Back Navigation */}
          {activeReport === 'dashboard' ? (
            <Box
              as='button'
              onClick={handleExportConsolidated}
              bg={C.maroon700}
              color='white'
              border='none'
              borderRadius='100px'
              px='16px'
              h='36px'
              fontSize='11.5px'
              fontWeight='800'
              cursor='pointer'
              display='inline-flex'
              alignItems='center'
              gap='6px'
              transition='all 0.15s'
              _hover={{ bg: C.maroon800 }}
            >
              <FiDownload size={12} />
              <Text>{t('menu.revenueReport.exportConsolidated', 'Export Summary')}</Text>
            </Box>
          ) : activeReport === 'REVENUE_BY_CUSTOMER' ? (
            <Box
              as='button'
              onClick={handleExportCustomersList}
              bg={C.maroon700}
              color='white'
              border='none'
              borderRadius='100px'
              px='16px'
              h='36px'
              fontSize='11.5px'
              fontWeight='800'
              cursor='pointer'
              display='inline-flex'
              alignItems='center'
              gap='6px'
              transition='all 0.15s'
              _hover={{ bg: C.maroon800 }}
            >
              <FiDownload size={12} />
              <Text>{t('menu.revenueReport.exportList', 'Export List')}</Text>
            </Box>
          ) : activeReport === 'REVENUE_BY_SEGMENT' ? (
            <Box
              as='button'
              onClick={() => navigate({ to: '/app/finance/invoice/revenue-report' })}
              bg={C.paper}
              border='1px solid'
              borderColor={C.line}
              color={C.inkSoft}
              borderRadius='100px'
              px='16px'
              h='36px'
              fontSize='11.5px'
              fontWeight='800'
              cursor='pointer'
              display='inline-flex'
              alignItems='center'
              gap='6px'
              transition='all 0.15s'
              _hover={{ bg: C.lineSoft }}
            >
              <FiArrowLeft size={12} />
              <Text>{t('menu.expenseReport.back')}</Text>
            </Box>
          ) : activeReport === 'REVENUE_ALL' ? (
            <Box
              as='button'
              onClick={() => navigate({ to: '/app/finance/invoice/revenue-report' })}
              bg={C.paper}
              border='1px solid'
              borderColor={C.line}
              color={C.inkSoft}
              borderRadius='100px'
              px='16px'
              h='36px'
              fontSize='11.5px'
              fontWeight='800'
              cursor='pointer'
              display='inline-flex'
              alignItems='center'
              gap='6px'
              transition='all 0.15s'
              _hover={{ bg: C.lineSoft }}
            >
              <FiArrowLeft size={12} />
              <Text>{t('menu.expenseReport.back')}</Text>
            </Box>
          ) : (
            <Flex gap='8px' align='center' flexWrap='wrap'>
              <Box
                as='button'
                onClick={() => handleExportReport(activeReport, false)}
                bg='white'
                border='1px solid'
                borderColor={C.line}
                color={C.maroon700}
                px='12px'
                h='36px'
                borderRadius='100px'
                fontSize='11.5px'
                fontWeight='800'
                cursor='pointer'
                display='flex'
                alignItems='center'
                gap='6px'
                transition='all 0.15s'
                _hover={{ borderColor: C.maroon700 }}
              >
                <FiDownload size={12} />
                <Text>{t('menu.expenseReport.exportAll')}</Text>
              </Box>
              <Box
                as='button'
                onClick={() => handleExportReport(activeReport, true)}
                bg={C.maroon700}
                color='white'
                border='none'
                px='12px'
                h='36px'
                borderRadius='100px'
                fontSize='11.5px'
                fontWeight='800'
                cursor='pointer'
                display='flex'
                alignItems='center'
                gap='6px'
                transition='all 0.15s'
                _hover={{ bg: C.maroon800 }}
              >
                <FiDownload size={12} />
                <Text>{t('menu.expenseReport.exportFiltered')}</Text>
              </Box>
            </Flex>
          )}
        </Flex>
      </Flex>
      {/* Main View Area */}
      <Box>
        {activeReport === 'dashboard' ||
        activeReport === 'REVENUE_ALL' ||
        activeReport === 'REVENUE_BY_SEGMENT' ||
        activeReport === 'REVENUE_BY_CUSTOMER' ? (
          <RevenueReportsDashboard activeReport={activeReport} handleExportReport={handleExportReport} />
        ) : (
          <DetailedReportView
            activeReport={activeReport}
            meta={metaObj}
            schema={SCHEMAS[activeReport]}
            rows={DATA[activeReport] || []}
            sortKey={sortKey}
            sortDir={sortDir}
            handleSort={handleSort}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageNum={pageNum}
            setPageNum={setPageNum}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            renderCellContent={renderCellContent}
          />
        )}
      </Box>
      {toastMessage && (
        <Box
          position='fixed'
          bottom='24px'
          right='24px'
          bg={C.maroon800}
          color={C.yellow}
          p='12px 20px'
          borderRadius='100px'
          fontSize='12px'
          fontWeight='800'
          display='flex'
          alignItems='center'
          gap='8px'
          boxShadow='0 12px 32px rgba(74, 15, 42, 0.25)'
          zIndex={1100}
        >
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' width='14' height='14'>
            <polyline points='20 6 9 17 4 12' />
          </svg>
          <Text>{toastMessage}</Text>
        </Box>
      )}
    </Box>
  );
}
