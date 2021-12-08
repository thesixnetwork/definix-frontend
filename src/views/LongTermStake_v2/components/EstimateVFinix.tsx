import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'definixswap-uikit'

const EstimateVFinix: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex width="100%" mt="S_24" flexDirection="column">
        <Text mb="S_20" textStyle="R_16M" color="deepgrey">
          {t('Estimated Result')}
        </Text>
        <Flex justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('Period End')}
          </Text>
          <Flex flexDirection="column" alignItems="flex-end">
            <Text textStyle="R_14M" color="deepgrey">
              02-Nov-2022 17:55:57 GMT+9
            </Text>
            <Text textStyle="R_12R" color="mediumgrey">
              {t('*Asia/Seoul')}
            </Text>
          </Flex>
        </Flex>
        <Flex mt="S_8" justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('vFINIX Earn')}
          </Text>
          <Text textStyle="R_14M" color="deepgrey">
            100,000,000.0123444 {t('vFINIX')}
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default EstimateVFinix
