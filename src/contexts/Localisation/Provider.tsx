import React, { createContext, useEffect, useState, useCallback } from 'react'
import { allLanguagesCode, EN } from 'config/localisation/languageCodes'
import defaultTranslation from 'config/localisation/en.json'

export interface LangType {
  code: string
  language: string
}

const LANG_KEY = 'lang'

interface ProviderState {
  t: (key: string, replaceTxt?: Record<string, string>) => string
  setLangCode: (langCode: string) => void
  selectedLangCode: string
}
export const LanguageContext = createContext<ProviderState>(undefined)

const fetchLanguage = (langCode: string) => {
  return fetch(`${process.env.PUBLIC_URL}/locales/${langCode}.json`).then((res) => res.json())
}

const translationsMap = new Map()
translationsMap.set(EN.code, defaultTranslation)

const initLanguageCode = async (langCode: string) => {
  if (!translationsMap.has(langCode)) {
    translationsMap.set(langCode, defaultTranslation)
    const translation = await fetchLanguage(langCode)
    translationsMap.set(langCode, translation)
  }
}

export const LanguageContextProvider: React.FC = ({ children }) => {
  const [selectedLangCode, setSelectedLangCode] = useState(localStorage.getItem(LANG_KEY) || EN.code)

  const setLanguageCode = useCallback(
    async (langCode: string) => {
      if (langCode === selectedLangCode) return

      if (allLanguagesCode.includes(langCode)) {
        await initLanguageCode(langCode)
        setSelectedLangCode(langCode)
      }
    },
    [selectedLangCode],
  )

  const t = useCallback(
    (key: string, replaceTxts: Record<string, string>) => {
      const translation = translationsMap.get(selectedLangCode)
      let translateTxt = translation[key] ? translation[key] : key

      if (replaceTxts && /{{.+}}/gi.test(translateTxt)) {
        Object.entries(replaceTxts).forEach(([replaceTxtKey, replaceTxtValue]) => {
          translateTxt = translateTxt.replace(new RegExp(`{{${replaceTxtKey}}}`, 'gi'), replaceTxtValue)
        })
      }
      return translateTxt
    },
    [selectedLangCode],
  )

  useEffect(() => {
    localStorage.setItem(LANG_KEY, selectedLangCode)
  }, [selectedLangCode])

  useEffect(() => {
    if (selectedLangCode !== EN.code) {
      initLanguageCode(selectedLangCode)
    }
  }, [selectedLangCode])

  return (
    <LanguageContext.Provider
      value={{
        t,
        setLangCode: setLanguageCode,
        selectedLangCode,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export default {}
