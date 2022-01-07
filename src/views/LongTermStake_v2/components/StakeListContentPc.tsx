import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider, Helper } from '@fingerlabs/definixswap-uikit-v2'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

import UnstakeButton from './UnstakeButton'
import { AllDataLockType, IsMobileType } from './types'

interface ContentProps extends IsMobileType {
  allDataLock: AllDataLockType[]
}

const StakeListContentPc: React.FC<ContentProps> = ({ isMobile, allDataLock }) => {
  const { t, i18n } = useTranslation()

  const getEndDay = (endDay: string) => {
    if (i18n.language === 'ko') {
      return moment(endDay).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(endDay).format(`DD-MMM-YY HH:mm:ss`)
  }

  return (
    <>
      {allDataLock.map((item) => {
        return (
          <Flex width="100%" flexDirection="column" key={item.id}>
            <Flex width="100%" alignItems="center" py="S_16">
              <Flex pl="S_20" width="26%" flexDirection="column">
                <Text textStyle="R_14R" color="black">
                  {t(`${item.days} days`)}
                </Text>
                {item.topup.some((topup: any) => Number(topup) === item.id) && (
                  <Flex alignItems="center">
                    <Text mt={`${i18n.language === 'en' && 'S_2'}`} mr="S_4" textStyle="R_12R" color="yellow">
                      {t('Super Stake')}
                    </Text>
                    <Helper
                      text={`${t('28days super stake tooltip')}\n
                        ${getEndDay(item.lockTopupTimes)} ~ ${getEndDay(item.topupTimeStamp)}`}
                      color="yellow"
                    />
                  </Flex>
                )}
              </Flex>
              <Text width="22%" textStyle="R_14R" color="black">
                {getBalanceOverBillion(item.lockAmount)}
              </Text>
              <Flex width="52%" justifyContent="space-between">
                <Flex flexDirection="column" justifyContent="center">
                  <Text textStyle="R_14R" color="black">
                    {getEndDay(item.lockTimestamp)}
                  </Text>
                  <Text textStyle="R_12R" color="mediumgrey">
                    *GMT +9 {t('Asia/Seoul')}
                  </Text>
                </Flex>
                <UnstakeButton isMobile={isMobile} data={item} />
              </Flex>
            </Flex>
            <Divider width="100%" backgroundColor="lightGrey50" />
          </Flex>
        )
      })}
    </>
  )
}

export default StakeListContentPc
