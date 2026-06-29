import { Box, Button, Text } from '@kfonbss/bss-ui-components';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BsArrowRightCircle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import SplashLoader from '@/components/custom/SplashLoader';
import { DATE_FORMAT } from '@/constants/date';
import { getApiProgress } from '@/features/others/ApiProgress/selectors';
import { router } from '@/routes/routes';
import { dayjs } from '@/utils/dateUtils';

import { ACTION_TYPES, fetchServiceCommissioningByEnquiry } from '../action';
import { getServiceCommissioningByEnquiry } from '../selector';

const CorporateServiceProvisioningTableView = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enquiryId } = useParams({ strict: false });
    const apiProgress = useSelector(getApiProgress);
    const commissioningState = useSelector(getServiceCommissioningByEnquiry);

    const isLoading = !!(apiProgress[ACTION_TYPES.FETCH_SERVICE_COMMISSIONING_BY_ENQUIRY]) || commissioningState?.isLoading;
    const list = commissioningState?.data ?? [];

    useEffect(() => {
        if (enquiryId) {
            dispatch(fetchServiceCommissioningByEnquiry({ enquiryId }));
        }
    }, [dispatch, enquiryId]);

    const handleNavigate = (row) => {
        router.navigate({
            to: '/app/corporate/service-provisioning/$enquiryId',
            params: { enquiryId: row.enquiryId ?? enquiryId },
            state: { locationId: row.locationId, version: row.version }
        });
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                <SplashLoader inline />
            </Box>
        );
    }

    if (!list.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                <Text fontSize="md" color="gray.500">{t('noData', 'No data available')}</Text>
            </Box>
        );
    }

    return (
        <Box overflowX="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                        {['#', t('locName', 'Location'), t('serviceType', 'Service Type'), t('commissionDate', 'Commission Date'), t('status', 'Status'), ''].map((h, i) => (
                            <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280', whiteSpace: 'nowrap' }}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {list.map((row, idx) => (
                        <tr key={row.id ?? row.locationId ?? idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <td style={{ padding: '10px 16px', fontSize: '14px', color: '#374151' }}>{String(idx + 1).padStart(2, '0')}</td>
                            <td style={{ padding: '10px 16px', fontSize: '14px', color: '#374151' }}>{row.locName ?? row.locationName ?? '-'}</td>
                            <td style={{ padding: '10px 16px', fontSize: '14px', color: '#374151' }}>{row.serviceType ?? row.serviceName ?? '-'}</td>
                            <td style={{ padding: '10px 16px', fontSize: '14px', color: '#374151' }}>
                                {row.commissionDate ? dayjs(row.commissionDate, ['DD-MM-YYYY', 'YYYY-MM-DD']).format(DATE_FORMAT.DATE) : '-'}
                            </td>
                            <td style={{ padding: '10px 16px', fontSize: '14px', color: '#374151' }}>{row.approvalStatus ?? row.status ?? '-'}</td>
                            <td style={{ padding: '10px 16px' }}>
                                <Button
                                    variant="ghost"
                                    p={0}
                                    minW="auto"
                                    _hover={{ bg: 'transparent' }}
                                    onClick={() => handleNavigate(row)}
                                >
                                    <BsArrowRightCircle size={20} color="#8D0247" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Box>
    );
};

export default CorporateServiceProvisioningTableView;
