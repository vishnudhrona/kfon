import { Box, VStack } from '@kfonbss/bss-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import Footer from '@/components/common/Footer';
import { STORAGE_KEYS } from '@/constants';
import { doLogout } from '@/features/others/common/actions';
import { getDataFromStorage } from '@/utils/encryptionUtils';

import ApplyForNewConnection from './ApplyForNewConnection';
import { LandingHeader } from './header';
import HighSpeedSection from './HighSpeedSection';
import LandingHero from './LandingHero';
import LatestNewsSection from './LatestNewsSection';
import PartnerSection from './PartnerSection';
import PlanSelector from './PlanSelector';
import ServiceListSection from './servicesList';
import SupportSection from './SupportSection';
import TopContactBar from './TopContactBar';

export default function LandingPage() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getDataFromStorage(STORAGE_KEYS.AUTH_TOKEN, false);
    if (token) {
      dispatch(doLogout());
    }
  }, [dispatch]);

  // ✅ SECTION REFS (minimal + explicit)
  const homeRef = useRef(null);
  const applyRef = useRef(null);
  const plansRef = useRef(null);
  const servicesRef = useRef(null);
  const highSpeedRef = useRef(null);
  const partnerRef = useRef(null);
  const supportRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsMobileOrTablet(true);
      } else {
        setIsMobileOrTablet(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ SINGLE SCROLL HANDLER
  const scrollToSection = (key) => {
    const map = {
      home: homeRef,
      apply: applyRef,
      plans: plansRef,
      services: servicesRef,
      highSpeed: highSpeedRef,
      partner: partnerRef,
      support: supportRef
    };

    const ref = map[key];
    if (!ref?.current) return;

    const headerOffset = 90;
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <VStack gap={0}>
      {/* ✅ STICKY HEADER WRAPPER */}
      <Box width={'100%'} position='sticky' top='0' zIndex='1000'>
        <LandingHeader onNavigate={scrollToSection} />
      </Box>

      {/* HOME / HERO */}
      <Box ref={homeRef}>
        <LandingHero onEnquiryClick={() => scrollToSection('apply')} />
      </Box>

      <Box h='50px' />

      {/* APPLY */}
      <Box ref={applyRef} w='100%'>
        <ApplyForNewConnection />
      </Box>

      {/* PLANS */}
      <Box ref={plansRef}>
        <PlanSelector />
      </Box>

      {/* SERVICES */}
      <Box ref={servicesRef}>
        <ServiceListSection />
      </Box>

      {/* HIGH SPEED */}
      <Box ref={highSpeedRef}>
        <HighSpeedSection />
      </Box>

      {/* PARTNER */}
      <Box ref={partnerRef}>
        <PartnerSection />
      </Box>

      <LatestNewsSection />

      {/* SUPPORT */}
      <Box ref={supportRef} w='100%'>
        <SupportSection isMobileOrTablet={isMobileOrTablet} />
      </Box>

      <TopContactBar />
      <Footer />
    </VStack>
  );
}
