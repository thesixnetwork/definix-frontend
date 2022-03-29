import React, { useState } from 'react'
import moment from 'moment'
import { useTranslation, Trans } from 'react-i18next'
import { Flex, Text, Divider, ImgTokenFinixIcon, AlertIcon } from '@fingerlabs/definixswap-uikit-v2'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

interface SuperConfirmStakeProps {
  totalFinix: number
  days: number
}

const SuperConfirmStake: React.FC<SuperConfirmStakeProps> = ({ totalFinix, days }) => {
  const { t, i18n } = useTranslation()
  const [amount] = useState<number>(totalFinix)

  const getLockDay = (day: number) => {
    switch (day) {
      case 90:
        return 'FINIX amount will be locked 7 days'
      case 180:
        return 'FINIX amount will be locked 14 days'
      case 365:
        return 'FINIX amount will be locked 28 days'
      default:
        return ''
    }
  }

  const getEndDay = (day: number) => {
    const today = new Date()

    if (i18n.language === 'ko') {
      return moment(today.setDate(today.getDate() + day)).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(today.setDate(today.getDate() + day)).format(`DD-MMM-YYYY HH:mm:ss`)
  }

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

  return (
    <Flex flexDirection="column">
      <Flex mt="S_14" mb="S_24" justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <ImgTokenFinixIcon viewBox="0 0 48 48" width="32px" height="32px" />
          <Text ml="S_10" textStyle="R_16M" color="black">
            {t('FINIX')}
          </Text>
        </Flex>
        <Text textStyle="R_16R" color="black">
          {getBalanceOverBillion(Number(amount))}
        </Text>
      </Flex>
      <Divider />
      <Flex mt="S_24" flexDirection="column">
        <Flex mb="S_8" justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('Stake Period')}
          </Text>
          <Text textStyle="R_14M" color="deepgrey">
            {t(`${28} days`)}
          </Text>
        </Flex>
        <Flex mb="S_8" justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('Period End')}
          </Text>
          <Flex flexDirection="column" alignItems="flex-end">
            <Text textStyle="R_14M" color="deepgrey">
              {getEndDay(28)}
            </Text>
            <Text textStyle="R_12R" color="mediumgrey">
              *GMT +9 {t('Asia/Seoul')}
            </Text>
          </Flex>
        </Flex>
        <Flex mb="S_8" justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('vFINIX Earn')}
          </Text>
          <Flex>
            <Text textStyle="R_14M" color="deepgrey">
              {getVFinix(days, amount)}
            </Text>
            <Text ml="S_4" textStyle="R_14M" color="deepgrey">
              {t('vFINIX')}
            </Text>
          </Flex>
        </Flex>
        <Flex mt="S_12" alignItems="flex-start">
          <Flex mt="S_2">
            <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
          </Flex>
          <Text ml="S_4" textStyle="R_14R" color="red" width="396px">
            <Trans i18nKey={getLockDay(days)} components={[<strong />]} />
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default SuperConfirmStake
