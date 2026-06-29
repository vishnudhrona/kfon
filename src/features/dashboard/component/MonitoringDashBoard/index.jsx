import { Box, Flex, Grid, HStack, Icons, SimpleGrid, Text } from '@kfonbss/bss-ui-components';
import { useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

const { DashBoardCardWaveIcon, GrowthIcon, BoardNewIcon, HomeCardNewIcon, MoneyCardNewIcon, PenNibIcon } = Icons;

const WaveChart = ({ id, isIncrease = true, white = false }) => (
    <svg width="48" height="37" viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M48 37V22.1472C42.7753 22.1472 42.1483 10.8199 37.3923 10.8199C32.6364 10.8199 33.0197 18.8638 27.067 21.0104C21.1143 23.157 20.2187 1 15.6548 1C11.0908 1 13.5162 17.5889 8.59005 19.7134C3.66386 21.838 1.46497 13.5237 0 15.8219V37H48Z"
            fill={`url(#wave_${id})`}
        />
        <path
            d="M0 15.8219C2.7696 15.8219 3.66386 21.838 8.59005 19.7134C13.5162 17.5889 11.0908 1 15.6548 1C20.2187 1 21.1143 23.157 27.067 21.0104C33.0197 18.8638 32.6364 10.8199 37.3923 10.8199C42.1483 10.8199 42.0855 22.1472 48 22.1472"
            stroke={white ? '#FFFFFF' : isIncrease ? '#33CCCC' : '#F27649'}
            strokeWidth="2"
        />
        <defs>
            <linearGradient id={`wave_${id}`} x1="24" y1="1" x2="24" y2="37" gradientUnits="userSpaceOnUse">
                {white ? (
                    <>
                        <stop stopColor="rgba(255, 255, 255, 0.4)" />
                        <stop offset="1" stopColor="rgba(13, 231, 185, 0)" />
                    </>
                ) : isIncrease ? (
                    <>
                        <stop stopColor="rgba(13, 231, 185, 0.4)" />
                        <stop offset="1" stopColor="rgba(13, 231, 185, 0)" />
                    </>
                ) : (
                    <>
                        <stop stopColor="rgba(250, 120, 133, 0.4)" />
                        <stop offset="1" stopColor="rgba(253, 53, 73, 0)" />
                    </>
                )}
            </linearGradient>
        </defs>
    </svg>
);

const RevenueCard = ({ title, value, isIncrease, pct, id }) => (
    <Box bg="white" borderRadius="16px" p="16px" boxShadow="0px 2px 12px rgba(0,0,0,0.07)" border="1px solid #E2E8F0" h="100%">
        <Flex justify="space-between" align="flex-start" mb={2}>
            <Text fontSize="13px" fontWeight="600" color="#374151">{title}</Text>
            <WaveChart id={id} isIncrease={isIncrease} />
        </Flex>
        <Flex justify="space-between" align="center">
            <Text fontSize="22px" fontWeight="700" color="#1A202C" lineHeight="1">{value}</Text>
            <HStack spacing={1}>
                <Box w="6px" h="6px" borderRadius="full" bg={isIncrease ? '#33CCCC' : '#F27649'} flexShrink={0} />
                <Text fontSize="11px" fontWeight="400" color={isIncrease ? '#33CCCC' : '#F27649'} textAlign="right">
                    {isIncrease ? 'Increase' : 'Decrease'} {pct}
                </Text>
            </HStack>
        </Flex>
    </Box>
);

const TotalRevenueCard = ({ value, isIncrease, pct, id }) => (
    <Box bg="white" borderRadius="16px" p="24px" boxShadow="0px 2px 12px rgba(0,0,0,0.07)" border="1px solid #E2E8F0" h="100%" display="flex" flexDirection="column" justifyContent="space-between">
        <Flex justify="space-between" align="flex-start" mb={2}>
            <Text fontSize="16px" fontWeight="600" color="#000000">Total Revenue</Text>
            <WaveChart id={id} isIncrease={isIncrease} />
        </Flex>
        <Text fontSize="28px" fontWeight="700" color="#1A202C" lineHeight="1" mb={4}>
            {value}
        </Text>
        <HStack spacing={1}>
            <Box w="8px" h="8px" borderRadius="full" bg="#33CCCC" flexShrink={0} />
            <Text fontSize="13px" fontWeight="400" color="#33CCCC">
                {isIncrease ? 'Increase' : 'Decrease'} {pct} total over month
            </Text>
        </HStack>
    </Box>
);

const ColoredCard = ({ title, value, isIncrease, pct, id, bg, style, dotColor = '#33CCCC', onClick }) => (
    <Box
        borderRadius="16px"
        cursor="pointer"
        onClick={onClick}
        _focusVisible={{ outline: 'none' }}
        p="14px 16px"
        boxShadow="0px 4px 16px rgba(0,0,0,0.15)"
        position="relative"
        overflow="hidden"
        bg={bg}
        style={style}
        h="111px"
        display="flex"
        alignItems="stretch"
    >
        <Flex flexDirection="column" justifyContent="space-between" flex={1}>
            <Text fontSize="16px" fontWeight="600" color="#FFFFFF">{title}</Text>
            <Text fontSize="24px" fontWeight="500" color="white" lineHeight="1">{value}</Text>
        </Flex>
        <Flex flexDirection="column" justifyContent="space-between" alignItems="flex-end">
            <WaveChart id={id} isIncrease={isIncrease} white />
            <HStack spacing={1}>
                <Box w="6px" h="6px" borderRadius="full" bg={dotColor} flexShrink={0} />
                <Text fontSize="11px" color="white" fontWeight="400" textAlign="right">
                    {isIncrease ? 'Increase' : 'Decrease'} {pct}<br />total over month
                </Text>
            </HStack>
        </Flex>
        <Box position="absolute" bottom="0" left="0" right="0" color="#FFFFFF24">
            {DashBoardCardWaveIcon && <DashBoardCardWaveIcon width="60%" style={{ display: 'block' }} />}
        </Box>
    </Box>
);

const LnpCard = ({ title, value, isIncrease, pct, id }) => (
    <Box bg="white" borderRadius="16px" p="20px" boxShadow="0px 2px 12px rgba(0,0,0,0.07)" border="1px solid #E2E8F0">
        <Flex justify="space-between" align="flex-start" mb={3}>
            <Text fontSize="14px" fontWeight="600" color="#374151">{title}</Text>
            <WaveChart id={id} isIncrease={isIncrease} />
        </Flex>
        <Flex justify="space-between" align="center">
            <Text fontSize="24px" fontWeight="500" color="#1A202C" lineHeight="1">{value}</Text>
            <HStack spacing={1}>
                <Box w="6px" h="6px" borderRadius="full" bg={isIncrease ? '#33CCCC' : '#F27649'} flexShrink={0} />
                <Text fontSize="11px" color={isIncrease ? '#33CCCC' : '#F27649'} fontWeight="500">
                    {pct} {isIncrease ? 'Increase' : 'Decrease'} from the Previous Month
                </Text>
            </HStack>
        </Flex>
    </Box>
);

const ActiveSubCard = ({ title, value, today, iconBg, IconComponent }) => (
    <Box bg="white" borderRadius="12px" p="16px" border="1px solid #F0F0F0">
        <HStack spacing={2} mb={4} align="flex-start">
            <Box w="36px" h="36px" borderRadius="10px" bg={iconBg || '#FFE5D0'} flexShrink={0} display="flex" alignItems="center" justifyContent="center">
                {IconComponent && <IconComponent boxSize="28px" color="white" />}
            </Box>
            <Box>
                <Text fontSize="14px" fontWeight="500" color="#000000" lineHeight="tight">{title}</Text>
                <Text fontSize="12px" fontWeight="500" color="#000000" lineHeight="tight">Subscribers</Text>
            </Box>
        </HStack>
        <Text fontSize="22px" fontWeight="700" color="#000000" lineHeight="1" mb="8px">{value}</Text>
        <HStack spacing={1}>
            <GrowthIcon width="14px" height="14px" />
            <Text fontSize="11px" color="#22C55E" fontWeight="600">{today}</Text>
            <Text fontSize="11px" color="#000000">today</Text>
        </HStack>
    </Box>
);

const ConnectionRow = ({ label, current, prev, prevLabel, todayCount }) => (
    <Flex justify="space-between" align="center" py="10px" borderBottom="1px solid #F3F4F6">
        <Box>
            <Text fontSize="14px" fontWeight="600" color="#000000CC" mb="2px">{label}</Text>
            <HStack spacing={1}>
                <Text fontSize="22px" fontWeight="500" color="#000000CC">{current}</Text>
                <HStack spacing={1}>
                    <GrowthIcon width="14px" height="14px" />
                    <Text fontSize="11px" color="#22C55E" fontWeight="600">{todayCount ?? Math.abs(current - prev)}</Text>
                    <Text fontSize="11px" color="#9CA3AF">today</Text>
                </HStack>
            </HStack>
        </Box>
        <Box textAlign="right">
            <Text fontSize="16px" fontWeight="400" color="#000000">{prev}</Text>
            <Text fontSize="10px" fontWeight="400" color="#666666">{prevLabel}</Text>
        </Box>
    </Flex>
);

const GaugeChart = ({ value, pct = 0.65 }) => {
    const filled = pct * 100;
    const empty = 100 - filled;
    const data = [
        { value: filled },
        { value: empty }
    ];

    return (
        <Box position="relative" display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <PieChart width={320} height={170} style={{ outline: 'none' }}>
                <defs>
                    <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#86EFAC" />
                        <stop offset="100%" stopColor="#D4E85A" />
                    </linearGradient>
                </defs>
                <Pie
                    data={data}
                    cx={160}
                    cy={160}
                    startAngle={180}
                    endAngle={0}
                    innerRadius={110}
                    outerRadius={135}
                    paddingAngle={0}
                    dataKey="value"
                    strokeWidth={0}
                    isAnimationActive={false}
                    style={{ outline: 'none' }}
                >
                    <Cell fill="url(#gaugeGradient)" />
                    <Cell fill="#E5E7EB" />
                </Pie>
            </PieChart>
            <Box position="absolute" bottom="12px" textAlign="center">
                <Text fontSize="12px" color="#6B7280" mb="2px">Live</Text>
                <Text fontSize="24px" fontWeight="700" color="#1A202C">₹ {value}</Text>
            </Box>
        </Box>
    );
};

const DISTRICT_DATA = [
    { district: 'Thiruvananthapuram', lnp: 50, agnp: 35 },
    { district: 'Kollam', lnp: 30, agnp: 25 },
    { district: 'Pathanamthitta', lnp: 25, agnp: 12 },
    { district: 'Alappuzha', lnp: 15, agnp: 8 }
];

const SUBSCRIBER_DATA = {
    total: [
        { title: 'Active Home', value: 31, today: 1 },
        { title: 'Active BPL', value: 14, today: 1 },
        { title: 'Active Govt.', value: 5, today: 0 },
        { title: 'Active Corporate', value: 5, today: 0 }
    ],
    active: [
        { title: 'Active Home', value: 18, today: 1 },
        { title: 'Active BPL', value: 9, today: 1 },
        { title: 'Active Govt.', value: 3, today: 0 },
        { title: 'Active Corporate', value: 3, today: 0 }
    ],
    online: [
        { title: 'Active Home', value: 11, today: 1 },
        { title: 'Active BPL', value: 6, today: 1 },
        { title: 'Active Govt.', value: 2, today: 0 },
        { title: 'Active Corporate', value: 2, today: 0 }
    ]
};

const ICON_MAP = [BoardNewIcon, HomeCardNewIcon, MoneyCardNewIcon, PenNibIcon];
const ICON_BG = ['#33CCCC', '#F27649', '#707892', '#F4B207'];

const MonitoringDashBoard = () => {
    const [activeTab, setActiveTab] = useState('total');
    const subCards = SUBSCRIBER_DATA[activeTab];

    return (
        <Box p="24px" bg="#F5F6FA" minH="100vh">
            <Flex gap="20px" alignItems="stretch">
                {/* ── LEFT MAIN ── */}
                <Box flex={1} minW={0} display="flex" flexDirection="column">

                    {/* ROW 1: Total Revenue + Home/BPL/Govt/Corporate */}
                    <Grid
                        templateColumns="1fr 1fr 1fr"
                        templateRows="1fr 1fr"
                        gap="16px"
                        mb="16px"
                    >
                        <Box gridRow="1 / 3">
                            <TotalRevenueCard
                                id="total_rev"
                                value="₹1,650"
                                isIncrease
                                pct="6.2%"
                            />
                        </Box>
                        <RevenueCard id="home" title="Home" value="₹800" isIncrease pct="8.4%" />
                        <RevenueCard id="bpl" title="BPL" value="₹150" isIncrease pct="3.2%" />
                        <RevenueCard id="govt" title="Government" value="₹300" isIncrease pct="5.1%" />
                        <RevenueCard id="corp" title="Corporate" value="₹400" isIncrease={false} pct="12%" />
                    </Grid>

                    {/* ROW 2: Total Subscribers | Active | Online */}
                    <SimpleGrid columns={3} gap="16px" mb="16px">
                        <ColoredCard
                            id="total_sub"
                            title="Total Subscribers"
                            value="55"
                            isIncrease
                            pct="4.8%"
                            bg="#8D0247"
                            dotColor="#8C8C8C"
                            onClick={() => setActiveTab('total')}
                            isActive={activeTab === 'total'}
                        />
                        <ColoredCard
                            id="active"
                            title="Active"
                            value="33"
                            isIncrease
                            pct="3.6%"
                            bg="#9BA500"
                            onClick={() => setActiveTab('active')}
                            isActive={activeTab === 'active'}
                        />
                        <ColoredCard
                            id="online"
                            title="Online"
                            value="21"
                            isIncrease
                            pct="2.1%"
                            style={{ background: 'linear-gradient(242.76deg, #DCD3D3 2.79%, #4F4F4F 98.27%, #7B7B7B 98.27%)' }}
                            onClick={() => setActiveTab('online')}
                            isActive={activeTab === 'online'}
                        />
                    </SimpleGrid>

                    {/* ROW 3: Total LNPs | Total AGNPs */}
                    <SimpleGrid columns={2} gap="16px" mb="16px">
                        <LnpCard id="total_lnp" title="Total LNPs" value="120" isIncrease pct="12%" />
                        <LnpCard id="total_agnp" title="Total AGNPs" value="80" isIncrease pct="6%" />
                    </SimpleGrid>

                    {/* District table */}
                    <Box bg="white" borderRadius="16px" p="20px" boxShadow="0px 2px 12px rgba(0,0,0,0.07)" border="1px solid #E2E8F0" flex={1}>
                        <Text fontSize="21px" fontWeight="500" color="#8D0247" mb="16px">
                            District wise data of LNPs & AGNPs
                        </Text>
                        <Box overflowX="auto">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#FFF9C4' }}>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#374151', borderRadius: '8px 0 0 8px' }}>District</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#374151' }}>LNP</th>
                                        <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '13px', fontWeight: '600', color: '#374151', borderRadius: '0 8px 8px 0' }}>AGNP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {DISTRICT_DATA.map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '10px 16px', fontSize: '14px', color: '#8D0247', fontWeight: '500', cursor: 'pointer' }}>{row.district}</td>
                                            <td style={{ padding: '10px 16px', fontSize: '13px', color: '#374151' }}>{row.lnp}</td>
                                            <td style={{ padding: '10px 16px', fontSize: '13px', color: '#374151' }}>{row.agnp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Box>
                    </Box>
                </Box>

                {/* ── RIGHT SIDEBAR ── */}
                <Box w="420px" flexShrink={0} bg="#F5F6FA" borderRadius="16px" border="1px solid #E2E8F0" p="16px" display="flex" flexDirection="column" gap="12px" alignSelf="stretch">

                    {/* Active subscriber grid 2x2 */}
                    <SimpleGrid columns={2} gap="10px">
                        {subCards.map((card, i) => (
                            <ActiveSubCard
                                key={i}
                                title={card.title}
                                value={card.value}
                                today={card.today}
                                iconBg={ICON_BG[i]}
                                IconComponent={ICON_MAP[i]}
                            />
                        ))}
                    </SimpleGrid>

                    {/* Connections */}
                    <Box bg="white" borderRadius="12px" p="12px" border="1px solid #F0F0F0">
                        <ConnectionRow label="Today Connections" current={2} prev={309} prevLabel="Til Yesterday" todayCount={2} />
                        <ConnectionRow label="This Week Connections" current={10} prev={700} prevLabel="Previous Week" todayCount={10} />
                        <ConnectionRow label="This Month Connections" current={26} prev={1200} prevLabel="Previous Month" todayCount={26} />
                    </Box>

                    {/* Live Revenue */}
                    <Box bg="white" borderRadius="12px" p="16px" border="1px solid #F0F0F0" textAlign="center" flex={1} display="flex" flexDirection="column" justifyContent="center">
                        <Text fontSize="20px" fontWeight="500" color="#000000" mb="8px">Live Revenue Today</Text>
                        <GaugeChart value="1,650" />
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default MonitoringDashBoard;
