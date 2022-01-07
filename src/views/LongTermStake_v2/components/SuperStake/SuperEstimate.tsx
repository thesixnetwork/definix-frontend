import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

import { IsMobileType } from '../types'

interface EstimateVFinixProps extends IsMobileType {
  days: number
  totalFinix: number
}

const SuperEstimate: React.FC<EstimateVFinixProps> = ({ isMobile, days, totalFinix }) => {
  const { t, i18n } = useTranslation()

  const getVFinix = (day: number, balance: number) => {
    if (!balance) return 0

    switch (day) {
      case 90:
        return getBalanceOverBillion(balance)
      case 180:
        return getBalanceOverBillion(balance * 2)
      case 365:
        return getBalanceOverBillion(balance * 4)
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
              {getBalanceOverBillion(totalFinix)}
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
              {getVFinix(days, totalFinix)}
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
