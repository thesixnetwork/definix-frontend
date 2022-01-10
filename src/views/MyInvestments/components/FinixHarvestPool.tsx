import React from 'react'
import BigNumber from 'bignumber.js'
import usePoolEarning from 'hooks/usePoolEarning'
import { usePriceFinixUsd } from 'state/hooks'
import { Text } from '@fingerlabs/definixswap-uikit-v2'
import useWallet from 'hooks/useWallet'
import Locked from './Locked'

const Balance = () => {
  const poolEarnings = usePoolEarning()

  const earningsPoolSum = poolEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)

  const earningsBusd = new BigNumber(earningsPoolSum).multipliedBy(usePriceFinixUsd()).toNumber()

  return (
    <>
      <Text className="sum">{earningsPoolSum}</Text>
      <Text className="usd">= ${earningsBusd}</Text>
      {/* <CardValue value={earningsPoolSum} lineHeight="1.5" color="textInvert" />
      <CardBusdValue value={earningsBusd} /> */}
    </>
  )
}

const FinixHarvestPool = () => {
  const { account } = useWallet()
  return account ? <Balance /> : <Locked />
}

export default FinixHarvestPool
