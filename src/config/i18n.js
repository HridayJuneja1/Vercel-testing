import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../assets/data/translations.json';

// Set the default language based on the user's preference stored in localStorage, or fallback to English ("en")
const defaultLanguage = localStorage.getItem('language') || "en";

i18n
  .use(initReactI18next) // Use the initReactI18next module to integrate i18next with React
  .init({
    // Initialize i18next with the following configuration:
    resources: translations, // Set the translation resources (loaded from the JSON file)
    lng: defaultLanguage, // Set the default language to be used (based on user preference or default "en")
    interpolation: {
      escapeValue: false // Disable escaping for the values (important for React to handle JSX properly)
    }
  });

export default i18n; // Export the configured i18next instance to be used throughout the app
