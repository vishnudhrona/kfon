import { Box, Breadcrumb, Flex, HStack, Link, VStack } from '@kfonbss/bss-ui-components';
import { useNavigate } from '@tanstack/react-router';
import { t } from 'i18next';
import { useState } from 'react';

import GOVT_SEAL from '@/assets/govt_seal_red.png';
import LOGO from '@/assets/kfon_logo.png';
import styles from '@/style/landing.module.css';

import { loginRoute } from '../../login/routes';

const SubPageHeader = ({ govtSeal = false }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  return (
    <Box
      bg='white'
      p='14px 62px'
      boxShadow='0 4px 18px 0 rgba(0, 0, 0, 0.08)'
      borderBottomLeftRadius='12px'
      borderBottomRightRadius='12px'
      position='relative'
      paddingTop={'30px'}
    >
      <Flex justifyContent='space-between' alignItems='center'>
        <HStack gap='36px'>
          <img width='112px' src={LOGO} alt='BSS logo' />
          {govtSeal && <img src={GOVT_SEAL} alt='govt-seal' />}
        </HStack>

        {/* DESKTOP MENU */}
        <HStack className={`${styles.linkStack} ${styles.desktopMenu}`} gap='45px'>
          <Link onClick={() => navigate({ to: '/' })}>{t('home')}</Link>
          <Link>{t('business')}</Link>
          <Link>{t('becomeAPartner')}</Link>
          <Link>{t('tariffs')}</Link>
          <Link>{t('kFon')}</Link>
          <Link>{t('contactUs')}</Link>

          <Link color='primary.500' onClick={() => navigate({ to: loginRoute.to })}>
            {t('login')}
            <svg width='7' height='12' viewBox='0 0 7 12'>
              <path d='M1 11L6 6L1 1' stroke='#8D0247' strokeWidth='2' />
            </svg>
          </Link>
        </HStack>

        <button className={styles.hamburger} onClick={() => setOpen(!open)} aria-label='Menu'>
          ☰
        </button>
      </Flex>

      <Box p='20px 0 0'>
        <Breadcrumb.Root>
          <Breadcrumb.List>
            <Breadcrumb.Item>
              <Breadcrumb.Link
                fontSize='14px'
                fontWeight={500}
                color='primary.500'
                onClick={() => navigate({ to: '/' })}
                display='flex'
                alignItems='center'
                gap='6px'
                cursor='pointer'
              >
                <svg width='22' height='22' viewBox='0 0 22 22'>
                  <path d='M3.67664 10.9818H17.4175' stroke='#272727' strokeWidth='1.5' />
                  <path d='M9.17927 5.48877L3.66919 10.9998L9.17927 16.5108' stroke='#272727' strokeWidth='1.5' />
                </svg>
                {t('home')}
              </Breadcrumb.Link>
            </Breadcrumb.Item>

            <Breadcrumb.Separator color='#333333' />

            <Breadcrumb.Item>
              <Breadcrumb.CurrentLink fontSize='14px' color='#333333'>
                {t('getEnquiry')}
              </Breadcrumb.CurrentLink>
            </Breadcrumb.Item>
          </Breadcrumb.List>
        </Breadcrumb.Root>
      </Box>

      {/* MOBILE MENU */}
      {open && (
        <VStack className={styles.mobileMenu} style={{ zIndex: 9999 }}>
          <Link
            onClick={() => {
              navigate({ to: '/' });
              closeMenu();
            }}
          >
            {t('home')}
          </Link>
          <Link onClick={closeMenu}>{t('business')}</Link>
          <Link onClick={closeMenu}>{t('becomeAPartner')}</Link>
          <Link onClick={closeMenu}>{t('tariffs')}</Link>
          <Link onClick={closeMenu}>{t('kFon')}</Link>
          <Link onClick={closeMenu}>{t('contactUs')}</Link>

          <Link
            color='primary.500'
            onClick={() => {
              navigate({ to: loginRoute.to });
              closeMenu();
            }}
          >
            {t('login')}
          </Link>
        </VStack>
      )}
    </Box>
  );
};

export default SubPageHeader;
