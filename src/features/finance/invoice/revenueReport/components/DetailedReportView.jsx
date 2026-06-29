import { Box, Flex, Grid, Text } from '@kfonbss/bss-ui-components';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPrinter, FiSearch, FiX } from 'react-icons/fi';

import { C, fmtINR, fmtINRFull } from './RevenueReportsShared';

export default function DetailedReportView({
  activeReport,
  meta,
  schema,
  rows: rawRows,
  sortKey,
  sortDir,
  handleSort,
  pageSize,
  setPageSize,
  pageNum,
  setPageNum,
  modalOpen,
  setModalOpen,
  selectedRowIndex,
  setSelectedRowIndex,
  renderCellContent
}) {
  const { t } = useTranslation();

  // Local filter states
  const [filterQuery, setFilterQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('');
  const [revTypeFilter, setRevTypeFilter] = useState('');
  const [custTypeFilter, setCustTypeFilter] = useState('');
  const [gstCatFilter, setGstCatFilter] = useState('');
  const [subTypeFilter, setSubTypeFilter] = useState('');

  // Extract unique options for dropdowns from raw data
  const uniqueRevTypes = useMemo(() => {
    return [...new Set(rawRows.map((r) => r.revType).filter(Boolean))];
  }, [rawRows]);

  const uniqueCustTypes = useMemo(() => {
    return [...new Set(rawRows.map((r) => r.custType).filter(Boolean))];
  }, [rawRows]);

  const uniqueSubTypes = useMemo(() => {
    return [...new Set(rawRows.map((r) => r.subType).filter(Boolean))];
  }, [rawRows]);

  // Filter rows
  const filteredRows = useMemo(() => {
    return rawRows.filter((x) => {
      // General search filter
      if (filterQuery) {
        const q = filterQuery.toLowerCase();
        const matches = Object.values(x).some((v) =>
          String(v ?? '')
            .toLowerCase()
            .includes(q)
        );
        if (!matches) return false;
      }

      // Invoice-wise Revenue specific dropdown filters
      if (activeReport === 'REVENUE_BR11') {
        if (docTypeFilter && x.docType !== docTypeFilter) return false;
        if (revTypeFilter && x.revType !== revTypeFilter) return false;
        if (custTypeFilter && x.custType !== custTypeFilter) return false;
        if (gstCatFilter && x.gstCat !== gstCatFilter) return false;
      }

      // Credit Notes — Customer specific dropdown filters
      if (activeReport === 'REVENUE_BR27') {
        if (subTypeFilter && x.subType !== subTypeFilter) return false;
      }

      return true;
    });
  }, [rawRows, filterQuery, docTypeFilter, revTypeFilter, custTypeFilter, gstCatFilter, subTypeFilter, activeReport]);

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * sortDir;
      }
      return String(va ?? '').localeCompare(String(vb ?? '')) * sortDir;
    });
  }, [filteredRows, sortKey, sortDir]);

  // Calculate totals
  const totals = useMemo(() => {
    if (activeReport === 'REVENUE_BR11') {
      return {
        taxable: sortedRows.reduce((s, r) => s + (r.taxable || 0), 0),
        gst: sortedRows.reduce((s, r) => s + (r.totGst || 0), 0),
        val: sortedRows.reduce((s, r) => s + (r.invVal || 0), 0)
      };
    } else {
      return {
        amount: sortedRows.reduce((s, r) => s + (r.amount || 0), 0),
        gst: sortedRows.reduce((s, r) => s + (r.gst || 0), 0),
        val: sortedRows.reduce((s, r) => s + (r.cnValue || 0), 0)
      };
    }
  }, [sortedRows, activeReport]);

  const total = sortedRows.length;
  const pagesCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPageNum = Math.min(pageNum, pagesCount);
  const start = (currentPageNum - 1) * pageSize;
  const pageRows = sortedRows.slice(start, start + pageSize);

  const pageNums = [];
  const pStart = Math.max(1, currentPageNum - 1);
  const pEnd = Math.min(pagesCount, currentPageNum + 1);
  if (pStart > 1) pageNums.push(1);
  if (pStart > 2) pageNums.push('…');
  for (let i = pStart; i <= pEnd; i++) pageNums.push(i);
  if (pEnd < pagesCount - 1) pageNums.push('…');
  if (pEnd < pagesCount) pageNums.push(pagesCount);

  const selectedRow = selectedRowIndex !== null ? sortedRows[selectedRowIndex] : null;

  const handleClearFilters = () => {
    setFilterQuery('');
    setDocTypeFilter('');
    setRevTypeFilter('');
    setCustTypeFilter('');
    setGstCatFilter('');
    setSubTypeFilter('');
    setPageNum(1);
  };

  const getColString = () => {
    if (activeReport === 'REVENUE_BR11') {
      return '140px 100px 70px 100px minmax(200px, 1fr) 100px 70px 100px 110px 110px 120px';
    }
    return '160px 110px minmax(200px, 1.5fr) 160px 140px 110px 110px 60px 110px 110px 120px';
  };

  const colString = getColString();
  const fields = meta ? meta.fields || [] : [];
  const breakdowns = meta ? meta.breakdowns || [] : [];

  return (
    <Flex direction='column' gap='20px'>
      {/* Section A - Summary KPIs */}
      <Flex direction='column' gap='10px'>
        <Flex align='center' gap='10px' mb='2px' flexWrap='wrap'>
          <Box
            w='22px'
            h='22px'
            borderRadius='50%'
            bg={C.maroon700}
            color={C.yellow}
            display='flex'
            alignItems='center'
            justifyContent='center'
            fontSize='12px'
          >
            A
          </Box>
          <Text fontSize='11px' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={C.inkSoft}>
            {t('menu.revenueReport.summaryLabel', 'Summary')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            <Text as='strong' color={C.maroon700} fontWeight='700'>
              {sortedRows.length}
            </Text>{' '}
            {t('menu.expenseReport.of')}{' '}
            <Text as='strong' color={C.maroon700} fontWeight='700'>
              {rawRows.length}
            </Text>{' '}
            {t('menu.revenueReport.rowsAfterFilters', 'rows after filters')}
          </Text>
        </Flex>

        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' px='20px' py='14px'>
          <Grid templateColumns={{ base: '1fr', lg: '1.5fr auto 1.5fr' }} alignItems='center' gap='32px'>
            {/* Left Section */}
            <Box>
              <Text fontSize='10px' fontWeight='700' letterSpacing='0.8px' color={C.inkSoft}>
                {activeReport === 'REVENUE_BR11'
                  ? t('menu.revenueReport.invoiceValueLabel', 'Invoice Value')
                  : t('menu.revenueReport.creditNoteValueLabel', 'Total Credit Note Value')}
              </Text>

              <Text
                fontSize='36px'
                fontWeight='500'
                color={activeReport === 'REVENUE_BR27' ? C.coralDeep : C.maroon800}
                lineHeight='1'
                mt='2px'
              >
                ₹{fmtINR(totals.val)}
              </Text>

              <Text fontSize='12px' color={C.inkSoft} mt='4px'>
                {t('menu.revenueReport.taxableLabel', 'Taxable')}: ₹
                {fmtINR(activeReport === 'REVENUE_BR11' ? totals.taxable : totals.amount)}
                &nbsp;·&nbsp; {t('menu.revenueReport.gstLabel', 'GST')}: ₹{fmtINR(totals.gst)}
                &nbsp;·&nbsp; {total}{' '}
                {activeReport === 'REVENUE_BR11'
                  ? t('menu.revenueReport.invoices', 'invoices')
                  : t('menu.revenueReport.cns', 'CNs')}
              </Text>
            </Box>

            {/* Middle Section */}
            <Box textAlign='center'>
              <Text fontSize='10px' fontWeight='500' color={C.inkSoft} mb='4px'>
                {t('menu.expenseReport.rows')}
              </Text>
              <Text fontSize='26px' fontWeight='600' color={C.maroon800} lineHeight='1'>
                {total}
              </Text>
            </Box>

            {/* Right Section */}
            <Flex gap='24px' align='center' justify='flex-end'>
              <Box textAlign='right'>
                <Flex justify='flex-end' align='center' gap='6px'>
                  <Box w='6px' h='6px' borderRadius='full' bg={C.mint} />
                  <Text fontSize='10px' fontWeight='700' color={C.inkSoft}>
                    {t('menu.revenueReport.taxableLabel', 'Taxable')}
                  </Text>
                </Flex>
                <Text fontSize='24px' fontWeight='500' color={C.mintDeep} lineHeight='1' mt='2px'>
                  ₹{fmtINR(activeReport === 'REVENUE_BR11' ? totals.taxable : totals.amount)}
                </Text>
              </Box>

              <Box textAlign='right'>
                <Flex justify='flex-end' align='center' gap='6px'>
                  <Box w='6px' h='6px' borderRadius='full' bg={C.rose} />
                  <Text fontSize='10px' fontWeight='700' color={C.inkSoft}>
                    {activeReport === 'REVENUE_BR11'
                      ? t('menu.revenueReport.gstLabel', 'GST')
                      : t('menu.revenueReport.gstReversed', 'GST Reversed')}
                  </Text>
                </Flex>
                <Text fontSize='24px' fontWeight='500' color={C.roseDeep} lineHeight='1' mt='2px'>
                  ₹{fmtINR(totals.gst)}
                </Text>
              </Box>
            </Flex>
          </Grid>
        </Box>
      </Flex>

      {/* Section B - Search & Filter */}
      <Flex direction='column' gap='10px'>
        <Flex align='center' gap='10px' mb='2px' flexWrap='wrap'>
          <Box
            w='22px'
            h='22px'
            borderRadius='50%'
            bg={C.maroon700}
            color={C.yellow}
            display='flex'
            alignItems='center'
            justifyContent='center'
            fontSize='12px'
          >
            B
          </Box>
          <Text fontSize='11px' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={C.inkSoft}>
            {t('menu.expenseReport.detailSectionBLabel')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            {t('menu.expenseReport.detailSectionBHint')}
          </Text>
        </Flex>

        <Flex
          bg='white'
          border='1px solid'
          borderColor={C.line}
          borderRadius='12px'
          p='10px'
          align='center'
          gap='10px'
          flexWrap='wrap'
        >
          {/* Main search bar */}
          <Flex
            align='center'
            gap='8px'
            bg={C.paper}
            border='1px solid'
            borderColor={C.line}
            borderRadius='8px'
            px='12px'
            h='34px'
            w='280px'
          >
            <FiSearch size={14} color={C.inkSoft} />
            <Box
              as='input'
              placeholder={
                activeReport === 'REVENUE_BR11'
                  ? t('menu.revenueReport.searchBR11Placeholder', 'Search invoice / customer / GSTIN…')
                  : t('menu.revenueReport.searchBR27Placeholder', 'Search credit note / customer…')
              }
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setPageNum(1);
              }}
              border='none'
              outline='none'
              fontSize='12.5px'
              bg='transparent'
              w='100%'
            />
          </Flex>

          {/* Invoice-wise Revenue Dropdown Filters */}
          {activeReport === 'REVENUE_BR11' && (
            <>
              <select
                value={docTypeFilter}
                onChange={(e) => {
                  setDocTypeFilter(e.target.value);
                  setPageNum(1);
                }}
                style={{
                  height: '34px',
                  border: `1px solid ${C.line}`,
                  borderRadius: '8px',
                  padding: '0 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: C.maroon700,
                  outline: 'none',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                <option value=''>{t('menu.revenueReport.allDocs', 'All Docs')}</option>
                <option value='INV'>{t('menu.revenueReport.invoicesOnly', 'Invoices Only')}</option>
                <option value='CN'>{t('menu.revenueReport.cnsOnly', 'Credit Notes Only')}</option>
              </select>

              <select
                value={revTypeFilter}
                onChange={(e) => {
                  setRevTypeFilter(e.target.value);
                  setPageNum(1);
                }}
                style={{
                  height: '34px',
                  border: `1px solid ${C.line}`,
                  borderRadius: '8px',
                  padding: '0 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: C.maroon700,
                  outline: 'none',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                <option value=''>{t('menu.revenueReport.allRevTypes', 'All Rev Types')}</option>
                {uniqueRevTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={custTypeFilter}
                onChange={(e) => {
                  setCustTypeFilter(e.target.value);
                  setPageNum(1);
                }}
                style={{
                  height: '34px',
                  border: `1px solid ${C.line}`,
                  borderRadius: '8px',
                  padding: '0 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: C.maroon700,
                  outline: 'none',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                <option value=''>{t('menu.revenueReport.allSegments', 'All Segments')}</option>
                {uniqueCustTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={gstCatFilter}
                onChange={(e) => {
                  setGstCatFilter(e.target.value);
                  setPageNum(1);
                }}
                style={{
                  height: '34px',
                  border: `1px solid ${C.line}`,
                  borderRadius: '8px',
                  padding: '0 10px',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: C.maroon700,
                  outline: 'none',
                  cursor: 'pointer',
                  background: 'white'
                }}
              >
                <option value=''>{t('menu.revenueReport.allGst', 'All GST')}</option>
                <option value='B2B'>B2B</option>
                <option value='B2C'>B2C</option>
              </select>
            </>
          )}

          {/* Credit Notes — Customer Dropdown Filters */}
          {activeReport === 'REVENUE_BR27' && (
            <select
              value={subTypeFilter}
              onChange={(e) => {
                setSubTypeFilter(e.target.value);
                setPageNum(1);
              }}
              style={{
                height: '34px',
                border: `1px solid ${C.line}`,
                borderRadius: '8px',
                padding: '0 10px',
                fontSize: '11.5px',
                fontWeight: '700',
                color: C.maroon700,
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value=''>{t('menu.revenueReport.allSubscriberTypes', 'All Subscriber Types')}</option>
              {uniqueSubTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}

          <Box
            as='button'
            onClick={handleClearFilters}
            bg={C.yellowBg}
            border='1px solid'
            borderColor={C.yellow}
            color={C.maroon800}
            h='34px'
            px='14px'
            borderRadius='8px'
            fontSize='11.5px'
            fontWeight='700'
            cursor='pointer'
            transition='all 0.15s'
            _hover={{ bg: C.yellowSoft }}
          >
            {t('menu.expenseReport.reset')}
          </Box>
          <Box flex='1' />
          <Box display='flex' align='center' gap='6px'>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setPageNum(1);
              }}
              style={{
                height: '34px',
                border: `1px solid ${C.line}`,
                borderRadius: '8px',
                padding: '0 10px',
                fontSize: '11.5px',
                fontWeight: '700',
                color: C.maroon700,
                outline: 'none',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              {[10, 15, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} {t('menu.expenseReport.perPage')}
                </option>
              ))}
            </select>
          </Box>
        </Flex>

        {/* Table Container */}
        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='12px' overflow='hidden'>
          <Box overflowX='auto'>
            {/* Header */}
            <Box
              display='grid'
              gridTemplateColumns={colString}
              gap='10px'
              alignItems='center'
              px='16px'
              py='12px'
              bg={C.yellowBg}
              borderBottom='2px solid'
              borderColor={C.yellow}
              fontSize='10px'
              fontWeight='800'
              color={C.maroon800}
              letterSpacing='0.5px'
              textTransform='uppercase'
            >
              {schema.map((c) => {
                const dir = sortKey === c.k ? (sortDir === 1 ? '↑' : '↓') : '↕';
                const isSorted = sortKey === c.k;
                return (
                  <Box
                    key={c.k}
                    textAlign={c.num ? 'right' : 'left'}
                    cursor='pointer'
                    userSelect='none'
                    onClick={() => handleSort(c.k)}
                    color={isSorted ? C.rose : 'inherit'}
                    display='flex'
                    alignItems='center'
                    justifyContent={c.num ? 'flex-end' : 'flex-start'}
                    gap='4px'
                  >
                    <Text>{c.label}</Text>
                    <Text opacity={isSorted ? 1 : 0.4}>{dir}</Text>
                  </Box>
                );
              })}
            </Box>

            {/* Rows */}
            <Flex direction='column'>
              {pageRows.length === 0 ? (
                <Box p='40px' textAlign='center'>
                  <Text color={C.inkFaint} fontSize='13px'>
                    {t('menu.expenseReport.noRecords')}
                  </Text>
                </Box>
              ) : (
                pageRows.map((row, idx) => {
                  const absoluteIdx = rawRows.indexOf(row);
                  return (
                    <Box
                      key={idx}
                      display='grid'
                      gridTemplateColumns={colString}
                      gap='10px'
                      alignItems='center'
                      px='16px'
                      py='12px'
                      borderBottom='1px solid'
                      borderColor={C.line}
                      cursor='pointer'
                      transition='background 0.15s'
                      _hover={{ bg: C.roseBg }}
                      onClick={() => {
                        setSelectedRowIndex(absoluteIdx);
                        setModalOpen(true);
                      }}
                    >
                      {schema.map((c) => (
                        <Box key={c.k} display='flex' w='100%' justifyContent={c.num ? 'flex-end' : 'flex-start'}>
                          {renderCellContent(row, c)}
                        </Box>
                      ))}
                    </Box>
                  );
                })
              )}
            </Flex>
          </Box>

          {/* Pagination footer */}
          <Flex
            justify='space-between'
            align='center'
            px='16px'
            py='12px'
            bg={C.paper}
            borderTop='1px solid'
            borderColor={C.line}
            fontSize='11.5px'
            color={C.inkSoft}
            flexWrap='wrap'
            gap='10px'
          >
            <Text>
              {t('menu.expenseReport.showing')}{' '}
              <strong>
                {total === 0 ? 0 : start + 1} – {Math.min(start + pageSize, total)}
              </strong>{' '}
              {t('menu.expenseReport.of')} <strong>{total}</strong> rows
            </Text>
            <Flex gap='6px'>
              <Box
                as='button'
                onClick={() => setPageNum(1)}
                disabled={currentPageNum === 1}
                w='30px'
                h='30px'
                borderRadius='6px'
                border='1px solid'
                borderColor={C.line}
                bg='white'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                opacity={currentPageNum === 1 ? 0.4 : 1}
              >
                «
              </Box>
              <Box
                as='button'
                onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                disabled={currentPageNum === 1}
                w='30px'
                h='30px'
                borderRadius='6px'
                border='1px solid'
                borderColor={C.line}
                bg='white'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                opacity={currentPageNum === 1 ? 0.4 : 1}
              >
                ‹
              </Box>
              {pageNums.map((n, idx) =>
                n === '…' ? (
                  <Box key={idx} px='8px' py='4px' fontSize='11px' color={C.inkFaint}>
                    …
                  </Box>
                ) : (
                  <Box
                    key={n}
                    as='button'
                    onClick={() => setPageNum(n)}
                    w='30px'
                    h='30px'
                    borderRadius='6px'
                    border='1px solid'
                    borderColor={n === currentPageNum ? C.maroon700 : C.line}
                    bg={n === currentPageNum ? C.maroon700 : 'white'}
                    color={n === currentPageNum ? C.yellow : C.ink}
                    fontWeight='800'
                    cursor='pointer'
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                  >
                    {n}
                  </Box>
                )
              )}
              <Box
                as='button'
                onClick={() => setPageNum((p) => Math.min(pagesCount, p + 1))}
                disabled={currentPageNum === pagesCount}
                w='30px'
                h='30px'
                borderRadius='6px'
                border='1px solid'
                borderColor={C.line}
                bg='white'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                opacity={currentPageNum === pagesCount ? 0.4 : 1}
              >
                ›
              </Box>
              <Box
                as='button'
                onClick={() => setPageNum(pagesCount)}
                disabled={currentPageNum === pagesCount}
                w='30px'
                h='30px'
                borderRadius='6px'
                border='1px solid'
                borderColor={C.line}
                bg='white'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                opacity={currentPageNum === pagesCount ? 0.4 : 1}
              >
                »
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Flex>

      {/* Row detail modal */}
      {modalOpen && selectedRow && (
        <Box
          position='fixed'
          inset='0'
          bg='rgba(74, 15, 42, 0.4)'
          backdropFilter='blur(4px)'
          display='flex'
          alignItems='center'
          justifyContent='center'
          zIndex={1000}
          p='20px'
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <Box
            bg='white'
            borderRadius='16px'
            w='720px'
            maxW='100%'
            maxH='90vh'
            overflow='hidden'
            display='flex'
            flexDirection='column'
            boxShadow='0 24px 48px rgba(74, 15, 42, 0.25)'
          >
            {/* Header */}
            <Flex
              align='center'
              justify='space-between'
              p='18px 20px'
              bg={`linear-gradient(135deg, ${C.maroon800}, ${C.maroon700})`}
              color='white'
            >
              <Box>
                <Text fontWeight='800' color={C.yellow} fontSize='16px'>
                  {activeReport === 'REVENUE_BR11' ? `Invoice ${selectedRow.invNo}` : `Credit Note ${selectedRow.cnNo}`}
                </Text>
                <Text fontSize='10.5px' opacity={0.8}>
                  {meta.code} · Row {selectedRow.sl || selectedRowIndex + 1}
                </Text>
              </Box>
              <Box
                as='button'
                onClick={() => setModalOpen(false)}
                bg='rgba(255, 255, 255, 0.15)'
                border='none'
                color='white'
                w='30px'
                h='30px'
                borderRadius='6px'
                cursor='pointer'
                display='flex'
                alignItems='center'
                justifyContent='center'
                _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
              >
                <FiX size={18} />
              </Box>
            </Flex>

            {/* Body */}
            <Box p='20px' overflowY='auto' flex='1'>
              {/* Info Grid */}
              <Box display='grid' gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap='16px 24px'>
                {fields.map(([lbl, k]) => {
                  const v = selectedRow[k];
                  if (v == null || v === '') return null;
                  return (
                    <Box key={k}>
                      <Text fontSize='9px' fontWeight='800' color={C.inkSoft} uppercase letterSpacing='0.5px'>
                        {lbl}
                      </Text>
                      <Text fontSize='13px' fontWeight='700' color={C.ink} mt='2px'>
                        {v}
                      </Text>
                    </Box>
                  );
                })}
              </Box>

              {/* Amount Breakdown */}
              {breakdowns.length > 0 && (
                <Box mt='24px' bg={C.paper} borderRadius='12px' p='16px' border='1px solid' borderColor={C.line}>
                  <Text fontSize='9px' fontWeight='800' color={C.inkSoft} mb='12px' uppercase letterSpacing='0.5px'>
                    {t('menu.expenseReport.amountBreakdown')}
                  </Text>
                  <Flex direction='column' gap='8px'>
                    {breakdowns.map(([lbl, k, flag]) => {
                      const v = selectedRow[k];
                      if (v == null || v === '') return null;
                      const isTotal = flag === true;
                      const isNeg = flag === 'neg';
                      const isInt = flag === 'int';
                      const isPct = flag === 'pct';

                      return (
                        <Flex
                          key={k}
                          justify='space-between'
                          py='6px'
                          borderBottom={isTotal ? 'none' : '1px dashed'}
                          borderColor={C.line}
                          align='center'
                        >
                          <Text
                            fontSize='12.5px'
                            color={isTotal ? C.maroon800 : C.inkSoft}
                            fontWeight={isTotal ? '800' : '600'}
                          >
                            {lbl}
                          </Text>
                          {isInt ? (
                            <Text fontWeight='800' fontSize='13px'>
                              {v}
                            </Text>
                          ) : isPct ? (
                            <Text fontWeight='800' fontSize='13px'>
                              {(v * 100).toFixed(1)}%
                            </Text>
                          ) : (
                            <Text
                              fontWeight='800'
                              fontSize={isTotal ? '18px' : '13px'}
                              color={isTotal ? C.rose : isNeg ? C.coralDeep : C.ink}
                            >
                              {isNeg ? '-' : ''}₹{fmtINRFull(Math.abs(v))}
                            </Text>
                          )}
                        </Flex>
                      );
                    })}
                  </Flex>
                </Box>
              )}
            </Box>

            {/* Footer */}
            <Flex justify='flex-end' gap='10px' p='12px 20px' bg={C.paper} borderTop='1px solid' borderColor={C.line}>
              <Box
                as='button'
                onClick={() => setModalOpen(false)}
                bg='white'
                border='1px solid'
                borderColor={C.line}
                px='16px'
                h='36px'
                borderRadius='20px'
                fontSize='12px'
                fontWeight='700'
                cursor='pointer'
              >
                {t('menu.expenseReport.close')}
              </Box>
              <Box
                as='button'
                onClick={() => window.print()}
                bg={C.maroon700}
                color='white'
                border='none'
                px='16px'
                h='36px'
                borderRadius='20px'
                fontSize='12px'
                fontWeight='700'
                cursor='pointer'
                display='flex'
                alignItems='center'
                gap='6px'
                _hover={{ bg: C.maroon800 }}
              >
                <FiPrinter size={13} />
                <Text>{t('menu.expenseReport.print')}</Text>
              </Box>
            </Flex>
          </Box>
        </Box>
      )}
    </Flex>
  );
}
