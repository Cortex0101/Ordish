import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import daCommon from './locales/da/common.json';
import daSignup from './locales/da/signup.json';
import daHome from './locales/da/home.json';
import daHeader from './locales/da/header.json';
import daLogin from './locales/da/login.json';
import daProfile from './locales/da/profile.json';
import enCommon from './locales/en/common.json';
import enSignup from './locales/en/signup.json';
import enHome from './locales/en/home.json';
import enHeader from './locales/en/header.json';
import enLogin from './locales/en/login.json';
import enProfile from './locales/en/profile.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      da: { common: daCommon, signup: daSignup, home: daHome, 
        header: daHeader, login: daLogin, profile: daProfile
      },
      en: { common: enCommon, signup: enSignup, home: enHome, 
        header: enHeader, login: enLogin, profile: enProfile
      }
    },
    fallbackLng: 'da',
    interpolation: { escapeValue: false }
  });

export default i18n;