import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../assets/data/translations.json';

const defaultLanguage = localStorage.getItem('language') || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: defaultLanguage,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
