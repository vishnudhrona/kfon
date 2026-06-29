import { Box, Flex, Text } from '@kfonbss/bss-ui-components';

const C = {
  maroon: '#5c012e',
  maroon2: '#8d0247',
  yellow: '#ffd557',
  yellowBg: '#fff9e8',
  mint: '#5bbf95',
  mintSoft: '#d9f0e5',
  mintDeep: '#1b6b3a',
  amber: '#f5b93b',
  amberSoft: '#fff0cf',
  amberDeep: '#9a7800',
  coral: '#f76c7a',
  coralSoft: '#ffe2e4',
  coralDeep: '#a3362f',
  teal: '#2fb8c6',
  tealSoft: '#d6f2f4',
  tealDeep: '#0c5a63',
  info: '#5b8cb8',
  infoSoft: '#dde8f2',
  line: '#f0e4ea',
  paper: '#fbf7f5',
  ink: '#2b1a26',
  inkSoft: '#6f5e6a'
};

const TOP_PARTNERS = [
  {
    rank: 1,
    name: 'MOONSTAR CABLE VISION',
    meta: 'Kollam · 42 txns · ₹68,200 collected',
    metric: '94%',
    trend: '+12%',
    up: true
  },
  {
    rank: 2,
    name: 'ORBIT 2 CABLE TV NETWORK',
    meta: 'Alappuzha · 38 txns · ₹54,800 collected',
    metric: '91%',
    trend: '+8%',
    up: true
  },
  {
    rank: 3,
    name: 'STARLINE CABLE NETWORK',
    meta: 'Malappuram · 35 txns · ₹48,950 collected',
    metric: '89%',
    trend: '+5%',
    up: true
  },
  {
    rank: 4,
    name: 'HIGH TEC VISION',
    meta: 'Idukki · 31 txns · ₹42,100 collected',
    metric: '87%',
    trend: '+3%',
    up: true
  },
  {
    rank: 5,
    name: 'SKY VISION CABLE TV',
    meta: 'Thiruvananthapuram · 29 txns · ₹38,400 collected',
    metric: '84%',
    trend: '+2%',
    up: true
  }
];

const DISTRICTS_BAR = [
  { name: 'Ernakulam', pct: 95, color: C.mint, success: '82%', txns: 208 },
  { name: 'Thiruvananthapuram', pct: 83, color: C.teal, success: '79%', txns: 182 },
  { name: 'Malappuram', pct: 78, color: C.teal, success: '77%', txns: 172 },
  { name: 'Thrissur', pct: 76, color: C.info, success: '76%', txns: 167 },
  { name: 'Kozhikode', pct: 74, color: C.info, success: '74%', txns: 163 },
  { name: 'Palakkad', pct: 70, color: C.info, success: '72%', txns: 154 },
  { name: 'Kottayam', pct: 67, color: C.amber, success: '68%', txns: 148 },
  { name: 'Kannur', pct: 61, color: C.amber, success: '65%', txns: 135 },
  { name: 'Kollam', pct: 56, color: C.amber, success: '63%', txns: 124 },
  { name: 'Alappuzha', pct: 52, color: C.amber, success: '70%', txns: 115 },
  { name: 'Pathanamthitta', pct: 40, color: C.coral, success: '58%', txns: 89 },
  { name: 'Kasaragod', pct: 38, color: C.coral, success: '54%', txns: 83 },
  { name: 'Idukki', pct: 34, color: C.coral, success: '52%', txns: 76 },
  { name: 'Wayanad', pct: 28, color: C.coral, success: '48%', txns: 61 }
];

const DELAY_DATA = [
  { name: 'STARLINE CABLE NETWORK', left: 9, tag: '2.1 hrs', speed: 'fast' },
  { name: 'HIGH TEC VISION', left: 12, tag: '2.8 hrs', speed: 'fast' },
  { name: 'MOONSTAR CABLE VISION', left: 18, tag: '4.2 hrs', speed: 'fast' },
  { name: 'ORBIT 2 CABLE TV NETWORK', left: 24, tag: '5.7 hrs', speed: 'fast' },
  { name: 'SKY VISION CABLE TV', left: 42, tag: '10 hrs', speed: 'mid' },
  { name: 'JACKSON CABLE NETWORK', left: 55, tag: '13 hrs', speed: 'mid' },
  { name: 'CABNET CHENAPPADY', left: 60, tag: '14 hrs', speed: 'mid' },
  { name: 'SUN SHINE CABLE NETWORK', left: 78, tag: '18 hrs', speed: 'slow' },
  { name: 'DAS CABLE NETWORK', left: 88, tag: '21 hrs', speed: 'slow' },
  { name: 'SKY VISION CABLE NETWORK', left: 95, tag: '26 hrs', speed: 'slow' }
];

