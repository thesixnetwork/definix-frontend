import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'definixswap-uikit-v2'

interface EstimateVFinixProps {
  endDay: string
  earn: number
}

const EstimateVFinix: React.FC<EstimateVFinixProps> = ({ endDay, earn }) => {
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
              {endDay} GMT+9
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
            {earn} {t('vFINIX')}
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default EstimateVFinix
