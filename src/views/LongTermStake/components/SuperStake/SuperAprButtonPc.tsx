import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { DataType } from '../types'

interface AprButtonProps {
  days: number
  setDays: React.Dispatch<React.SetStateAction<number>>
  data: DataType[]
  superStakeData: number[]
}

const FlexVFinix = styled(Flex)<{ $focus: boolean; $myLongTerm: boolean }>`
  width: calc(100% / 3);
  margin-right: 16px;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: ${({ $focus, $myLongTerm }) => {
    if ($myLongTerm && $focus) return '0 8px 10px 0 rgba(254, 169, 72, 0.2)'
    return 'none'
  }};
  cursor: ${({ $myLongTerm }) => {
    if ($myLongTerm) return 'pointer'
    return 'auto'
  }};
  opacity: ${({ $myLongTerm }) => {
    if ($myLongTerm) return 1
    return 0.4
  }};

  &:last-child {
    margin-right: 0;
  }
`

const FlexDays = styled(Flex)<{ $focus: boolean; $myLongTerm: boolean }>`
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: ${({ theme, $focus, $myLongTerm }) => {
    if ($myLongTerm && $focus) return theme.colors.yellow
    return theme.colors.lightbrown
  }};
`

const FlexApr = styled(Flex)<{ $focus: boolean; $myLongTerm: boolean }>`
  flex-direction: column;
  padding: 10px ${({ $focus }) => ($focus ? '15px' : '16px')};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-width: ${({ $focus }) => ($focus ? '2px' : '1px')};
  border-style: solid;
  border-color: ${({ theme, $focus, $myLongTerm }) => {
    if ($myLongTerm && $focus) return theme.colors.yellow
    return theme.colors.lightgrey
  }};
  border-top: none;
`

const AprButtonPc: React.FC<AprButtonProps> = ({ days, setDays, data, superStakeData }) => {
  const { t } = useTranslation()
  const myLongTerm = useCallback((item) => superStakeData.some((v: number) => v === item.level), [superStakeData])
  const APRColor = useCallback(
    (item) => {
      if (myLongTerm(item) && days === item.day) return 'yellow'
      return 'black'
    },
    [days, myLongTerm],
  )
  const onClickAPR = useCallback(
    (item) => {
      if (myLongTerm(item)) setDays(item.day)
    },
    [myLongTerm, setDays],
  )

  return (
    <>
      {data.map((item) => {
        return (
          <FlexVFinix
            key={item.day}
            $focus={days === item.day}
            $myLongTerm={myLongTerm(item)}
            onClick={() => onClickAPR(item)}
          >
            <FlexDays $focus={days === item.day} $myLongTerm={myLongTerm(item)}>
              <Flex flexDirection="column">
                <Text textStyle="R_12R" color="white">
                  {t('vFINIX')}
                </Text>
                <Text textStyle="R_20B" color="white">
                  {item.multiple}X
                </Text>
              </Flex>
              <Text textStyle="R_14M" color="white" mb="S_2">
                {t(`${item.day} days`)}
              </Text>
            </FlexDays>

            <FlexApr $focus={days === item.day} $myLongTerm={myLongTerm(item)}>
              <Flex flexDirection="column">
                <Text textStyle="R_12R" color="mediumgrey">
                  {t('APR')}
                </Text>
                <Text textStyle="R_16B" color={APRColor(item)}>
                  {numeral(item.apr).format('0,0.[00]')}%
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
