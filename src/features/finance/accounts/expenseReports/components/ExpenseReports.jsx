import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiChevronDown, FiDownload, FiSearch } from 'react-icons/fi';

import DetailedReportView from './DetailedReportView';
import ExpenseReportsDashboard from './ExpenseReportsDashboard';
import {
  BREAKDOWN_FIELDS,
  C,
  CODE_TO_PATH,
  COLS,
  DATA,
  DETAIL_FIELDS,
  fmtINR,
  fmtINRFull,
  PATH_TO_CODE,
  REPORTS_METADATA,
  SCHEMAS,
  shortTitle,
  TOTALS
} from './ExpenseReportsShared';

export default function ExpenseReports() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams({ strict: false });

  // Compute activeReport based on URL parameter or fallback
  const reportIdParam = params.reportId ? params.reportId.toLowerCase() : null;
  const activeReport =
    reportIdParam && PATH_TO_CODE[reportIdParam]
      ? PATH_TO_CODE[reportIdParam]
      : reportIdParam
        ? reportIdParam.toUpperCase()
        : 'dashboard';

  const getHeaderMeta = () => {
    if (activeReport === 'dashboard') {
      return {
        title: t('menu.expenseReport.dashboardTitle'),
        desc: t('menu.expenseReport.dashboardDesc'),
        code: null
      };
    }
    const meta = REPORTS_METADATA[activeReport];
    return {
      title: meta ? shortTitle(meta.title) : t('menu.expenseReport.detailedReport'),
      desc: meta ? meta.desc : t('menu.expenseReport.detailedReportDesc'),
      code: meta ? meta.code : null
    };
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(15);
  const [pageNum, setPageNum] = useState(1);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 2600);
  };

  const getSourceCards = () => {
    return Object.keys(REPORTS_METADATA).map((k) => {
      const r = REPORTS_METADATA[k];
      const t = TOTALS[k];
      return { key: k, ...r, total: t.total || 0, gst: t.gst || 0, count: t.count };
    });
  };

  const cards = getSourceCards();
  const grandTotal = cards.reduce((s, c) => s + c.total, 0);
  const grandGST = cards.reduce((s, c) => s + c.gst, 0);

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
    const headers = t('menu.expenseReport.exportCsvHeaders').split(',');
    const keys = ['code', 'title', 'count', 'total', 'gst'];
    exportCSV('KFON_BSS_Consolidated_Expense.csv', headers, keys, cards);
    showToast(t('menu.expenseReport.toastConsolidatedDownloaded'));
  };

  const handleExportReport = (key, filteredOnly) => {
    const meta = REPORTS_METADATA[key];
    const schema = SCHEMAS[key];
    const headers = schema.map((c) => c.label);
    const keys = schema.map((c) => c.k);
    let rows = DATA[key];

    if (filteredOnly && filterQuery) {
      const q = filterQuery.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some((v) =>
          String(v ?? '')
            .toLowerCase()
            .includes(q)
        )
      );
    }

    exportCSV(`KFON_BSS_${meta.code}_Report.csv`, headers, keys, rows);
    showToast(`Downloaded ${meta.code} CSV`);
  };

  // Render SVG Chart - Outflow (Styled using Box)
  const renderBarChart = (cards) => {
    const maxVal = Math.max(...cards.map((c) => c.total));
    return (
      <Flex direction='column' h='100%' justify='space-between' p='10px'>
        <Flex
          align='flex-end'
          justify='space-between'
          flex='1'
          h='160px'
          borderBottom='1px solid'
          borderColor={C.line}
          pb='8px'
          gap='14px'
        >
          {cards.map((c, idx) => {
            const h = (c.total / maxVal) * 100 || 4; // minimum height
            const colors = [C.lavender, C.info, C.teal, C.coral, C.amber, C.plum, C.rose, C.mint, C.slate];
            const color = colors[idx % colors.length];

            return (
              <Flex
                key={c.key}
                direction='column'
                align='center'
                flex='1'
                gap='8px'
                cursor='pointer'
                onClick={() =>
                  navigate({
                    to: `/app/finance/accounts/expense-reports/${CODE_TO_PATH[c.key] || c.key.toLowerCase()}`
                  })
                }
              >
                <Box
                  w='24px'
                  h={`${h}%`}
                  bg={color}
                  borderRadius='4px 4px 0 0'
                  transition='opacity 0.2s'
                  _hover={{ opacity: 0.8 }}
                  position='relative'
                  title={`${c.title}: ₹${fmtINRFull(c.total)}`}
                />
                <Text fontSize='10px' fontWeight='800' color={C.inkSoft}>
                  {c.code}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    );
  };

  // Render Doughnut Chart (Ring segments rendered with clean SVG)
  const renderDoughnutChart = () => {
    const mix = {
      LNP: TOTALS.LNP_RETAIL.total + TOTALS.LNP_ENTERPRISE.total,
      AGNP: TOTALS.AGNP_ENTERPRISE.total,
      MSP: TOTALS.MSP_REVENUE.total,
      VAS: TOTALS.VAS_PROVIDER.total,
      Incentives: TOTALS.PARTNERS_INCENTIVES.total + TOTALS.INCENTIVES_SUMMARY.total,
      'GST Refund': TOTALS.PARTNER_GST_REFUND.total
    };

    const labels = Object.keys(mix);
    const values = Object.values(mix);
    const total = values.reduce((s, v) => s + v, 0);
    const colors = [C.lavender, C.teal, C.coral, C.amber, C.rose, C.mint];

    let accumulatedPercentage = 0;
    const center = 80;
    const radius = 50;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;

    return (
      <Flex align='center' justify='center' gap='24px' h='100%' py='10px'>
        <Box w='140px' h='140px'>
          <svg viewBox='0 0 160 160' width='100%' height='100%'>
            {values.map((v, idx) => {
              const pct = v / total;
              const strokeDasharray = `${circumference * pct} ${circumference}`;
              const strokeDashoffset = circumference - circumference * accumulatedPercentage;
              accumulatedPercentage += pct;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill='transparent'
                  stroke={colors[idx % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform={`rotate(-90 ${center} ${center})`}
                />
              );
            })}
            <circle cx={center} cy={center} r={radius - strokeWidth / 2} fill='white' />
            <g transform={`translate(${center}, ${center})`}>
              <text textAnchor='middle' y='-4' fill={C.inkSoft} fontSize={8} fontWeight='800' letterSpacing='0.5px'>
                TOTAL
              </text>
              <text textAnchor='middle' y='10' fill={C.maroon800} fontSize={11} fontWeight='800'>
                ₹{fmtINR(total)}
              </text>
            </g>
          </svg>
        </Box>
        <Flex direction='column' gap='6px' fontSize='11px' fontWeight='600' color={C.inkSoft}>
          {labels.map((lbl, idx) => (
            <Flex key={idx} align='center' gap='8px'>
              <Box w='8px' h='8px' borderRadius='50%' bg={colors[idx % colors.length]} />
              <Text flex='1' minW='80px'>
                {lbl}
              </Text>
              <Text fontWeight='800' color={C.ink}>
                ₹{fmtINR(mix[lbl])}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  };

  const getFilteredReportRows = (key) => {
    const all = DATA[key] || [];
    if (!filterQuery) return all;
    const q = filterQuery.toLowerCase();
    return all.filter((r) =>
      Object.values(r).some((v) =>
        String(v ?? '')
          .toLowerCase()
          .includes(q)
      )
    );
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
    if (fmt === 'inr') {
      if (v == null || v === '') return <Text textAlign='right'>—</Text>;
      const isTotal = col.total;
      const isNeg = col.neg && v < 0;
      const color = isTotal ? C.rose : isNeg ? C.coralDeep : C.ink;
      return (
        <Text textAlign='right' fontWeight='800' fontSize={isTotal ? '14px' : '13px'} color={color}>
          ₹{fmtINRFull(v)}
        </Text>
      );
    }
    if (fmt === 'pct') {
      if (v == null) return <Text textAlign='right'>—</Text>;
      return <Text textAlign='right'>{(v * 100).toFixed(1)}%</Text>;
    }
    if (fmt === 'pctint') {
      if (v == null) return <Text textAlign='right'>—</Text>;
      return <Text textAlign='right'>{v}%</Text>;
    }
    if (fmt === 'district') {
      return (
        <Box
          display='inline-flex'
          px='8px'
          py='3px'
          borderRadius='5px'
          bg={C.yellowBg}
          color={C.maroon800}
          fontWeight='800'
          fontSize='11px'
        >
          {v ?? ''}
        </Box>
      );
    }
    if (fmt && fmt.startsWith('pname:')) {
      const subKey = fmt.split(':')[1];
      return (
        <Box>
          <Text fontWeight='800' color={C.ink} fontSize='13px' lineHeight='1.2'>
            {v ?? ''}
          </Text>
          <Text fontSize='10.5px' color={C.inkSoft} mt='2px'>
            {row[subKey] ?? ''}
          </Text>
        </Box>
      );
    }
    if (fmt && fmt.startsWith('chip:')) {
      const type = fmt.split(':')[1];
      let bg = C.infoSoft;
      let color = C.infoDeep;
      if (type === 'custtype') {
        if (v === 'Government') {
          bg = C.tealSoft;
          color = C.tealDeep;
        } else if (v === 'Private') {
          bg = C.infoSoft;
          color = C.infoDeep;
        } else if (v === 'Home Subscriber') {
          bg = C.roseSoft;
          color = C.roseDeep;
        }
      } else if (type === 'gstcat') {
        if (v === 'B2B') {
          bg = C.infoSoft;
          color = C.infoDeep;
        } else if (v === 'B2C') {
          bg = C.plumSoft;
          color = C.plumDeep;
        }
      } else if (type === 'scheme') {
        if (v === 'Acquisition Incentive') {
          bg = C.mintSoft;
          color = C.mintDeep;
        } else {
          bg = C.lavenderSoft;
          color = C.lavenderDeep;
        }
      } else if (type === 'slab') {
        const slabL = (v || '').toLowerCase();
        if (slabL === 'ruby') {
          bg = C.roseSoft;
          color = C.roseDeep;
        } else if (slabL === 'silver') {
          bg = C.slateSoft;
          color = C.slateDeep;
        } else if (slabL === 'gold') {
          bg = C.amberSoft;
          color = C.amberDeep;
        }
      }
      if (!v) return <Text>—</Text>;
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
          {v}
        </Box>
      );
    }
    if (fmt === 'gst-status') {
      let bg = C.line;
      let color = C.ink;
      if (v === 'Documents Not Submitted') {
        bg = C.roseSoft;
        color = C.roseDeep;
      } else if (v === 'To Be Approved') {
        bg = C.infoSoft;
        color = C.infoDeep;
      } else if (v === 'Approved') {
        bg = C.mintSoft;
        color = C.mintDeep;
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
          {v}
        </Box>
      );
    }

    return <Text fontSize='12.5px'>{v ?? ''}</Text>;
  };

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim();
      if (!q) return;
      for (const k of Object.keys(DATA)) {
        const idx = DATA[k].findIndex((r) =>
          Object.values(r).some((v) =>
            String(v ?? '')
              .toLowerCase()
              .includes(q.toLowerCase())
          )
        );
        if (idx >= 0) {
          navigate({ to: `/app/finance/accounts/expense-reports/${CODE_TO_PATH[k] || k.toLowerCase()}` });
          setFilterQuery(q);
          setPageNum(1);
          setSearchQuery('');
          break;
        }
      }
    }
  };

  const headerMeta = getHeaderMeta();

  // Combine schemas & fields for detailed report rendering
  const metaObj =
    activeReport !== 'dashboard'
      ? {
          ...REPORTS_METADATA[activeReport],
          fields: DETAIL_FIELDS[activeReport],
          breakdowns: BREAKDOWN_FIELDS[activeReport]
        }
      : null;

  let reportRows = activeReport !== 'dashboard' ? getFilteredReportRows(activeReport) : [];
  if (activeReport !== 'dashboard' && sortKey) {
    reportRows = [...reportRows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sortDir;
      return String(va ?? '').localeCompare(String(vb ?? '')) * sortDir;
    });
  }

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
                {headerMeta.code.replace(/_/g, ' ')}
              </Box>
            )}
            <Text as='span'>{headerMeta.desc}</Text>
          </Text>
        </Box>

        <Flex align='center' gap='10px' flexWrap='wrap'>
          {/* Global Search Input */}
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
              placeholder={t('menu.expenseReport.searchPlaceholder')}
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
            <Text>{t('menu.expenseReport.periodLabel')}</Text>
            <FiChevronDown size={11} />
          </Flex>

          {/* Export Consolidated / Back */}
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
              <Text>{t('menu.expenseReport.exportConsolidated')}</Text>
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
              <Box
                as='button'
                onClick={() => navigate({ to: '/app/finance/accounts/expense-reports' })}
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
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* Main View Area */}
      <Box>
        {activeReport === 'dashboard' ? (
          <ExpenseReportsDashboard
            cards={cards}
            TOTALS={TOTALS}
            grandTotal={grandTotal}
            grandGST={grandGST}
            handleExportConsolidated={handleExportConsolidated}
            renderBarChart={renderBarChart}
            renderDoughnutChart={renderDoughnutChart}
          />
        ) : (
          <DetailedReportView
            activeReport={activeReport}
            meta={metaObj}
            schema={SCHEMAS[activeReport]}
            colString={COLS[activeReport] || '50px 100px 1fr 100px'}
            rows={reportRows}
            sortKey={sortKey}
            sortDir={sortDir}
            handleSort={handleSort}
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageNum={pageNum}
            setPageNum={setPageNum}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            selectedRowIndex={selectedRowIndex}
            setSelectedRowIndex={setSelectedRowIndex}
            handleExportReport={handleExportReport}
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
