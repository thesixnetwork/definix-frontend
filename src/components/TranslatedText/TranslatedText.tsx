import React from 'react'
import { useTranslation } from 'contexts/Localization'

export interface TranslatedTextProps {
  children: string
}

const TranslatedText = ({ children }: TranslatedTextProps) => {
  const { t } = useTranslation()
  return <>{t(children)}</>
}

export default TranslatedText
