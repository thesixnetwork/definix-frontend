import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Text, lightColors } from 'definixswap-uikit'

import { IsMobileType } from './types'

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
    if (ratio <= 10) return 10
    if (prevRatio <= 10) return ratio - 5
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

const StakeDayRatio: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()

  const data = [
    {
      name: t('90 days'),
      color: lightColors.green,
      ratio: '1',
      value: '461,974',
    },
    {
      name: t('180 days'),
      color: lightColors.yellow,
      ratio: '39',
      value: '865,204',
    },
    {
      name: t('365 days'),
      color: lightColors.red,
      ratio: '60',
      value: '8,666,998',
    },
  ]

  return (
    <>
      <FlexRatio>
        <Flex flexDirection="column">
          <Flex>
            {data.map((v) => (
              <Bar ratio={Number(v.ratio)} color={v.color} />
            ))}
          </Flex>
          {!isMobile && (
            <Flex>
              {data.map((v, i) => {
                return (
                  <BarText ratio={Number(v.ratio)} prevRatio={i === 0 ? 100 : Number(data[i - 1].ratio)}>
                    <Text textStyle="R_12R" color="mediumgrey">
                      {v.ratio}%
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
                    {v.name}
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
