import React from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'

import { IsMobileType } from '../types'

interface EstimateVFinixProps extends IsMobileType {
  days: number
  inputFinix: string
}

const SuperEstimate: React.FC<EstimateVFinixProps> = ({ isMobile, days, inputFinix }) => {
  const { t, i18n } = useTranslation()

  const getVFinix = (day: number, balance: string) => {
    if (!balance) return 0

    switch (day) {
      case 90:
        return numeral(Number(balance)).format('0,0.[00]')
      case 180:
        return numeral(Number(balance) * 2).format('0,0.[00]')
      case 365:
        return numeral(Number(balance) * 4).format('0,0.[00]')
      default:
        return 0
    }
  }

  const getEndDay = (day: number) => {
    const today = new Date()

    if (i18n.language === 'ko') {
      return moment(today.setDate(today.getDate() + day)).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(today.setDate(today.getDate() + day)).format(`DD-MMM-YYYY HH:mm:ss`)
  }

  return (
    <>
      <Flex width="100%" mt={isMobile ? 'S_40' : 'S_32'} flexDirection="column">
        <Flex justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('Estimated Period End')}
          </Text>
          <Flex flexDirection="column" alignItems="flex-end">
            <Text textStyle="R_14M" color="deepgrey">
              {getEndDay(days)}
            </Text>
            <Text textStyle="R_12R" color="mediumgrey">
              *GMT +9 {t('Asia/Seoul')}
            </Text>
          </Flex>
        </Flex>
        <Flex mt="S_8" justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('Total FINIX Stake')}
          </Text>
          <Flex>
            <Text textStyle="R_14M" color="deepgrey">
              {inputFinix || 0}
            </Text>
            <Text ml="S_4" textStyle="R_14M" color="deepgrey">
              {t('FINIX')}
            </Text>
          </Flex>
        </Flex>
        <Flex mt="S_8" justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('vFINIX Earn')}
          </Text>
          <Flex>
            <Text textStyle="R_14M" color="deepgrey">
              {getVFinix(days, inputFinix)}
            </Text>
            <Text ml="S_4" textStyle="R_14M" color="deepgrey">
              {t('vFINIX')}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export default SuperEstimate
