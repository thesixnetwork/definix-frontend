import React, { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { DataType } from './types'

interface AprButtonProps {
  days: number
  setDays: React.Dispatch<React.SetStateAction<number>>
  data: DataType[]
  superStakeData: number[]
}

const FlexVFinix = styled(Flex)<{ $focus: boolean; $isSuperStake: boolean; $myLongTerm: boolean }>`
  width: calc(100% / 3);
  margin-right: 16px;
  margin-bottom: 12px;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: ${({ $focus, $isSuperStake, $myLongTerm }) => {
    if ($isSuperStake && !$myLongTerm) return 'none'
    if ($focus) {
      if ($isSuperStake) return '0 8px 10px 0 rgba(254, 169, 72, 0.2)'
      return '0 8px 10px 0 rgba(255, 104, 40, 0.2)'
    }
    return 'none'
  }};
  cursor: ${({ $isSuperStake, $myLongTerm }) => {
    if ($isSuperStake) {
      if ($myLongTerm) return 'pointer'
      return 'auto'
    }
    return 'pointer'
  }};
  opacity: ${({ $isSuperStake, $myLongTerm }) => {
    if ($isSuperStake) {
      if ($myLongTerm) return 1
      return 0.4
    }
    return 1
  }};

  &:last-child {
    margin-right: 0;
  }
`

const FlexDays = styled(Flex)<{ $focus: boolean; $isSuperStake: boolean; $myLongTerm: boolean }>`
  justify-content: space-between;
  align-items: flex-end;
  padding: 14px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: ${({ theme, $focus, $isSuperStake, $myLongTerm }) => {
    if ($isSuperStake && !$myLongTerm) return theme.colors.lightbrown
    if ($focus) {
      if ($isSuperStake) return theme.colors.yellow
      return theme.colors.orange
    }
    return theme.colors.lightbrown
  }};
`

const FlexApr = styled(Flex)<{ $focus: boolean; $isSuperStake: boolean; $myLongTerm: boolean }>`
  flex-direction: column;
  padding: ${({ $focus }) => ($focus ? '19px' : '20px')};
  padding-top: 20px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-width: ${({ $focus }) => ($focus ? '2px' : '1px')};
  border-style: solid;
  border-color: ${({ theme, $focus, $isSuperStake, $myLongTerm }) => {
    if ($isSuperStake && !$myLongTerm) return theme.colors.lightgrey
    if ($focus) {
      if ($isSuperStake) return theme.colors.yellow
      return theme.colors.orange
    }
    return theme.colors.lightgrey
  }};
  border-top: none;
`

const AprButtonPc: React.FC<AprButtonProps> = ({ days, setDays, data, superStakeData }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const isSuperStake = useMemo(() => pathname.indexOf('super') > -1, [pathname])
  const myLongTerm = useCallback((item) => superStakeData.some((v: number) => v === item.level), [superStakeData])
  const APRColor = useCallback(
    (item) => {
      if (isSuperStake && !myLongTerm(item)) return 'black'
      if (days === item.day) {
        if (isSuperStake) return 'yellow'
        return 'red'
      }
      return 'black'
    },
    [days, isSuperStake, myLongTerm],
  )

  const onClickAPR = (item) => {
    if (isSuperStake) {
      if (myLongTerm(item)) setDays(item.day)
    } else {
      setDays(item.day)
    }
  }

  return (
    <>
      {data.map((item) => {
        return (
          <FlexVFinix
            key={item.day}
            $focus={days === item.day}
            $isSuperStake={isSuperStake}
            $myLongTerm={myLongTerm(item)}
            onClick={() => onClickAPR(item)}
          >
            <FlexDays $focus={days === item.day} $isSuperStake={isSuperStake} $myLongTerm={myLongTerm(item)}>
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

            <FlexApr $focus={days === item.day} $isSuperStake={isSuperStake} $myLongTerm={myLongTerm(item)}>
              <Flex flexDirection="column">
                <Text textStyle="R_12R" color="mediumgrey">
                  {t('APR')}
                </Text>
                <Text textStyle="R_18B" color={APRColor(item)}>
                  {numeral(item.apr).format('0,0.[00]')}%
                </Text>
              </Flex>
              {!isSuperStake && (
                <Flex mt="S_12" flexDirection="column">
                  <Text textStyle="R_12R" color="mediumgrey">
                    {t('Minimum Stake')}
                  </Text>
                  <Text textStyle="R_18B" color="black">
                    {numeral(item.minStake).format('0,0')} {t('FINIX')}
                  </Text>
                </Flex>
              )}
            </FlexApr>
          </FlexVFinix>
        )
      })}
    </>
  )
}

export default AprButtonPc
