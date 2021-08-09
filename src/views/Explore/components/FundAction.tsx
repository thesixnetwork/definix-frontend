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
}

const CardStyled = styled(Card)`
  // border-top-left-radius: 0;
  // border-top-right-radius: 0;
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
`

const FundAction: React.FC<FundActionType> = ({ className, rebalance }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  return (
    <CardStyled className={`flex flex-wrap justify-space-between pa-4 bd-t ${className}`}>
      <TwoLineFormat
        title="Current investment"
        subTitle={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
        value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
        percent={`${
          rebalance.sharedPricePercentDiff >= 0
            ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
            : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
        }%`}
        percentClass={(() => {
          if (rebalance.sharedPricePercentDiff < 0) return 'failure'
          if (rebalance.sharedPricePercentDiff > 0) return 'success'
          return ''
        })()}
        days="24H"
        large
      />

      <div className={`flex ${isMobile ? 'col-12 pt-2' : 'col-6'}`}>
        <Button as={Link} to="/explore/invest" fullWidth radii="small" className="mr-3" variant="success">
          INVEST
        </Button>
        <Button as={Link} to="/explore/withdraw" fullWidth radii="small" className="flex flex-column">
          WITHDRAW
        </Button>
      </div>
    </CardStyled>
  )
}

export default FundAction