const GATEWAYS = [
  { name: 'BBPS', rate: 91, pct: 91, color: C.mintDeep, txns: '332 txns', vol: '18% of volume', winner: true },
  { name: 'IKM', rate: 78, pct: 78, color: C.teal, txns: '259 txns', vol: '14% of volume', winner: false },
  { name: 'HDFC', rate: 71, pct: 71, color: C.amber, txns: '1,256 txns', vol: '68% of volume', winner: false }
];

const RANK_BG = [
  'linear-gradient(135deg,#f5c842,#d4a017)',
  'linear-gradient(135deg,#c0c0c0,#868686)',
  'linear-gradient(135deg,#cd7f32,#8b5a2b)'
];
const DELAY_STYLE = {
  fast: { bg: C.mintSoft, color: C.mintDeep },
  mid: { bg: C.amberSoft, color: C.amberDeep },
  slow: { bg: C.coralSoft, color: C.coralDeep }
};

const RechargeInsights = () => {
  return (
    <Box p='22px 26px 32px' bg={C.paper} minH='100vh'>
      <Box mb='18px'>
        <Text fontSize='28px' color={C.maroon} fontWeight='400' letterSpacing='-0.4px' mb='4px'>
          Recharge Insights
        </Text>
        <Text fontSize='12px' color={C.inkSoft}>
          Operational intelligence from recharge data · Answering 4 key business questions
        </Text>
      </Box>

      {/* Summary Strip */}
      <Box display='grid' gridTemplateColumns='repeat(4,1fr)' gap='12px' mb='20px'>
        {[
          { type: 'mint', label: 'Top Performing Partner', val: 'MOONSTAR', sub: '₹68.2K recharged · 94% success' },
          { type: 'teal', label: 'Best District', val: 'Ernakulam', sub: '208 txns · 82% success rate' },
          { type: 'amber', label: 'Fastest Responder', val: 'STARLINE', sub: 'Avg 2.1 hrs · Subscriber → Partner' },
          { type: 'coral', label: 'Winning Gateway', val: 'BBPS', sub: '91% success · Lowest drop-off' }
        ].map((s, i) => (
          <Box
            key={i}
            bg='white'
            border='1px solid'
            borderColor={C.line}
            borderRadius='10px'
            p='14px 16px'
            position='relative'
            overflow='hidden'
          >
            <Box
              position='absolute'
              left='0'
              top='0'
              bottom='0'
              w='3px'
              borderRadius='2px 0 0 2px'
              bg={s.type === 'mint' ? C.mint : s.type === 'teal' ? C.teal : s.type === 'amber' ? C.amber : C.coral}
            />
            <Text
              fontSize='10px'
              color={C.inkSoft}
              textTransform='uppercase'
              letterSpacing='0.7px'
              fontWeight='700'
              mb='6px'
            >
              {s.label}
            </Text>
            <Text fontSize='22px' fontWeight='700' color={C.maroon} lineHeight='1'>
              {s.val}
            </Text>
            <Text fontSize='11px' color={C.inkSoft} mt='4px'>
              {s.sub}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Q1 & Q2 */}
      <Box display='grid' gridTemplateColumns='1fr 1fr' gap='16px' mb='20px'>
        {/* Q1 */}
        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='20px 22px'>
          <Flex justify='space-between' align='flex-start' mb='14px' gap='12px'>
            <Box>
              <Text
                fontSize='11px'
                color={C.inkSoft}
                textTransform='uppercase'
                letterSpacing='0.8px'
                fontWeight='700'
                mb='4px'
              >
                Question 01
              </Text>
              <Text fontSize='17px' fontWeight='700' color={C.maroon} lineHeight='1.25'>
                Which partners are actually doing proper recharges?
              </Text>
            </Box>
            <Box
              px='9px'
              py='4px'
              borderRadius='12px'
              bg={C.mintDeep}
              color='white'
              fontSize='10px'
              fontWeight='800'
              letterSpacing='0.4px'
              whiteSpace='nowrap'
            >
              Top Performers
            </Box>
          </Flex>
          <Box
            bg={C.paper}
            borderLeft='3px solid'
            borderColor={C.yellow}
            px='14px'
            py='10px'
            borderRadius='0 8px 8px 0'
            mb='14px'
            fontSize='13px'
            color={C.ink}
          >
            <Text as='strong' color={C.maroon2} fontWeight='700'>
              MOONSTAR CABLE VISION
            </Text>{' '}
            leads with 94% completion rate. Top 5 partners contribute{' '}
            <Text as='strong' color={C.maroon2} fontWeight='700'>
              62%
            </Text>{' '}
            of total recharge value.
          </Box>
          <Flex direction='column' gap='8px'>
            {TOP_PARTNERS.map((p, i) => (
              <Flex
                key={i}
                align='center'
                gap='10px'
                p='10px 12px'
                bg={C.paper}
                borderRadius='8px'
                _hover={{ bg: C.yellowBg }}
                fontSize='12px'
              >
                <Box
                  w='26px'
                  h='26px'
                  borderRadius='50%'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  fontSize='11px'
                  fontWeight='800'
                  color='white'
                  flexShrink={0}
                  style={{
                    background: i < 3 ? RANK_BG[i] : C.slate,
                    boxShadow: i === 0 ? '0 2px 6px rgba(212,160,23,.3)' : 'none'
                  }}
                >
                  {p.rank}
                </Box>
                <Box flex='1' minW={0}>
                  <Text fontWeight='700' color={C.maroon} noOfLines={1}>
                    {p.name}
                  </Text>
                  <Text fontSize='10px' color={C.inkSoft} mt='2px'>
                    {p.meta}
                  </Text>
                </Box>
                <Text fontWeight='700' color={C.mintDeep} fontSize='13px'>
                  {p.metric}
                </Text>
                <Box
                  px='7px'
                  py='2px'
                  borderRadius='10px'
                  bg={C.mintSoft}
                  color={C.mintDeep}
                  fontSize='10px'
                  fontWeight='700'
                >
                  {p.trend}
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Q2 */}
        <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='20px 22px'>
          <Flex justify='space-between' align='flex-start' mb='14px' gap='12px'>
            <Box>
              <Text
                fontSize='11px'
                color={C.inkSoft}
                textTransform='uppercase'
                letterSpacing='0.8px'
                fontWeight='700'
                mb='4px'
              >
                Question 02
              </Text>
              <Text fontSize='17px' fontWeight='700' color={C.maroon} lineHeight='1.25'>
                Which districts are doing proper recharges?
              </Text>
            </Box>
            <Box
              px='9px'
              py='4px'
              borderRadius='12px'
              bg={C.maroon}
              color={C.yellow}
              fontSize='10px'
              fontWeight='800'
              letterSpacing='0.4px'
              whiteSpace='nowrap'
            >
              Geography
            </Box>
          </Flex>
          <Box
            bg={C.paper}
            borderLeft='3px solid'
            borderColor={C.yellow}
            px='14px'
            py='10px'
            borderRadius='0 8px 8px 0'
            mb='14px'
            fontSize='13px'
            color={C.ink}
          >
            <Text as='strong' color={C.maroon2} fontWeight='700'>
              Ernakulam, TVM and Malappuram
            </Text>{' '}
            are top 3 — contributing{' '}
            <Text as='strong' color={C.maroon2} fontWeight='700'>
              54%
            </Text>{' '}
            of transactions.
          </Box>
          <Flex direction='column' gap='10px'>
            {DISTRICTS_BAR.map((d, i) => (
              <Flex key={i} align='center' gap='12px' fontSize='12px'>
                <Text fontWeight='600' color={C.ink} w='140px' flexShrink={0} noOfLines={1}>
                  {d.name}
                </Text>
                <Box flex='1' bg={C.line} h='18px' borderRadius='4px' overflow='hidden'>
                  <Flex
                    h='100%'
                    bg={d.color}
                    borderRadius='4px'
                    align='center'
                    px='8px'
                    w={`${d.pct}%`}
                    style={{ transition: 'width .6s ease' }}
                  >
                    <Text fontSize='10px' fontWeight='700' color='white' noOfLines={1}>
                      {d.success} success
                    </Text>
                  </Flex>
                </Box>
                <Text fontWeight='700' color={C.maroon} w='48px' textAlign='right'>
                  {d.txns}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Q3 Delay */}
      <Box
        bg='linear-gradient(135deg,#fff9e8 0%,#fff 60%)'
        border='1px solid'
        borderColor={C.yellow}
        borderRadius='14px'
        p='20px 22px'
        mb='20px'
      >
        <Flex justify='space-between' align='flex-start' mb='14px' gap='12px'>
          <Box>
            <Text
              fontSize='11px'
              color={C.inkSoft}
              textTransform='uppercase'
              letterSpacing='0.8px'
              fontWeight='700'
              mb='4px'
            >
              Question 03
            </Text>
            <Text fontSize='17px' fontWeight='700' color={C.maroon} lineHeight='1.25'>
              Which partners are recharging against subscribers without delay?
            </Text>
          </Box>
          <Box
            px='9px'
            py='4px'
            borderRadius='12px'
            bg={C.mintDeep}
            color='white'
            fontSize='10px'
            fontWeight='800'
            letterSpacing='0.4px'
            whiteSpace='nowrap'
          >
            Response Time
          </Box>
        </Flex>
        <Box
          bg={C.paper}
          borderLeft='3px solid'
          borderColor={C.yellow}
          px='14px'
          py='10px'
          borderRadius='0 8px 8px 0'
          mb='14px'
          fontSize='13px'
          color={C.ink}
        >
          Measures gap between subscriber payment received → partner wallet recharged.{' '}
          <Text as='strong' color={C.maroon2} fontWeight='700'>
            4 partners
          </Text>{' '}
          operate within 6-hour SLA. Two partners exceed 24 hrs — intervention needed.
        </Box>
        <Flex direction='column' gap='6px'>
          {DELAY_DATA.map((d, i) => (
            <Flex key={i} align='center' gap='10px' py='6px' fontSize='11px'>
              <Text fontWeight='700' color={C.maroon} w='160px' flexShrink={0} noOfLines={1}>
                {d.name}
              </Text>
              <Box
                flex='1'
                h='22px'
                borderRadius='4px'
                position='relative'
                overflow='hidden'
                style={{
                  background: `linear-gradient(90deg,${C.mintSoft} 0%,${C.mintSoft} 33%,${C.amberSoft} 33%,${C.amberSoft} 66%,${C.coralSoft} 66%,${C.coralSoft} 100%)`
                }}
              >
                <Box
                  position='absolute'
                  top='50%'
                  w='14px'
                  h='14px'
                  borderRadius='50%'
                  bg={C.maroon}
                  border='2px solid white'
                  style={{
                    left: `${d.left}%`,
                    transform: 'translate(-50%,-50%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,.2)'
                  }}
                />
              </Box>
              <Box
                px='7px'
                py='2px'
                borderRadius='10px'
                whiteSpace='nowrap'
                fontWeight='700'
                bg={DELAY_STYLE[d.speed].bg}
                color={DELAY_STYLE[d.speed].color}
                fontSize='10px'
              >
                {d.tag}
              </Box>
            </Flex>
          ))}
          <Flex
            gap='14px'
            fontSize='10px'
            color={C.inkSoft}
            mt='10px'
            pt='10px'
            borderTop='1px dashed'
            borderColor={C.line}
          >
            <Flex align='center' gap='5px'>
              <Box w='10px' h='10px' borderRadius='2px' bg={C.mintSoft} />
              <Text as='strong' color={C.mintDeep}>
                Fast
              </Text>{' '}
              &lt; 6 hrs (SLA)
            </Flex>
            <Flex align='center' gap='5px'>
              <Box w='10px' h='10px' borderRadius='2px' bg={C.amberSoft} />
              <Text as='strong' color={C.amberDeep}>
                Medium
              </Text>{' '}
              6–18 hrs
            </Flex>
            <Flex align='center' gap='5px'>
              <Box w='10px' h='10px' borderRadius='2px' bg={C.coralSoft} />
              <Text as='strong' color={C.coralDeep}>
                Slow
              </Text>{' '}
              &gt; 18 hrs · Needs escalation
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Q4 Gateway */}
      <Box bg='white' border='1px solid' borderColor={C.line} borderRadius='14px' p='20px 22px'>
        <Flex justify='space-between' align='flex-start' mb='14px' gap='12px'>
          <Box>
            <Text
              fontSize='11px'
              color={C.inkSoft}
              textTransform='uppercase'
              letterSpacing='0.8px'
              fontWeight='700'
              mb='4px'
            >
              Question 04
            </Text>
            <Text fontSize='17px' fontWeight='700' color={C.maroon} lineHeight='1.25'>
              Which payment gateway is performing best?
            </Text>
          </Box>
          <Box
            px='9px'
            py='4px'
            borderRadius='12px'
            bg={C.maroon}
            color={C.yellow}
            fontSize='10px'
            fontWeight='800'
            letterSpacing='0.4px'
          >
            Gateway Analysis
          </Box>
        </Flex>
        <Box
          bg={C.paper}
          borderLeft='3px solid'
          borderColor={C.yellow}
          px='14px'
          py='10px'
          borderRadius='0 8px 8px 0'
          mb='14px'
          fontSize='13px'
          color={C.ink}
        >
          <Text as='strong' color={C.maroon2} fontWeight='700'>
            BBPS
          </Text>{' '}
          wins on success rate (91%) but handles only 18% of volume.{' '}
          <Text as='strong' color={C.maroon2} fontWeight='700'>
            HDFC
          </Text>{' '}
          dominates volume (68%) but shows weaker completion (71%).
        </Box>
        <Box display='grid' gridTemplateColumns='repeat(3,1fr)' gap='12px' mb='16px'>
          {GATEWAYS.map((g, i) => (
            <Box
              key={i}
              borderRadius='10px'
              p='14px'
              position='relative'
              bg={g.winner ? C.mintSoft : C.paper}
              border='1px solid'
              borderColor={g.winner ? C.mint : C.line}
            >
              {g.winner && (
                <Box
                  position='absolute'
                  top='-8px'
                  right='10px'
                  bg={C.mintDeep}
                  color='white'
                  fontSize='9px'
                  fontWeight='800'
                  px='9px'
                  py='3px'
                  borderRadius='10px'
                  letterSpacing='0.5px'
                >
                  ★ Best
                </Box>
              )}
              <Text
                fontSize='11px'
                fontWeight='800'
                color={C.maroon2}
                textTransform='uppercase'
                letterSpacing='0.6px'
                mb='8px'
              >
                {g.name}
              </Text>
              <Text fontSize='28px' fontWeight='700' color={C.maroon} lineHeight='1'>
                {g.rate}
                <Text as='small' fontSize='13px' color={C.inkSoft} ml='2px'>
                  %
                </Text>
              </Text>
              <Box h='6px' bg='white' borderRadius='3px' my='10px' overflow='hidden'>
                <Box h='100%' borderRadius='3px' bg={g.color} w={`${g.pct}%`} />
              </Box>
              <Flex justify='space-between' fontSize='10px' color={C.inkSoft} fontWeight='600'>
                <Text>{g.txns}</Text>
                <Text>{g.vol}</Text>
              </Flex>
            </Box>
          ))}
        </Box>
        <Box
          p='12px 16px'
          bg={C.yellowBg}
          border='1px dashed'
          borderColor={C.yellow}
          borderRadius='8px'
          fontSize='12px'
          color={C.ink}
        >
          <Text as='strong' color={C.maroon2}>
            ⚑ Operational Recommendation:
          </Text>{' '}
          Shift 30% of HDFC volume to BBPS/IKM. Projected gain:{' '}
          <Text as='strong' color={C.maroon2}>
            +146 successful transactions/day
          </Text>{' '}
          → approx{' '}
          <Text as='strong' color={C.maroon2}>
            ₹58K additional daily collection
          </Text>
          .
        </Box>
      </Box>
    </Box>
  );
};

export default RechargeInsights;
