import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Text, lightColors, VDivider } from 'definixswap-uikit-v2'

import { IsMobileType } from './types'

interface StakeDayRatioProps extends IsMobileType {
  getTotalFinixLock: number[]
  totalFinixLock: number
}

const FlexRatio = styled(Flex)`
  width: 60%;
  flex-direction: column;
  padding-left: 40px;

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    padding-left: 0;
    padding-top: 24px;
  }
`

const Bar = styled.div<{ ratio: number; color: string }>`
  background: ${({ color }) => color};
  flex: ${({ ratio }) => (ratio <= 5 ? 5 : ratio)};
  height: 16px;
  margin-bottom: 2px;
`

const FlexDays = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Dot = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  width: 10px;
  height: 10px;
  margin-right: 8px;
  border-radius: 50%;
`

const StakeDayRatio: React.FC<StakeDayRatioProps> = ({ isMobile, getTotalFinixLock, totalFinixLock }) => {
  const { t } = useTranslation()

  const data = [
    {
      name: '90',
      color: lightColors.green,
      ratio: Math.round((getTotalFinixLock[0] / totalFinixLock) * 100),
      value: numeral(getTotalFinixLock[0]).format('0,0'),
    },
    {
      name: '180',
      color: lightColors.yellow,
      ratio: Math.round((getTotalFinixLock[1] / totalFinixLock) * 100),
      value: numeral(getTotalFinixLock[1]).format('0,0'),
    },
    {
      name: '365',
      color: lightColors.red,
      ratio:
        100 -
        Math.round((getTotalFinixLock[0] / totalFinixLock) * 100) -
        Math.round((getTotalFinixLock[1] / totalFinixLock) * 100),
      value: numeral(getTotalFinixLock[2]).format('0,0'),
    },
  ]

  return (
    <>
      <FlexRatio>
        <Flex>
          {data.map((v) => (
            <Bar key={v.name} ratio={v.ratio} color={v.color} />
          ))}
        </Flex>

        <Flex mt={`${isMobile ? 'S_20' : 'S_32'}`} flexDirection="column">
          {data.map((v) => {
            return (
              <FlexDays key={v.name}>
                <Flex alignItems="center">
                  <Dot color={v.color} />
                  <Text textStyle="R_14R" color="deepgrey">
                    {v.name} {t('days')}
                  </Text>
                </Flex>
                <Flex alignItems="center">
                  <Text textStyle="R_14B" color="black">
                    {v.value}
                  </Text>
                  <Text ml="S_4" mr="S_8" textStyle="R_14R" color="black">
                    {t('FINIX')}
                  </Text>
                  <Flex height="10px">
                    <VDivider color="lightgrey" />
                  </Flex>
                  <Text width="26px" ml="S_8" textStyle="R_14R" color="mediumgrey" textAlign="right">
                    {v.ratio}%
                  </Text>
                </Flex>
              </FlexDays>
            )
          })}
        </Flex>
      </FlexRatio>
    </>
  )
}

export default StakeDayRatio
