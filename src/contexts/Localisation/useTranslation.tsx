import React, { useContext } from 'react'
import { LanguageContext } from './Provider'

interface Props {
  label: string;
}

const useTranslation = () => {
  const languageContext = useContext(LanguageContext)

  if (languageContext === undefined) {
    throw new Error('Language context is undefined')
  }

  return languageContext
}

export const Trans: React.FC<Props> = ({ label }) => {
  const { t } = useContext(LanguageContext);
  return <span>{t(label)}</span>
}

export default useTranslation
