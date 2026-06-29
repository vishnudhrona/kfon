import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locale/en/translation.json';
import hi from '@/locale/hi/translation.json';
import ml from '@/locale/ml/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ml: { translation: ml },
    hi: { translation: hi }
  },
  fallbackLng: 'en',
  debug: import.meta.env.DEV,
  interpolation: { escapeValue: false }
});

const savedLang = localStorage.getItem('lang');
if (savedLang && ['en', 'ml', 'hi'].includes(savedLang)) {
  if (i18n.isInitialized) {
    i18n.changeLanguage(savedLang);
  } else {
    i18n.on('initialized', () => i18n.changeLanguage(savedLang));
  }
}

export default i18n;
