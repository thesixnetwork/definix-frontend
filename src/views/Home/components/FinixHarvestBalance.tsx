import React from 'react'
import { Text } from 'uikit-dev'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useFarmEarning from 'hooks/useFarmEarning'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
}
`

const FinixHarvestBalance = () => {
  const TranslateString = useI18n()
  const { account } = useWallet()
  const farmEarnings = useFarmEarning()
  const earningsSum = farmEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)

  const earningsBusd = new BigNumber(earningsSum).multipliedBy(usePriceFinixUsd()).toNumber()

  if (!account) {
    return (
      <Text fontSize="24px !important" color="textDisabled" style={{ lineHeight: '76px' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={earningsSum} lineHeight="1.5" color="textInvert" />
      <CardBusdValue value={earningsBusd} />
    </Block>
  )
}

export default FinixHarvestBalance
