import { Box, Flex, Text } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { FiDownload } from 'react-icons/fi';

import FinanceCategoryCard from '@/features/finance/common/components/FinanceCategoryCard';
import FinanceStreamCard from '@/features/finance/common/components/FinanceStreamCard';

import { C, CODE_TO_PATH, fmtINR, fmtINRFull, fmtINRShort, shortTitle } from './ExpenseReportsShared';

export default function ExpenseReportsDashboard({
  cards,
  TOTALS,
  grandTotal,
  grandGST,
  handleExportConsolidated,
  renderBarChart,
  renderDoughnutChart
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {t('menu.expenseReport.sectionALabel')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            {t('menu.expenseReport.sectionAHint', { count: 9 })}
          </Text>
        </Flex>

        <Box display='grid' gridTemplateColumns={{ base: '1fr', lg: '1fr 230px' }} gap='14px' alignItems='stretch'>
          {/* Left Block - 3x3 Stream Cards Grid */}
          <Box
            display='grid'
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }}
            gap='10px'
          >
            {cards.map((c) => {
              return (
                <FinanceStreamCard
                  key={c.key}
                  cardData={c}
                  mainValuePrefix='₹'
                  footerData={{
                    firstLabel: 'Remark',
                    secondLabel: (
                      <>
                        <strong>{c.count}</strong> rows
                      </>
                    )
                  }}
                  onClick={() =>
                    navigate({
                      to: `/app/finance/accounts/expense-reports/${CODE_TO_PATH[c.key] || c.key.toLowerCase()}`
                    })
                  }
                />
              );
            })}
          </Box>

          {/* Right Block - Premium Grand Total Card */}
          <Box
            bg={`radial-gradient(circle at 100% 0%, rgba(233, 78, 119, 0.18) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(255, 213, 87, 0.2) 0%, transparent 55%), linear-gradient(160deg, #fff5f7 0%, #fff1de 100%)`}
            border='1px solid'
            borderColor={C.roseSoft}
            borderRadius='14px'
            p='18px 16px'
            display='flex'
            flexDirection='column'
            justifyContent='space-between'
            minH='260px'
            boxShadow='0 6px 22px -10px rgba(233, 78, 119, 0.45)'
            position='relative'
          >
            {/* Header */}
            <Flex align='flex-start' gap={2}>
              <Box
                as='button'
                onClick={handleExportConsolidated}
                w='32px'
                h='32px'
                borderRadius='10px'
                bg={`linear-gradient(135deg, ${C.rose}, ${C.roseDeep})`}
                color='white'
                border='none'
                display='flex'
                alignItems='center'
                justifyContent='center'
                cursor='pointer'
                boxShadow='0 4px 10px rgba(233,78,119,0.4)'
                transition='transform 0.15s'
                _hover={{ transform: 'scale(1.05)' }}
                title={t('menu.expenseReport.exportConsolidatedCsv')}
              >
                <FiDownload size={14} />
              </Box>
              <Box>
                <Text
                  fontSize='11px'
                  fontWeight='800'
                  color={C.roseDeep}
                  letterSpacing='0.4px'
                  textTransform='uppercase'
                >
                  {t('menu.expenseReport.grandTotal')}
                </Text>
                <Text fontSize='9px' color={C.maroon700} fontWeight='600' mt='3px'>
                  {t('menu.expenseReport.allDisbursements')}
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
                  color={C.roseDeep}
                  opacity={0.85}
                  mb='10px'
                >
                  {t('menu.expenseReport.outflowPending')}
                </Text>
                <Text fontSize='30px' fontWeight='800' color={C.maroon800} letterSpacing='-0.9px' lineHeight={1.1}>
                  <span style={{ fontSize: '18px', marginRight: '2px' }}>₹</span>
                  {fmtINR(grandTotal)}
                </Text>
                <Box
                  display='inline-block'
                  mt='12px'
                  bg='white'
                  border='1px solid'
                  borderColor={C.roseSoft}
                  px='10px'
                  py='3px'
                  borderRadius='100px'
                  fontSize='10px'
                  fontWeight='800'
                  color={C.roseDeep}
                >
                  FY 2025-26
                </Box>
              </Box>
            </Flex>

            {/* GST summary box */}
            <Box
              bg='rgba(255, 255, 255, 0.75)'
              p='11px 14px'
              borderRadius='10px'
              border='1px solid'
              borderColor={C.roseSoft}
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
                color={C.roseDeep}
                opacity={0.85}
              >
                {t('menu.expenseReport.totalGst18')}
              </Text>
              <Text fontSize='18px' fontWeight='800' color={C.roseDeep} letterSpacing='-0.3px'>
                <span style={{ fontSize: '13px', marginRight: '1px' }}>₹</span>
                {fmtINR(grandGST)}
              </Text>
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* Section B - Top Categories */}
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
            {t('menu.expenseReport.sectionBLabel')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            {t('menu.expenseReport.sectionBHint')}
          </Text>
        </Flex>

        {/* Outflow ratio bar summary across all streams */}
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
          mb='2px'
        >
          <Box>
            <Text fontSize='9.5px' fontWeight='800' letterSpacing='1px' textTransform='uppercase' color={C.inkFaint}>
              {t('menu.expenseReport.acrossAllStreams')}
            </Text>
            <Text fontSize='15px' fontWeight='600' color={C.maroon800} letterSpacing='-0.2px' lineHeight={1.2}>
              Total Partner <span style={{ color: C.rose }}>{t('menu.expenseReport.totalOutflow')}</span>
              <Text
                as='span'
                display='block'
                mt='2px'
                fontSize='11px'
                color={C.inkSoft}
                fontWeight='500'
                letterSpacing='0'
              >
                {t('menu.expenseReport.disbursementsDesc')}
              </Text>
            </Text>
          </Box>
          <Box /> {/* Spacer */}
          <Flex direction='column' gap='2px' textAlign='right'>
            <Flex
              align='center'
              gap='5px'
              fontSize='9px'
              fontWeight='800'
              letterSpacing='0.6px'
              textTransform='uppercase'
              color={C.inkSoft}
              justify='flex-end'
            >
              {t('menu.expenseReport.totalOutflow')}
            </Flex>
            <Text fontSize='18px' color={C.maroon800} letterSpacing='-0.3px' lineHeight={1}>
              <span style={{ fontSize: '13px', color: C.maroon600, marginRight: '1px' }}>₹</span>
              {fmtINRShort(grandTotal)}
            </Text>
          </Flex>
          <Box h='6px' borderRadius='100px' bg={C.lineSoft} overflow='hidden' display='flex' w='180px'>
            <Box bg={`linear-gradient(90deg, ${C.mint}, #3da070)`} w='62%' h='100%' />
            <Box bg={`linear-gradient(90deg, #ff8fa5, ${C.rose})`} w='38%' h='100%' />
          </Box>
          <Flex gap='14px'>
            <Flex direction='column' gap='2px' textAlign='right'>
              <Flex
                align='center'
                gap='5px'
                fontSize='9px'
                fontWeight='800'
                letterSpacing='0.6px'
                textTransform='uppercase'
                color={C.inkSoft}
                justify='flex-end'
              >
                <Box w='6px' h='6px' borderRadius='50%' bg={C.mint} />
                {t('menu.expenseReport.disbursed62')}
              </Flex>
              <Text fontSize='17px' color={C.mintDeep} letterSpacing='-0.3px' lineHeight={1}>
                <span style={{ fontSize: '12px', color: C.inkSoft, marginRight: '1px', opacity: 0.7 }}>₹</span>
                {fmtINRShort(grandTotal * 0.62)}
              </Text>
            </Flex>
            <Flex direction='column' gap='2px' textAlign='right'>
              <Flex
                align='center'
                gap='5px'
                fontSize='9px'
                fontWeight='800'
                letterSpacing='0.6px'
                textTransform='uppercase'
                color={C.inkSoft}
                justify='flex-end'
              >
                <Box w='6px' h='6px' borderRadius='50%' bg={C.rose} />
                {t('menu.expenseReport.pending38')}
              </Flex>
              <Text fontSize='17px' color={C.rose} letterSpacing='-0.3px' lineHeight={1}>
                <span style={{ fontSize: '12px', color: C.inkSoft, marginRight: '1px', opacity: 0.7 }}>₹</span>
                {fmtINRShort(grandTotal * 0.38)}
              </Text>
            </Flex>
          </Flex>
        </Box>

        {/* Cards Breakdown Grid */}
        <Box
          display='grid'
          gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }}
          gap='10px'
        >
          {[
            {
              name: t('menu.expenseReport.categoryLnpPartners'),
              sub: t('menu.expenseReport.categoryLnpPartnersSub'),
              val: TOTALS.LNP_RETAIL.total + TOTALS.LNP_ENTERPRISE.total,
              ratio: 0.78,
              icon: 'lavender'
            },
            {
              name: t('menu.expenseReport.categoryAgnpPartners'),
              sub: t('menu.expenseReport.categoryAgnpPartnersSub'),
              val: TOTALS.AGNP_ENTERPRISE.total,
              ratio: 0.65,
              icon: 'teal'
            },
            {
              name: t('menu.expenseReport.categoryMspVas'),
              sub: t('menu.expenseReport.categoryMspVasSub'),
              val: TOTALS.MSP_REVENUE.total + TOTALS.VAS_PROVIDER.total,
              ratio: 0.82,
              icon: 'coral'
            },
            {
              name: t('menu.expenseReport.categoryIncentives'),
              sub: t('menu.expenseReport.categoryIncentivesSub'),
              val: TOTALS.PARTNERS_INCENTIVES.total + TOTALS.INCENTIVES_SUMMARY.total + TOTALS.PARTNER_GST_REFUND.total,
              ratio: 0.41,
              icon: 'plum',
              alert: false
            }
          ].map((cat, i) => {
            const paid = cat.val * cat.ratio;
            const pending = cat.val - paid;
            return (
              <FinanceCategoryCard
                key={i}
                category={cat}
                mainLabel={t('menu.expenseReport.totalPayable')}
                mainValuePrefix='₹'
                footerData={{
                  progressBar: true,
                  items: [
                    {
                      label: 'Disbursed',
                      value: paid,
                      color: C.ink,
                      dotColor: C.mint
                    },
                    {
                      label: 'Pending',
                      value: pending,
                      color: C.ink,
                      dotColor: C.rose
                    }
                  ]
                }}
              />
            );
          })}
        </Box>
      </Flex>

      {/* Charts Row */}
      <Box display='grid' gridTemplateColumns={{ base: '1fr', xl: '1.5fr 1fr' }} gap='14px'>
        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='16px'>
          <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
            {t('menu.expenseReport.outflowDistribution')}
          </Text>
          <Text fontSize='11px' color={C.inkSoft} mb='16px'>
            {t('menu.expenseReport.outflowDistributionDesc')}
          </Text>
          <Box h='200px'>{renderBarChart(cards)}</Box>
        </Box>
        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='16px'>
          <Text fontSize='16px' fontWeight='800' color={C.maroon800} mb='2px'>
            {t('menu.expenseReport.partnerTypeMix')}
          </Text>
          <Text fontSize='11px' color={C.inkSoft} mb='16px'>
            {t('menu.expenseReport.partnerTypeMixDesc')}
          </Text>
          <Box h='200px'>{renderDoughnutChart()}</Box>
        </Box>
      </Box>

      {/* Section C - Table quick view */}
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
            {t('menu.expenseReport.sectionCLabel')}
          </Text>
          <Box flex='1' h='1px' bg={C.line} minW='20px' />
          <Text fontSize='10.5px' color={C.inkFaint} fontWeight='600' letterSpacing='0.3px'>
            {t('menu.expenseReport.sectionCHint')}
          </Text>
        </Flex>

        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='12px' overflow='hidden'>
          {/* Table Header */}
          <Box
            display='grid'
            gridTemplateColumns='150px minmax(200px, 2fr) 120px 100px 140px 120px'
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
            <Text>{t('menu.expenseReport.tableCode')}</Text>
            <Text>{t('menu.expenseReport.tableReportName')}</Text>
            <Text>{t('menu.expenseReport.tablePartnerType')}</Text>
            <Text textAlign='right'>{t('menu.expenseReport.tableRows')}</Text>
            <Text textAlign='right'>{t('menu.expenseReport.tableDisbursement')}</Text>
            <Text textAlign='right'>{t('menu.expenseReport.tableGstComponent')}</Text>
          </Box>

          {/* Table Rows */}
          <Flex direction='column'>
            {cards.map((c) => (
              <Box
                key={c.key}
                display='grid'
                gridTemplateColumns='150px minmax(200px, 2fr) 120px 100px 140px 120px'
                gap='10px'
                alignItems='center'
                px='16px'
                py='12px'
                borderBottom='1px solid'
                borderColor={C.line}
                cursor='pointer'
                transition='background 0.15s'
                _hover={{ bg: C.roseBg }}
                onClick={() => navigate({ to: `/app/finance/accounts/expense-reports/${c.key.toLowerCase()}` })}
              >
                <Box>
                  <Box
                    display='inline-flex'
                    px='8px'
                    py='2px'
                    borderRadius='5px'
                    bg={C.yellowBg}
                    color={C.maroon800}
                    fontWeight='800'
                    fontSize='11px'
                  >
                    {c.code}
                  </Box>
                </Box>
                <Box>
                  <Text fontWeight='800' color={C.ink} fontSize='12.5px'>
                    {shortTitle(c.title)}
                  </Text>
                  <Text fontSize='10.5px' color={C.inkSoft} noOfLines={1}>
                    {c.desc}
                  </Text>
                </Box>
                <Box>
                  <Box
                    display='inline-flex'
                    px='8px'
                    py='2px'
                    borderRadius='5px'
                    bg={c.partnerType.includes('/') || c.partnerType === 'All' ? C.slateSoft : C.lavenderSoft}
                    color={c.partnerType.includes('/') || c.partnerType === 'All' ? C.slateDeep : C.lavenderDeep}
                    fontSize='10px'
                    fontWeight='800'
                  >
                    {c.partnerType}
                  </Box>
                </Box>
                <Text textAlign='right' fontSize='12.5px' fontWeight='600'>
                  {c.count}
                </Text>
                <Text textAlign='right' fontSize='13.5px' fontWeight='800' color={C.rose}>
                  ₹{fmtINRFull(c.total)}
                </Text>
                <Text textAlign='right' fontSize='12.5px' fontWeight='600' color={C.inkSoft}>
                  {c.gst ? `₹${fmtINRFull(c.gst)}` : '—'}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
