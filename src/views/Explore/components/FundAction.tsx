import React from 'react'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Button, Card, useMatchBreakpoints } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { useRebalanceBalances, useBalances } from '../../../state/hooks'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'

interface FundActionType {
  className?: string
  rebalance?: Rebalance | any
  isVertical?: boolean
}

const CardStyled = styled(Card)<{ isVertical: boolean }>`
  position: sticky;
  top: ${({ isVertical }) => (isVertical ? '0' : 'initial')};
  bottom: ${({ isVertical }) => (!isVertical ? '0' : 'initial')};
  align-self: start;
  left: 0;
  width: 100%;
`

const FundAction: React.FC<FundActionType> = ({ className, rebalance, isVertical = false }) => {
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  return (
    <CardStyled
      className={`flex flex-wrap justify-space-between ${className} ${isVertical ? 'flex-column ml-4' : 'pa-4 bd-t'}`}
      isVertical={isVertical}
    >
      <TwoLineFormat
        className={isVertical ? 'pa-4' : ''}
        title="Current investment"
        subTitle={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
        value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
        large
      />

      <div
        className={`flex ${isMobile || isVertical ? 'col-12' : 'col-6'} ${isMobile ? 'pt-2' : ''} ${
          isVertical ? 'flex-column bd-t pa-4' : ''
        }`}
      >
        <Button
          as={Link}
          to="/rebalancing/invest"
          fullWidth
          radii="small"
          className={isVertical ? 'mb-2' : 'mr-2'}
          variant="success"
        >
          INVEST
        </Button>
        <Button as={Link} to="/rebalancing/withdraw" fullWidth radii="small" className="flex flex-column">
          WITHDRAW
        </Button>
      </div>
    </CardStyled>
  )
}

export default FundAction
