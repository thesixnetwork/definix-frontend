import React from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { DataType } from './types'

interface AprButtonProps {
  days: number
  setDays: React.Dispatch<React.SetStateAction<number>>
  data: DataType[]
}

const FlexVFinix = styled(Flex)<{ $focus: boolean }>`
  width: calc(100% / 3);
  margin-right: 16px;
  margin-bottom: 12px;
  flex-direction: column;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${({ $focus }) => ($focus ? '0 8px 10px 0 rgba(255, 104, 40, 0.2)' : 'none')};

  &:last-child {
    margin-right: 0;
  }
`

const FlexDays = styled(Flex)<{ $focus: boolean }>`
  justify-content: space-between;
  align-items: flex-end;
  padding: 14px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: ${({ theme, $focus }) => ($focus ? theme.colors.orange : theme.colors.lightbrown)};
`

const FlexApr = styled(Flex)<{ $focus: boolean }>`
  flex-direction: column;
  padding: ${({ $focus }) => ($focus ? '19px' : '20px')};
  padding-top: 20px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-width: ${({ $focus }) => ($focus ? '2px' : '1px')};
  border-style: solid;
  border-color: ${({ theme, $focus }) => ($focus ? theme.colors.orange : theme.colors.lightgrey)};
  border-top: none;
`

const AprButtonPc: React.FC<AprButtonProps> = ({ days, setDays, data }) => {
  const { t } = useTranslation()

  return (
    <>
      {data.map((item) => {
        return (
          <FlexVFinix key={item.day} $focus={days === item.day} onClick={() => setDays(item.day)}>
            <FlexDays $focus={days === item.day}>
              <Flex flexDirection="column">
                <Text textStyle="R_12R" color="white">
                  {t('vFINIX')}
                </Text>
                <Text textStyle="R_20B" color="white">
                  {item.multiple}X
                </Text>
              </Flex>
              <Text textStyle="R_14M" color="white">
                {t(`${item.day} days`)}
              </Text>
            </FlexDays>

            <FlexApr $focus={days === item.day}>
              <Flex mb="S_12" flexDirection="column">
                <Text textStyle="R_12R" color="mediumgrey">
                  {t('APR')}
                </Text>
                <Text textStyle="R_18B" color={`${days === item.day ? 'red' : 'black'}`}>
                  {numeral(item.apr).format('0,0.[00]')}%
                </Text>
              </Flex>
              <Flex flexDirection="column">
                <Text textStyle="R_12R" color="mediumgrey">
                  {t('Minimum Stake')}
                </Text>
                <Text textStyle="R_18B" color="black">
                  {numeral(item.minStake).format('0,0')} {t('FINIX')}
                </Text>
              </Flex>
            </FlexApr>
          </FlexVFinix>
        )
      })}
    </>
  )
}

export default AprButtonPc
