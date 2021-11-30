import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'definixswap-uikit'
import styled from 'styled-components'

import { IsMobileType } from './types'

interface VFinixProps extends IsMobileType {
  days: string
  setDays: React.Dispatch<React.SetStateAction<string>>
}

const FlexVFinix = styled(Flex)`
  width: 172px;
  margin-right: 16px;
  flex-direction: column;
  border-radius: 8px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`

const FlexDays = styled(Flex)<{ focus: boolean }>`
  justify-content: space-between;
  align-items: flex-end;
  padding: 14px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: ${({ theme, focus }) => (focus ? theme.colors.orange : theme.colors.lightbrown)};
`

const FlexApr = styled(Flex)<{ focus: boolean }>`
  flex-direction: column;
  padding: ${({ focus }) => (focus ? '19px' : '20px')};
  padding-top: 20px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-width: ${({ focus }) => (focus ? '2px' : '1px')};
  border-style: solid;
  border-color: ${({ theme, focus }) => (focus ? theme.colors.orange : theme.colors.lightgrey)};
  border-top: none;
`

const VFinixAPR: React.FC<VFinixProps> = ({ isMobile, days, setDays }) => {
  const { t } = useTranslation()

  const data = [
    {
      rate: '1X',
      day: '90 days',
      apr: '27.69%',
      minStake: '1,000',
    },
    {
      rate: '2X',
      day: '180 days',
      apr: '55.30%',
      minStake: '10,000',
    },
    {
      rate: '4X',
      day: '365 days',
      apr: '110.76%',
      minStake: '30,000',
    },
  ]

  return (
    <>
      <Flex>
        {data.map((v) => {
          return (
            <FlexVFinix onClick={() => setDays(v.day)}>
              <FlexDays focus={days === v.day}>
                <Flex flexDirection="column">
                  <Text textStyle="R_12R" color="white">
                    {t('vFINIX')}
                  </Text>
                  <Text textStyle="R_20B" color="white">
                    {v.rate}
                  </Text>
                </Flex>
                <Text textStyle="R_14M" color="white">
                  {v.day}
                </Text>
              </FlexDays>

              <FlexApr focus={days === v.day}>
                <Flex mb="S_12" flexDirection="column">
                  <Text textStyle="R_12R" color="mediumgrey">
                    {t('APR')}
                  </Text>
                  <Text textStyle="R_18B" color="black">
                    {v.apr}
                  </Text>
                </Flex>
                <Flex flexDirection="column">
                  <Text textStyle="R_12R" color="mediumgrey">
                    {t('Minimum stake')}
                  </Text>
                  <Text textStyle="R_18B" color="black">
                    {v.minStake} {t('FINIX')}
                  </Text>
                </Flex>
              </FlexApr>
            </FlexVFinix>
          )
        })}
      </Flex>
    </>
  )
}

export default VFinixAPR
