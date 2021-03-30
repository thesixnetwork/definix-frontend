import React from 'react'
import { useTotalClaim } from 'hooks/useTickets'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceFinixBusd } from 'state/hooks'
import { BigNumber } from 'bignumber.js'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
 }
`
const FinixWinnings = () => {
  const { claimAmount } = useTotalClaim()
  const finixAmount = getBalanceNumber(claimAmount)
  const claimAmountBusd = new BigNumber(finixAmount).multipliedBy(usePriceFinixBusd()).toNumber()

  return (
    <Block>
      <CardValue value={finixAmount} lineHeight="1.5" />
      <CardBusdValue value={claimAmountBusd} decimals={2} />
    </Block>
  )
}

export default FinixWinnings
