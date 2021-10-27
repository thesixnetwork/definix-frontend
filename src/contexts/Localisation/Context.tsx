import React, { createContext, useEffect, useState, useCallback } from 'react'
import { allLanguagesCode, EN } from 'config/localisation/languageCodes'
import defaultTranslation from 'config/localisation/translation.json'

const LANG_KEY = 'lang'

interface ProviderState {
  t: (key: string, replaceTxt?: Record<string, string>) => string
  setLanguage: (langCode: string) => void
}
export const LanguageContext = createContext<ProviderState>(undefined)

const fetchLanguage = (langCode: string) => {
  return fetch(`${process.env.PUBLIC_URL}/locale/${langCode}.json`)
}

const translationsMap = new Map()
translationsMap.set(EN.code, defaultTranslation)

export const LanguageProvider: React.FC = ({ children }) => {
  const [selectedLangCode, setSelectedLangCode] = useState(EN.code)

  const setLanguage = useCallback(
    async (langCode: string) => {
      if (langCode === selectedLangCode) return

      if (allLanguagesCode.includes(langCode)) {
        if (!translationsMap.has(langCode)) {
          const translation = await fetchLanguage(langCode)
          translationsMap.set(langCode, translation)
        }
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
    let currentLangCode: string = selectedLangCode

    const langCodeLS = localStorage.getItem(LANG_KEY)
    if (!langCodeLS) {
      localStorage.setItem(LANG_KEY, currentLangCode)
    } else if (langCodeLS && allLanguagesCode.includes(langCodeLS)) {
      currentLangCode = langCodeLS
    }

    setLanguage(currentLangCode)
    // if (selectedLangCode !== currentLangCode) {
    //   setSelectedLangCode(currentLangCode);

    //   if (!translationsMap.has(currentLangCode)) {
    //     fetchLanguage(currentLangCode).then((res) => {
    //       console.log(res);
    //       translationsMap.set(currentLangCode, res);
    //     })
    //   }
    // }
  }, [selectedLangCode, setLanguage])

  return (
    <LanguageContext.Provider
      value={{
        t,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export default {}
