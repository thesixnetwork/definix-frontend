import React from 'react'
import { useTranslation } from 'react-i18next'
import { TitleSet, Flex, ImgBridgeTopFinixIcon } from 'definixswap-uikit'

interface TitleType {
  isMobile: boolean
}

const TitleBridge: React.FC<TitleType> = ({ isMobile }) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex>
        <TitleSet title={t('Bridge')} description={t('Try to Bridge the token for a different chain.')} />

        {!isMobile && (
          <Flex>
            <ImgBridgeTopFinixIcon className="mr-s16" viewBox="0 0 193.4 118" width="100%" height="100%" />
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default TitleBridge
