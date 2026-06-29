import { Box, Menu } from '@kfonbss/bss-ui-components';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { value: 'en', label: 'EN', full: 'English' },
  { value: 'ml', label: 'ML', full: 'മലയാളം' },
  { value: 'hi', label: 'HI', full: 'हिन्दी' }
];

const GlobeIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='12' r='10' />
    <path d='M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
  </svg>
);

const ChevronIcon = () => (
  <svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M6 9l6 6 6-6' />
  </svg>
);

const LanguageSelector = ({ variant = 'light' }) => {
  const { i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.value === i18n.language) ?? LANGUAGES[0];

  const handleSelect = (value) => {
    i18n.changeLanguage(value);
    localStorage.setItem('lang', value);
  };

  const isDark = variant === 'dark';

  return (
    <Box flexShrink={0}>
      <Menu.Root>
        <Menu.Trigger asChild>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px 5px 10px',
              background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(141, 2, 71, 0.06)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.30)' : 'rgba(141, 2, 71, 0.18)'}`,
              borderRadius: '20px',
              cursor: 'pointer',
              color: isDark ? 'white' : '#8D0247',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.04em',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.22)' : 'rgba(141, 2, 71, 0.12)';
              e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.50)' : 'rgba(141, 2, 71, 0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(141, 2, 71, 0.06)';
              e.currentTarget.style.borderColor = isDark ? 'rgba(255, 255, 255, 0.30)' : 'rgba(141, 2, 71, 0.18)';
            }}
          >
            <GlobeIcon />
            {current.label}
            <ChevronIcon />
          </button>
        </Menu.Trigger>
        <Menu.Positioner>
          <Menu.Content
            style={{
              minWidth: '140px',
              borderRadius: '10px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              border: '1px solid rgba(0,0,0,0.07)',
              padding: '6px',
              background: 'white'
            }}
          >
            {LANGUAGES.map((lang) => {
              const isActive = lang.value === i18n.language;
              return (
                <Menu.Item
                  key={lang.value}
                  value={lang.value}
                  onClick={() => handleSelect(lang.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(141, 2, 71, 0.07)' : 'transparent',
                    color: isActive ? '#8D0247' : '#444',
                    fontWeight: isActive ? '600' : '400',
                    fontSize: '13px',
                    transition: 'background 0.12s'
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '26px',
                    height: '18px',
                    background: isActive ? '#8D0247' : '#f0f0f0',
                    color: isActive ? 'white' : '#666',
                    borderRadius: '3px',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.04em',
                    flexShrink: 0
                  }}>
                    {lang.label}
                  </span>
                  {lang.full}
                </Menu.Item>
              );
            })}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Box>
  );
};

export default LanguageSelector;
