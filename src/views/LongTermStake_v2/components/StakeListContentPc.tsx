import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Divider, Helper } from '@fingerlabs/definixswap-uikit-v2'

import UnstakeButton from './UnstakeButton'
import { AllDataLockType, IsMobileType } from './types'

interface ContentProps extends IsMobileType {
  allDataLock: AllDataLockType[]
}

const StakeListContentPc: React.FC<ContentProps> = ({ isMobile, allDataLock }) => {
  const { t } = useTranslation()

  return (
    <>
      {allDataLock.map((item) => {
        return (
          <Flex width="100%" flexDirection="column" key={item.id}>
            <Flex width="100%" alignItems="center" py="S_16">
              <Flex width="20%" flexDirection="column">
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
              <Text width="27%" textStyle="R_14R" color="black">
                {numeral(item.lockAmount).format(0, 0)}
              </Text>
              <Flex width="53%" justifyContent="space-between">
                <Flex flexDirection="column" justifyContent="center">
                  <Text textStyle="R_14R" color="black">
                    {item.lockTimestamp}
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
