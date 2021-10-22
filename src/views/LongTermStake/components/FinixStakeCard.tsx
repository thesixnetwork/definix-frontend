/* eslint-disable no-nested-ternary */
import React from 'react'
import styled, { useTheme } from 'styled-components'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import _ from 'lodash'
import { Card, Text, useMatchBreakpoints } from '../../../uikit-dev'
import { useTotalFinixLock, useTotalSupply, useUnstakeId } from '../../../hooks/useLongTermStake'
import CardBarChart from './CardBarChart'

const CardFinixStake = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  //   align-items: center;

  a {
    display: block;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

export const TR = styled.tr`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  th {
    border-top: 1px solid${({ theme }) => theme.colors.border};
  }

  &:last-child {
    border: none;
  }

  &.isMe {
    position: sticky;
    bottom: 1px;
    left: 0;
    background: #f7f7f8;
    border-top: 1px solid: ${({ theme }) => theme.colors.border};
  }
`

export const TD = styled.td<{ align?: string }>`
  padding: 20px;
  width: 100%;
  vertical-align: middle;
  padding-left: 24px;
  //   text-align: ${({ align }) => align || 'center'};
  align-self: ${'center'};
`

const TextStyled = styled.div`
  align-self: center;

  ${({ theme }) => theme.mediaQueries.xs} {
    .text-value {
      font-size: 11px;
      text-align: end;
      line-height: 3;
    }
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    .text-value {
      font-size: 11px;
      text-align: end;
      line-height: 4.3;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    .text-value {
      font-size: 14px;
      text-align: end;
      line-height: 3;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    .text-value {
      font-size: 14px;
      text-align: end;
      line-height: 3;
    }
  }
`

const FinixStakeCard = () => {
  // @ts-ignore
  const { isDark } = useTheme()
  const totalSupply = useTotalSupply()
  const getTotalFinixLock = useTotalFinixLock()
  const { totalFinixLock, totalvFinixSupply } = useUnstakeId()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg && !isMd

  const textColor = () => {
    return isDark ? 'white' : '#737375'
  }

  return (
    <>
      <CardFinixStake className={`mt-5 ${isMobile ? '' : 'flex'}`}>
        <div className={`${isMobile ? 'col-12 mt-2 px-5 pt-4' : 'col-5 my-2 py-3 px-5 bd-r'}`}>
          <div className="flex justify-space-between">
            <Text color="#737375">Total FINIX staked</Text>
            <div className="flex align-items-center">
              <Text color={isDark ? 'white' : '#000000'} className="mr-2">
                {numeral(totalFinixLock).format('0,0')}{' '}
              </Text>
              <Text color={isDark ? 'white' : '#000000'}>FINIX</Text>
            </div>
          </div>
          <div className={`${isMobile ? 'text-left' : 'text-center'}`}>
            <Text color="#ffffff00">( 36% of FINIX supply )</Text>
          </div>
          <div className={`flex justify-space-between ${isMobile ? 'mt-2' : ' mt-7'}`}>
            <Text color="#737375">Total vFINIX minted</Text>
            <div className="flex align-items-center">
              <Text color={isDark ? 'white' : '#000000'} className="mr-2">
                {numeral(totalvFinixSupply).format('0,0')}
              </Text>
              <Text color={isDark ? 'white' : '#000000'}>vFINIX</Text>
            </div>
          </div>
        </div>
        <div className={`flex align-items-center ${isMobile ? 'col-12 pa-3' : 'col-7 pa-3 pt-1 pb-0'}`}>
          <CardBarChart className="col-6" lock={getTotalFinixLock} />
          <TextStyled className="col-6">
            <TextStyled color={textColor()} className="text-value">
              {numeral(getTotalFinixLock[0]).format('0,0')} FINIX
            </TextStyled>
            <TextStyled color={textColor()} className="text-value">
              {numeral(getTotalFinixLock[1]).format('0,0')} FINIX
            </TextStyled>
            <TextStyled color={textColor()} className="text-value">
              {numeral(getTotalFinixLock[2]).format('0,0')} FINIX
            </TextStyled>
          </TextStyled>
        </div>
      </CardFinixStake>
    </>
  )
}

export default FinixStakeCard
