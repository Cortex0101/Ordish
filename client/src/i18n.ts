import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import daCommon from './locales/da/common.json';
import daLogin from './locales/da/login.json';
import daHome from './locales/da/home.json';
import enCommon from './locales/en/common.json';
import enLogin from './locales/en/login.json';
import enHome from './locales/en/home.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      da: { common: daCommon, login: daLogin, home: daHome },
      en: { common: enCommon, login: enLogin, home: enHome }
    },
    fallbackLng: 'da',
    interpolation: { escapeValue: false }
  });

export default i18n;