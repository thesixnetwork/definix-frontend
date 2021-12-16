import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import LanguageDetector from 'i18next-browser-languagedetector'
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
import enJSON from './locales/en.json'
import koJSON from './locales/ko.json'

const resources = {
  en: {
    translation: enJSON,
  },
  ko: {
    translation: koJSON,
  },
}

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    // debug: true,
    react: {
      useSuspense: true,
    },
    // detection: {
    //   order: ['localStorage', 'querystring', 'navigator'],
    //   lookupQuerystring: 'lng',
    // },
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ko'],
    keySeparator: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.setAttribute('lang', lng.split('-')[0])
})

export default i18n
