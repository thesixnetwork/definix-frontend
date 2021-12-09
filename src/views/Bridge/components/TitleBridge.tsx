import React from 'react'
import { useTranslation } from 'react-i18next'
import { TitleSet, Flex, ImgBridgeTopFinixIcon } from 'definixswap-uikit-v2'

interface TitleType {
  isMobile: boolean
}

const TitleBridge: React.FC<TitleType> = ({ isMobile }) => {
  const { t } = useTranslation()

  return (
    <>
      <Flex>
        <TitleSet title={t('Bridge')} description={t('Transfer tokens to other chains')} />

        {!isMobile && (
          <Flex>
            <ImgBridgeTopFinixIcon className="mt-s8 mr-s16" width="193.4" height="118" />
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default TitleBridge
