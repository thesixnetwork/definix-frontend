import React from 'react'
import styled, { css } from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Flex, Text, textStyle } from '@fingerlabs/definixswap-uikit-v2'
import useFarmEarning from 'hooks/useFarmEarning'
import usePoolEarning from 'hooks/usePoolEarning'
import { usePriceFinixUsd } from 'state/hooks'
import Locked from './Locked'

const StyledFlex = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    margin-bottom: 24px;
    align-items: flex-end;
  }
}
`

const SumText = styled(Text)`
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.textStyle.R_23B}

  ${({ theme }) => theme.mediaQueries.xl} {
    ${({ theme }) => theme.textStyle.R_32B}
  }
`

const UsdText = styled(Text)`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => theme.textStyle.R_14M}

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 0;
    margin-left: 16px;
    margin-bottom: 4px;
    ${({ theme }) => theme.textStyle.R_16M}
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
    <StyledFlex>
      <SumText>{earningsSum}</SumText>
      <UsdText>= ${earningsBusd}</UsdText>
      {/* <CardValue value={earningsSum} lineHeight="1.5" color="textInvert" />
      <CardBusdValue value={earningsBusd} /> */}
    </StyledFlex>
  )
}

const FinixHarvestTotalBalance = () => {
  const { account } = useWallet()
  return account ? <Balance /> : <Locked />
}

export default FinixHarvestTotalBalance
