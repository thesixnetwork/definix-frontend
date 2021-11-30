import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Flex, Text, lightColors } from 'definixswap-uikit'

import { IsMobileType } from './types'

const FlexRatio = styled(Flex)`
  width: 50%;
  flex-direction: column;
  padding-left: 32px;
  border-left: 1px solid #d8d8d880;

  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
    padding-left: 0;
    padding-top: 24px;
    border-left: none;
    border-top: 1px solid #d8d8d880;
  }
`

const Graph = styled.div<{ width: string }>`
  width: ${({ width }) => width};
`

const Bar = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  width: 100%;
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

const StakeDayRatio: React.FC<IsMobileType> = ({ isMobile }) => {
  const { t } = useTranslation()

  const data = [
    {
      name: t('90 days'),
      color: lightColors.green,
      ratio: '12',
      value: '461,974',
    },
    {
      name: t('180 days'),
      color: lightColors.yellow,
      ratio: '28',
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
        <Flex>
          {data.map((v) => {
            return (
              <Graph width={`${v.ratio}%`}>
                <Bar color={v.color} />
                {!isMobile && (
                  <Text textStyle="R_12R" color="deepgrey">
                    {v.ratio}%
                  </Text>
                )}
              </Graph>
            )
          })}
        </Flex>

        <Flex mt={`${isMobile ? 'S_16' : 'S_20'}`} flexDirection="column">
          {data.map((v) => {
            return (
              <FlexDays>
                <Flex alignItems="center">
                  <Dot color={v.color} />
                  <Text textStyle="R_14R" color="mediumgrey">
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
