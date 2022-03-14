import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider, Helper } from '@fingerlabs/definixswap-uikit-v2'
import getBalanceOverBillion from 'utils/getBalanceOverBillion'

import UnstakeButton from './UnstakeButton'
import { AllDataLockType, IsMobileType } from './types'

interface ContentProps extends IsMobileType {
  allDataLock: AllDataLockType[]
  dataLength: number
}

const StakeListContentMobile: React.FC<ContentProps> = ({ isMobile, allDataLock, dataLength }) => {
  const { t, i18n } = useTranslation()

  const getEndDay = (endDay: string) => {
    if (i18n.language === 'ko') {
      return moment(endDay).format(`YYYY-MM-DD HH:mm:ss`)
    }
    return moment(endDay).format(`DD-MMM-YY HH:mm:ss`)
  }

  return (
    <>
      {allDataLock.map((item, idx) => {
        return (
          <Flex flexDirection="column" width="100%" key={item.id}>
            <Flex mb="S_16">
              <Flex width="50%" flexDirection="column">
                <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                  {t('Stake Period')}
                </Text>
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
              <Flex width="50%" flexDirection="column">
                <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                  {t('Amount')}
                </Text>
                <Text textStyle="R_14R" color="black">
                  {getBalanceOverBillion(item.lockAmount)} {t('FINIX')}
                </Text>
              </Flex>
            </Flex>

            <Flex mb="S_20" flexDirection="column">
              <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                {t('Period End')}
              </Text>
              <Flex alignItems="center">
                <Text textStyle="R_14R" color="black">
                  {item.isPenalty ? getEndDay(item.penaltyUnlockTimestamp) : getEndDay(item.lockTimestamp)}
                </Text>
                <Text ml="S_8" textStyle="R_12R" color="mediumgrey">
                  *GMT +9 {t('Asia/Seoul')}
                </Text>
              </Flex>
            </Flex>

            <UnstakeButton isMobile={isMobile} data={item} />

            {idx + 1 !== dataLength && <Divider my="S_20" width="100%" backgroundColor="lightGrey50" />}
          </Flex>
        )
      })}
    </>
  )
}

export default StakeListContentMobile
