import { Box, Flex, Grid, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { FiArrowRight } from 'react-icons/fi';

import FinanceCategoryCard from '@/features/finance/common/components/FinanceCategoryCard';
import FinanceStreamCard from '@/features/finance/common/components/FinanceStreamCard';

import { C, fmtINR, fmtINRFull, fmtINRShort, REPORTS_METADATA, REPORTS_METADATA_ALL, T } from './RevenueReportsShared';

export default function RevenueReportsDashboard({ activeReport }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 1. ALL REPORTS VIEW
  if (activeReport === 'REVENUE_ALL') {
    const allCards = Object.keys(REPORTS_METADATA_ALL).map((k) => {
      const r = REPORTS_METADATA[k];
      return { key: k, ...r };
    });
    return (
      <Flex direction='column' gap='20px'>
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
            ·
          </Box>
          <Text fontSize='11px' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={C.inkSoft}>
            {t('menu.revenueReport.pickStream', 'Pick a report stream')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
        </Flex>

        <Box display='grid' gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }} gap='16px'>
          {allCards.map((c) => {
            return (
              <FinanceStreamCard
                key={c.key}
                onClick={() => {
                  if (c.page) {
                    navigate({ to: `/app/finance/invoice/revenue-report/${c.page}` });
                  }
                }}
                cardData={c}
                mainValuePrefix={c.neg ? '−₹' : '₹'}
                footerData={{
                  firstLabel: 'Reason',
                  secondLabel: (
                    <Flex align='center' gap='6px'>
                      <Text fontSize='10px'>{c.chip}</Text>
                      <span fontWeight='800'>{c.count}</span>
                    </Flex>
                  )
                }}
              />
            );
          })}
        </Box>
      </Flex>
    );
  }

  // 2. BY CUSTOMER SEGMENT VIEW
  if (activeReport === 'REVENUE_BY_SEGMENT') {
    const types = Object.keys(T.byCustType).sort((a, b) => T.byCustType[b].val - T.byCustType[a].val);
    const maxSegmentVal = Math.max(...Object.values(T.byCustType).map((d) => d.val));
    const maxSegmentCount = Math.max(...Object.values(T.byCustType).map((d) => d.count));

    return (
      <Flex direction='column' gap='24px'>
        {/* Segment Cards Grid */}
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
              ·
            </Box>
            <Text fontSize='11px' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={C.inkSoft}>
              {t('menu.revenueReport.segmentCards', 'Segment Cards')}
            </Text>
            <Box flex='1' h='1px' bg={C.line} minW='20px' />
          </Flex>

          <Box display='grid' gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap='12px'>
            {[
              {
                name: 'Enterprise',
                sub: t(
                  'menu.revenueReport.entCardDesc',
                  'B2B + B2C contracts to Government, Corporate & Private entities'
                ),
                ratio: 0.93,
                icon: 'lavender',
                val: 345654
              },
              {
                name: 'Retail',
                sub: t(
                  'menu.revenueReport.retailCardDesc',
                  'Home Subscriber FTTH connections billed monthly via LNP partners'
                ),
                ratio: 0.03,
                icon: 'rose',
                val: 23456
              },
              {
                name: 'Special Events',
                sub: t(
                  'menu.revenueReport.specialCardDesc',
                  'One-off bandwidth for government events, summits, exhibitions'
                ),
                ratio: 0.3,
                icon: 'amber',
                val: 456789
              }
            ].map((k) => {
              const d = { taxable: k.val, gst: k.val * 0.18, val: k.val * 1.18 };

              return (
                <FinanceCategoryCard
                  key={k}
                  category={k}
                  mainLabel={t('menu.revenueReport.grossInvoiced', 'Gross Invoiced')}
                  footerData={{
                    items: [
                      {
                        label: 'Taxable',
                        value: fmtINRShort(d.taxable),
                        color: C.ink
                      },
                      {
                        label: 'GST · 18%',
                        value: fmtINRShort(d.gst),
                        color: C.ink
                      }
                    ]
                  }}
                />
              );
            })}
          </Box>
        </Flex>

        {/* Visualisation Chart */}
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
              ·
            </Box>
            <Text fontSize='11px' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={C.inkSoft}>
              {t('menu.revenueReport.visualisation', 'Visualisation')}
            </Text>
            <Box flex='1' h='1px' bg={C.line} minW='20px' />
          </Flex>

          <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='16px'>
            <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
              {t('menu.revenueReport.segmentWiseComparison', 'Segment-wise Comparison')}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mb='20px'>
              {t('menu.revenueReport.invoiceCountVsGross', 'Invoice count vs gross value · all customer segments')}
            </Text>

            {/* Custom segment double-bar chart using SVG */}
            <Box h='240px' pt='10px'>
              <Flex direction='column' h='100%' justify='space-between'>
                <Flex
                  align='flex-end'
                  justify='space-around'
                  flex='1'
                  borderBottom='1px solid'
                  borderColor={C.line}
                  pb='8px'
                  gap='30px'
                >
                  {types.map((k) => {
                    const d = T.byCustType[k];
                    const hVal = (d.val / maxSegmentVal) * 100 || 4;
                    const hCount = (d.count / maxSegmentCount) * 100 || 4;

                    return (
                      <Flex key={k} direction='column' align='center' flex='1' gap='8px'>
                        <Flex align='flex-end' gap='10px' h='160px'>
                          {/* Gross Value Bar */}
                          <Box
                            w='28px'
                            h={`${hVal}%`}
                            bg={C.lavender}
                            borderRadius='4px 4px 0 0'
                            title={`Gross Invoiced: ₹${fmtINRFull(d.val)}`}
                          />
                          {/* Invoice Count Bar */}
                          <Box
                            w='28px'
                            h={`${hCount}%`}
                            bg={C.amber}
                            borderRadius='4px 4px 0 0'
                            title={`Invoice Count: ${d.count}`}
                          />
                        </Flex>
                        <Text fontSize='12px' fontWeight='800' color={C.ink}>
                          {k}
                        </Text>
                      </Flex>
                    );
                  })}
                </Flex>
                {/* Legend */}
                <Flex
                  align='center'
                  justify='center'
                  gap='24px'
                  mt='12px'
                  fontSize='11px'
                  fontWeight='600'
                  color={C.inkSoft}
                >
                  <Flex align='center' gap='8px'>
                    <Box w='12px' h='12px' bg={C.lavender} borderRadius='2px' />
                    <Text>{t('menu.revenueReport.grossInvoicedLabel', 'Gross Invoiced (₹)')}</Text>
                  </Flex>
                  <Flex align='center' gap='8px'>
                    <Box w='12px' h='12px' bg={C.amber} borderRadius='2px' />
                    <Text>{t('menu.revenueReport.invoiceCountLabel', 'Invoice Count')}</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>
    );
  }

  // 3. TOP CUSTOMERS LEADERBOARD VIEW
  if (activeReport === 'REVENUE_BY_CUSTOMER') {
    return (
      <Flex direction='column' gap='20px'>
        {/* Table Container */}
        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='12px' overflow='hidden'>
          <Box overflowX='auto'>
            <table className='bss' style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    background: C.yellowBg,
                    borderBottom: `2px solid ${C.yellow}`,
                    textAlign: 'left',
                    fontSize: '10px',
                    fontWeight: '800',
                    color: C.maroon800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  <th style={{ padding: '12px 16px' }}>{t('menu.revenueReport.rank', 'Rank')}</th>
                  <th style={{ padding: '12px 16px' }}>{t('menu.revenueReport.customer', 'Customer')}</th>
                  <th style={{ padding: '12px 16px' }}>{t('menu.revenueReport.segment', 'Segment')}</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {t('menu.revenueReport.invoices', 'Invoices')}
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {t('menu.revenueReport.taxableLabel', 'Taxable')}
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {t('menu.revenueReport.grossInvoicedLabel', 'Gross Invoiced')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {T.topCustomers.map((c, i) => {
                  const chipBg =
                    c.custType === 'Government' ? C.tealSoft : c.custType === 'Private' ? C.infoSoft : C.roseSoft;
                  const chipColor =
                    c.custType === 'Government' ? C.tealDeep : c.custType === 'Private' ? C.infoDeep : C.roseDeep;

                  return (
                    <tr
                      key={i}
                      style={{ borderBottom: `1px solid ${C.line}`, cursor: 'pointer' }}
                      onClick={() => {
                        navigate({
                          to: '/app/finance/invoice/revenue-report/invoice-wise-revenue'
                        });
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <Text color={C.rose} fontWeight='800' fontSize='15px'>
                          #{i + 1}
                        </Text>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Text fontWeight='800' color={C.ink} fontSize='13px'>
                          {c.name}
                        </Text>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Box
                          display='inline-flex'
                          px='8px'
                          py='2px'
                          borderRadius='100px'
                          bg={chipBg}
                          color={chipColor}
                          fontSize='10px'
                          fontWeight='800'
                        >
                          {c.custType || '—'}
                        </Box>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>{c.count}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600' }}>
                        ₹{fmtINRFull(c.taxable)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '800', color: C.rose }}>
                        ₹{fmtINRFull(c.val)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </Box>
      </Flex>
    );
  }

  // 4. MAIN ANALYTICS DASHBOARD VIEW
  const cards = Object.keys(REPORTS_METADATA).map((k) => {
    const r = REPORTS_METADATA[k];
    return { key: k, ...r };
  });

  // SVG drawing logic for charts
  const renderBarChart = () => {
    const monthly = T.monthly;
    const maxVal = Math.max(...monthly.map((m) => m.val));
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
          {monthly.map((m) => {
            const h = (m.val / maxVal) * 100 || 4;
            return (
              <Flex key={m.key} direction='column' align='center' flex='1' gap='8px'>
                <Box
                  w='24px'
                  h={`${h}%`}
                  bg={C.lavender}
                  borderRadius='4px 4px 0 0'
                  transition='opacity 0.2s'
                  _hover={{ opacity: 0.8 }}
                  position='relative'
                  title={`${m.key}: ₹${fmtINRFull(m.val)}`}
                />
                <Text fontSize='10px' fontWeight='800' color={C.inkSoft}>
                  {m.key}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    );
  };

  const renderDoughnutChart = (dataObj, colors) => {
    const labels = Object.keys(dataObj);
    const values = Object.values(dataObj).map((x) => x.val || x);
    const total = values.reduce((s, v) => s + v, 0);

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
              <text textAnchor='middle' y={10} fill={C.maroon800} fontSize={11} fontWeight='800'>
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
                ₹{fmtINR(dataObj[lbl].val || dataObj[lbl])}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  };

  const renderHorizontalBarChart = () => {
    const tp = T.byTaxPayer;
    const labels = Object.keys(tp);
    const values = Object.values(tp).map((x) => x.val);
    const maxVal = Math.max(...values);
    const colors = [C.mint, C.amber, C.slate, C.plum, C.teal];

    return (
      <Flex direction='column' gap='12px' justify='center' h='100%' py='10px'>
        {labels.map((lbl, idx) => {
          const val = tp[lbl].val;
          const w = maxVal > 0 ? (val / maxVal) * 100 : 0;
          return (
            <Grid key={lbl} templateColumns='100px 1fr 90px' gap='12px' align='center'>
              <Text fontSize='11px' fontWeight='700' color={C.inkSoft}>
                {lbl}
              </Text>
              <Box bg={C.lineSoft} h='12px' borderRadius='100px' overflow='hidden'>
                <Box w={`${w}%`} h='100%' bg={colors[idx % colors.length]} borderRadius='100px' />
              </Box>
              <Text fontSize='11px' fontWeight='800' color={C.ink} textAlign='right'>
                ₹{fmtINRShort(val)}
              </Text>
            </Grid>
          );
        })}
      </Flex>
    );
  };

  return (
    <Flex direction='column' gap='20px'>
      {/* Section A - Grid of Streams and Consolidated Total */}
      <Flex direction='column' gap='12px'>
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
            {t('menu.revenueReport.atGlance', 'Revenue at a Glance')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            {t('menu.revenueReport.kpisHint', '6 KPIs + grand total · Net Revenue = Invoices − Credit Notes')}
          </Text>
        </Flex>

        <Box display='grid' gridTemplateColumns={{ base: '1fr', lg: '1fr 230px' }} gap='14px' alignItems='stretch'>
          {/* Left Block - 3x2 Stream Cards Grid */}
          <Box
            display='grid'
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
            gap='10px'
          >
            {cards.map((c) => {
              return (
                <FinanceStreamCard
                  key={c.key}
                  onClick={() => {
                    if (c.page) {
                      navigate({ to: `/app/finance/invoice/revenue-report/${c.page}` });
                    }
                  }}
                  cardData={c}
                  mainValuePrefix={c.neg ? '−₹' : '₹'}
                  footerData={{
                    firstLabel: 'Reason',
                    secondLabel: (
                      <Flex align='center' gap='6px'>
                        <Text fontSize='10px'>{c.chip}</Text>
                        <span fontWeight='800'>{c.count}</span>
                      </Flex>
                    )
                  }}
                />
              );
            })}
          </Box>

          {/* Right Block - Premium Net Revenue Card */}
          <Box
            bg={`radial-gradient(circle at 100% 0%, rgba(47, 184, 198, 0.18) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(255, 213, 87, 0.2) 0%, transparent 55%), linear-gradient(160deg, #f2fbfd 0%, #fffde8 100%)`}
            border='1px solid'
            borderColor={C.tealSoft}
            borderRadius='14px'
            p='18px 16px'
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            minH='260px'
            boxShadow='0 6px 22px -10px rgba(47, 184, 198, 0.45)'
            position='relative'
          >
            {/* Header */}
            <Flex align='flex-start' gap={2}>
              <Box
                w='32px'
                h='32px'
                borderRadius='10px'
                bg={`linear-gradient(135deg, ${C.teal}, ${C.tealDeep})`}
                color='white'
                display='flex'
                alignItems='center'
                justifyContent='center'
                boxShadow='0 4px 10px rgba(47,184,198,0.4)'
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='white' strokeWidth='2.5'>
                  <path d='M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' />
                </svg>
              </Box>
              <Box>
                <Text
                  fontSize='11px'
                  fontWeight='800'
                  color={C.tealDeep}
                  letterSpacing='0.4px'
                  textTransform='uppercase'
                >
                  {t('menu.revenueReport.netRevenue', 'Net Revenue')}
                </Text>
                <Text fontSize='9px' color={C.tealDeep} fontWeight='600' mt='3px'>
                  {t('menu.revenueReport.afterCreditNotes', 'After credit notes')}
                </Text>
              </Box>
            </Flex>

            {/* Middle Outflow Value */}
            <Flex justify='center'>
              <Box mt='15px' textAlign='center'>
                <Text
                  fontSize='9px'
                  fontWeight='800'
                  letterSpacing='1.4px'
                  textTransform='uppercase'
                  color={C.tealDeep}
                  opacity={0.85}
                  mb='10px'
                >
                  {t('menu.revenueReport.realisedIncome', 'Realised Income')}
                </Text>
                <Text fontSize='30px' fontWeight='800' color={C.maroon800} letterSpacing='-0.9px' lineHeight={1.1}>
                  <span style={{ fontSize: '18px', marginRight: '2px' }}>₹</span>
                  {fmtINR(T.net)}
                </Text>
                <Box
                  display='inline-block'
                  mt='12px'
                  bg='white'
                  border='1px solid'
                  borderColor={C.tealSoft}
                  px='10px'
                  py='3px'
                  borderRadius='100px'
                  fontSize='10px'
                  fontWeight='800'
                  color={C.tealDeep}
                >
                  {T.totalInv.count} INV · {T.cnInline.count + T.br27.count} CN
                </Box>
              </Box>
            </Flex>

            {/* GST summary box */}
            <Box
              bg='rgba(255, 255, 255, 0.75)'
              p='11px 14px'
              borderRadius='10px'
              border='1px solid'
              borderColor={C.tealSoft}
              display='flex'
              flexDirection='column'
              gap='3px'
              mt='15px'
            >
              <Text
                fontSize='9.5px'
                fontWeight='800'
                letterSpacing='0.8px'
                textTransform='uppercase'
                color={C.tealDeep}
                opacity={0.85}
              >
                {t('menu.revenueReport.totalGstCollected', 'Total GST Collected · 18%')}
              </Text>
              <Text fontSize='18px' fontWeight='800' color={C.tealDeep} letterSpacing='-0.3px'>
                <span style={{ fontSize: '13px', marginRight: '1px' }}>₹</span>
                {fmtINR(T.totalInv.gst)}
              </Text>
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* Section B - Revenue Type Performance */}
      <Flex direction='column' gap='12px'>
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
            {t('menu.revenueReport.performanceLabel', 'Revenue Type Performance')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            {t('menu.revenueReport.streamsHint', 'Share & count by stream · current period')}
          </Text>
        </Flex>

        {/* Gross Invoiced bar split */}
        <Box
          bg='white'
          border='1px solid'
          borderColor={C.line}
          borderRadius='14px'
          p='14px 20px'
          display='grid'
          gridTemplateColumns={{ base: '1fr', lg: 'auto 1fr auto auto auto' }}
          alignItems='center'
          gap='20px'
        >
          <Box>
            <Text fontSize='9.5px' fontWeight='800' letterSpacing='1px' textTransform='uppercase' color={C.inkFaint}>
              {t('menu.revenueReport.grossInvoiced', 'Gross Invoiced')}
            </Text>
            <Text fontSize='15px' fontWeight='600' color={C.maroon800} letterSpacing='-0.2px' lineHeight={1.2}>
              Three revenue <span style={{ color: C.rose }}>streams</span>
              <Text as='span' display='block' mt='2px' fontSize='11px' color={C.inkSoft} fontWeight='500'>
                Enterprise · Retail · Special Events
              </Text>
            </Text>
          </Box>
          <Box />
          <Flex direction='column' gap='2px' textAlign='right'>
            <Text fontSize='9px' fontWeight='800' color={C.inkSoft} uppercase letterSpacing='0.6px'>
              {t('menu.revenueReport.gross', 'Gross')}
            </Text>
            <Text fontSize='18px' color={C.maroon800} letterSpacing='-0.3px' lineHeight={1}>
              <span style={{ fontSize: '13px', color: C.maroon600, marginRight: '1px' }}>₹</span>
              {fmtINRShort(T.gross)}
            </Text>
          </Flex>

          {/* Bar graphic */}
          <Box h='8px' borderRadius='100px' bg={C.lineSoft} overflow='hidden' display='flex' w='180px'>
            <Box bg={C.lavender} w={`${((T.byRevType.Enterprise?.val || 0) / T.gross) * 100}%`} h='100%' />
            <Box bg={C.rose} w={`${((T.byRevType.Retail?.val || 0) / T.gross) * 100}%`} h='100%' />
            <Box bg={C.amber} w={`${((T.byRevType['Special Events']?.val || 0) / T.gross) * 100}%`} h='100%' />
          </Box>

          <Flex gap='14px'>
            <Flex direction='column' gap='2px' textAlign='right'>
              <Flex align='center' gap='5px' fontSize='9px' fontWeight='800' color={C.inkSoft} justify='flex-end'>
                <Box w='6px' h='6px' borderRadius='50%' bg={C.lavender} />
                Enterprise
              </Flex>
              <Text fontSize='15px' color={C.lavenderDeep} fontWeight='800' lineHeight={1}>
                ₹{fmtINRShort(T.byRevType.Enterprise?.val || 0)}
              </Text>
            </Flex>
            <Flex direction='column' gap='2px' textAlign='right'>
              <Flex align='center' gap='5px' fontSize='9px' fontWeight='800' color={C.inkSoft} justify='flex-end'>
                <Box w='6px' h='6px' borderRadius='50%' bg={C.rose} />
                Retail
              </Flex>
              <Text fontSize='15px' color={C.roseDeep} fontWeight='800' lineHeight={1}>
                ₹{fmtINRShort(T.byRevType.Retail?.val || 0)}
              </Text>
            </Flex>
            <Flex direction='column' gap='2px' textAlign='right'>
              <Flex align='center' gap='5px' fontSize='9px' fontWeight='800' color={C.inkSoft} justify='flex-end'>
                <Box w='6px' h='6px' borderRadius='50%' bg={C.amber} />
                Special
              </Flex>
              <Text fontSize='15px' color={C.amberDeep} fontWeight='800' lineHeight={1}>
                ₹{fmtINRShort(T.byRevType['Special Events']?.val || 0)}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Grid of three performance cards */}
        <Box display='grid' gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap='10px'>
          {[
            {
              name: 'Enterprise',
              sub: t(
                'menu.revenueReport.entCardDesc',
                'B2B + B2C contracts to Government, Corporate & Private entities'
              ),
              ratio: 0.93,
              icon: 'lavender',
              val: 345654
            },
            {
              name: 'Retail',
              sub: t(
                'menu.revenueReport.retailCardDesc',
                'Home Subscriber FTTH connections billed monthly via LNP partners'
              ),
              ratio: 0.03,
              icon: 'rose',
              val: 23456
            },
            {
              name: 'Special Events',
              sub: t(
                'menu.revenueReport.specialCardDesc',
                'One-off bandwidth for government events, summits, exhibitions'
              ),
              ratio: 0.3,
              icon: 'amber',
              val: 456789
            }
          ].map((card, i) => {
            const data = card.data || { count: 0, val: 0, gst: 0 };

            return (
              <FinanceCategoryCard
                key={i}
                category={card}
                mainLabel={t('menu.revenueReport.grossInvoiced', 'Gross Invoiced')}
                mainValue={fmtINRShort(data.val)}
                footerData={{
                  items: [
                    {
                      label: 'invoice',
                      value: 224,
                      color: C.ink
                    },
                    {
                      label: 'GST · 18%',
                      value: 234324,
                      color: C.ink
                    }
                  ]
                }}
              />
            );
          })}
        </Box>
      </Flex>

      {/* Section C - Charts Grid */}
      <Flex direction='column' gap='12px'>
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
            C
          </Box>
          <Text fontSize='11px' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={C.inkSoft}>
            {t('menu.revenueReport.analytics', 'Analytics')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            {t('menu.revenueReport.chartsHint', 'Distribution & trend visualisation')}
          </Text>
        </Flex>

        {/* Charts row 1 */}
        <Box display='grid' gridTemplateColumns={{ base: '1fr', xl: '1.5fr 1fr' }} gap='14px'>
          <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='16px'>
            <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
              {t('menu.revenueReport.chartMonthlyTitle', 'Invoice Value by Month')}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mb='16px'>
              {t('menu.revenueReport.chartMonthlyDesc', 'Gross invoiced amount · across all revenue types')}
            </Text>
            <Box h='200px'>{renderBarChart()}</Box>
          </Box>
          <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='16px'>
            <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
              {t('menu.revenueReport.chartCustMixTitle', 'Customer Type Mix')}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mb='16px'>
              {t('menu.revenueReport.chartCustMixDesc', 'Share of total invoiced value')}
            </Text>
            <Box h='200px'>{renderDoughnutChart(T.byCustType, [C.teal, C.info, C.rose, C.lavender])}</Box>
          </Box>
        </Box>

        {/* Charts row 2 */}
        <Box display='grid' gridTemplateColumns={{ base: '1fr', xl: '1fr 1fr' }} gap='14px'>
          <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='16px'>
            <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
              {t('menu.revenueReport.chartGstTitle', 'GST Category Split')}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mb='16px'>
              {t('menu.revenueReport.chartGstDesc', 'B2B (registered taxpayers) vs B2C (unregistered consumers)')}
            </Text>
            <Box h='200px'>{renderDoughnutChart(T.byGstCat, [C.info, C.plum])}</Box>
          </Box>
          <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='16px'>
            <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
              {t('menu.revenueReport.chartTaxPayerTitle', 'Tax Payer Type')}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mb='16px'>
              {t('menu.revenueReport.chartTaxPayerDesc', 'Regular GST · Unregistered · ISD · Composition')}
            </Text>
            <Box h='200px'>{renderHorizontalBarChart()}</Box>
          </Box>
        </Box>
      </Flex>

      {/* Section D - Top customers */}
      <Flex direction='column' gap='12px'>
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
            D
          </Box>
          <Text fontSize='11px' fontWeight='800' letterSpacing='1.2px' textTransform='uppercase' color={C.inkSoft}>
            {t('menu.revenueReport.topCustomersTitle', 'Top Customers by Revenue')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            <strong>{T.topCustomers.length}</strong> unique customer accounts loaded
          </Text>
        </Flex>

        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='20px'>
          <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
            {t('menu.revenueReport.leaderboardTitle', 'Customer Leaderboard')}
          </Text>
          <Text fontSize='11px' color={C.inkSoft} mb='20px'>
            {t('menu.revenueReport.leaderboardDesc', 'Top 10 by gross invoiced value')}
          </Text>

          <Flex direction='column' gap='8px'>
            {T.topCustomers.slice(0, 10).map((c, i) => {
              const maxv = T.topCustomers[0].val;
              const w = maxv > 0 ? (c.val / maxv) * 100 : 0;
              const chipBg =
                c.custType === 'Government' ? C.tealSoft : c.custType === 'Private' ? C.infoSoft : C.roseSoft;
              const chipColor =
                c.custType === 'Government' ? C.tealDeep : c.custType === 'Private' ? C.infoDeep : C.roseDeep;

              return (
                <Box
                  key={i}
                  display='grid'
                  gridTemplateColumns='40px 2.5fr 3fr 150px'
                  gap='16px'
                  alignItems='center'
                  py='10px'
                  px='12px'
                  borderRadius='8px'
                  cursor='pointer'
                  transition='background 0.15s'
                  _hover={{ bg: C.roseBg }}
                  onClick={() => {
                    navigate({
                      to: '/app/finance/invoice/revenue-report/invoice-wise-revenue'
                    });
                  }}
                >
                  <Text color={C.rose} fontWeight='800' fontSize='15px'>
                    #{i + 1}
                  </Text>
                  <Box>
                    <Text fontWeight='800' color={C.ink} fontSize='13px' lineHeight='1.2'>
                      {c.name}
                    </Text>
                    <Flex gap='6px' mt='2px' align='center'>
                      <Box
                        display='inline-flex'
                        px='6px'
                        py='1px'
                        borderRadius='100px'
                        bg={chipBg}
                        color={chipColor}
                        fontSize='9px'
                        fontWeight='800'
                      >
                        {c.custType || '—'}
                      </Box>
                      <Text fontSize='10.5px' color={C.inkSoft}>
                        {c.count} invoice{c.count > 1 ? 's' : ''}
                      </Text>
                    </Flex>
                  </Box>
                  <Box bg={C.lineSoft} h='8px' borderRadius='100px' overflow='hidden'>
                    <Box w={`${w}%`} h='100%' bg={C.maroon700} borderRadius='100px' />
                  </Box>
                  <Text fontSize='14px' fontWeight='800' color={C.maroon800} textAlign='right'>
                    ₹{fmtINRShort(c.val)}
                  </Text>
                </Box>
              );
            })}
          </Flex>

          {T.topCustomers.length > 10 && (
            <Flex justify='center' mt='16px' pt='14px' borderTop='1px solid' borderColor={C.line}>
              <Box
                as='button'
                onClick={() => navigate({ to: '/app/finance/invoice/revenue-report/by-customer' })}
                bg={C.maroon700}
                color='white'
                border='none'
                px='16px'
                h='34px'
                borderRadius='100px'
                fontSize='11.5px'
                fontWeight='800'
                cursor='pointer'
                display='inline-flex'
                alignItems='center'
                gap='6px'
                transition='all 0.15s'
                _hover={{ bg: C.maroon800 }}
              >
                <Text>View all {T.topCustomers.length} customers</Text>
                <FiArrowRight size={12} />
              </Box>
            </Flex>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
