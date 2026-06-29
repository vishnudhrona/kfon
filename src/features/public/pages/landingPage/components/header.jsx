import { Box, Flex, HStack, VStack } from '@kfonbss/bss-ui-components';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// import GOVT_SEAL from '@/assets/govt_seal_red.png';
import LOGO from '@/assets/main_logo.png';
import styles from '@/style/landing.module.css';

export const LandingHeader = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (key) => {
    onNavigate?.(key);
    closeMenu();
  };

  return (
    <Box className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <Flex className={styles.headerInner} justifyContent={'space-between'}>
        {/* Logo + Seal */}
        <HStack gap='36px'>
          <img width='252px' src={LOGO} alt='BSS logo' />
          {/* <img src={GOVT_SEAL} alt='govt-seal' /> */}
        </HStack>

        {/* Desktop Menu */}
        <HStack className={`${styles.linkStack} ${styles.desktopMenu}`} gap='38px'>
          <span className={styles.menuLink} onClick={() => handleNav('home')}>
            {t('home')}
          </span>

          <span className={styles.menuLink} onClick={() => handleNav('about')}>
            {t('aboutKfon')}
          </span>
          <span className={styles.menuLink} onClick={() => handleNav('services')}>
            {t('services')}
          </span>
          <span className={styles.menuLink} onClick={() => handleNav('downloads')}>
            {t('downloads')}
          </span>
          <span className={styles.menuLink} onClick={() => handleNav('tender')}>
            {t('tender')}
          </span>
          <span className={styles.menuLink} onClick={() => handleNav('gallery')}>
            {t('gallery')}
          </span>
          <span className={styles.menuLink} onClick={() => handleNav('quickLaunch')}>
            {t('quickLaunch')}
          </span>
          <span className={styles.menuLink} onClick={() => handleNav('support')}>
            {t('support')}
          </span>
          <span className={styles.menuLink} onClick={() => handleNav('partner')}>
            {t('becomeAPartner')}
          </span>

          <Link to='/auth/tenant-selection' reset={false} className={styles.navLink}>
            {t('login')}
            <svg width='7' height='12' viewBox='0 0 7 12'>
              <path d='M1 11L6 6L1 1' stroke='#8D0247' strokeWidth='2' />
            </svg>
          </Link>
        </HStack>

        {/* Hamburger */}
        <button className={styles.hamburger} onClick={() => setOpen(!open)} aria-label='Menu'>
          ☰
        </button>

        {/* Mobile Menu */}
        {open && (
          <VStack className={styles.mobileMenu}>
            <Box className={styles.mobileMenuItem} onClick={() => handleNav('home')}>
              {t('home')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('about')}>
              {t('aboutKfon')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('services')}>
              {t('services')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('downloads')}>
              {t('downloads')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('tender')}>
              {t('tender')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('gallery')}>
              {t('gallery')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('quickLaunch')}>
              {t('quickLaunch')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('support')}>
              {t('support')}
            </Box>

            <Box className={styles.mobileMenuItem} onClick={() => handleNav('partner')}>
              {t('becomeAPartner')}
            </Box>

            <Link
              to='/auth/tenant-selection'
              reset={false}
              className={`${styles.mobileMenuItem} ${styles.navLink}`}
              onClick={closeMenu}
            >
              {t('login')}
            </Link>
          </VStack>
        )}
      </Flex>
    </Box>
  );
};
