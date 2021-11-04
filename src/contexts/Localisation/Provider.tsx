import React, { createContext, useEffect, useState, useCallback, Suspense } from 'react'
import { allLanguagesCode, EN } from 'config/localisation/languageCodes'
import defaultTranslation from 'config/localisation/en.json'
import { mapKeys } from 'lodash'

export interface LangType {
  code: string
  language: string
}

const LANG_KEY = 'lang'
const DEFAULT_LANG_CODE = EN.code;

interface ProviderState {
  t: (key: string, replaceTxt?: Record<string, string>) => string
  setLangCode: (langCode: string) => void
  selectedLangCode: string
}
export const LanguageContext = createContext<ProviderState>(undefined)

const fetchLanguage = (langCode: string) => {
  return fetch(`${process.env.PUBLIC_URL}/locales/${langCode}.json`).then((res) => res.json())
}

const changeKeyLowerCase = (translation: Record<string, string>) => {
  return mapKeys(translation, (value, key) => key.toLowerCase())
};

const translationsMap = new Map()
translationsMap.set(EN.code, changeKeyLowerCase(defaultTranslation))

const fetchLanguageCode = async (code: string) => {
  const langCode = code;
  if (!translationsMap.has(langCode)) {
    const translation = await fetchLanguage(langCode)
    translationsMap.set(langCode, changeKeyLowerCase(translation))
  }
  localStorage.setItem(LANG_KEY, langCode);
  return langCode;
}

export const LanguageContextProvider: React.FC = ({ children }) => {
  const [selectedLangCode, setSelectedLangCode] = useState<string>(localStorage.getItem(LANG_KEY) || DEFAULT_LANG_CODE);

  const setLanguageCode = useCallback(
    async (langCode: string) => {
      if (langCode === selectedLangCode) return

      if (allLanguagesCode.includes(langCode)) {
        await fetchLanguageCode(langCode)
        setSelectedLangCode(langCode)
      }
    },
    [selectedLangCode, setSelectedLangCode],
  )

  const t = useCallback(
    (key: string, replaceTxts: Record<string, string>) => {
      let translation = translationsMap.get(selectedLangCode)
      if (!translation) {
        translation = translationsMap.get(DEFAULT_LANG_CODE)
      }
      let translateTxt = translation[key.toLowerCase()] ? translation[key.toLowerCase()] : key

      if (replaceTxts && /{{.+}}/gi.test(translateTxt)) {
        Object.entries(replaceTxts).forEach(([replaceTxtKey, replaceTxtValue]) => {
          translateTxt = translateTxt.replace(new RegExp(`{{${replaceTxtKey}}}`, 'gi'), replaceTxtValue)
        })
      }
      return translateTxt
    },
    [selectedLangCode],
  )

  // useEffect(() => {
  //   localStorage.setItem(LANG_KEY, selectedLangCode)
  // }, [selectedLangCode])

  useEffect(() => {
    if (selectedLangCode !== EN.code) {
      fetchLanguageCode(selectedLangCode)
    }
  }, [selectedLangCode])

  return (
    <LanguageContext.Provider
      value={{
        t,
        setLangCode: setLanguageCode,
        selectedLangCode
      }}
    >
        {children}
    </LanguageContext.Provider>
  )
}

export default {}
