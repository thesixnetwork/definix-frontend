import React from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import useFarmEarning from 'hooks/useFarmEarning'
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
  const farmEarnings = useFarmEarning()
  const poolEarnings = usePoolEarning()
  const earningsFarmSum = farmEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const earningsFarmBusd = new BigNumber(earningsFarmSum).multipliedBy(usePriceFinixUsd()).toNumber()

  const earningsPoolSum = poolEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)

  const earningsPoolBusd = new BigNumber(earningsPoolSum).multipliedBy(usePriceFinixUsd()).toNumber()

  const earningsSum = earningsFarmSum + earningsPoolSum
  const earningsBusd = earningsFarmBusd + earningsPoolBusd

  return (
    <Block>
      <CardValue value={earningsSum} lineHeight="1.5" color="textInvert" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

const FinixHarvestTotalBalance = () => {
  const { account } = useWallet()
  return account ? <Balance /> : <Locked />
}

export default FinixHarvestTotalBalance
