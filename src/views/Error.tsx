import React from 'react'
import { useTranslation } from 'react-i18next'
import { ErrorBlock } from 'definixswap-uikit-v2'
import { useHistory } from 'react-router'

const Error = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <>
      <ErrorBlock message={t('Unknown error')} label={t('Home')} onBack={() => history.push('/')} />
    </>
  )
}

export default Error
