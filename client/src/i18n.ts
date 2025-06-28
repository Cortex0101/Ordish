import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import daCommon from './locales/da/common.json';
import daLogin from './locales/da/signup.json';
import daHome from './locales/da/home.json';
import daHeader from './locales/da/header.json';
import enCommon from './locales/en/common.json';
import enLogin from './locales/en/signup.json';
import enHome from './locales/en/home.json';
import enHeader from './locales/en/header.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      da: { common: daCommon, login: daLogin, home: daHome, header: daHeader },
      en: { common: enCommon, login: enLogin, home: enHome, header: enHeader }
    },
    fallbackLng: 'da',
    interpolation: { escapeValue: false }
  });

export default i18n;