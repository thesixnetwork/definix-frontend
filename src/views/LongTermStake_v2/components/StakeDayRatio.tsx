import React from 'react'
import numeral from 'numeral'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Text, lightColors } from 'definixswap-uikit'

import { IsMobileType } from './types'

interface StakeDayRatioProps extends IsMobileType {
  getTotalFinixLock: number[]
  totalFinixLock: number
}

const FlexRatio = styled(Flex)`
  width: 50%;
  flex-direction: column;
  padding-left: 32px;

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

const BarText = styled.div<{ ratio: number; prevRatio: number }>`
  flex: ${({ ratio, prevRatio }) => {
    if (ratio < 10) return 10
    if (ratio < 18) return 12.5
    if (prevRatio < 10) return ratio - 5
    return ratio
  }};
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
        <Flex flexDirection="column">
          <Flex>
            {data.map((v) => (
              <Bar ratio={v.ratio} color={v.color} />
            ))}
          </Flex>
          {!isMobile && (
            <Flex height="18px">
              {data.map((v, i) => {
                return (
                  <BarText ratio={v.ratio} prevRatio={i === 0 ? 100 : data[i - 1].ratio}>
                    <Text textStyle="R_12R" color="mediumgrey">
                      {getTotalFinixLock.length !== 0 && `${v.ratio}%`}
                    </Text>
                  </BarText>
                )
              })}
            </Flex>
          )}
        </Flex>

        <Flex mt={`${isMobile ? 'S_16' : 'S_20'}`} flexDirection="column">
          {data.map((v) => {
            return (
              <FlexDays>
                <Flex alignItems="center">
                  <Dot color={v.color} />
                  <Text textStyle="R_14R" color="deepgrey">
                    {v.name} {t('days')}
                  </Text>
                </Flex>
                <Flex>
                  <Text textStyle="R_14B" color="black">
                    {v.value}
                  </Text>
                  <Text ml="S_4" textStyle="R_14R" color="black">
                    {t('FINIX')}
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
