/* eslint-disable no-nested-ternary */
import React from 'react'
import styled, { useTheme } from 'styled-components'
import numeral from 'numeral'
import _ from 'lodash'
import { Card, Text, useMatchBreakpoints, Heading } from '../../../uikit-dev'
import { useTotalFinixLock, useTotalSupply, useUnstakeId } from '../../../hooks/useLongTermStake'
import CardBarChart from './CardBarChart'
import vFinix from '../../../uikit-dev/images/for-ui-v2/vFinix.png'

const CardFinixStake = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

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
  width: 100%;

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

const Coin = styled.div`
  align-self: center img {
    width: 63px;
    height: 63px;
  }
`

const FinixStakeCard = () => {
  // @ts-ignore
  const { isDark } = useTheme()
  const totalSupply = useTotalSupply()
  const getTotalFinixLock = useTotalFinixLock()
  const { totalFinixLock, totalvFinixSupply, totalSupplyAllTimeMint, finixLockMap } = useUnstakeId()
  const { isXl, isLg, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg && !isMd

  const textColor = () => {
    return isDark ? 'white' : '#737375'
  }

  return (
    <>
      <CardFinixStake className="mt-5">
        <Heading fontSize="18px !important" className="bd-b pa-5">
          vFINIX Pool Status
        </Heading>
        <div className="flex">
          <div
            className={`${
              isMobile
                ? 'py-6 px-2 col-6 justify-center align-center'
                : 'flex py-6 px-2 col-6 justify-center align-center'
            }`}
          >
            <Coin className={`${isMobile ? 'flex justify-center align-center mb-2' : ''}`}>
              <img src={`/images/coins/${'FINIX'}.png`} alt="" width="63px" height="63px" />
            </Coin>
            <div className={`${isMobile ? 'text-center' : 'pl-5'}`}>
              <Text color="textSubtle" fontWeight="inherit">
                Total FINIX staked
              </Text>
              <Heading as="h1" style={{ lineHeight: '1.5' }} fontSize="30px !important">
                {numeral(totalFinixLock).format('0,0')}{' '}
              </Heading>
            </div>
          </div>
          <div className="mt-3 bd-r" />
          <div
            className={`${
              isMobile
                ? 'py-6 px-2 col-6 justify-center align-center'
                : 'flex py-6 px-2 col-6 justify-center align-center'
            }`}
          >
            <Coin className={`${isMobile ? 'flex justify-center align-center mb-2' : ''}`}>
              <img src={vFinix} alt="vfinix" width="63px" height="63px" />
            </Coin>
            <div className={`${isMobile ? 'text-center' : 'pl-5'}`}>
              <Text color="textSubtle" fontWeight="inherit">
                Total vFINIX supply
              </Text>
              <Heading as="h1" style={{ lineHeight: '1.5' }} fontSize="30px !important">
                {numeral(totalSupplyAllTimeMint).format('0,0')}
              </Heading>
            </div>
          </div>
        </div>
        <div className={`flex align-items-center ${isMobile ? 'col-12 pa-3' : 'col-7 py-3 pl-3 pr-5 pt-1 pb-0'}`}>
          <CardBarChart className="col-10" lock={getTotalFinixLock} />
          <div className="col-2">
            <TextStyled style={{ position: 'absolute', left: '63%', top: '59%' }} className="col-4">
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
        </div>
      </CardFinixStake>
    </>
  )
}

export default FinixStakeCard
