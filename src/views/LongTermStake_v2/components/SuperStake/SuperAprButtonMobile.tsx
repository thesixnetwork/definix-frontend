import React, { useMemo, useCallback } from 'react'
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
  justify-content: space-between;
  align-items: flex-end;
  margin-right: 12px;
  padding: 10px 0;
  border-radius: 8px;
  background-color: ${({ theme, $focus, $myLongTerm }) => {
    if ($myLongTerm && $focus) return theme.colors.yellow
    return theme.colors.lightbrown
  }};
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

const AprButtonMobile: React.FC<AprButtonProps> = ({ days, setDays, data, superStakeData }) => {
  const { t } = useTranslation()

  const focusDays = useMemo(() => data.find((item) => item.day === days), [days, data])
  const myLongTerm = useCallback((item) => superStakeData.some((v: number) => v === item.level), [superStakeData])

  const onClickAPR = (item) => {
    if (myLongTerm(item)) setDays(item.day)
  }

  return (
    <>
      <Flex width="100%" flexDirection="column">
        <Flex width="100%">
          {data.map((item) => {
            return (
              <FlexVFinix
                key={item.day}
                $focus={days === item.day}
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

        {superStakeData.length !== 0 && (
          <>
            <FlexApr>
              <Flex flexDirection="column">
                <TextApr textStyle="R_14R" color="mediumgrey">
                  {t('APR')}
                </TextApr>
                <TextApr textStyle="R_14R" color="mediumgrey">
                  {t('vFINIX Multiples')}
                </TextApr>
              </Flex>
              <Flex flexDirection="column" alignItems="flex-end">
                <TextApr textStyle="R_14B" color="yellow">
                  {numeral(focusDays.apr).format('0,0.[00]')}%
                </TextApr>
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
