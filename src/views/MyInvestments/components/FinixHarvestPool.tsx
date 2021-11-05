import React from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import usePoolEarning from 'hooks/usePoolEarning'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'
import Locked from './Locked'

const Block = styled.div`
  margin-bottom: 24px;
}
`

const Balance = () => {
  const poolEarnings = usePoolEarning()

  const earningsPoolSum = poolEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)

  const earningsBusd = new BigNumber(earningsPoolSum).multipliedBy(usePriceFinixUsd()).toNumber()

  return (
    <Block>
      <CardValue value={earningsPoolSum} lineHeight="1.5" color="textInvert" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

const FinixHarvestPool = () => {
  const { account } = useWallet()
  return account ? <Balance /> : <Locked />
}

export default FinixHarvestPool
