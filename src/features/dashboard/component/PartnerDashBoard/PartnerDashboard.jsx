import { Box } from '@kfonbss/bss-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { fetchDistrict } from '@/features/common/actions';

import ActivePartnersRegister from './components/ActivePartnersRegister';
import DistrictSummary from './components/DistrictSummary';
import EnquiryPosition from './components/EnquiryPosition';
import FilterBar from './components/FilterBar';
import HeroStats from './components/HeroStats';
import LongPendingLinkNotEstablished from './components/LongPendingLinkNotEstablished';
import LongPendingNotOnboarded from './components/LongPendingNotOnboarded';
import OnboardingEfficiency from './components/OnboardingEfficiency';
import SummaryKpis from './components/SummaryKpis';

const PartnerDashboard = () => {
  const dispatch = useDispatch();

  // Shared filters consumed by multiple sections; each section owns its own fetch.
  const [period, setPeriod] = useState('Today');
  const [district, setDistrict] = useState('');
  const [partnerType, setPartnerType] = useState('');

  // Districts dropdown source (shared library action).
  useEffect(() => {
    dispatch(fetchDistrict());
  }, [dispatch]);

  return (
    <Box minH='100vh' color='#1A1030' fontSize='16px'>
      <FilterBar
        period={period}
        onPeriodChange={setPeriod}
        district={district}
        onDistrictChange={setDistrict}
        partnerType={partnerType}
        onPartnerTypeChange={setPartnerType}
      />

      <HeroStats period={period} district={district} partnerType={partnerType} />

      {/* Summary KPIs as a full-width strip directly under the hero. */}
      <Box mb='14px'>
        <SummaryKpis />
      </Box>

      {/* Main enquiry table gets the full width it needs. */}
      <Box mb='14px'>
        <EnquiryPosition
          district={district}
          partnerType={partnerType}
          onDistrictChange={setDistrict}
          onPartnerTypeChange={setPartnerType}
        />
      </Box>

      {/* Two parallel "action" lists side-by-side; each scrolls internally. */}
      <Box display='grid' gridTemplateColumns='1fr 1fr' gap='12px' mb='14px'>
        <LongPendingNotOnboarded />
        <LongPendingLinkNotEstablished />
      </Box>

      {/* Efficiency (compact) beside the wider district table. */}
      <Box display='grid' gridTemplateColumns='1fr 1.6fr' gap='12px' mb='14px'>
        <OnboardingEfficiency period={period} />
        <DistrictSummary />
      </Box>

      <ActivePartnersRegister period={period} partnerType={partnerType} />
    </Box>
  );
};

export default PartnerDashboard;
