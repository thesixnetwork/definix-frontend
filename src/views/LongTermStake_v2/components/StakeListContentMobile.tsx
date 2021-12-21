import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider, Helper } from '@fingerlabs/definixswap-uikit-v2'

import UnstakeButton from './UnstakeButton'
import { AllDataLockType, IsMobileType } from './types'

interface ContentProps extends IsMobileType {
  allDataLock: AllDataLockType[]
}

const StakeListContentMobile: React.FC<ContentProps> = ({ isMobile, allDataLock }) => {
  const { t } = useTranslation()

  return (
    <>
      {allDataLock.map((item) => {
        return (
          <Flex flexDirection="column" width="100%" key={item.id}>
            <Flex mb="S_16">
              <Flex width="50%" flexDirection="column">
                <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                  {t('Stake Period')}
                </Text>
                <Text textStyle="R_14R" color="black">
                  {item.days} {t('days')}
                </Text>
                {item.topup.some((topup: any) => Number(topup) === item.id) && (
                  <>
                    <Flex mt="S_2">
                      <Text textStyle="R_12R" color="red" mr="S_4">
                        Super staked
                      </Text>
                      <Helper text={t('28 days Superstake')} />
                    </Flex>
                  </>
                )}
              </Flex>
              <Flex width="50%" flexDirection="column">
                <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                  {t('Amount')}
                </Text>
                <Text textStyle="R_14R" color="black">
                  {numeral(item.lockAmount).format(0, 0)} {t('FINIX')}
                </Text>
              </Flex>
            </Flex>

            <Flex mb="S_20" flexDirection="column">
              <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                {t('Period End')}
              </Text>
              <Flex alignItems="center">
                <Text textStyle="R_14R" color="black">
                  {item.lockTimestamp}
                </Text>
                <Text ml="S_8" textStyle="R_12R" color="mediumgrey">
                  *GMT +9 {t('Asia/Seoul')}
                </Text>
              </Flex>
            </Flex>

            <UnstakeButton isMobile={isMobile} data={item} />

            <Divider my="S_20" width="100%" backgroundColor="lightGrey50" />
          </Flex>
        )
      })}
    </>
  )
}

export default StakeListContentMobile
