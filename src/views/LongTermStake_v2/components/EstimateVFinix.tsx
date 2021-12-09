import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'definixswap-uikit-v2'
import numeral from 'numeral'

interface EstimateVFinixProps {
  days: number
  inputBalance: string
  endDay: string
}

const EstimateVFinix: React.FC<EstimateVFinixProps> = ({ days, inputBalance, endDay }) => {
  const { t } = useTranslation()

  const getVFinix = (day: number, balance: string) => {
    if (!balance) return 0

    switch (day) {
      case 90:
        return numeral(Number(balance)).format('0,0.[000000]')
      case 180:
        return numeral(Number(balance) * 2).format('0,0.[000000]')
      case 365:
        return numeral(Number(balance) * 4).format('0,0.[000000]')
      default:
        return 0
    }
  }

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
            {getVFinix(days, inputBalance)} {t('vFINIX')}
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default EstimateVFinix
