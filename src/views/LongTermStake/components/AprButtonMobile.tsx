import React, { useMemo, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import numeral from 'numeral'
import { Flex, Text } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { DataType } from './types'

interface AprButtonProps {
  days: number
  setSelectedSuperStakOption: any
  data: DataType[]
  superStakeData: number[]
}

const FlexVFinix = styled(Flex)<{ $focus: boolean; $isSuperStake: boolean; $myLongTerm: boolean }>`
  width: calc(100% / 3);
  justify-content: space-between;
  align-items: flex-end;
  margin-right: 12px;
  padding: 10px 0;
  border-radius: 8px;
  background-color: ${({ theme, $focus, $isSuperStake, $myLongTerm }) => {
    if ($isSuperStake && !$myLongTerm) return theme.colors.lightbrown
    if ($focus) {
      if ($isSuperStake) return theme.colors.yellow
      return theme.colors.orange
    }
    return theme.colors.lightbrown
  }};
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

const FlexApr = styled(Flex)`
  justify-content: space-between;
  padding-top: 20px;
`

const TextApr = styled(Text)`
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`

const AprButtonMobile: React.FC<AprButtonProps> = ({ days, setSelectedSuperStakOption, data, superStakeData }) => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const focusDays = useMemo(() => data.find((item) => item.day === days), [days, data])
  const isSuperStake = useMemo(() => pathname.indexOf('super') > -1, [pathname])
  const myLongTerm = useCallback((item) => superStakeData.some((v: number) => v === item.level), [superStakeData])

  const onClickAPR = (item) => {
    if (isSuperStake) {
      if (myLongTerm(item)) setSelectedSuperStakOption(item)
    } else {
      setSelectedSuperStakOption(item)
    }
  }
  return (
    <>
      <Flex mb="S_24" width="100%" flexDirection="column">
        <Flex width="100%">
          {data.map((item) => {
            return (
              <FlexVFinix
                key={item.day}
                $focus={days === item.day}
                $isSuperStake={isSuperStake}
                $myLongTerm={myLongTerm(item)}
                onClick={() => onClickAPR(item)}
              >
                <Text width="100%" textAlign="center" textStyle="R_14M" color="white">
                  {t(`${item.day} days`)}
                </Text>
              </FlexVFinix>
            )
          })}
        </Flex>

        {(!isSuperStake || superStakeData.length !== 0) && (
          <>
            <FlexApr>
              <Flex flexDirection="column">
                <TextApr textStyle="R_14R" color="mediumgrey">
                  {t('APR')}
                </TextApr>
                {!isSuperStake && (
                  <TextApr textStyle="R_14R" color="mediumgrey">
                    {t('Minimum Stake')}
                  </TextApr>
                )}
                <TextApr textStyle="R_14R" color="mediumgrey">
                  {t('vFINIX Multiples')}
                </TextApr>
              </Flex>
              <Flex flexDirection="column" alignItems="flex-end">
                <TextApr textStyle="R_14B" color={isSuperStake ? 'yellow' : 'red'}>
                  {numeral(focusDays.apr).format('0,0.[00]')}%
                </TextApr>
                {!isSuperStake && (
                  <TextApr textStyle="R_14B" color="black">
                    {numeral(focusDays.minStake).format('0,0')} {t('FINIX')}
                  </TextApr>
                )}
                <TextApr textStyle="R_14B" color="black">
                  {focusDays.multiple}X
                </TextApr>
              </Flex>
            </FlexApr>
          </>
        )}
      </Flex>
    </>
  )
}

export default AprButtonMobile
