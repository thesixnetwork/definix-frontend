import React from 'react'
import _ from 'lodash'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Button, Card, Text, useMatchBreakpoints } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { useBalances } from '../../../state/hooks'
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
  const currentBalance = _.get(balances, getAddress(rebalance.address))
  const currentBalanceNumber = currentBalance.toNumber()

  return (
    <CardStyled className={`flex flex-wrap justify-space-between pa-4 bd-t ${className}`}>
      <TwoLineFormat
        title="Current investment"
        subTitle={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
        value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
        percent="+0.2%"
        days="1 D"
        large
      />

      <div className={`flex ${isMobile ? 'col-12 pt-2' : 'col-6'}`}>
        <Button as={Link} to="/explore/invest" fullWidth radii="small" className="mr-3" variant="success">
          INVEST
        </Button>
        <Button as={Link} to="/explore/withdraw" fullWidth radii="small" className="flex flex-column">
          WITHDRAW
          <Text fontSize="12px" color="white">
            0.00%
          </Text>
        </Button>
      </div>
    </CardStyled>
  )
}

export default FundAction
