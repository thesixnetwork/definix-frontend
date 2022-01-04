import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'

interface EstimateVFinixProps {
  hasAccount: boolean
  days: number
  earn: number
}

const EstimateVFinix: React.FC<EstimateVFinixProps> = ({ hasAccount, days, earn }) => {
  const { t, i18n } = useTranslation()

  const getEndDay = (day: number) => {
    const today = new Date()

    if (i18n.language === 'ko') {
      return moment(today.setDate(today.getDate() + day)).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(today.setDate(today.getDate() + day)).format(`DD-MMM-YYYY HH:mm:ss`)
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
              {getEndDay(days)}
            </Text>
            <Text textStyle="R_12R" color="mediumgrey">
              *GMT +9 {t('Asia/Seoul')}
            </Text>
          </Flex>
        </Flex>
        <Flex mt="S_8" justifyContent="space-between">
          <Text textStyle="R_14R" color="mediumgrey">
            {t('vFINIX Earn')}
          </Text>
          <Flex>
            <Text textStyle="R_14M" color="deepgrey">
              {hasAccount ? earn : 0}
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

export default EstimateVFinix
